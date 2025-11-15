package com.codetracker.codetracker_backend.controller.user;

import com.codetracker.codetracker_backend.dto.ProgressRequestDto;
import com.codetracker.codetracker_backend.dto.ProgressResponseDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.service.ProblemService;
import com.codetracker.codetracker_backend.service.UserProgressService;
import com.codetracker.codetracker_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService userProgressService;
    private final UserService userService;
    private final ProblemService problemService;

    @GetMapping("/me")
    public ResponseEntity<UserStatsDto> getUserStats(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(userProgressService.getUserStats(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProgress> getProgress(@PathVariable UUID id) {
        return userProgressService.getProgressById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<UserProgress> getProgressByUser(@PathVariable UUID userId) {
        return userProgressService.getProgressByUser(userId);
    }

    @GetMapping("/problem/{problemId}")
    public List<UserProgress> getProgressByProblem(@PathVariable UUID problemId) {
        return userProgressService.getProgressByProblem(problemId);
    }

    @PostMapping
    public ProgressResponseDto upsertProgress(
            @RequestBody ProgressRequestDto dto,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Problem problem = problemService.getProblemEntityById(dto.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        return userProgressService.upsertProgress(user, problem, dto);
    }

    @GetMapping
    public List<ProgressResponseDto> getUserProgress(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return userProgressService.getUserProgress(user);
    }

    @DeleteMapping("/{id}")
    public void deleteProgress(@PathVariable UUID id) {
        userProgressService.deleteProgress(id);
    }
}