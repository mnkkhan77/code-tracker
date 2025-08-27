import {
  AddAttemptDto,
  CreateProgressDto,
  TopicWithStats,
  UserProgress,
} from "@/types/api";
import apiClient from "./apiClient";

export const getUserProgress = async (): Promise<UserProgress[]> => {
  const res = await apiClient.get<UserProgress[]>("/progress/me");
  return res.data;
};

export const getTopicsWithStats = async (): Promise<TopicWithStats[]> => {
  const res = await apiClient.get<TopicWithStats[]>(`/progress/me`);
  return res.data;
};

export const getProgressByProblem = async (
  problemId: string
): Promise<UserProgress[]> => {
  const res = await apiClient.get<UserProgress[]>(
    `/progress/problem/${problemId}`
  );
  console.log("problems been fetched");
  return res.data;
};

export const createProgress = async (
  dto: CreateProgressDto
): Promise<UserProgress> => {
  const res = await apiClient.post<UserProgress>("/progress", dto);
  return res.data;
};

export const updateProgress = async (
  id: string,
  progress: UserProgress
): Promise<UserProgress> => {
  const res = await apiClient.put<UserProgress>(`/progress/${id}`, progress);
  return res.data;
};

export const addAttempt = async (dto: AddAttemptDto) => {
  // Backend: POST /api/attempts with Attempt DTO
  const res = await apiClient.post("/attempts", dto);
  return res.data;
};

export const deleteProgress = async (id: string): Promise<void> => {
  await apiClient.delete(`/progress/${id}`);
};
