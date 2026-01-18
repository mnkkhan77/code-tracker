package com.codetracker.codetracker_backend.service.serviceImpl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.codetracker.codetracker_backend.entity.Token;
import com.codetracker.codetracker_backend.repository.TokenRepository;
import com.codetracker.codetracker_backend.service.TokenService;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;

    @Override
    public Token saveToken(@NonNull Token token) {
        return tokenRepository.save(token);
    }

    @Override
    public Optional<Token> getTokenByValue(String tokenValue) {
        return tokenRepository.findByTokenValue(tokenValue);
    }

    @Override
    public void revokeToken(String tokenValue) {
        tokenRepository.findByTokenValue(tokenValue)
                .ifPresent(tokenRepository::delete);
    }

    @Override
    public void deleteTokenById(@NonNull UUID tokenId) {
        tokenRepository.deleteById(tokenId);
    }
}