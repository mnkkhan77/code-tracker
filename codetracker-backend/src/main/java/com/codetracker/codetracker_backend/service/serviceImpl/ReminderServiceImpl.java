package com.codetracker.codetracker_backend.service.serviceImpl;

import com.codetracker.codetracker_backend.entity.Reminder;
import com.codetracker.codetracker_backend.repository.ReminderRepository;
import com.codetracker.codetracker_backend.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReminderServiceImpl implements ReminderService {
    private final ReminderRepository reminderRepository;

    public List<Reminder> getUpcomingReminders(UUID userId, String entityType, int days) {
        LocalDate today = LocalDate.now();
        LocalDate until = today.plusDays(days);
        return reminderRepository.findUpcomingReminders(userId, entityType, today, until);
    }

    public Reminder createReminder(UUID userId, String entityType, UUID entityId, int daysGap) {
        Reminder reminder = new Reminder();
        reminder.setUserId(userId);
        reminder.setEntityType(entityType);
        reminder.setEntityId(entityId);
        reminder.setNextReminderDate(LocalDate.now().plusDays(daysGap));
        return reminderRepository.save(reminder);
    }

    public Reminder updateReminder(UUID reminderId, int daysGap) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));
        reminder.setNextReminderDate(LocalDate.now().plusDays(daysGap));
        return reminderRepository.save(reminder);
    }
}
