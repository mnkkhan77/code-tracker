package com.codetracker.codetracker_backend.controller.admin;

import com.codetracker.codetracker_backend.dto.AdminProblemRequestDto;
import com.codetracker.codetracker_backend.dto.AdminProblemResponseDto;
import com.codetracker.codetracker_backend.entity.ExternalUrl;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;
import com.codetracker.codetracker_backend.entity.Topic;
import com.codetracker.codetracker_backend.repository.ExternalUrlRepository;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.TagRepository;
import com.codetracker.codetracker_backend.repository.TopicRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Admin - Problems", description = "Problem management (admin only)")
@RestController
@RequestMapping("/api/admin/problems")
@RequiredArgsConstructor
public class AdminProblemsController {

    private final ProblemRepository problemRepository;
    private final TopicRepository topicRepository;
    private final TagRepository tagRepository;
    private final ExternalUrlRepository externalUrlRepository;

    @Operation(summary = "Get all problems (admin)")
    @ApiResponse(responseCode = "200", description = "List of all problems")
    @GetMapping
    public List<AdminProblemResponseDto> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(AdminProblemResponseDto::fromEntity)
                .toList();
    }

    @Operation(summary = "Get a problem by ID (admin)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Problem found"),
        @ApiResponse(responseCode = "404", description = "Problem not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AdminProblemResponseDto> getProblem(@PathVariable UUID id) {
        return problemRepository.findById(id)
                .map(AdminProblemResponseDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new problem (admin)")
    @ApiResponse(responseCode = "201", description = "Problem created")
    @PostMapping
    public ResponseEntity<AdminProblemResponseDto> createProblem(@RequestBody AdminProblemRequestDto req) {
        Topic topic = topicRepository.findById(req.getTopicId())
                .orElseThrow(() -> new IllegalArgumentException("Topic not found: " + req.getTopicId()));

        Problem problem = new Problem();
        problem.setTitle(req.getTitle());
        problem.setDifficulty(req.getDifficulty());
        problem.setSlug(req.getSlug());
        problem.setTopic(topic);
        problem.setTags(resolveTags(req.getTags()));

        Problem saved = problemRepository.save(problem);
        saveExternalUrls(saved, req.getExternalUrls());

        Problem reloaded = problemRepository.findById(saved.getId()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(AdminProblemResponseDto.fromEntity(reloaded));
    }

    @Operation(summary = "Update a problem (admin)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Problem updated"),
        @ApiResponse(responseCode = "404", description = "Problem not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<AdminProblemResponseDto> updateProblem(
            @PathVariable UUID id, @RequestBody AdminProblemRequestDto req) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found: " + id));

        if (req.getTitle() != null) problem.setTitle(req.getTitle());
        if (req.getDifficulty() != null) problem.setDifficulty(req.getDifficulty());
        if (req.getSlug() != null) problem.setSlug(req.getSlug());

        if (req.getTopicId() != null) {
            Topic topic = topicRepository.findById(req.getTopicId())
                    .orElseThrow(() -> new IllegalArgumentException("Topic not found: " + req.getTopicId()));
            problem.setTopic(topic);
        }

        if (req.getTags() != null) {
            problem.setTags(resolveTags(req.getTags()));
        }

        if (req.getExternalUrls() != null) {
            externalUrlRepository.deleteAll(externalUrlRepository.findByProblemId(id));
            problemRepository.save(problem);
            saveExternalUrls(problem, req.getExternalUrls());
        } else {
            problemRepository.save(problem);
        }

        Problem reloaded = problemRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(AdminProblemResponseDto.fromEntity(reloaded));
    }

    @Operation(summary = "Delete a problem (admin)")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Problem deleted"),
        @ApiResponse(responseCode = "404", description = "Problem not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable UUID id) {
        if (!problemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        problemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---- helpers ----

    private List<Tag> resolveTags(List<String> tagNames) {
        if (tagNames == null) return new ArrayList<>();
        return tagNames.stream()
                .map(name -> tagRepository.findByName(name)
                        .orElseGet(() -> {
                            Tag t = new Tag();
                            t.setName(name);
                            return tagRepository.save(t);
                        }))
                .toList();
    }

    private void saveExternalUrls(Problem problem, List<com.codetracker.codetracker_backend.dto.ExternalUrlDto> urls) {
        if (urls == null) return;
        for (var dto : urls) {
            ExternalUrl eu = new ExternalUrl();
            eu.setPlatform(dto.platform());
            eu.setUrl(dto.url());
            eu.setProblem(problem);
            externalUrlRepository.save(eu);
        }
    }
}
