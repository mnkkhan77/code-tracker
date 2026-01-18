package com.codetracker.codetracker_backend.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class ProgressRequestDto {
//    private UUID userId;
    private UUID problemId;
    private String status;
//    private String notes;
    private Long bestTime;
//    private LocalDate lastAttemptDate;
//    private LocalDate nextReviewDate;
//    private LocalDate completedDate;
//    private List<AttemptDto> attempts;
}


