package com.codetracker.codetracker_backend.repository;

import com.codetracker.codetracker_backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {
    Optional<Topic> findBySlug(String slug);

    // Single query: eager-load all topics + their problems to avoid N+1
    @Query("SELECT DISTINCT t FROM Topic t LEFT JOIN FETCH t.problems")
    List<Topic> findAllWithProblems();
}

