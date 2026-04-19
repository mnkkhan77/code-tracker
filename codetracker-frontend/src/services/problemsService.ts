// src/services/problemsService.ts
import * as problemsAPI from "@/api/problemsAPI";
import { ProblemFilters } from "@/api/problemsAPI";
import { ProblemModel, mapProblemsDtoToModel } from "@/mappers/problemMapper";
import { indexProgressByProblemId } from "@/mappers/progressMapper";
import { PageResponse, Problem, Topic, UserProgress } from "@/types/api";

export async function getAllProblems(): Promise<ProblemModel[]> {
  const raw = await problemsAPI.getProblems();
  return mapProblemsDtoToModel(raw);
}

export async function getProblemsWithProgress(
  page = 0,
  size = 20,
  filters: ProblemFilters = {},
): Promise<PageResponse<ProblemModel>> {
  const pageData = await problemsAPI.getProblemsWithProgress(page, size, filters);
  return {
    ...pageData,
    content: mapProblemsDtoToModel(pageData.content),
  };
}

export async function getTopics(): Promise<Topic[]> {
  return problemsAPI.getTopics();
}

export async function getTopicBySlug(slug: string) {
  return problemsAPI.getTopicBySlug(slug);
}

export async function getTopicBySlugWithProgress(slug: string) {
  return problemsAPI.getTopicBySlugWithProgress(slug);
}

export async function getTopicProblems(
  topicId: string,
): Promise<ProblemModel[]> {
  const raw = await problemsAPI.getProblemsByTopic(topicId);
  return mapProblemsDtoToModel(raw);
}

export async function getTopicPageData(
  slug: string,
  userId?: string,
): Promise<{
  topic: Topic | null;
  problems: ProblemModel[];
  progressByProblemId: Record<string, UserProgress> | null;
}> {
  const topic = userId
    ? await problemsAPI.getTopicBySlugWithProgress(slug)
    : await problemsAPI.getTopicBySlug(slug);
  if (!topic) {
    return { topic: null, problems: [], progressByProblemId: null };
  }

  // Ensure topic.problems exists and is an array
  const problems = Array.isArray(topic.problems)
    ? mapProblemsDtoToModel(topic.problems)
    : [];

  let progressByProblemId: Record<string, UserProgress> | null = null;
  if (userId) {
    const { getUserProgress } = await import("@/api/progressAPI");
    const progressList = await getUserProgress();
    progressByProblemId = indexProgressByProblemId(progressList);
  }

  return {
    topic,
    problems,
    progressByProblemId,
  };
}

// --- Problem CRUD ---
export const addProblem = (payload: Partial<Problem>) =>
  problemsAPI.addProblem(payload);
export const updateProblem = (id: string, updates: Partial<Problem>) =>
  problemsAPI.updateProblem(id, updates);
export const deleteProblem = (id: string) => problemsAPI.deleteProblem(id);
