package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.entity.Attempt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttemptService {
    Attempt createAttempt(Attempt attempt);

    Optional<Attempt> getAttemptById(UUID attemptId);

    List<Attempt> getAttemptsByUser(UUID userId);

    List<Attempt> getAttemptsByProblem(UUID problemId);

    Attempt updateAttempt(UUID attemptId, Attempt updated);

    void deleteAttempt(UUID attemptId);
}


