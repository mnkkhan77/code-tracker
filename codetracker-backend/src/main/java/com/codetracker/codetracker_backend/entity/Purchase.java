package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "purchases")
@Data
public class Purchase {
    // revenue can be derived by summing Purchase.amount grouped by month.
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double amount;
    private String description;
    private Long purchaseDate;
}
