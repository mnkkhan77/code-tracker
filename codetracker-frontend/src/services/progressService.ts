// src/services/progressService.ts
import * as progressAPI from "@/api/progressAPI";
import {
  AddAttemptDto,
  CreateProgressDto,
  TopicWithStats,
  UserStatsDto,
} from "@/types/api";

export function getUserStats(): Promise<UserStatsDto> {
  return progressAPI.getUserStats();
}
export function getTopicsWithStats(): Promise<TopicWithStats[]> {
  return progressAPI.getTopicsWithStats();
}

export function upsertProgress(dto: CreateProgressDto) {
  return progressAPI.upsertProgress(dto);
}

export function addAttempt(dto: AddAttemptDto) {
  return progressAPI.addAttempt(dto);
}

export function deleteProgress(id: string) {
  return progressAPI.deleteProgress(id);
}
