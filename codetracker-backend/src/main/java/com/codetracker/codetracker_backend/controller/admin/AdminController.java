package com.codetracker.codetracker_backend.controller.admin;

import com.codetracker.codetracker_backend.dto.AdminUserDto;
import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.entity.*;
import com.codetracker.codetracker_backend.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Admin - Users", description = "User management (admin only)")
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final ProblemService problemService;
    private final PurchaseService purchaseService;
    private final AttemptService attemptService;
    private final UserProgressService userProgressService;

    @Operation(summary = "Get all users (paginated)")
    @ApiResponse(responseCode = "200", description = "Page of users")
    @GetMapping
    public ResponseEntity<Page<AdminUserDto>> getAllUsers(
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        Page<AdminUserDto> result = userService.getAllUsers(pageable)
                .map(u -> new AdminUserDto(
                        u.getId().toString(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole() != null ? u.getRole().name() : "USER",
                        u.getBio(),
                        u.getCreatedDate() != null ? u.getCreatedDate().toString() : null,
                        (int) u.getProgressList().stream()
                                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                                .count(),
                        "active"
                ));
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get a user by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable UUID id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new user")
    @ApiResponse(responseCode = "200", description = "User created")
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @Operation(summary = "Update a user")
    @ApiResponse(responseCode = "200", description = "User updated")
    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody UserDto user) {
        return userService.updateUser(id, user);
    }

    @Operation(summary = "Delete a user")
    @ApiResponse(responseCode = "200", description = "User deleted")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }

    @Operation(summary = "Get problems created by a user")
    @ApiResponse(responseCode = "200", description = "Problems list returned")
    @GetMapping("/problems/user/{userId}")
    public List<Problem> getProblemsByUser(@PathVariable UUID userId) {
        return problemService.getProblemsByUser(userId);
    }

    @Operation(summary = "Get purchases by a user")
    @ApiResponse(responseCode = "200", description = "Purchases list returned")
    @GetMapping("/purchases/user/{userId}")
    public List<Purchase> getPurchasesByUser(@PathVariable UUID userId) {
        return purchaseService.getPurchasesByUser(userId);
    }

    @Operation(summary = "Get attempts by a user")
    @ApiResponse(responseCode = "200", description = "Attempts list returned")
    @GetMapping("/attempts/user/{userId}")
    public List<Attempt> getAttemptsByUser(@PathVariable UUID userId) {
        return attemptService.getAttemptsByUser(userId);
    }

    @Operation(summary = "Get progress records for a user")
    @ApiResponse(responseCode = "200", description = "Progress list returned")
    @GetMapping("/progress/user/{userId}")
    public List<UserProgress> getProgressByUser(@PathVariable UUID userId) {
        return userProgressService.getProgressByUser(userId);
    }
}
