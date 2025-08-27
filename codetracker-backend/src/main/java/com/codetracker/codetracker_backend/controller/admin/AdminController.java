package com.codetracker.codetracker_backend.controller.admin;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.entity.*;
import com.codetracker.codetracker_backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final ProblemService problemService;
    private final PurchaseService purchaseService;
    private final AttemptService attemptService;
    private final UserProgressService userProgressService;

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable UUID id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Update a user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody UserDto user) {
        return userService.updateUser(id, user);
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }

//    -------------- admin access for user data --------------------

    @GetMapping("/problems/user/{userId}")
    public List<Problem> getProblemsByUser(@PathVariable UUID userId) {
        return problemService.getProblemsByUser(userId);
    }

    @GetMapping("/purchases/user/{userId}")
    public List<Purchase> getPurchasesByUser(@PathVariable UUID userId) {
        return purchaseService.getPurchasesByUser(userId);
    }

    @GetMapping("/attempts/user/{userId}")
    public List<Attempt> getAttemptsByUser(@PathVariable UUID userId) {
        return attemptService.getAttemptsByUser(userId);
    }

    @GetMapping("/progress/user/{userId}")
    public List<UserProgress> getProgressByUser(@PathVariable UUID userId) {
        return userProgressService.getProgressByUser(userId);
    }
}
