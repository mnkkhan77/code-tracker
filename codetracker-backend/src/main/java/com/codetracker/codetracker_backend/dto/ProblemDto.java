package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;

import java.util.List;

public record ProblemDto(
        String title,
        String difficulty,
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
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getTopic() != null ? problem.getTopic().getName() : null,
                problem.getSlug(),
                urls,
                tags
        );
    }
}
