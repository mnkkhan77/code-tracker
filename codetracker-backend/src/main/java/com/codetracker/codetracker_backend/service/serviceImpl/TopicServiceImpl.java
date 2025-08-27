package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.dto.TopicDto;
import com.codetracker.codetracker_backend.entity.Topic;
import com.codetracker.codetracker_backend.repository.TopicRepository;
import com.codetracker.codetracker_backend.service.TopicService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;

    @Override
    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    @Override
    public List<TopicDto> getAllTopics() {
        return topicRepository.findAll().stream()
                .map(TopicDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TopicDto getTopicById(UUID id) {
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
    public Topic updateTopic(UUID topicId, Topic updatedTopic) {
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
    public void deleteTopic(UUID topicId) {
        topicRepository.deleteById(topicId);
    }
}