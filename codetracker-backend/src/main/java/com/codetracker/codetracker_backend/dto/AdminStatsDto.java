package com.codetracker.codetracker_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsDto {
    private long totalUsers;
    private long totalProblems;
    private BigDecimal totalRevenue;
    private BigDecimal revenueThisMonth;
    private long newUsersThisMonth;
    private long completedPurchases;
}
