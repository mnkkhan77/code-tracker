package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "external_urls")
@Data
public class ExternalUrl {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String platform;
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
}

