package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    long countByCreatedDateAfter(LocalDateTime date);
    long countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);
}


