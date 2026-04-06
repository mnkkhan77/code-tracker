package com.codetracker.codetracker_backend.controller.user;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codetracker.codetracker_backend.dto.ProgressRequestDto;
import com.codetracker.codetracker_backend.dto.ProgressResponseDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.service.ProblemService;
import com.codetracker.codetracker_backend.service.UserProgressService;
import com.codetracker.codetracker_backend.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Progress", description = "User problem progress tracking")
@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService userProgressService;
    private final UserService userService;
    private final ProblemService problemService;

    @Operation(summary = "Get current user's progress stats")
    @ApiResponse(responseCode = "200", description = "User stats returned")
    @GetMapping("/me")
    public ResponseEntity<UserStatsDto> getUserStats(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(userProgressService.getUserStats(user.getId()));
    }

    @Operation(summary = "Get a progress record by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Progress found"),
        @ApiResponse(responseCode = "404", description = "Progress not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserProgress> getProgress(@PathVariable UUID id) {
        return userProgressService.getProgressById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get all progress records for a user")
    @ApiResponse(responseCode = "200", description = "Progress list returned")
    @GetMapping("/user/{userId}")
    public List<UserProgress> getProgressByUser(@PathVariable UUID userId) {
        return userProgressService.getProgressByUser(userId);
    }

    @Operation(summary = "Get all progress records for a problem")
    @ApiResponse(responseCode = "200", description = "Progress list returned")
    @GetMapping("/problem/{problemId}")
    public List<UserProgress> getProgressByProblem(@PathVariable UUID problemId) {
        return userProgressService.getProgressByProblem(problemId);
    }

    @Operation(summary = "Create or update progress for a problem")
    @ApiResponse(responseCode = "200", description = "Progress upserted")
    @PostMapping
    public ProgressResponseDto upsertProgress(
            @Valid @RequestBody ProgressRequestDto dto,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Problem problem = problemService.getProblemEntityById(dto.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        return userProgressService.upsertProgress(user, problem, dto);
    }

    @Operation(summary = "Get all progress records for current user")
    @ApiResponse(responseCode = "200", description = "Progress list returned")
    @GetMapping
    public List<ProgressResponseDto> getUserProgress(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return userProgressService.getUserProgress(user);
    }

    @Operation(summary = "Delete a progress record")
    @ApiResponse(responseCode = "200", description = "Progress deleted")
    @DeleteMapping("/{id}")
    public void deleteProgress(@PathVariable UUID id) {
        userProgressService.deleteProgress(id);
    }
}