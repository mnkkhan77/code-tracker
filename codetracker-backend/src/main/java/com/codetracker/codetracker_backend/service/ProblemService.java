package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.entity.Problem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProblemService {
    List<ProblemDto> getAllProblems();
    ProblemDto getProblemById(UUID id);
    List<ProblemDto> getProblemsByTopicId(UUID topicId);
    Problem createProblem(Problem problem);
    List<Problem> getProblemsByUser(UUID createdBy);
    Problem updateProblem(UUID problemId, Problem updatedProblem);
    void deleteProblem(UUID problemId);
}


