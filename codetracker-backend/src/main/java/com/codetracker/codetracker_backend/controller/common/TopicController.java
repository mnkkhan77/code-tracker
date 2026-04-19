package com.codetracker.codetracker_backend.controller.common;

import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.dto.ProblemWithProgressDto;
import com.codetracker.codetracker_backend.dto.TopicDto;
import com.codetracker.codetracker_backend.dto.TopicWithProgressDto;
import com.codetracker.codetracker_backend.entity.Topic;
import com.codetracker.codetracker_backend.repository.TopicRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.ProblemService;
import com.codetracker.codetracker_backend.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Topics", description = "Topic listing and management")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;
    private final ProblemService problemService;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    @Operation(summary = "Get all topics")
    @ApiResponse(responseCode = "200", description = "List of all topics")
    @GetMapping
    public List<TopicDto> getAllTopics() {
        return topicService.getAllTopics();
    }

    @Operation(summary = "Get a topic by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Topic found"),
        @ApiResponse(responseCode = "404", description = "Topic not found")
    })
    @GetMapping("/{id}")
    public TopicDto getTopic(@PathVariable UUID id) {
        return topicService.getTopicById(id);
    }

    @Operation(summary = "Get a topic by slug")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Topic found"),
        @ApiResponse(responseCode = "404", description = "Topic not found")
    })
    @GetMapping("/slug/{slug}")
    public ResponseEntity<TopicDto> getTopicBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(topicService.getTopicBySlug(slug));
    }

    @Operation(summary = "Get a topic by slug with current user's progress")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Topic with progress data"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/slug/{slug}/with-progress")
    public ResponseEntity<TopicWithProgressDto> getTopicBySlugWithProgress(
            @PathVariable String slug,
            Authentication auth) {
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        return ResponseEntity.ok(topicService.getTopicBySlugWithProgress(slug, userId));
    }

    @Operation(summary = "Get all topics with current user's progress")
    @ApiResponse(responseCode = "200", description = "Topics with progress data")
    @GetMapping("/with-progress")
    public ResponseEntity<List<TopicWithProgressDto>> getTopicsWithProgress(Authentication auth) {
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        return ResponseEntity.ok(topicService.getTopicsWithProgress(userId));
    }

    @Operation(summary = "Get paginated problems for a topic by slug (public)")
    @ApiResponse(responseCode = "200", description = "Paginated problems for topic")
    @GetMapping("/slug/{slug}/problems")
    public ResponseEntity<Page<ProblemDto>> getTopicProblems(
            @PathVariable String slug,
            @PageableDefault(size = 20, sort = "title") Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir) {
        UUID topicId = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Topic not found"))
                .getId();
        return ResponseEntity.ok(problemService.getTopicProblems(topicId, pageable, search, difficulty, tags, sortBy, sortDir));
    }

    @Operation(summary = "Get paginated problems for a topic with current user's progress")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Paginated problems with progress for topic"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/slug/{slug}/problems/with-progress")
    public ResponseEntity<Page<ProblemWithProgressDto>> getTopicProblemsWithProgress(
            @PathVariable String slug,
            Authentication auth,
            @PageableDefault(size = 20, sort = "title") Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir) {
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        UUID topicId = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Topic not found"))
                .getId();
        return ResponseEntity.ok(
                problemService.getTopicProblemsWithUserProgress(topicId, userId, pageable, search, difficulty, tags, status, sortBy, sortDir));
    }

    @Operation(summary = "Create a new topic")
    @ApiResponse(responseCode = "200", description = "Topic created")
    @PostMapping
    public Topic createTopic(@RequestBody Topic topic) {
        return topicService.createTopic(topic);
    }

    @Operation(summary = "Update a topic by ID")
    @ApiResponse(responseCode = "200", description = "Topic updated")
    @PutMapping("/{id}")
    public Topic updateTopic(@PathVariable UUID id, @RequestBody Topic topic) {
        return topicService.updateTopic(id, topic);
    }

    @Operation(summary = "Delete a topic by ID")
    @ApiResponse(responseCode = "200", description = "Topic deleted")
    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable UUID id) {
        topicService.deleteTopic(id);
    }
}
