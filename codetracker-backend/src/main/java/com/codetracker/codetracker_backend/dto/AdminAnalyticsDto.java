package com.codetracker.codetracker_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminAnalyticsDto {

    private List<MonthlyDataPoint> userGrowthTrend;
    private ProblemStats problemStats;
    private LearningStats learningStats;
    private List<RevenueByProductType> revenueByProductType;
    private List<MonthlyRevenuePoint> monthlyRevenueTrend;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyDataPoint {
        private String month;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProblemStats {
        private long easy;
        private long medium;
        private long hard;
        private List<TopicDataPoint> byTopic;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopicDataPoint {
        private String topic;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LearningStats {
        private long totalAttempts;
        private long successfulAttempts;
        private long completedProblems;
        private long inProgressProblems;
        private long notStartedProblems;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RevenueByProductType {
        private String productType;
        private BigDecimal total;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyRevenuePoint {
        private String month;
        private BigDecimal amount;
    }
}
