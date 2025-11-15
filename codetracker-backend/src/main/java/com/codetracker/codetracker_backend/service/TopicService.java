package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.dto.TopicDto;
import com.codetracker.codetracker_backend.dto.TopicWithProgressDto;
import com.codetracker.codetracker_backend.entity.Topic;

import java.util.List;
import java.util.UUID;

public interface TopicService {
    Topic createTopic(Topic topic);

    List<TopicDto> getAllTopics();

    TopicDto getTopicById(UUID id);

    TopicDto getTopicBySlug(String slug);

    Topic updateTopic(UUID topicId, Topic updatedTopic);

    void deleteTopic(UUID topicId);

    TopicWithProgressDto getTopicBySlugWithProgress(String slug, UUID userId);

    List<TopicWithProgressDto> getTopicsWithProgress(UUID userId);
}


