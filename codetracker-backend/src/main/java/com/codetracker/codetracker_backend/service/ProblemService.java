package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.dto.ProblemWithProgressDto;
import com.codetracker.codetracker_backend.entity.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface ProblemService {
    List<ProblemDto> getAllProblems();
    Page<ProblemDto> getAllProblems(Pageable pageable, String difficulty, List<String> tags, String search, String sortBy, String sortDir);
    ProblemDto getProblemById(UUID id);
    List<ProblemDto> getProblemsByTopicId(UUID topicId);
    Problem createProblem(Problem problem);
    List<Problem> getProblemsByUser(UUID createdBy);
    Problem updateProblem(UUID problemId, Problem updatedProblem);
    void deleteProblem(UUID problemId);

    List<ProblemWithProgressDto> getProblemsWithUserProgress(UUID userId);
    Page<ProblemWithProgressDto> getProblemsWithUserProgress(UUID userId, Pageable pageable, String search, String difficulty, List<String> tags, String status, String sortBy, String sortDir);

    Page<ProblemDto> getTopicProblems(UUID topicId, Pageable pageable, String search, String difficulty, List<String> tags, String sortBy, String sortDir);
    Page<ProblemWithProgressDto> getTopicProblemsWithUserProgress(UUID topicId, UUID userId, Pageable pageable, String search, String difficulty, List<String> tags, String status, String sortBy, String sortDir);

    List<String> getAllTagNames();
    Optional<Problem> getProblemEntityById(UUID id);
}


