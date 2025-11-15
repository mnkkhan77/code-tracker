package com.codetracker.codetracker_backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

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


