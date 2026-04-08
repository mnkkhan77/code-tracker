package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.Attempt;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttemptResponseDto {
    private UUID id;
    private Integer duration;
    private LocalDateTime date;
    private Boolean successful;
    private UUID problemId;
    private String problemTitle;

    public static AttemptResponseDto from(Attempt attempt) {
        var up = attempt.getUserProgress();
        var problem = up.getProblem();
        return new AttemptResponseDto(
                attempt.getId(),
                attempt.getDuration(),
                attempt.getDate(),
                attempt.getSuccessful(),
                problem.getId(),
                problem.getTitle()
        );
    }
}
