package com.codetracker.codetracker_backend.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.codetracker.codetracker_backend.entity.UserProgress;

public record TopicWithProgressDto(
        String name,
        String description,
        String slug,
        List<ProblemWithProgressDto> problems
) {
    public static TopicWithProgressDto toDto(com.codetracker.codetracker_backend.entity.Topic topic, List<UserProgress> userProgressList) {
        return new TopicWithProgressDto(
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
