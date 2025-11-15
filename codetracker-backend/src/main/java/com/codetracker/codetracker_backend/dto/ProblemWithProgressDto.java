package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;
import com.codetracker.codetracker_backend.entity.UserProgress;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProblemWithProgressDto(
        String title,
        String difficulty,
        String topicName,
        String slug,
        List<ExternalUrlDto> externalUrls,
        List<String> tags,

        String status,
        Long bestTime
) {
    public static ProblemWithProgressDto toDto(Problem problem, List<UserProgress> userProgressList) {
        Optional<UserProgress> progress = userProgressList.stream()
                .filter(p -> p.getProblem().getId().equals(problem.getId()))
                .findFirst();

        List<String> tag = problem.getTags() != null ?
                problem.getTags().stream()
                        .map(Tag::getName)
                        .collect(Collectors.toList()) : List.of();

        List<ExternalUrlDto> externalUrlDtos = problem.getExternalUrls() != null
                ? problem.getExternalUrls().stream()
                .map(ExternalUrlDto::fromEntity)
                .toList()
                : List.of();

        return new ProblemWithProgressDto(
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getTopic() != null ? problem.getTopic().getName() : null,
                problem.getSlug(),
                externalUrlDtos,
                tag,
                progress.map(UserProgress::getStatus).orElse("not_started"),
                progress.map(UserProgress::getBestTime).orElse(null)
        );
    }
}
