package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.ReminderProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderProblemRepository extends JpaRepository<ReminderProblem, UUID> {
    List<ReminderProblem> findByReminderUserIdAndNextReviewDateBefore(UUID userId, LocalDateTime now);
}

