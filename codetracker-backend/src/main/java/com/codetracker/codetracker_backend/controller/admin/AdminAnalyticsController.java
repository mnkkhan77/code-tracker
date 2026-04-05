package com.codetracker.codetracker_backend.controller.admin;

import com.codetracker.codetracker_backend.dto.AdminAnalyticsDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.repository.AttemptRepository;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.PurchaseRepository;
import com.codetracker.codetracker_backend.repository.UserProgressRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final AttemptRepository attemptRepository;
    private final UserProgressRepository userProgressRepository;
    private final PurchaseRepository purchaseRepository;

    @GetMapping
    public AdminAnalyticsDto getAnalytics() {
        return new AdminAnalyticsDto(
                buildUserGrowthTrend(),
                buildProblemStats(),
                buildLearningStats(),
                buildRevenueByProductType(),
                buildMonthlyRevenueTrend()
        );
    }

    private List<AdminAnalyticsDto.MonthlyDataPoint> buildUserGrowthTrend() {
        List<AdminAnalyticsDto.MonthlyDataPoint> points = new ArrayList<>();
        YearMonth current = YearMonth.now();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = 5; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            LocalDateTime start = month.atDay(1).atStartOfDay();
            LocalDateTime end = month.atEndOfMonth().atTime(23, 59, 59);
            long count = userRepository.countByCreatedDateBetween(start, end);
            points.add(new AdminAnalyticsDto.MonthlyDataPoint(month.format(fmt), count));
        }
        return points;
    }

    private AdminAnalyticsDto.ProblemStats buildProblemStats() {
        List<Problem> problems = problemRepository.findAll();

        long easy = problems.stream().filter(p -> "easy".equalsIgnoreCase(p.getDifficulty())).count();
        long medium = problems.stream().filter(p -> "medium".equalsIgnoreCase(p.getDifficulty())).count();
        long hard = problems.stream().filter(p -> "hard".equalsIgnoreCase(p.getDifficulty())).count();

        Map<String, Long> byTopic = problems.stream()
                .filter(p -> p.getTopic() != null)
                .collect(Collectors.groupingBy(p -> p.getTopic().getName(), Collectors.counting()));

        List<AdminAnalyticsDto.TopicDataPoint> topicPoints = byTopic.entrySet().stream()
                .map(e -> new AdminAnalyticsDto.TopicDataPoint(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());

        return new AdminAnalyticsDto.ProblemStats(easy, medium, hard, topicPoints);
    }

    private AdminAnalyticsDto.LearningStats buildLearningStats() {
        long totalAttempts = attemptRepository.count();
        long successfulAttempts = attemptRepository.countBySuccessful(true);
        long completedProblems = userProgressRepository.countByStatus("completed");
        long inProgressProblems = userProgressRepository.countByStatus("in_progress");
        long notStartedProblems = userProgressRepository.countByStatus("not_started");

        return new AdminAnalyticsDto.LearningStats(
                totalAttempts, successfulAttempts,
                completedProblems, inProgressProblems, notStartedProblems
        );
    }

    private List<AdminAnalyticsDto.RevenueByProductType> buildRevenueByProductType() {
        List<Object[]> rows = purchaseRepository.revenueByProductType();
        List<AdminAnalyticsDto.RevenueByProductType> result = new ArrayList<>();
        for (Object[] row : rows) {
            String productType = (String) row[0];
            BigDecimal total = (BigDecimal) row[1];
            long count = ((Number) row[2]).longValue();
            result.add(new AdminAnalyticsDto.RevenueByProductType(productType, total, count));
        }
        return result;
    }

    private List<AdminAnalyticsDto.MonthlyRevenuePoint> buildMonthlyRevenueTrend() {
        List<AdminAnalyticsDto.MonthlyRevenuePoint> points = new ArrayList<>();
        YearMonth current = YearMonth.now();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = 5; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            LocalDateTime start = month.atDay(1).atStartOfDay();
            LocalDateTime end = month.atEndOfMonth().atTime(23, 59, 59);
            BigDecimal amount = purchaseRepository.sumCompletedRevenueBetween(start, end);
            points.add(new AdminAnalyticsDto.MonthlyRevenuePoint(
                    month.format(fmt),
                    amount != null ? amount : BigDecimal.ZERO
            ));
        }
        return points;
    }
}
