package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.dto.ProgressRequestDto;
import com.codetracker.codetracker_backend.dto.ProgressResponseDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.entity.UserProgress;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserProgressService {

    Optional<UserProgress> getProgressById(UUID progressId);

    List<UserProgress> getProgressByUser(UUID userId);

    List<ProgressResponseDto> getProgressByUserId(UUID userId);

    List<UserProgress> getProgressByProblem(UUID problemId);

    void deleteProgress(UUID progressId);

    ProgressResponseDto upsertProgress(User user, Problem problem, ProgressRequestDto dto);

    List<ProgressResponseDto> getUserProgress(User user);

    UserStatsDto getUserStats(UUID userId);
}


