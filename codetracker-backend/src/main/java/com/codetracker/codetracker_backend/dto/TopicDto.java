package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Topic;

import java.util.List;
import java.util.stream.Collectors;

public record TopicDto(
        String name,
        String description,
        String slug,
        List<ProblemDto> problems
) {
    public static TopicDto toDto(Topic topic) {
        return new TopicDto(
                topic.getName(),
                topic.getDescription(),
                topic.getSlug(),
                topic.getProblems() != null
                        ? topic.getProblems().stream()
                        .map(ProblemDto::toDto)
                        .collect(Collectors.toList())
                        : null
        );
    }
}
