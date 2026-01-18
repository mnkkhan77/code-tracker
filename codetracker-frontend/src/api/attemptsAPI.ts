// src/api/attemptsAPI.ts
import { Attempt } from "@/types/api";
import apiClient from "./apiClient";

export const getUserAttempts = async (userId: string): Promise<Attempt[]> => {
  try {
    const res = await apiClient.get<Attempt[]>(`/attempts/user/${userId}`);
    return res.data ?? [];
  } catch (e: any) {
    return [];
  }
};

export const getProblemAttempts = async (
  problemId: string,
): Promise<Attempt[]> => {
  try {
    const res = await apiClient.get<Attempt[]>(
      `/attempts/problem/${problemId}`,
    );
    return res.data ?? [];
  } catch (e: any) {
    return [];
  }
};

export const createAttempt = async (
  attempt: Partial<Attempt>,
): Promise<Attempt | null> => {
  try {
    const res = await apiClient.post<Attempt>("/attempts", attempt);
    return res.data ?? null;
  } catch (e: any) {
    return null;
  }
};
