package com.codetracker.codetracker_backend.controller.user;

import com.codetracker.codetracker_backend.dto.AttemptResponseDto;
import com.codetracker.codetracker_backend.entity.Attempt;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.AttemptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Attempts", description = "Problem attempt tracking")
@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;
    private final UserRepository userRepository;

    @Operation(summary = "Get all attempts for current user")
    @ApiResponse(responseCode = "200", description = "List of attempts")
    @GetMapping("/me")
    public List<AttemptResponseDto> getMyAttempts(Authentication auth) {
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        return attemptService.getAttemptsByUser(userId).stream()
                .map(AttemptResponseDto::from)
                .toList();
    }

    @Operation(summary = "Get all attempts for a specific problem")
    @ApiResponse(responseCode = "200", description = "List of attempts for the problem")
    @GetMapping("/problem/{problemId}")
    public List<Attempt> getAttemptsByProblem(@PathVariable UUID problemId) {
        return attemptService.getAttemptsByProblem(problemId);
    }

    @Operation(summary = "Record a new attempt")
    @ApiResponse(responseCode = "200", description = "Attempt recorded")
    @PostMapping
    public Attempt createAttempt(@RequestBody Attempt attempt) {
        return attemptService.createAttempt(attempt);
    }
}
