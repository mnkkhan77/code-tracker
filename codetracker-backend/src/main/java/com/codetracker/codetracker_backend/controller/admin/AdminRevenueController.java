package com.codetracker.codetracker_backend.controller.admin;

import com.codetracker.codetracker_backend.entity.Purchase;
import com.codetracker.codetracker_backend.repository.PurchaseRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
public class AdminRevenueController {

    private final PurchaseRepository purchaseRepository;

    @GetMapping
    public RevenueResponse getRevenue() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime yesterdayStart = todayStart.minusDays(1);
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime lastMonthStart = monthStart.minusMonths(1);

        BigDecimal today = orZero(purchaseRepository.sumCompletedRevenueBetween(todayStart, todayStart.plusDays(1)));
        BigDecimal yesterday = orZero(purchaseRepository.sumCompletedRevenueBetween(yesterdayStart, todayStart));
        BigDecimal thisMonth = orZero(purchaseRepository.sumCompletedRevenueSince(monthStart));
        BigDecimal lastMonth = orZero(purchaseRepository.sumCompletedRevenueBetween(lastMonthStart, monthStart));
        BigDecimal total = orZero(purchaseRepository.sumCompletedRevenue());
        long totalTransactions = purchaseRepository.countByStatus("COMPLETED");
        BigDecimal avg = totalTransactions > 0
                ? total.divide(BigDecimal.valueOf(totalTransactions), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<TransactionDto> transactions = purchaseRepository.findTop20ByOrderByPaidAtDesc()
                .stream()
                .map(p -> new TransactionDto(
                        p.getId().toString(),
                        p.getUser() != null ? p.getUser().getId().toString() : null,
                        p.getUser() != null ? p.getUser().getName() : "Unknown",
                        p.getAmount(),
                        p.getProductType(),
                        p.getPaidAt() != null ? p.getPaidAt().toLocalDate().toString() : null,
                        p.getStatus() != null ? p.getStatus().toLowerCase() : "pending",
                        p.getCurrency()
                ))
                .collect(Collectors.toList());

        return new RevenueResponse(
                new DailyStats(today, yesterday, percentChange(today, yesterday)),
                new MonthlyStats(thisMonth, lastMonth, percentChange(thisMonth, lastMonth)),
                new OverallStats(total, totalTransactions, avg),
                transactions
        );
    }

    private BigDecimal orZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private double percentChange(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    // ---- Response types ----

    @Data @AllArgsConstructor
    public static class RevenueResponse {
        private DailyStats daily;
        private MonthlyStats monthly;
        private OverallStats overall;
        private List<TransactionDto> transactions;
    }

    @Data @AllArgsConstructor
    public static class DailyStats {
        private BigDecimal today;
        private BigDecimal yesterday;
        private double change;
    }

    @Data @AllArgsConstructor
    public static class MonthlyStats {
        private BigDecimal thisMonth;
        private BigDecimal lastMonth;
        private double change;
    }

    @Data @AllArgsConstructor
    public static class OverallStats {
        private BigDecimal total;
        private long totalTransactions;
        private BigDecimal averageTransaction;
    }

    @Data @AllArgsConstructor
    public static class TransactionDto {
        private String id;
        private String userId;
        private String userName;
        private BigDecimal amount;
        private String type;
        private String date;
        private String status;
        private String currency;
    }
}
