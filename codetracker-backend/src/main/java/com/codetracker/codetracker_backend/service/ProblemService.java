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
    Page<ProblemDto> getAllProblems(Pageable pageable);
    ProblemDto getProblemById(UUID id);
    List<ProblemDto> getProblemsByTopicId(UUID topicId);
    Problem createProblem(Problem problem);
    List<Problem> getProblemsByUser(UUID createdBy);
    Problem updateProblem(UUID problemId, Problem updatedProblem);
    void deleteProblem(UUID problemId);

    List<ProblemWithProgressDto> getProblemsWithUserProgress(UUID userId);
    Optional<Problem> getProblemEntityById(UUID id);
}


