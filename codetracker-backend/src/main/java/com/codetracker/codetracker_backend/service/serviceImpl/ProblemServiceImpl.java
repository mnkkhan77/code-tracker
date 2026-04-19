package com.codetracker.codetracker_backend.service.serviceImpl;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.codetracker.codetracker_backend.dto.ExternalUrlDto;
import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.dto.ProblemWithProgressDto;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;
import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.repository.ProblemRepository;
import com.codetracker.codetracker_backend.repository.UserProgressRepository;
import com.codetracker.codetracker_backend.service.ProblemService;
import com.codetracker.codetracker_backend.specification.ProblemSpecification;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final UserProgressRepository userProgressRepository;

    @Override
    public Problem createProblem(@NonNull Problem problem) {
        return problemRepository.save(problem);
    }

    @Override
    public List<ProblemDto> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(ProblemDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProblemDto> getAllProblems(Pageable pageable, String difficulty, List<String> tags) {
        Specification<Problem> spec = ProblemSpecification.withFilters(difficulty, tags);
        return problemRepository.findAll(spec, Objects.requireNonNull(pageable)).map(ProblemDto::toDto);
    }

    @Override
    public List<String> getAllTagNames() {
        return problemRepository.findAllTagNames();
    }

    @Override
    public ProblemDto getProblemById(@NonNull UUID id) {
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
    public Problem updateProblem(@NonNull UUID problemId, Problem updatedProblem) {
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
    public void deleteProblem(@NonNull UUID problemId) {
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
                            problem.getId(),
                            problem.getTitle(),
                            problem.getDifficulty(),
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
                            progress != null ? progress.getStatus() : "not_started",
                            progress != null ? progress.getBestTime() : null
                    );
                })
                .toList();
    }


    @Override
    public Page<ProblemWithProgressDto> getProblemsWithUserProgress(
            UUID userId, Pageable pageable, String search, String difficulty, List<String> tags, String status, String sortBy, String sortDir) {
        Specification<Problem> spec = ProblemSpecification.withTopicUserFilters(null, difficulty, tags, search, status, userId, sortBy, sortDir);
        Page<Problem> problemPage = problemRepository.findAll(spec, Objects.requireNonNull(ProblemSpecification.effectivePageable(pageable, sortBy)));

        Map<UUID, UserProgress> progressMap = userProgressRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(up -> up.getProblem().getId(), up -> up));

        return problemPage.map(problem -> {
            UserProgress progress = progressMap.get(problem.getId());
            return new ProblemWithProgressDto(
                    problem.getId(),
                    problem.getTitle(),
                    problem.getDifficulty(),
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
                    progress != null ? progress.getStatus() : "not_started",
                    progress != null ? progress.getBestTime() : null
            );
        });
    }

    @Override
    public Page<ProblemDto> getTopicProblems(UUID topicId, Pageable pageable, String search, String difficulty, List<String> tags, String sortBy, String sortDir) {
        Specification<Problem> spec = ProblemSpecification.withTopicFilters(topicId, difficulty, tags, search, sortBy, sortDir);
        return problemRepository.findAll(spec, Objects.requireNonNull(ProblemSpecification.effectivePageable(pageable, sortBy))).map(ProblemDto::toDto);
    }

    @Override
    public Page<ProblemWithProgressDto> getTopicProblemsWithUserProgress(
            UUID topicId, UUID userId, Pageable pageable, String search, String difficulty, List<String> tags, String status, String sortBy, String sortDir) {
        Specification<Problem> spec = ProblemSpecification.withTopicUserFilters(topicId, difficulty, tags, search, status, userId, sortBy, sortDir);
        Page<Problem> problemPage = problemRepository.findAll(spec, Objects.requireNonNull(ProblemSpecification.effectivePageable(pageable, sortBy)));

        Map<UUID, UserProgress> progressMap = userProgressRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(up -> up.getProblem().getId(), up -> up));

        return problemPage.map(problem -> {
            UserProgress progress = progressMap.get(problem.getId());
            return new ProblemWithProgressDto(
                    problem.getId(),
                    problem.getTitle(),
                    problem.getDifficulty(),
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
                    progress != null ? progress.getStatus() : "not_started",
                    progress != null ? progress.getBestTime() : null
            );
        });
    }

    @Override
    public Optional<Problem> getProblemEntityById(@NonNull UUID id) {
        return problemRepository.findById(id);
    }
}