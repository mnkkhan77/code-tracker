package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminProblemResponseDto {
    private String id;
    private String title;
    private String difficulty;
    private String topicId;
    private String topicName;
    private String slug;
    private List<String> tags;
    private List<ExternalUrlDto> externalUrls;
    private String createdAt;
    private String updatedAt;

    public static AdminProblemResponseDto fromEntity(Problem p) {
        return new AdminProblemResponseDto(
                p.getId().toString(),
                p.getTitle(),
                p.getDifficulty(),
                p.getTopic() != null ? p.getTopic().getId().toString() : null,
                p.getTopic() != null ? p.getTopic().getName() : null,
                p.getSlug(),
                p.getTags() != null
                        ? p.getTags().stream().map(Tag::getName).toList()
                        : List.of(),
                p.getExternalUrls() != null
                        ? p.getExternalUrls().stream()
                        .map(u -> new ExternalUrlDto(u.getPlatform(), u.getUrl()))
                        .toList()
                        : List.of(),
                p.getCreatedDate() != null ? p.getCreatedDate().toString() : null,
                p.getUpdatedDate() != null ? p.getUpdatedDate().toString() : null
        );
    }
}
