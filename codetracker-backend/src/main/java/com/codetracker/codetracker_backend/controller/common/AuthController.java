package com.codetracker.codetracker_backend.controller.common;

import com.codetracker.codetracker_backend.dto.RegisterRequest;
import com.codetracker.codetracker_backend.entity.User;
import com.codetracker.codetracker_backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Authentication", description = "User registration and login")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Register a new user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Email missing or already in use")
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email must be provided"));
        }
        if (authService.userExists(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "User with this email already exists"));
        }
        User registeredUser = authService.register(request);
        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "userId", registeredUser.getId(),
                "email", registeredUser.getEmail(),
                "role", registeredUser.getRole()
        ));
    }

    @Operation(summary = "Login and receive a JWT token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful, returns JWT token"),
        @ApiResponse(responseCode = "400", description = "Email or password missing"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password must be provided"));
        }

        if(!authService.userExists(email)) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        String token = authService.login(email, password);
        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", email
        ));
    }
}