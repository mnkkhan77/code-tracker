import sampleData from "@/data/sampleData";
import { Problem } from "../adminAPI";
// NOTE: We are removing the complex caching and mutable 'db' instance.
// Each API call will get a fresh, deep-copied version of the data
// to prevent any state pollution or caching issues. This simplifies the logic
// and ensures predictable data retrieval, fixing the recent bugs.
// A simple helper to simulate API latency.
const simulateApiCall = <T>(data: T, delay = 200): Promise<T> => {
  // Deep copy to prevent mutations from affecting the original sampleData object
  return new Promise((resolve) =>
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay)
  );
};

export type Topic = {
  id: string;
  name: string;
  description: string;
  slug: string;
};

export type UserProgress = {
  id: string;
  userId: string;
  problemId: string;
  status: "completed" | "in_progress" | "not_started";
  notes: string;
  bestTime: number | null;
  attempts: { duration: number }[];
  lastAttemptDate: number | null;
  nextReviewDate: number | null;
  completedDate: number | null;
};

export type TopicPageData = {
  topic: Topic;
  problems: Problem[];
};

// In-memory state for this session only, to make mutations appear to work.
// This is a simplified approach.
let sessionDb = JSON.parse(JSON.stringify(sampleData));
// Function to reset the session DB if needed for testing
export const resetSessionData = () => {
  sessionDb = JSON.parse(JSON.stringify(sampleData));
};
// --- API GET Functions ---
export const getTopics = () => {
  return simulateApiCall(sessionDb.topics);
};
export const getProblems = () => {
  return simulateApiCall(sessionDb.problems);
};
export const getUserProgress = () => {
  return simulateApiCall(sessionDb.userProgress);
};
export const getDashboardData = () => {
  return simulateApiCall({
    topics: sessionDb.topics,
    problems: sessionDb.problems,
    userProgress: sessionDb.userProgress,
  });
};
export const getTopicPageData = (
  slug: string
): Promise<TopicPageData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const topic = sessionDb.topics.find((t: any) => t.slug === slug);
      if (!topic) {
        resolve(null);
        return;
      }
      const problemsForTopic = sessionDb.problems
        .filter((p: any) => p.topicId === topic.id)
        .map((problem: any) => {
          const progress = sessionDb.userProgress.find(
            (p: any) => p.problemId === problem.id
          );
          return {
            ...problem,
            status: progress ? progress.status : "not_started",
            bestTime: progress ? progress.bestTime : null,
          };
        });
      resolve({
        topic,
        problems: problemsForTopic,
      });
    }, 300);
  });
};
export const getReminders = () => {
  const now = Date.now();
  const reminders = sessionDb.userProgress
    .filter((p: any) => p.nextReviewDate && p.nextReviewDate <= now)
    .map((progress: any) => {
      const problem = sessionDb.problems.find(
        (p: any) => p.id === progress.problemId
      );
      const topic = problem
        ? sessionDb.topics.find((t: any) => t.id === problem.topicId)
        : null;
      return {
        ...progress,
        problem,
        topic,
      };
    })
    .filter((item: any) => item.problem && item.topic)
    .sort(
      (a: any, b: any) => (a.nextReviewDate || 0) - (b.nextReviewDate || 0)
    );
  return simulateApiCall(reminders);
};
// --- API MUTATE Functions ---
// These now modify the 'sessionDb' object, so changes will be reflected
// during the user's current session.
export const updateUserProblemStatus = (
  problemId: string,
  newStatus: string
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let progress = sessionDb.userProgress.find(
        (p: any) => p.problemId === problemId
      );
      if (progress) {
        progress.status = newStatus;
      } else {
        sessionDb.userProgress.push({
          id: `up_${Date.now()}`,
          userId: "user_1",
          problemId,
          status: newStatus,
          notes: "",
          bestTime: null,
          attempts: [],
          lastAttemptDate: null,
          nextReviewDate: null,
          completedDate: null,
        });
      }
      resolve({ success: true, problemId, newStatus });
    }, 200);
  });
};
export const updateUserProblemBestTime = (
  problemId: string,
  newTime: number | null
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let progress = sessionDb.userProgress.find(
        (p: any) => p.problemId === problemId
      );
      if (progress) {
        progress.bestTime = newTime;
      } else {
        sessionDb.userProgress.push({
          id: `up_${Date.now()}`,
          userId: "user_1",
          problemId,
          status: "in_progress",
          notes: "",
          bestTime: newTime,
          attempts: [],
          lastAttemptDate: null,
          nextReviewDate: null,
          completedDate: null,
        });
      }
      resolve({ success: true, problemId, newTime });
    }, 200);
  });
};
