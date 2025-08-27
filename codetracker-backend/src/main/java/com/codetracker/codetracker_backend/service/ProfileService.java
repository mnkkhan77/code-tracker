package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import com.codetracker.codetracker_backend.entity.User;

import java.util.UUID;

public interface ProfileService {
    User getMyProfile(UUID userId);
    User updateMyProfile(UUID userId, UserDto request);
    UserStatsDto getMyStats(UUID userId);
}
