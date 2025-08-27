package com.codetracker.codetracker_backend.controller.common;

import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;
    private final UserRepository userRepository;

    @GetMapping
    public List<ProblemDto> getAllProblems() {
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public ProblemDto  getProblem(@PathVariable UUID id) {
        return problemService.getProblemById(id);
    }
    @GetMapping("/me")
    public List<Problem> getMyProblems(Authentication auth) {
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        return problemService.getProblemsByUser(userId);
    }

    @GetMapping("/user/{userId}")
    public List<Problem> getProblemsByUser(@PathVariable UUID userId) {
        return problemService.getProblemsByUser(userId);
    }


    @GetMapping("/topic/{topicId}")
    public List<ProblemDto> getProblemsByTopic(@PathVariable UUID topicId) {
        return problemService.getProblemsByTopicId(topicId);
    }

    @PostMapping
    public Problem createProblem(@RequestBody Problem problem) {
        return problemService.createProblem(problem);
    }

    @PutMapping("/{id}")
    public Problem updateProblem(@PathVariable UUID id, @RequestBody Problem problem) {
        return problemService.updateProblem(id, problem);
    }

    @DeleteMapping("/{id}")
    public void deleteProblem(@PathVariable UUID id) {
        problemService.deleteProblem(id);
    }
}
