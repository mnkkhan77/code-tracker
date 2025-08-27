// src/services/attemptsService.ts
import * as attemptsAPI from "@/api/attemptsAPI";
import { Attempt } from "@/types/api";

export const getUserAttempts = (userId: string): Promise<Attempt[]> =>
  attemptsAPI.getUserAttempts(userId);

export const getProblemAttempts = (problemId: string): Promise<Attempt[]> =>
  attemptsAPI.getProblemAttempts(problemId);

export const createAttempt = (attempt: Partial<Attempt>): Promise<Attempt> =>
  attemptsAPI.createAttempt(attempt);
