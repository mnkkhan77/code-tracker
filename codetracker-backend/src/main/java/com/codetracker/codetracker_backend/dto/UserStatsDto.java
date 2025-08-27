package com.codetracker.codetracker_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {
    private long totalProblemsSolved;
    private long successfulAttempts;
    private long failedAttempts;
    private double averageTimeTaken; // seconds
}
