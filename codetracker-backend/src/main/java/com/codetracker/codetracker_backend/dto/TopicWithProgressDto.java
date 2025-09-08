package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.UserProgress;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record TopicWithProgressDto(
        UUID id,
        String name,
        String description,
        String slug,
        List<ProblemWithProgressDto> problems
) {
    public static TopicWithProgressDto toDto(com.codetracker.codetracker_backend.entity.Topic topic, List<UserProgress> userProgressList) {
        return new TopicWithProgressDto(
                topic.getId(),
                topic.getName(),
                topic.getDescription(),
                topic.getSlug(),
                topic.getProblems() != null
                        ? topic.getProblems().stream()
                        .map(problem -> ProblemWithProgressDto.toDto(problem, userProgressList))
                        .collect(Collectors.toList())
                        : null
        );
    }
}
