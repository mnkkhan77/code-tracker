package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    List<UserProgress> findByUserId(UUID userId);
    List<UserProgress> findByProblemId(UUID problemId);

}
