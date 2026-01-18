package com.codetracker.codetracker_backend.service.serviceImpl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

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
    public Topic createTopic(@NonNull Topic topic) {
        return topicRepository.save(topic);
    }

    @Override
    public List<TopicDto> getAllTopics() {
        return topicRepository.findAll().stream()
                .map(TopicDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TopicDto getTopicById(@NonNull UUID id) {
        return topicRepository.findById(id)
                .map(TopicDto::toDto)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    @Override
    public TopicDto getTopicBySlug(String slug) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        return TopicDto.toDto(topic);
    }

    @Override
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
    public void deleteTopic(@NonNull UUID topicId) {
        topicRepository.deleteById(topicId);
    }

    @Override
    public TopicWithProgressDto getTopicBySlugWithProgress(String slug, UUID userId) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        List<UserProgress> userProgressList = userProgressRepository.findByUserId(userId);

        return TopicWithProgressDto.toDto(topic, userProgressList);
    }

    public List<TopicWithProgressDto> getTopicsWithProgress(UUID userId) {
        List<Topic> topics = topicRepository.findAll();

        List<UserProgress> userProgressList = userProgressRepository.findByUserId(userId);

        return topics.stream()
                .map(topic -> TopicWithProgressDto.toDto(topic, userProgressList))
                .toList();
    }
}