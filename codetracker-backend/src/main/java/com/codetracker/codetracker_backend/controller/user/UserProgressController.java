package com.codetracker.codetracker_backend.controller.user;

import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService userProgressService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public List<UserProgress> getMyProgress(Authentication auth) {
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        return userProgressService.getProgressByUser(userId);
    }

    @GetMapping
    public List<UserProgress> getAllProgress() {
        return userProgressService.getAllProgress();
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
    public UserProgress createProgress(@RequestBody UserProgress progress) {
        return userProgressService.createProgress(progress);
    }

    @PutMapping("/{id}")
    public UserProgress updateProgress(@PathVariable UUID id, @RequestBody UserProgress progress) {
        return userProgressService.updateProgress(id, progress);
    }

    @DeleteMapping("/{id}")
    public void deleteProgress(@PathVariable UUID id) {
        userProgressService.deleteProgress(id);
    }
}