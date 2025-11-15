package com.codetracker.codetracker_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {
    private long totalProblems;
    private long completed;
    private long inProgress;
    private long notStarted;
    private double totalTimeSpent;
    private int progressPercentage;
}
