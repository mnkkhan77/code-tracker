package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import com.codetracker.codetracker_backend.entity.Attempt;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.repository.AttemptRepository;
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

    @Override
    public User getMyProfile(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    @Override
    public User updateMyProfile(UUID userId, UserDto request) {
        User user = getMyProfile(userId);

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }

    @Override
    public UserStatsDto getMyStats(UUID userId) {
        List<Attempt> attempts = attemptRepository.findByUserProgress_User_Id(userId);

        long successful = attempts.stream()
                .filter(a -> Boolean.TRUE.equals(a.getSuccessful()))
                .count();

        long failed = attempts.stream()
                .filter(a -> Boolean.FALSE.equals(a.getSuccessful()))
                .count();

        long totalProblemsSolved = attempts.stream()
                .filter(a -> Boolean.TRUE.equals(a.getSuccessful()))
                .map(a -> a.getUserProgress().getProblem().getId())
                .distinct()
                .count();

        double avgTime = attempts.stream()
                .filter(a -> Boolean.TRUE.equals(a.getSuccessful()) && a.getDuration() != null)
                .mapToInt(a -> a.getDuration())
                .average()
                .orElse(0.0);

        return new UserStatsDto(totalProblemsSolved, successful, failed, avgTime);
    }
}
