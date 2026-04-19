package com.codetracker.codetracker_backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.codetracker.codetracker_backend.entity.Problem;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID>, JpaSpecificationExecutor<Problem> {
    List<Problem> findByTopicId(UUID topicId);
    List<Problem> findByCreatedBy(UUID createdBy);

    @Query("SELECT DISTINCT t.name FROM Problem p JOIN p.tags t ORDER BY t.name")
    List<String> findAllTagNames();
}