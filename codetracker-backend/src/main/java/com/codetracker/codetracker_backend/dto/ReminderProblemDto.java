package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.ReminderProblem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReminderProblemDto {

    private UUID id;
    private int repetitionCount;
    private int intervalDays;
    private double easeFactor;
    private LocalDateTime nextReviewDate;
    private ProblemInfo problem;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProblemInfo {
        private UUID id;
        private String title;
        private String difficulty;
        private String topicSlug;
    }

    public static ReminderProblemDto from(ReminderProblem rp) {
        com.codetracker.codetracker_backend.entity.Problem p = rp.getProblem();
        ProblemInfo info = new ProblemInfo(
                p.getId(),
                p.getTitle(),
                p.getDifficulty(),
                p.getTopic() != null ? p.getTopic().getSlug() : null
        );
        return new ReminderProblemDto(
                rp.getId(),
                rp.getRepetitionCount(),
                rp.getIntervalDays(),
                rp.getEaseFactor(),
                rp.getNextReviewDate(),
                info
        );
    }
}
