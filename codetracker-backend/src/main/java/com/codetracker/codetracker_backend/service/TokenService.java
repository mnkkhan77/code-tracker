package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.entity.Token;

import java.util.Optional;
import java.util.UUID;

public interface TokenService {
    Token saveToken(Token token);

    Optional<Token> getTokenByValue(String tokenValue);

    void revokeToken(String tokenValue);

    void deleteTokenById(UUID tokenId);
}
