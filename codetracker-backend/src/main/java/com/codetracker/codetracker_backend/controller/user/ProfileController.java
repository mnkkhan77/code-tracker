package com.codetracker.codetracker_backend.controller.user;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@Tag(name = "Profile", description = "Current user profile management")
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    private UUID currentUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found by email: " + email)).getId();
    }

    @Operation(summary = "Get current user's profile")
    @ApiResponse(responseCode = "200", description = "Profile returned")
    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getMyProfile(currentUserId(authentication)));
    }

    @Operation(summary = "Update current user's profile")
    @ApiResponse(responseCode = "200", description = "Profile updated")
    @PatchMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(Authentication authentication, @RequestBody UserDto request) {
        return ResponseEntity.ok(profileService.updateMyProfile(currentUserId(authentication), request));
    }
}
