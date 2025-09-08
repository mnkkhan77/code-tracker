package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.ExternalUrl;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;
import com.codetracker.codetracker_backend.entity.UserProgress;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProblemWithProgressDto(
        UUID id,
        String title,
        String difficulty,
        UUID topicId,
        String topicName,
        String slug,
        List<ExternalUrl> externalUrls,
        List<String> tags,

        String status,
        Long bestTime
) {
    public static ProblemWithProgressDto toDto(Problem problem, List<UserProgress> userProgressList) {
        // Find progress for this specific problem
        Optional<UserProgress> progress = userProgressList.stream()
                .filter(p -> p.getProblem().getId().equals(problem.getId()))
                .findFirst();

        List<String> tag = problem.getTags() != null ?
                problem.getTags().stream()
                        .map(Tag::getName) // Assuming 'Tag' has a 'getName()' method returning a String
                        .collect(Collectors.toList()) : List.of(); // Empty list if null

        return new ProblemWithProgressDto(
                problem.getId(),
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getTopic() != null ? problem.getTopic().getId() : null,
                problem.getTopic() != null ? problem.getTopic().getName() : null,
                problem.getSlug(),
                problem.getExternalUrls() != null ? problem.getExternalUrls() : List.of(), // Empty list if null
                tag,
                progress.map(UserProgress::getStatus).orElse("not_started"),
                progress.map(UserProgress::getBestTime).orElse(null) // Allow null for bestTime
        );
    }
}
