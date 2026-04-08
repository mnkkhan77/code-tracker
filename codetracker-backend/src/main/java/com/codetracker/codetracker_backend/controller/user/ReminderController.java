package com.codetracker.codetracker_backend.controller.user;

import com.codetracker.codetracker_backend.dto.ReminderProblemDto;
import com.codetracker.codetracker_backend.entity.Reminder;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.ReminderProblemService;
import com.codetracker.codetracker_backend.service.ReminderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "Reminders", description = "Problem review reminders and spaced repetition")
@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {
    private final ReminderService reminderService;
    private final ReminderProblemService reminderProblemService;
    private final UserRepository userRepository;

    @Operation(summary = "Get upcoming reminders for current user")
    @ApiResponse(responseCode = "200", description = "List of upcoming reminders")
    @GetMapping("/me")
    public List<Reminder> getReminders(
            @RequestParam(defaultValue = "PROBLEM") String entityType,
            @RequestParam(defaultValue = "3") int days,
            Principal principal
    ) {
        String username = principal.getName(); // the logged-in username (e.g. email)
        // now load the user by username and get userId
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reminderService.getUpcomingReminders(user.getId(), entityType, days);
    }


    @Operation(summary = "Create a new reminder")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Reminder created"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping
    public Reminder createReminder(
            @RequestParam String entityType,
            @RequestParam UUID entityId,
            @RequestParam(defaultValue = "3") int days,
            Principal principal
    ) {
        String username = principal.getName(); // usually the user's email
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reminderService.createReminder(user.getId(), entityType, entityId, days);
    }


    @Operation(summary = "Reschedule an existing reminder")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Reminder rescheduled"),
        @ApiResponse(responseCode = "404", description = "Reminder not found")
    })
    @PutMapping("/{reminderId}")
    public Reminder updateReminder(
            @PathVariable UUID reminderId,
            @RequestParam(defaultValue = "3") int days
    ) {
        return reminderService.updateReminder(reminderId, days);
    }

    // ---- Spaced Repetition (SM-2) ----

    @Operation(summary = "Get all problems due for spaced repetition review")
    @ApiResponse(responseCode = "200", description = "List of due ReminderProblems")
    @GetMapping("/due")
    public List<ReminderProblemDto> getDueReviews(Principal principal) {
        User user = resolveUser(principal);
        return reminderProblemService.getDueReviews(user.getId()).stream()
                .map(ReminderProblemDto::from)
                .toList();
    }

    @Operation(summary = "Schedule a problem for spaced repetition")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Problem scheduled"),
        @ApiResponse(responseCode = "404", description = "Problem not found")
    })
    @PostMapping("/schedule")
    public ReminderProblemDto scheduleReview(
            @RequestParam UUID problemId,
            Principal principal
    ) {
        User user = resolveUser(principal);
        return ReminderProblemDto.from(reminderProblemService.scheduleReview(user.getId(), problemId));
    }

    @Operation(summary = "Record a spaced repetition review result (quality 0-5)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Review recorded, next review date updated"),
        @ApiResponse(responseCode = "400", description = "Invalid quality value"),
        @ApiResponse(responseCode = "404", description = "ReminderProblem not found")
    })
    @PostMapping("/review/{reminderProblemId}")
    public ResponseEntity<ReminderProblemDto> recordReview(
            @PathVariable UUID reminderProblemId,
            @RequestBody Map<String, Integer> body
    ) {
        int quality = body.getOrDefault("quality", 0);
        return ResponseEntity.ok(ReminderProblemDto.from(reminderProblemService.recordReview(reminderProblemId, quality)));
    }

    private User resolveUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
