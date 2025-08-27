package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.entity.UserProgress;
import com.codetracker.codetracker_backend.repository.UserProgressRepository;
import com.codetracker.codetracker_backend.service.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProgressServiceImpl implements UserProgressService {

    private final UserProgressRepository userProgressRepository;

    @Override
    public UserProgress createProgress(UserProgress progress) {
        return userProgressRepository.save(progress);
    }

    @Override
    public List<UserProgress> getAllProgress() {
        return userProgressRepository.findAll();
    }

    @Override
    public Optional<UserProgress> getProgressById(UUID progressId) {
        return userProgressRepository.findById(progressId);
    }

    @Override
    public List<UserProgress> getProgressByUser(UUID userId) {
        return userProgressRepository.findByUserId(userId);
    }

    @Override
    public List<UserProgress> getProgressByProblem(UUID problemId) {
        return userProgressRepository.findByProblemId(problemId);
    }

    @Override
    public UserProgress updateProgress(UUID progressId, UserProgress updatedProgress) {
        return userProgressRepository.findById(progressId)
                .map(existing -> {
                    existing.setStatus(updatedProgress.getStatus());
                    existing.setNotes(updatedProgress.getNotes());
                    existing.setBestTime(updatedProgress.getBestTime());
                    existing.setLastAttemptDate(updatedProgress.getLastAttemptDate());
                    existing.setNextReviewDate(updatedProgress.getNextReviewDate());
                    existing.setCompletedDate(updatedProgress.getCompletedDate());
                    existing.setAttempts(updatedProgress.getAttempts());
                    return userProgressRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Progress not found with id: " + progressId));
    }


    @Override
    public void deleteProgress(UUID progressId) {
        userProgressRepository.deleteById(progressId);
    }
}