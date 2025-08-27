package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.ExternalUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExternalUrlRepository extends JpaRepository<ExternalUrl, String> {
    List<ExternalUrl> findByProblemId(UUID problemId);
}
