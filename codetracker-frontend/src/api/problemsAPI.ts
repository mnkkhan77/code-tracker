// src/api/problemsAPI.ts
import {
  CreateProgressDto,
  Problem,
  ProgressStatus,
  Topic,
  UserProgress,
} from "@/types/api";
import apiClient from "./apiClient";
import { upsertProgress as createProgress } from "./progressAPI";

// --- Topics ---
export const getTopics = async (): Promise<Topic[]> => {
  try {
    const res = await apiClient.get<Topic[]>("/topics");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTopicBySlug = async (slug: string): Promise<Topic | null> => {
  try {
    const res = await apiClient.get<Topic>(
      `/topics/slug/${slug}/with-progress`,
    );
    return res.data;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
};

export async function getTopicBySlugWithProgress(slug: string) {
  try {
    const response = await apiClient.get(`/topics/slug/${slug}/with-progress`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createTopic = async (topic: Partial<Topic>): Promise<Topic> => {
  try {
    const res = await apiClient.post<Topic>("/topics", topic);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateTopic = async (
  id: string,
  topic: Partial<Topic>,
): Promise<Topic> => {
  try {
    const res = await apiClient.put<Topic>(`/topics/${id}`, topic);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTopic = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/topics/${id}`);
  } catch (error) {
    throw error;
  }
};

// --- Problems ---
export const getProblems = async (): Promise<Problem[]> => {
  try {
    const res = await apiClient.get<Problem[]>("/problems");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProblemsWithProgress = async (): Promise<Problem[]> => {
  try {
    const res = await apiClient.get<Problem[]>("/problems/with-progress");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProblem = async (id: string): Promise<Problem> => {
  try {
    const res = await apiClient.get<Problem>(`/problems/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProblemsByTopic = async (
  topicId: string,
): Promise<Problem[]> => {
  try {
    const res = await apiClient.get<Problem[]>(`/problems/topic/${topicId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addProblem = async (
  payload: Partial<Problem>,
): Promise<Problem> => {
  try {
    const res = await apiClient.post<Problem>("/problems", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateProblem = async (
  id: string,
  updates: Partial<Problem>,
): Promise<Problem> => {
  try {
    const res = await apiClient.put<Problem>(`/problems/${id}`, updates);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProblem = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/problems/${id}`);
  } catch (error) {
    throw error;
  }
};

// --- Combined Helpers ---

export const getTopicPageData = async (
  slug: string,
  userId?: string,
): Promise<{
  topic: Topic | null;
  problems: Problem[];
  progressByProblemId: Record<string, UserProgress> | null;
}> => {
  try {
    const topic = userId
      ? await getTopicBySlugWithProgress(slug)
      : await getTopicBySlug(slug);
    if (!topic) return { topic: null, problems: [], progressByProblemId: null };

    const problems = await getProblemsByTopic(topic.id);

    let progressByProblemId: Record<string, UserProgress> | null = null;
    if (userId) {
      const res = await apiClient.get<UserProgress[]>("/progress/me");
      progressByProblemId = Object.fromEntries(
        res.data.map((p) => [p.problemId, p]),
      );
    }

    return { topic, problems, progressByProblemId };
  } catch (error) {
    throw error;
  }
};

// -------- User-progress update wrappers (compat names kept) --------
export const updateUserProblemStatus = async (
  userId: string,
  problemId: string,
  status: ProgressStatus,
): Promise<UserProgress> => {
  try {
    const list = await apiClient.get<UserProgress[]>(
      `/progress/user/${userId}`,
    );
    const row = list.data.find((p) => p.problemId === problemId);

    if (row) {
      // Progress exists, update it
      const updatedRow = { ...row, status };
      const res = await apiClient.put<UserProgress>(
        `/progress/${row.id}`,
        updatedRow,
      );
      return res.data;
    } else {
      // No progress, create it
      const newProgress: CreateProgressDto = { userId, problemId, status };
      return createProgress(newProgress);
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserProblemBestTime = async (
  userId: string,
  problemId: string,
  bestTime: number,
): Promise<UserProgress> => {
  try {
    const list = await apiClient.get<UserProgress[]>(
      `/progress/user/${userId}`,
    );
    const row = list.data.find((p) => p.problemId === problemId);

    if (row) {
      // Progress exists, update it
      const updatedRow = { ...row, bestTime };
      const res = await apiClient.put<UserProgress>(
        `/progress/${row.id}`,
        updatedRow,
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
  } catch (error) {
    throw error;
  }
};
