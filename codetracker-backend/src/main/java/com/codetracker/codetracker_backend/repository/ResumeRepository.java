package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ResumeRepository extends JpaRepository<Resume, UUID> {
    List<Resume> findByUserIdOrderByUploadedAtDesc(UUID userId);
}
