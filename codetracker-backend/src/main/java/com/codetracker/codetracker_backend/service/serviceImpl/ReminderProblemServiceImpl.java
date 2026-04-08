package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Reminder;
import com.codetracker.codetracker_backend.entity.ReminderProblem;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.ReminderProblemRepository;
import com.codetracker.codetracker_backend.repository.ReminderRepository;
import com.codetracker.codetracker_backend.service.ReminderProblemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReminderProblemServiceImpl implements ReminderProblemService {

    private static final double DEFAULT_EASE_FACTOR = 2.5;
    private static final double MIN_EASE_FACTOR = 1.3;

    private final ReminderProblemRepository reminderProblemRepository;
    private final ReminderRepository reminderRepository;
    private final ProblemRepository problemRepository;

    @Override
    public List<ReminderProblem> getDueReviews(UUID userId) {
        return reminderProblemRepository
                .findByReminderUserIdAndNextReviewDateBefore(userId, LocalDateTime.now().plusDays(1));
    }

    @Override
    public ReminderProblem scheduleReview(UUID userId, UUID problemId) {
        Problem problem = problemRepository.findById(Objects.requireNonNull(problemId))
                .orElseThrow(() -> new RuntimeException("Problem not found: " + problemId));

        // Find or create a Reminder container for this user+problem
        Reminder reminder = reminderRepository
                .findByUserIdAndEntityTypeAndEntityId(userId, "PROBLEM", problemId)
                .orElseGet(() -> {
                    Reminder r = new Reminder();
                    r.setUserId(userId);
                    r.setEntityType("PROBLEM");
                    r.setEntityId(problemId);
                    r.setNextReminderDate(LocalDate.now().plusDays(1));
                    return reminderRepository.save(r);
                });

        // Idempotent: return existing if already scheduled
        return reminderProblemRepository
                .findByReminderIdAndProblemId(Objects.requireNonNull(reminder.getId()), problemId)
                .orElseGet(() -> {
                    ReminderProblem newRp = ReminderProblem.builder()
                            .reminder(reminder)
                            .problem(problem)
                            .repetitionCount(0)
                            .intervalDays(1)
                            .easeFactor(DEFAULT_EASE_FACTOR)
                            .nextReviewDate(LocalDateTime.now().minusSeconds(1))
                            .build();
                    ReminderProblem saved = reminderProblemRepository.save(Objects.requireNonNull(newRp));
                    return Objects.requireNonNull(saved);
                });
    }

    @Override
    public ReminderProblem recordReview(UUID reminderProblemId, int quality) {
        if (quality < 0 || quality > 5) {
            throw new IllegalArgumentException("Quality must be between 0 and 5");
        }

        ReminderProblem rp = reminderProblemRepository.findById(Objects.requireNonNull(reminderProblemId))
                .orElseThrow(() -> new RuntimeException("ReminderProblem not found: " + reminderProblemId));

        // SM-2 algorithm
        if (quality < 3) {
            // Failed recall — reset
            rp.setRepetitionCount(0);
            rp.setIntervalDays(1);
        } else {
            // Successful recall — advance interval
            int nextInterval;
            if (rp.getRepetitionCount() == 0) {
                nextInterval = 1;
            } else if (rp.getRepetitionCount() == 1) {
                nextInterval = 6;
            } else {
                nextInterval = (int) Math.round(rp.getIntervalDays() * rp.getEaseFactor());
            }
            rp.setIntervalDays(nextInterval);
            rp.setRepetitionCount(rp.getRepetitionCount() + 1);
        }

        // Update ease factor (applies regardless of pass/fail per SM-2 spec)
        double newEF = rp.getEaseFactor()
                + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        rp.setEaseFactor(Math.max(MIN_EASE_FACTOR, newEF));

        rp.setNextReviewDate(LocalDateTime.now().plusDays(rp.getIntervalDays()));

        return reminderProblemRepository.save(rp);
    }
}
