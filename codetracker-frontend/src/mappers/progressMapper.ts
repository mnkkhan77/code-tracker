// src/mappers/progressMapper.ts
import { UserProgress } from "@/types/api";

export type UserProgressModel = UserProgress;

export function mapProgressDtoToModel(dto: UserProgress): UserProgressModel {
  return dto;
}

export function indexProgressByProblemId(list: UserProgressModel[]) {
  return Object.fromEntries(list.map((p) => [p.problemId, p]));
}
