package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {

    User createUser(User user);

    Optional<User> getUserById(UUID userId);

    Optional<User> getUserByEmail(String email);

    List<User> getAllUsers();
    Page<User> getAllUsers(Pageable pageable);

    User updateUser(UUID userId, UserDto updatedUser);

    void deleteUser(UUID userId);

    boolean isAdmin(UUID userId);
}


