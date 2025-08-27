package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "attempts")
@Data
public class Attempt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Integer duration; // in minutes/seconds
    private LocalDateTime date;
    private Boolean successful;

    @ManyToOne
    @JoinColumn(name = "user_progress_id", nullable = false)
    private UserProgress userProgress;
}
