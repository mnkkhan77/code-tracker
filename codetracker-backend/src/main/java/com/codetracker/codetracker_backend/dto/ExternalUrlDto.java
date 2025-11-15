package com.codetracker.codetracker_backend.dto;

import com.codetracker.codetracker_backend.entity.ExternalUrl;

public record ExternalUrlDto(
        String platform,
        String url
) {
    public static ExternalUrlDto fromEntity(ExternalUrl entity) {
        return new ExternalUrlDto(entity.getPlatform(), entity.getUrl());
    }
}
