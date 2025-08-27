package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, UUID> {
    List<Attempt> findByUserProgress_User_Id(UUID userId);
    List<Attempt> findByUserProgress_Problem_Id(UUID problemId);
}
