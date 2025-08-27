package com.codetracker.codetracker_backend.controller.user;

import com.codetracker.codetracker_backend.entity.Attempt;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.AttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public List<Attempt> getMyAttempts(Authentication auth) {
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        return attemptService.getAttemptsByUser(userId);
    }

    @GetMapping("/problem/{problemId}")
    public List<Attempt> getAttemptsByProblem(@PathVariable UUID problemId) {
        return attemptService.getAttemptsByProblem(problemId);
    }

    @PostMapping
    public Attempt createAttempt(@RequestBody Attempt attempt) {
        return attemptService.createAttempt(attempt);
    }
}
