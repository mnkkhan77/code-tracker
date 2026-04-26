package com.codetracker.codetracker_backend.service.serviceImpl;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.codetracker.codetracker_backend.config.RedisConfig;
import com.codetracker.codetracker_backend.dto.TopicDto;
import com.codetracker.codetracker_backend.dto.TopicWithProgressDto;
import com.codetracker.codetracker_backend.entity.Topic;
import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.repository.TopicRepository;
import com.codetracker.codetracker_backend.repository.UserProgressRepository;
import com.codetracker.codetracker_backend.service.TopicService;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final UserProgressRepository userProgressRepository;

    @Override
    @CacheEvict(value = RedisConfig.CACHE_TOPICS, allEntries = true)
    public Topic createTopic(@NonNull Topic topic) {
        return topicRepository.save(topic);
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_TOPICS, key = "'all'")
    public List<TopicDto> getAllTopics() {
        return topicRepository.findAll().stream()
                .map(TopicDto::toDto)
                .toList();
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_TOPICS, key = "#id")
    public TopicDto getTopicById(@NonNull UUID id) {
        return topicRepository.findById(id)
                .map(TopicDto::toDto)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_TOPICS, key = "'slug-' + #slug")
    public TopicDto getTopicBySlug(String slug) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        return TopicDto.toDto(topic);
    }

    @Override
    @CacheEvict(value = RedisConfig.CACHE_TOPICS, allEntries = true)
    public Topic updateTopic(@NonNull UUID topicId, Topic updatedTopic) {
        return topicRepository.findById(topicId)
                .map(existing -> {
                    existing.setName(updatedTopic.getName());
                    existing.setDescription(updatedTopic.getDescription());
                    existing.setSlug(updatedTopic.getSlug());
                    return topicRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    @Override
    @CacheEvict(value = RedisConfig.CACHE_TOPICS, allEntries = true)
    public void deleteTopic(@NonNull UUID topicId) {
        topicRepository.deleteById(topicId);
    }

    @Override
    public TopicWithProgressDto getTopicBySlugWithProgress(String slug, UUID userId) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Map<UUID, UserProgress> progressMap = userProgressRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(p -> p.getProblem().getId(), p -> p));

        return TopicWithProgressDto.toDto(topic, progressMap);
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_TOPICS_PROGRESS, key = "#userId")
    public List<TopicWithProgressDto> getTopicsWithProgress(UUID userId) {
        List<Topic> topics = topicRepository.findAllWithProblems();

        Map<UUID, UserProgress> progressMap = userProgressRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(p -> p.getProblem().getId(), p -> p));

        return topics.stream()
                .map(topic -> TopicWithProgressDto.toDto(topic, progressMap))
                .toList();
    }
}
