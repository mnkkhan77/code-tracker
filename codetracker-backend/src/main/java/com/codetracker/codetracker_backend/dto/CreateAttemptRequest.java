package com.codetracker.codetracker_backend.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateAttemptRequest {
    private UUID problemId;
    private int timeTaken;
}

