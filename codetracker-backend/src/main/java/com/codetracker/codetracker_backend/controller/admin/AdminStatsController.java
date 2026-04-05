package com.codetracker.codetracker_backend.controller.admin;

import com.codetracker.codetracker_backend.dto.AdminStatsDto;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.PurchaseRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final PurchaseRepository purchaseRepository;

    @GetMapping
    public AdminStatsDto getStats() {
        LocalDateTime startOfMonth = LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);

        long totalUsers = userRepository.count();
        long totalProblems = problemRepository.count();

        BigDecimal totalRevenue = purchaseRepository.sumCompletedRevenue();
        BigDecimal revenueThisMonth = purchaseRepository.sumCompletedRevenueSince(startOfMonth);

        long newUsersThisMonth = userRepository.countByCreatedDateAfter(startOfMonth);
        long completedPurchases = purchaseRepository.countByStatus("COMPLETED");

        return new AdminStatsDto(
                totalUsers,
                totalProblems,
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                revenueThisMonth != null ? revenueThisMonth : BigDecimal.ZERO,
                newUsersThisMonth,
                completedPurchases
        );
    }
}
