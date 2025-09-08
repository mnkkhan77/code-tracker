package com.codetracker.codetracker_backend.controller.common;

import com.codetracker.codetracker_backend.dto.TopicDto;
import com.codetracker.codetracker_backend.dto.TopicWithProgressDto;
import com.codetracker.codetracker_backend.entity.Topic;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;
    private final UserRepository userRepository;

    @GetMapping
    public List<TopicDto> getAllTopics() {
        return topicService.getAllTopics();
    }

    @GetMapping("/{id}")
    public TopicDto getTopic(@PathVariable UUID id) {
        return topicService.getTopicById(id);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<TopicDto> getTopicBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(topicService.getTopicBySlug(slug));
    }

    @GetMapping("/slug/{slug}/with-progress")
    public ResponseEntity<TopicWithProgressDto> getTopicBySlugWithProgress(
            @PathVariable String slug,
            Authentication auth) {

        // Get current user ID from authentication
        UUID userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(topicService.getTopicBySlugWithProgress(slug, userId));
    }

    @PostMapping
    public Topic createTopic(@RequestBody Topic topic) {
        return topicService.createTopic(topic);
    }

    @PutMapping("/{id}")
    public Topic updateTopic(@PathVariable UUID id, @RequestBody Topic topic) {
        return topicService.updateTopic(id, topic);
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable UUID id) {
        topicService.deleteTopic(id);
    }
}
