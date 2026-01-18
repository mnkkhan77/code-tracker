package com.codetracker.codetracker_backend.dto;

import java.util.UUID;

import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.entity.UserProgress;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressResponseDto {
    private UUID id;
    private UUID problemId;
    private String status;
    private Long bestTime;

    public static UserProgress toEntity(ProgressRequestDto dto, User user, Problem problem) {
        UserProgress progress = new UserProgress();
        progress.setUser(user);
        progress.setProblem(problem);
        progress.setStatus(dto.getStatus());
        progress.setBestTime(dto.getBestTime());
        return progress;
    }

    public static ProgressResponseDto toDto(UserProgress progress) {

        return new ProgressResponseDto(
                progress.getId(),
                progress.getProblem().getId(),
                progress.getStatus(),
                progress.getBestTime()
        );
    }
}