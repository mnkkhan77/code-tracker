package com.codetracker.codetracker_backend.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgressRequestDto {
//    private UUID userId;
    @NotNull(message = "problemId is required")
    private UUID problemId;
    private String status;
//    private String notes;
    private Long bestTime;
//    private LocalDate lastAttemptDate;
//    private LocalDate nextReviewDate;
//    private LocalDate completedDate;
//    private List<AttemptDto> attempts;
}


