package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "tokens")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String tokenValue;

    private boolean revoked;
    private boolean expired;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

