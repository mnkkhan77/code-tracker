package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reminder_problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reminder_id", nullable = false)
    private Reminder reminder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    private int repetitionCount;   // how many successful reviews
    private int intervalDays;      // current interval length in days
    private double easeFactor;     // SM-2 ease factor (min 1.3, default 2.5)
    private LocalDateTime nextReviewDate; // when to show next
}

