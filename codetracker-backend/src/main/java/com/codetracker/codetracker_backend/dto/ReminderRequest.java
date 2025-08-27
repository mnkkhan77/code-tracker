package com.codetracker.codetracker_backend.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ReminderRequest {
    private List<UUID> problemIds;
}

