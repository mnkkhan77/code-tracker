// src/services/progressService.ts
import * as progressAPI from "@/api/progressAPI";
import {
  AddAttemptDto,
  CreateProgressDto,
  TopicWithStats,
  UserProgress,
} from "@/types/api";

export function getUserProgress(): Promise<UserProgress[]> {
  return progressAPI.getUserProgress();
}
export function getTopicsWithStats(): Promise<TopicWithStats[]> {
  return progressAPI.getTopicsWithStats();
}

export function createProgress(dto: CreateProgressDto) {
  return progressAPI.createProgress(dto);
}

export function updateProgress(id: string, dto: UserProgress) {
  return progressAPI.updateProgress(id, dto);
}

export function addAttempt(dto: AddAttemptDto) {
  return progressAPI.addAttempt(dto);
}

export function deleteProgress(id: string) {
  return progressAPI.deleteProgress(id);
}
