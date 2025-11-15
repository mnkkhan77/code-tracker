package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;
import com.codetracker.codetracker_backend.entity.User;

import java.util.UUID;

public interface ProfileService {
    UserDto getMyProfile(UUID userId);
    UserDto updateMyProfile(UUID userId, UserDto request);
    UserStatsDto getUserStats(UUID userId);
}
