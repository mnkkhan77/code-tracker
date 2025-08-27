// src/api/attemptsAPI.ts
import { Attempt } from "@/types/api";
import apiClient from "./apiClient";

export const getUserAttempts = async (userId: string): Promise<Attempt[]> => {
  const res = await apiClient.get<Attempt[]>(`/attempts/user/${userId}`);
  return res.data;
};

export const getProblemAttempts = async (
  problemId: string
): Promise<Attempt[]> => {
  const res = await apiClient.get<Attempt[]>(`/attempts/problem/${problemId}`);
  return res.data;
};

export const createAttempt = async (
  attempt: Partial<Attempt>
): Promise<Attempt> => {
  const res = await apiClient.post<Attempt>("/attempts", attempt);
  return res.data;
};
