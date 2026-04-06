package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.entity.ReminderProblem;

import java.util.List;
import java.util.UUID;

public interface ReminderProblemService {

    /** Get all ReminderProblems due for review today or earlier for a user. */
    List<ReminderProblem> getDueReviews(UUID userId);

    /** Schedule a problem for spaced repetition for the first time. */
    ReminderProblem scheduleReview(UUID userId, UUID problemId);

    /**
     * Record the result of a review using the SM-2 algorithm.
     * @param reminderProblemId the ReminderProblem to update
     * @param quality 0-5 rating of recall quality (0=blackout, 5=perfect)
     */
    ReminderProblem recordReview(UUID reminderProblemId, int quality);
}
