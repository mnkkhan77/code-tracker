package com.codetracker.codetracker_backend.service.serviceImpl;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.codetracker.codetracker_backend.config.RedisConfig;
import com.codetracker.codetracker_backend.dto.ProblemDto;
import com.codetracker.codetracker_backend.dto.ProblemWithProgressDto;
import com.codetracker.codetracker_backend.entity.Problem;
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
    @Caching(evict = {
        @CacheEvict(value = RedisConfig.CACHE_PROBLEMS, allEntries = true),
        @CacheEvict(value = RedisConfig.CACHE_TAGS,     allEntries = true)
    })
    public Problem createProblem(@NonNull Problem problem) {
        return problemRepository.save(problem);
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_PROBLEMS, key = "'all'")
    public List<ProblemDto> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(ProblemDto::toDto)
                .toList();
    }

    @Override
    public Page<ProblemDto> getAllProblems(Pageable pageable, String difficulty, List<String> tags, String search, String sortBy, String sortDir) {
        Specification<Problem> spec = ProblemSpecification.withFilters(difficulty, tags, search, sortBy, sortDir);
        return problemRepository.findAll(spec, Objects.requireNonNull(ProblemSpecification.effectivePageable(pageable, sortBy))).map(ProblemDto::toDto);
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_TAGS, key = "'all'")
    public List<String> getAllTagNames() {
        return problemRepository.findAllTagNames();
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_PROBLEMS, key = "#id")
    public ProblemDto getProblemById(@NonNull UUID id) {
        return problemRepository.findById(id)
                .map(ProblemDto::toDto)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    @Override
    @Cacheable(value = RedisConfig.CACHE_PROBLEMS, key = "'topic-' + #topicId")
    public List<ProblemDto> getProblemsByTopicId(UUID topicId) {
        return problemRepository.findByTopicId(topicId).stream()
                .map(ProblemDto::toDto)
                .toList();
    }

    @Override
    public List<Problem> getProblemsByUser(UUID createdBy) {
        return problemRepository.findByCreatedBy(createdBy);
    }

    @Override
    @Caching(evict = {
        @CacheEvict(value = RedisConfig.CACHE_PROBLEMS, allEntries = true),
        @CacheEvict(value = RedisConfig.CACHE_TAGS,     allEntries = true)
    })
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
    @Caching(evict = {
        @CacheEvict(value = RedisConfig.CACHE_PROBLEMS, allEntries = true),
        @CacheEvict(value = RedisConfig.CACHE_TAGS,     allEntries = true)
    })
    public void deleteProblem(@NonNull UUID problemId) {
        problemRepository.deleteById(problemId);
    }

    @Override
    public List<ProblemWithProgressDto> getProblemsWithUserProgress(UUID userId) {
        List<Problem> problems = problemRepository.findAll();

        Map<UUID, UserProgress> progressMap = userProgressRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(
                        up -> up.getProblem().getId(),
                        up -> up
                ));

        return problems.stream()
                .map(problem -> ProblemWithProgressDto.toDto(problem, progressMap))
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

        return problemPage.map(problem -> ProblemWithProgressDto.toDto(problem, progressMap));
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

        return problemPage.map(problem -> ProblemWithProgressDto.toDto(problem, progressMap));
    }

    @Override
    public Optional<Problem> getProblemEntityById(@NonNull UUID id) {
        return problemRepository.findById(id);
    }
}
