package com.codetracker.codetracker_backend.service;

import com.codetracker.codetracker_backend.entity.Reminder;

import java.util.List;
import java.util.UUID;

public interface ReminderService {
    List<Reminder> getUpcomingReminders(UUID userId, String entityType, int days);
    Reminder createReminder(UUID userId, String entityType, UUID entityId, int daysGap);
    Reminder updateReminder(UUID reminderId, int daysGap);
}
