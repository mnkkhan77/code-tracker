package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.repository.AttemptRepository;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.UserProgressRepository;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final AttemptRepository attemptRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProblemRepository problemRepository;
    private final UserProgressRepository userProgressRepository;

    public UserDto getMyProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        return new UserDto(user.getName(), user.getBio(), user.getEmail(), null);  // Set password as null for security reasons
    }

    @Override
    public UserDto updateMyProfile(UUID userId, UserDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updated = userRepository.save(user);

        return new UserDto(updated.getName(), updated.getBio(), updated.getEmail(), null);
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
