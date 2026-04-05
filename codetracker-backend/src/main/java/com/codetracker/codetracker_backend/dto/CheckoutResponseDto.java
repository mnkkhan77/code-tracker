package com.codetracker.codetracker_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckoutResponseDto {
    private String sessionUrl;
    private String purchaseId;
}
