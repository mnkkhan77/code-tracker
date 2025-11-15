import {
  AddAttemptDto,
  CreateProgressDto,
  TopicWithStats,
  UserProgress,
  UserStatsDto,
} from "@/types/api";
import apiClient from "./apiClient";

export const getUserStats = async (): Promise<UserStatsDto> => {
  const res = await apiClient.get<UserStatsDto>("/progress/me");
  return res.data;
};

export const getTopicsWithStats = async (): Promise<TopicWithStats[]> => {
  const res = await apiClient.get<TopicWithStats[]>(`/topics/with-progress`);
  return res.data;
};

export const getProgressByProblem = async (
  problemId: string
): Promise<UserProgress[]> => {
  const res = await apiClient.get<UserProgress[]>(
    `/progress/problem/${problemId}`
  );
  return res.data;
};

export const upsertProgress = async (
  dto: CreateProgressDto
): Promise<UserProgress> => {
  const res = await apiClient.post<UserProgress>("/progress", dto);
  return res.data;
};

export const addAttempt = async (dto: AddAttemptDto) => {
  const res = await apiClient.post("/attempts", dto);
  return res.data;
};

export const deleteProgress = async (problemId: string): Promise<void> => {
  await apiClient.delete(`/progress/problem/${problemId}`);
};
