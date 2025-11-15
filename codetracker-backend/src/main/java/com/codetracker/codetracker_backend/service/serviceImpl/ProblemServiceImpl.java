package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.dto.ExternalUrlDto;
import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.dto.ProblemWithProgressDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;
import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.UserProgressRepository;
import com.codetracker.codetracker_backend.service.ProblemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final UserProgressRepository userProgressRepository;

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

    @Override
    public List<ProblemWithProgressDto> getProblemsWithUserProgress(UUID userId) {
        // 1. Fetch all problems
        List<Problem> problems = problemRepository.findAll();

        // 2. Fetch user's progress records
        Map<UUID, UserProgress> progressMap = userProgressRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(
                        up -> up.getProblem().getId(),
                        up -> up
                ));

        // 3. Merge problems + progress
        return problems.stream()
                .map(problem -> {
                    UserProgress progress = progressMap.get(problem.getId());

                    return new ProblemWithProgressDto(
//                            problem.getId(),
                            problem.getTitle(),
                            problem.getDifficulty(),
//                            problem.getTopic() != null ? problem.getTopic().getId() : null,
                            problem.getTopic() != null ? problem.getTopic().getName() : null,
                            problem.getSlug(),
                            problem.getExternalUrls() != null
                                    ? problem.getExternalUrls().stream()
                                    .map(url -> new ExternalUrlDto(url.getPlatform(), url.getUrl()))
                                    .toList()
                                    : List.of(),
                            problem.getTags() != null
                                    ? problem.getTags().stream().map(Tag::getName).toList()
                                    : List.of(),

                            // ✅ pull from UserProgress if present, else defaults
                            progress != null ? progress.getStatus() : "not_started",
                            progress != null ? progress.getBestTime() : null
                    );
                })
                .toList();
    }


    @Override
    public Optional<Problem> getProblemEntityById(UUID id) {
        return problemRepository.findById(id);
    }
}