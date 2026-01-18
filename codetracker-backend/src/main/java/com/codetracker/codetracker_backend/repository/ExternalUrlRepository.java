package com.codetracker.codetracker_backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codetracker.codetracker_backend.entity.ExternalUrl;

@Repository
public interface ExternalUrlRepository extends JpaRepository<ExternalUrl, UUID> {
    List<ExternalUrl> findByProblemId(UUID problemId);
}
