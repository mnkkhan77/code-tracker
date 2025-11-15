package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Attempt;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.entity.UserProgress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

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