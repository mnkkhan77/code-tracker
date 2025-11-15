package com.codetracker.codetracker_backend.controller.user;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.repository.UserRepository;
import com.codetracker.codetracker_backend.service.ProfileService;
import com.codetracker.codetracker_backend.service.UserProgressService;
import com.codetracker.codetracker_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final UserProgressService userProgressService;

    // Resolve current user's UUID using their email from Authentication
    private UUID currentUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found by email: " + email)).getId();
    }

    // Get own profile
    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getMyProfile(currentUserId(authentication)));
    }

    // Update own profile
    @PatchMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(Authentication authentication, @RequestBody UserDto request) {
        return ResponseEntity.ok(profileService.updateMyProfile(currentUserId(authentication), request));
    }
}
