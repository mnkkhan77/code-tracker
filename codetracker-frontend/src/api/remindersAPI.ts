// src/api/remindersAPI.ts
import { Reminder, ReminderProblem } from "@/types/api";
import apiClient from "./apiClient";

/**
 * Reminder API calls.
 * Backend handles the logged-in user via /me endpoint.
 * No need to pass userId from frontend.
 */

/**
 * Get upcoming reminders for logged-in user.
 *
 * @param days Number of days ahead to fetch reminders (default 3)
 * @param entityType Optional filter, e.g. "PROBLEM", "TOPIC"
 */

export const getRemindersForUser = async (
  days: number = 3,
  entityType?: string,
): Promise<Reminder[]> => {
  try {
    const res = await apiClient.get<Reminder[]>("/reminders/me", {
      params: { days, entityType },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new reminder (backend infers user from auth token).
 */
export const createReminderApi = async (
  payload: Partial<Reminder>,
): Promise<Reminder> => {
  try {
    const res = await apiClient.post<Reminder>("/reminders", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing reminder.
 */
export const updateReminderApi = async (
  id: string,
  payload: Partial<Reminder>,
): Promise<Reminder> => {
  try {
    const res = await apiClient.put<Reminder>(`/reminders/${id}`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a reminder.
 */
export const deleteReminderApi = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/reminders/${id}`);
  } catch (error) {
    throw error;
  }
};

// ---- Spaced Repetition (SM-2) ----

/** Get all problems due for spaced repetition review today. */
export const getDueReviewsApi = async (): Promise<ReminderProblem[]> => {
  const res = await apiClient.get<ReminderProblem[]>("/reminders/due");
  return res.data;
};

/** Schedule a problem for spaced repetition. */
export const scheduleReviewApi = async (
  problemId: string,
): Promise<ReminderProblem> => {
  const res = await apiClient.post<ReminderProblem>("/reminders/schedule", null, {
    params: { problemId },
  });
  return res.data;
};

/**
 * Record a review result using SM-2.
 * @param reminderProblemId the ReminderProblem id
 * @param quality 0-5 recall quality (0=blackout, 5=perfect)
 */
export const recordReviewApi = async (
  reminderProblemId: string,
  quality: number,
): Promise<ReminderProblem> => {
  const res = await apiClient.post<ReminderProblem>(
    `/reminders/review/${reminderProblemId}`,
    { quality },
  );
  return res.data;
};
