package com.codetracker.codetracker_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutRequestDto {
    @NotBlank
    private String productType; // SUBSCRIPTION | RESUME_ANALYSIS | CREDITS
}
