package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, UUID> {

    @Query("SELECT r FROM Reminder r WHERE r.userId = :userId " +
            "AND r.entityType = :entityType " +
            "AND r.nextReminderDate BETWEEN :today AND :until")
    List<Reminder> findUpcomingReminders(
            @Param("userId") UUID userId,
            @Param("entityType") String entityType,
            @Param("today") LocalDate today,
            @Param("until") LocalDate until
    );
}

