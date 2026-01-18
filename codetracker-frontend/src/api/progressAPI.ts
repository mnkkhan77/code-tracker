import {
  AddAttemptDto,
  CreateProgressDto,
  TopicWithStats,
  UserProgress,
  UserStatsDto,
} from "@/types/api";
import apiClient from "./apiClient";

export const getUserStats = async (): Promise<UserStatsDto> => {
  try {
    const res = await apiClient.get<UserStatsDto>("/progress/me");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTopicsWithStats = async (): Promise<TopicWithStats[]> => {
  try {
    const res = await apiClient.get<TopicWithStats[]>(`/topics/with-progress`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProgressByProblem = async (
  problemId: string,
): Promise<UserProgress[]> => {
  try {
    const res = await apiClient.get<UserProgress[]>(
      `/progress/problem/${problemId}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const upsertProgress = async (
  dto: CreateProgressDto,
): Promise<UserProgress> => {
  try {
    const res = await apiClient.post<UserProgress>("/progress", dto);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addAttempt = async (dto: AddAttemptDto) => {
  try {
    const res = await apiClient.post("/attempts", dto);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProgress = async (problemId: string): Promise<void> => {
  try {
    await apiClient.delete(`/progress/problem/${problemId}`);
  } catch (error) {
    throw error;
  }
};
