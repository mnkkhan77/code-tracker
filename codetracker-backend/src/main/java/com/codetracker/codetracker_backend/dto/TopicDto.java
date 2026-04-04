package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Topic;

import java.util.UUID;

public record TopicDto(
        UUID id,
        String name,
        String description,
        String slug
) {
    public static TopicDto toDto(Topic topic) {
        return new TopicDto(
                topic.getId(),
                topic.getName(),
                topic.getDescription(),
                topic.getSlug()
        );
    }
}
