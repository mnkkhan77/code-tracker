package com.codetracker.codetracker_backend.controller.user;

import com.codetracker.codetracker_backend.entity.Reminder;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {
    private final ReminderService reminderService;
    private final UserRepository userRepository;

    // Fetch upcoming reminders
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


    // Create a new reminder (user chooses days gap)
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


    // Update an existing reminder (reschedule)
    @PutMapping("/{reminderId}")
    public Reminder updateReminder(
            @PathVariable UUID reminderId,
            @RequestParam(defaultValue = "3") int days
    ) {
        return reminderService.updateReminder(reminderId, days);
    }
}
