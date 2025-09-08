package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.UserProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProgressDto {
    private UUID problemId;
    private String status;

    ProgressDto toDto(UserProgress progress) {
        return ProgressDto.builder()
                .problemId(progress.getProblem().getId())
                .status(progress.getStatus())
                .build();
    }
}

