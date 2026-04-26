package com.codetracker.codetracker_backend.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.codetracker.codetracker_backend.constants.ProgressStatusConstants;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;
import com.codetracker.codetracker_backend.entity.UserProgress;

public record ProblemWithProgressDto(
        UUID id,
        String title,
        String difficulty,
        String topicName,
        String slug,
        List<ExternalUrlDto> externalUrls,
        List<String> tags,

        String status,
        Long bestTime
) {
    public static ProblemWithProgressDto toDto(Problem problem, Map<UUID, UserProgress> progressMap) {
        UserProgress progress = progressMap.get(problem.getId());

        List<String> tag = problem.getTags() != null ?
                problem.getTags().stream()
                        .map(Tag::getName)
                        .toList() : List.of();

        List<ExternalUrlDto> externalUrlDtos = problem.getExternalUrls() != null
                ? problem.getExternalUrls().stream()
                .map(ExternalUrlDto::fromEntity)
                .toList()
                : List.of();

        return new ProblemWithProgressDto(
                problem.getId(),
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getTopic() != null ? problem.getTopic().getName() : null,
                problem.getSlug(),
                externalUrlDtos,
                tag,
                progress != null ? progress.getStatus() : ProgressStatusConstants.NOT_STARTED,
                progress != null ? progress.getBestTime() : null
        );
    }
}
