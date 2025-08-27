package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.entity.Attempt;
import com.codetracker.codetracker_backend.repository.AttemptRepository;
import com.codetracker.codetracker_backend.service.AttemptService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AttemptServiceImpl implements AttemptService {

    private final AttemptRepository attemptRepository;

    @Override
    public Attempt createAttempt(Attempt attempt) {
        return attemptRepository.save(attempt);
    }

    @Override
    public Optional<Attempt> getAttemptById(UUID attemptId) {
        return attemptRepository.findById(attemptId);
    }

    @Override
    public List<Attempt> getAttemptsByUser(UUID userId) {
        return attemptRepository.findByUserProgress_User_Id(userId);
    }

    @Override
    public List<Attempt> getAttemptsByProblem(UUID problemId) {
        return attemptRepository.findByUserProgress_Problem_Id(problemId);
    }

    @Override
    public Attempt updateAttempt(UUID attemptId, Attempt updated) {
        return attemptRepository.findById(attemptId)
                .map(existing -> {
                    existing.setDuration(updated.getDuration());
                    existing.setSuccessful(updated.getSuccessful());
                    existing.setDate(updated.getDate());
                    return attemptRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
    }


    @Override
    public void deleteAttempt(UUID attemptId) {
        attemptRepository.deleteById(attemptId);
    }
}