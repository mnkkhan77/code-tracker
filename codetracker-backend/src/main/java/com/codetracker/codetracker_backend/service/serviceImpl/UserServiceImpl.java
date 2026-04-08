package com.codetracker.codetracker_backend.service.serviceImpl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.entity.Role;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.UserService;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUser(@NonNull User user) {
        try {
            User savedUser = userRepository.save(user);
            log.info("User saved: {}", savedUser.getEmail());
            return savedUser;
        } catch (Exception e) {
            log.error("User save failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(Objects.requireNonNull(pageable));
    }

    @Override
    public Optional<User> getUserById(@NonNull UUID userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User updateUser(@NonNull UUID userId, UserDto updatedUser) {
        return userRepository.findById(userId)
                .map(existing -> {
                    existing.setName(updatedUser.getName());
                    existing.setEmail(updatedUser.getEmail());
                    existing.setBio(updatedUser.getBio());
                    return userRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void deleteUser(@NonNull UUID userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public boolean isAdmin(@NonNull UUID userId) {
        return userRepository.findById(userId)
                .map(user -> user.getRole() == Role.ADMIN)
                .orElse(false);
    }
}
