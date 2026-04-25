package com.codetracker.codetracker_backend.service.serviceImpl;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import com.codetracker.codetracker_backend.config.RedisConfig;
import com.codetracker.codetracker_backend.dto.ProgressRequestDto;
import com.codetracker.codetracker_backend.dto.ProgressResponseDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import java.time.LocalDateTime;

import com.codetracker.codetracker_backend.entity.Attempt;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.UserProgressRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.AttemptService;
import com.codetracker.codetracker_backend.service.ReminderProblemService;
import com.codetracker.codetracker_backend.service.UserProgressService;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProgressServiceImpl implements UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final ReminderProblemService reminderProblemService;
    private final AttemptService attemptService;

    @Override
    public List<ProgressResponseDto> getProgressByUserId(UUID userId) {
        return userProgressRepository.findByUserId(userId).stream()
                .map(ProgressResponseDto::toDto)
                .toList();
    }

    @Override
    public Optional<UserProgress> getProgressById(@NonNull UUID progressId) {
        return userProgressRepository.findById(progressId);
    }

    @Override
    public List<UserProgress> getProgressByUser(UUID userId) {
        return userProgressRepository.findByUserId(userId);
    }

    @Override
    public List<UserProgress> getProgressByProblem(UUID problemId) {
        return userProgressRepository.findByProblemId(problemId);
    }

    @Override
    @CacheEvict(value = RedisConfig.CACHE_TOPICS_PROGRESS, allEntries = true)
    public void deleteProgress(@NonNull UUID progressId) {
        userProgressRepository.deleteById(progressId);
    }

    @Override
    @CacheEvict(value = RedisConfig.CACHE_TOPICS_PROGRESS, key = "#user.id")
    public ProgressResponseDto upsertProgress(User user, Problem problem, ProgressRequestDto dto) {
        UserProgress progress = userProgressRepository
                .findByUserIdAndProblemId(user.getId(), problem.getId())
                .orElse(new UserProgress(user, problem));

        // only update fields that are explicitly provided
        if (dto.getStatus() != null) progress.setStatus(dto.getStatus());
        if (dto.getBestTime() != null) progress.setBestTime(dto.getBestTime());

        UserProgress saved = userProgressRepository.save(Objects.requireNonNull(progress));

        // auto-record attempt when bestTime is saved
        if (dto.getBestTime() != null) {
            boolean isCompleted = "completed".equalsIgnoreCase(saved.getStatus());
            Attempt attempt = new Attempt();
            attempt.setDuration(dto.getBestTime().intValue());
            attempt.setDate(LocalDateTime.now());
            attempt.setSuccessful(isCompleted);
            attempt.setUserProgress(saved);
            attemptService.createAttempt(attempt);
        }

        // auto-schedule for spaced repetition when first marked completed
        if ("completed".equalsIgnoreCase(dto.getStatus())) {
            reminderProblemService.scheduleReview(user.getId(), problem.getId());
        }

        return ProgressResponseDto.toDto(saved);
    }

    @Override
    public List<ProgressResponseDto> getUserProgress(User user) {
        return userProgressRepository.findByUserId(user.getId()).stream()
                .map(ProgressResponseDto::toDto)
                .toList();
    }

    @Override
    public UserStatsDto getUserStats(@NonNull UUID userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Problem> allProblems = problemRepository.findAll();
        List<UserProgress> progressList = userProgressRepository.findByUserId(userId);

        long totalProblems = allProblems.size();
        long completed = progressList.stream().filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus())).count();
        long inProgress = progressList.stream().filter(p -> "IN_PROGRESS".equalsIgnoreCase(p.getStatus())).count();
        long notStarted = totalProblems - completed - inProgress;

        long totalTimeSpent = progressList.stream()
                .mapToLong(p -> p.getBestTime() != null ? p.getBestTime() : 0L)
                .sum();

        int progressPercentage = totalProblems > 0
                ? (int) Math.round((completed * 100.0) / totalProblems)
                : 0;

        // difficulty breakdown
        Map<String, Long> totalByDifficulty = allProblems.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getDifficulty() != null ? p.getDifficulty().toLowerCase() : "unknown",
                        Collectors.counting()));

        Map<String, Long> completedByDifficulty = progressList.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                .collect(Collectors.groupingBy(
                        p -> p.getProblem().getDifficulty() != null ? p.getProblem().getDifficulty().toLowerCase() : "unknown",
                        Collectors.counting()));

        UserStatsDto dto = new UserStatsDto(totalProblems, completed, inProgress, notStarted, totalTimeSpent, progressPercentage,
                totalByDifficulty.getOrDefault("easy", 0L),
                totalByDifficulty.getOrDefault("medium", 0L),
                totalByDifficulty.getOrDefault("hard", 0L),
                completedByDifficulty.getOrDefault("easy", 0L),
                completedByDifficulty.getOrDefault("medium", 0L),
                completedByDifficulty.getOrDefault("hard", 0L));
        return dto;
    }
}