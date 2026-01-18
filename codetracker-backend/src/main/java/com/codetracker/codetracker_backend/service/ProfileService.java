package com.codetracker.codetracker_backend.service;

import java.util.UUID;

import com.codetracker.codetracker_backend.dto.UserDto;
import com.codetracker.codetracker_backend.dto.UserStatsDto;

public interface ProfileService {
    UserDto getMyProfile(UUID userId);
    UserDto updateMyProfile(UUID userId, UserDto request);
    UserStatsDto getUserStats(UUID userId);
}
