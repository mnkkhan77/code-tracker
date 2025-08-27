package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.dto.RegisterRequest;
import com.codetracker.codetracker_backend.entity.User;

public interface AuthService {
    User register(RegisterRequest request);

    String login(String email, String password);
}
