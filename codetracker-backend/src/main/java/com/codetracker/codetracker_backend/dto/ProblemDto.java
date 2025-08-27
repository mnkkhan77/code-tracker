package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Problem;

import java.util.UUID;

public record ProblemDto(
        UUID id,
        String title,
        String difficulty,
        UUID topicId,
        String topicName,
        String slug
) {
    public static ProblemDto toDto(Problem problem) {
        return new ProblemDto(
                problem.getId(),
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getTopic() != null ? problem.getTopic().getId() : null,
                problem.getTopic() != null ? problem.getTopic().getName() : null,
                problem.getSlug()
        );
    }
}
