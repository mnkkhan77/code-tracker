// src/services/problemsService.ts
import * as problemsAPI from "@/api/problemsAPI";
import { ProblemModel, mapProblemsDtoToModel } from "@/mappers/problemMapper";
import { indexProgressByProblemId } from "@/mappers/progressMapper";
import { Problem, Topic, UserProgress } from "@/types/api";

export async function getAllProblems(): Promise<ProblemModel[]> {
  const raw = await problemsAPI.getProblems();
  return mapProblemsDtoToModel(raw);
}

export async function getProblemsWithProgress(): Promise<ProblemModel[]> {
  const raw = await problemsAPI.getProblemsWithProgress();
  return mapProblemsDtoToModel(raw);
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
  topicId: string
): Promise<ProblemModel[]> {
  const raw = await problemsAPI.getProblemsByTopic(topicId);
  return mapProblemsDtoToModel(raw);
}

export async function getTopicPageData(
  slug: string,
  userId?: string
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

  // Use the problems from the topic object itself, which are now included in the response
  const problems = mapProblemsDtoToModel(topic.problems || []);

  if (!userId) {
    return { topic, problems, progressByProblemId: null };
  }

  const progressList = await (
    await import("@/api/progressAPI")
  ).getUserProgress();
  return {
    topic,
    problems,
    progressByProblemId: indexProgressByProblemId(progressList),
  };
}

// --- Problem CRUD ---
export const addProblem = (payload: Partial<Problem>) =>
  problemsAPI.addProblem(payload);
export const updateProblem = (id: string, updates: Partial<Problem>) =>
  problemsAPI.updateProblem(id, updates);
export const deleteProblem = (id: string) => problemsAPI.deleteProblem(id);
