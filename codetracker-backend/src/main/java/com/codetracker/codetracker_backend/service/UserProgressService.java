package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.entity.UserProgress;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserProgressService {

    UserProgress createProgress(UserProgress progress);

    List<UserProgress> getAllProgress();

    Optional<UserProgress> getProgressById(UUID progressId);

    List<UserProgress> getProgressByUser(UUID userId);

    List<UserProgress> getProgressByProblem(UUID problemId);

    UserProgress updateProgress(UUID progressId, UserProgress updatedProgress);

    void deleteProgress(UUID progressId);
}


