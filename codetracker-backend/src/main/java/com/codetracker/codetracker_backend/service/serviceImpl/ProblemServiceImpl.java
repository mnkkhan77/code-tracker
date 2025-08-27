package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.service.ProblemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;

    @Override
    public Problem createProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    @Override
    public List<ProblemDto> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(ProblemDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProblemDto getProblemById(UUID id) {
        return problemRepository.findById(id)
                .map(ProblemDto::toDto)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    @Override
    public List<ProblemDto> getProblemsByTopicId(UUID topicId) {
        return problemRepository.findByTopicId(topicId).stream()
                .map(ProblemDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Problem> getProblemsByUser(UUID createdBy) {
        return problemRepository.findByCreatedBy(createdBy);
    }

    @Override
    public Problem updateProblem(UUID problemId, Problem updatedProblem) {
        return problemRepository.findById(problemId)
                .map(existing -> {
                    existing.setTitle(updatedProblem.getTitle());
                    existing.setDifficulty(updatedProblem.getDifficulty());
                    existing.setTags(updatedProblem.getTags());
                    existing.setExternalUrls(updatedProblem.getExternalUrls());
                    return problemRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    @Override
    public void deleteProblem(UUID problemId) {
        problemRepository.deleteById(problemId);
    }
}