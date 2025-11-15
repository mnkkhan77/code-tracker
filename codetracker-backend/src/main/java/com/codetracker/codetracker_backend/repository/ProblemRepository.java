package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID> {
    List<Problem> findByTopicId(UUID topicId);
    List<Problem> findByCreatedBy(UUID createdBy);
}