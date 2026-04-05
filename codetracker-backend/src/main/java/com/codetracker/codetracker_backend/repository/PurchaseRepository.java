package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {
    List<Purchase> findByUser_Id(UUID userId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Purchase p WHERE p.status = 'COMPLETED'")
    BigDecimal sumCompletedRevenue();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Purchase p WHERE p.status = 'COMPLETED' AND p.paidAt >= :since")
    BigDecimal sumCompletedRevenueSince(LocalDateTime since);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Purchase p WHERE p.status = 'COMPLETED' AND p.paidAt >= :start AND p.paidAt < :end")
    BigDecimal sumCompletedRevenueBetween(LocalDateTime start, LocalDateTime end);

    long countByStatus(String status);

    List<Purchase> findTop20ByOrderByPaidAtDesc();

    @Query("SELECT p.productType, COALESCE(SUM(p.amount), 0), COUNT(p) FROM Purchase p WHERE p.status = 'COMPLETED' GROUP BY p.productType")
    List<Object[]> revenueByProductType();
}

