// src/hooks/useRemindersPage.tsx
import * as remindersService from "@/services/remindersService";
import { Reminder } from "@/types/api";
import { useCallback, useEffect, useState } from "react";

/**
 * useRemindersPage
 * - Optional parameter `userId` filters reminders for the current user.
 * - Returns: { loading, reminders, refresh, createReminder, updateReminder, deleteReminder }
 */
export function useRemindersPage(userId?: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await remindersService.getReminders(userId);
      setReminders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to load reminders");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const createReminder = useCallback(
    async (payload: Partial<Reminder>) => {
      setLoading(true);
      try {
        const created = await remindersService.createReminder({
          ...payload,
          userId,
        });
        // optimistic update
        setReminders((prev) => [
          created,
          ...prev.filter((r) => r.id !== created.id),
        ]);
        return created;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const updateReminder = useCallback(
    async (id: string, payload: Partial<Reminder>) => {
      setLoading(true);
      try {
        const updated = await remindersService.updateReminder(id, payload);
        setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return updated;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteReminder = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await remindersService.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    reminders,
    error,
    refresh: load,
    createReminder,
    updateReminder,
    deleteReminder,
  };
}
