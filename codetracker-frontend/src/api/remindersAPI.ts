// src/api/remindersAPI.ts
import { Reminder } from "@/types/api";
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
