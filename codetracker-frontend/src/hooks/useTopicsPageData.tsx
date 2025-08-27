// src/hooks/useTopicsPageData.tsx
import { ProblemModel } from "@/mappers/problemMapper";
import * as problemsService from "@/services/problemsService";
import * as progressService from "@/services/progressService";
import { Topic, UserProgress } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./use-auth";

export interface TopicWithStats extends Topic {
  totalProblems: number;
  completedProblems: number;
  progressPercentage: number;
}

export function useTopicsPageData() {
  const { user, isAdmin } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [problems, setProblems] = useState<ProblemModel[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topicsData, problemsData, progressData] = await Promise.all([
          problemsService.getTopics(),
          problemsService.getAllProblems(),
          user && !isAdmin
            ? progressService.getUserProgress()
            : Promise.resolve([]),
        ]);
        setTopics(topicsData || []);
        setProblems(problemsData || []);
        setUserProgress(progressData || []);
      } catch (error) {
        console.error("Failed to load topics page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isAdmin]);

  const topicsWithStats: TopicWithStats[] = useMemo(() => {
    if (loading) return [];
    const progressByProblemId = new Map(
      userProgress.map((p) => [p.problemId, p])
    );

    return topics.map((topic) => {
      const problemsInTopic = problems.filter((p) => p.topicId === topic.id);
      const totalProblems = problemsInTopic.length;
      const completedProblems = problemsInTopic.filter((p) => {
        const progress = progressByProblemId.get(p.id);
        return progress?.status === "completed";
      }).length;
      const progressPercentage =
        totalProblems > 0
          ? Math.round((completedProblems / totalProblems) * 100)
          : 0;

      return {
        ...topic,
        totalProblems,
        completedProblems,
        progressPercentage,
      };
    });
  }, [topics, problems, userProgress, loading]);

  return {
    loading,
    topicsWithStats,
  };
}
