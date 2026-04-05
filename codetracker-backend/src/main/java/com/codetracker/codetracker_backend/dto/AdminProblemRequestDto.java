package com.codetracker.codetracker_backend.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class AdminProblemRequestDto {
    private String title;
    private String difficulty; // easy, medium, hard
    private UUID topicId;
    private String slug;
    private List<String> tags;
    private List<ExternalUrlDto> externalUrls;
}
