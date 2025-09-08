package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;

import java.util.List;
import java.util.UUID;

public record ProblemDto(
        UUID id,
        String title,
        String difficulty,
        UUID topicId,
        String topicName,
        String slug,
        List<ExternalUrlDto> externalUrls,
        List<String> tags
) {
    public static ProblemDto toDto(Problem problem) {
        List<ExternalUrlDto> urls = problem.getExternalUrls().stream()
                .map(url -> new ExternalUrlDto(url.getPlatform(), url.getUrl()))
                .toList();

        List<String> tags = problem.getTags()
                .stream()
                .map(Tag::getName) // or TagDto if you want objects
                .toList();

        return new ProblemDto(
                problem.getId(),
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getTopic() != null ? problem.getTopic().getId() : null,
                problem.getTopic() != null ? problem.getTopic().getName() : null,
                problem.getSlug(),
                urls,
                tags
        );
    }
}
