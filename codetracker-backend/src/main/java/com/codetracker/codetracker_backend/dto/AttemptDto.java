package com.codetracker.codetracker_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttemptDto {
    private UUID id;
    private Integer duration;       // in seconds/minutes
    private LocalDateTime date;     // when attempt was made
    private Boolean successful;     // solved or not
}
