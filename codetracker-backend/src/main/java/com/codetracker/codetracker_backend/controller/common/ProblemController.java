package com.codetracker.codetracker_backend.controller.common;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.dto.ProblemWithProgressDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.ProblemService;
import com.codetracker.codetracker_backend.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Problems", description = "Problem listing and management")
@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;
    private final UserRepository userRepository;
    private final UserService userService;

    @Operation(summary = "Get all problems (paginated when page param present)")
    @ApiResponse(responseCode = "200", description = "List of all problems")
    @GetMapping
    public ResponseEntity<?> getAllProblems(
            @RequestParam(required = false) Integer page,
            @PageableDefault(size = 20, sort = "title") Pageable pageable) {
        if (page != null) {
            Page<ProblemDto> result = problemService.getAllProblems(pageable);
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @Operation(summary = "Get all problems with current user's progress")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Problems with progress data"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/with-progress")
    public ResponseEntity<List<ProblemWithProgressDto>> getProblemsWithProgress(
            Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<ProblemWithProgressDto> result = problemService.getProblemsWithUserProgress(user.getId());
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get a problem by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Problem found"),
        @ApiResponse(responseCode = "404", description = "Problem not found")
    })
    @GetMapping("/{id}")
    public ProblemDto getProblem(@PathVariable UUID id) {
        return problemService.getProblemById(id);
    }

    @Operation(summary = "Get problems created by the current user")
    @ApiResponse(responseCode = "200", description = "List of problems by current user")
    @GetMapping("/me")
    public List<Problem> getMyProblems(Authentication auth) {
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        return problemService.getProblemsByUser(userId);
    }

    @Operation(summary = "Get problems by user ID")
    @ApiResponse(responseCode = "200", description = "List of problems by user")
    @GetMapping("/user/{userId}")
    public List<Problem> getProblemsByUser(@PathVariable UUID userId) {
        return problemService.getProblemsByUser(userId);
    }

    @Operation(summary = "Get problems by topic ID")
    @ApiResponse(responseCode = "200", description = "Problems filtered by topic")
    @GetMapping("/topic/{topicId}")
    public List<ProblemDto> getProblemsByTopic(@PathVariable UUID topicId) {
        return problemService.getProblemsByTopicId(topicId);
    }

    @Operation(summary = "Create a new problem")
    @ApiResponse(responseCode = "200", description = "Problem created")
    @PostMapping
    public Problem createProblem(@RequestBody Problem problem) {
        return problemService.createProblem(problem);
    }

    @Operation(summary = "Update a problem by ID")
    @ApiResponse(responseCode = "200", description = "Problem updated")
    @PutMapping("/{id}")
    public Problem updateProblem(@PathVariable UUID id, @RequestBody Problem problem) {
        return problemService.updateProblem(id, problem);
    }

    @Operation(summary = "Delete a problem by ID")
    @ApiResponse(responseCode = "200", description = "Problem deleted")
    @DeleteMapping("/{id}")
    public void deleteProblem(@PathVariable UUID id) {
        problemService.deleteProblem(id);
    }
}
