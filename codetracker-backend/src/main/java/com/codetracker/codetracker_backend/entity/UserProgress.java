package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_progress")
@Data
public class UserProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    private String status; // not_started, in_progress, completed
    private String notes;

    private Long bestTime; // in seconds

    private LocalDate lastAttemptDate;
    private LocalDate nextReviewDate;
    private LocalDate completedDate;

    @OneToMany(mappedBy = "userProgress", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attempt> attempts = new ArrayList<>();
}
