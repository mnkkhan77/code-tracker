// src/services/remindersService.ts
import {
  createReminderApi,
  deleteReminderApi,
  getRemindersForUser,
  updateReminderApi,
} from "@/api/remindersAPI";
import { Reminder } from "@/types/api";

/**
 * Reminders service:
 * - Try server API calls first (if backend exists).
 * - If server call fails, fallback to localStorage (so reminders work out-of-the-box).
 *
 * Local storage structure: KEY -> JSON array of Reminder objects
 */

const LS_KEY = "app_reminders_v1";

/** Simple UUID v4 generator for local-only reminders */
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** LocalStorage helpers */
function readLocal(): Reminder[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Reminder[]) : [];
  } catch {
    return [];
  }
}
function writeLocal(list: Reminder[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    // ignore write errors
  }
}

/** Public API: */
export async function getReminders(userId?: string): Promise<Reminder[]> {
  try {
    // try server
    const remote = await getRemindersForUser();
    // if server returns, optionally persist a copy locally for offline view
    try {
      writeLocal(remote);
    } catch {}
    return remote;
  } catch (err) {
    // fallback to local
    const all = readLocal();
    return userId ? all.filter((r) => !r.userId || r.userId === userId) : all;
  }
}

export async function createReminder(
  payload: Partial<Reminder>
): Promise<Reminder> {
  try {
    const created = await createReminderApi(payload);
    // update local copy
    const local = readLocal().filter((r) => r.id !== created.id);
    writeLocal([created, ...local]);
    return created;
  } catch (err) {
    // fallback: create local-only reminder
    const now = new Date().toISOString();
    const reminder: Reminder = {
      id: payload.id ?? uuidv4(),
      userId: payload.userId,
      title: payload.title ?? "Untitled reminder",
      notes: payload.notes,
      remindAt: payload.remindAt,
      completed: payload.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };
    const existing = readLocal();
    existing.unshift(reminder);
    writeLocal(existing);
    return reminder;
  }
}

export async function updateReminder(
  id: string,
  payload: Partial<Reminder>
): Promise<Reminder> {
  try {
    const updated = await updateReminderApi(id, payload);
    // update local
    const list = readLocal().map((r) => (r.id === updated.id ? updated : r));
    writeLocal(list);
    return updated;
  } catch (err) {
    // fallback local update
    const now = new Date().toISOString();
    const list = readLocal();
    const found = list.find((r) => r.id === id);
    if (found) {
      Object.assign(found, payload, { updatedAt: now });
      writeLocal(list);
      return found;
    }
    // If not found, create a new local reminder with provided id
    const created: Reminder = {
      id,
      userId: payload.userId,
      title: payload.title ?? "Untitled reminder",
      notes: payload.notes,
      remindAt: payload.remindAt,
      completed: payload.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(created);
    writeLocal(list);
    return created;
  }
}

export async function deleteReminder(id: string): Promise<void> {
  try {
    await deleteReminderApi(id);
    // remove from local copy too
    const list = readLocal().filter((r) => r.id !== id);
    writeLocal(list);
  } catch (err) {
    // fallback: remove from local
    const list = readLocal().filter((r) => r.id !== id);
    writeLocal(list);
  }
}
