package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "purchases")
@Data
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "product_type", nullable = false)
    private String productType; // SUBSCRIPTION, RESUME_ANALYSIS, CREDITS

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    private String currency = "USD";

    @Column(nullable = false)
    private String status; // PENDING, COMPLETED, FAILED

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "provider_ref")
    private String providerRef;
}
