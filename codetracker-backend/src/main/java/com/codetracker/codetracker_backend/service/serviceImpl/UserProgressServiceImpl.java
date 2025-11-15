package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.dto.ProgressRequestDto;
import com.codetracker.codetracker_backend.dto.ProgressResponseDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import com.codetracker.codetracker_backend.entity.Attempt;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.UserProgressRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProgressServiceImpl implements UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    @Override
    public List<ProgressResponseDto> getProgressByUserId(UUID userId) {
        return userProgressRepository.findByUserId(userId).stream()
                .map(ProgressResponseDto::toDto)
                .toList();
    }

    @Override
    public Optional<UserProgress> getProgressById(UUID progressId) {
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
    public void deleteProgress(UUID progressId) {
        userProgressRepository.deleteById(progressId);
    }

    @Override
    public ProgressResponseDto upsertProgress(User user, Problem problem, ProgressRequestDto dto) {
        UserProgress progress = userProgressRepository
                .findByUserIdAndProblemId(user.getId(), problem.getId())
                .orElse(new UserProgress(user, problem));

        // update fields
        progress.setStatus(dto.getStatus());
        progress.setBestTime(dto.getBestTime());

        UserProgress saved = userProgressRepository.save(progress);
        return ProgressResponseDto.toDto(saved);
    }

    @Override
    public List<ProgressResponseDto> getUserProgress(User user) {
        return userProgressRepository.findByUserId(user.getId()).stream()
                .map(ProgressResponseDto::toDto)
                .toList();
    }

    @Override
    public UserStatsDto getUserStats(UUID userId) {
        User user = userRepository.findById(userId)
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

        return new UserStatsDto(totalProblems, completed, inProgress, notStarted, totalTimeSpent, progressPercentage);
    }
}