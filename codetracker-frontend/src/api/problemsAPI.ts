// src/api/problemsAPI.ts
import {
  CreateProgressDto,
  Problem,
  ProgressStatus,
  Topic,
  UserProgress,
} from "@/types/api";
import apiClient from "./apiClient";
import { createProgress } from "./progressAPI";

// --- Topics ---
export const getTopics = async (): Promise<Topic[]> => {
  const res = await apiClient.get<Topic[]>("/topics");
  return res.data;
};

export const getTopicBySlug = async (slug: string): Promise<Topic | null> => {
  try {
    const res = await apiClient.get<Topic>(`/topics/slug/${slug}`);
    return res.data;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
};

export const createTopic = async (topic: Partial<Topic>): Promise<Topic> => {
  const res = await apiClient.post<Topic>("/topics", topic);
  return res.data;
};

export const updateTopic = async (
  id: string,
  topic: Partial<Topic>
): Promise<Topic> => {
  const res = await apiClient.put<Topic>(`/topics/${id}`, topic);
  return res.data;
};

export const deleteTopic = async (id: string): Promise<void> => {
  await apiClient.delete(`/topics/${id}`);
};

// --- Problems ---
export const getProblems = async (): Promise<Problem[]> => {
  const res = await apiClient.get<Problem[]>("/problems");
  return res.data;
};

export const getProblem = async (id: string): Promise<Problem> => {
  const res = await apiClient.get<Problem>(`/problems/${id}`);
  return res.data;
};

export const getProblemsByTopic = async (
  topicId: string
): Promise<Problem[]> => {
  const res = await apiClient.get<Problem[]>(`/problems/topic/${topicId}`);
  return res.data;
};

export const addProblem = async (
  payload: Partial<Problem>
): Promise<Problem> => {
  const res = await apiClient.post<Problem>("/problems", payload);
  return res.data;
};

export const updateProblem = async (
  id: string,
  updates: Partial<Problem>
): Promise<Problem> => {
  const res = await apiClient.put<Problem>(`/problems/${id}`, updates);
  return res.data;
};

export const deleteProblem = async (id: string): Promise<void> => {
  await apiClient.delete(`/problems/${id}`);
};

// --- Combined Helpers ---

// Helper to fetch a topic + its problems + (optionally) user's progress map
export const getTopicPageData = async (
  slug: string,
  userId?: string
): Promise<{
  topic: Topic | null;
  problems: Problem[];
  progressByProblemId: Record<string, UserProgress> | null;
}> => {
  const topic = await getTopicBySlug(slug);
  if (!topic) return { topic: null, problems: [], progressByProblemId: null };

  const problems = await getProblemsByTopic(topic.id);

  let progressByProblemId: Record<string, UserProgress> | null = null;
  if (userId) {
    const res = await apiClient.get<UserProgress[]>("/progress/me");
    progressByProblemId = Object.fromEntries(
      res.data.map((p) => [p.problemId, p])
    );
  }

  return { topic, problems, progressByProblemId };
};

// -------- User-progress update wrappers (compat names kept) --------
export const updateUserProblemStatus = async (
  userId: string,
  problemId: string,
  status: ProgressStatus
): Promise<UserProgress> => {
  const list = await apiClient.get<UserProgress[]>(`/progress/user/${userId}`);
  const row = list.data.find((p) => p.problemId === problemId);

  if (row) {
    // Progress exists, update it
    const updatedRow = { ...row, status };
    const res = await apiClient.put<UserProgress>(
      `/progress/${row.id}`,
      updatedRow
    );
    return res.data;
  } else {
    // No progress, create it
    const newProgress: CreateProgressDto = { userId, problemId, status };
    return createProgress(newProgress);
  }
};

export const updateUserProblemBestTime = async (
  userId: string,
  problemId: string,
  bestTime: number
): Promise<UserProgress> => {
  const list = await apiClient.get<UserProgress[]>(`/progress/user/${userId}`);
  const row = list.data.find((p) => p.problemId === problemId);

  if (row) {
    // Progress exists, update it
    const updatedRow = { ...row, bestTime };
    const res = await apiClient.put<UserProgress>(
      `/progress/${row.id}`,
      updatedRow
    );
    return res.data;
  } else {
    // No progress, create it
    const newProgress: CreateProgressDto = {
      userId,
      problemId,
      bestTime,
      status: "in_progress",
    };
    return createProgress(newProgress);
  }
};
