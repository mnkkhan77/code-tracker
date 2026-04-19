// src/hooks/useTopicsPageData.tsx
import { ProblemModel } from "@/mappers/problemMapper";
import * as problemsService from "@/services/problemsService";
import { PageResponse, Topic } from "@/types/api";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topicsData, problemsData] = await Promise.all([
          problemsService.getTopics(),
          user
            ? problemsService.getProblemsWithProgress(0, 1000)
            : problemsService.getAllProblems(),
        ]);

        setTopics(topicsData || []);
        const problems = user
          ? (problemsData as PageResponse<ProblemModel>).content
          : (problemsData as ProblemModel[]);
        setProblems(problems || []);
      } catch (error) {
        console.error("Failed to load topics page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, isAdmin]);

  const topicsWithStats: TopicWithStats[] = useMemo(() => {
    if (loading) return [];

    return topics.map((topic) => {
      // Use topicId for matching if available, fallback to topicName
      const problemsInTopic = problems.filter(
        (p) => p.topicId === topic.id || p.topicName === topic.name,
      );
      const totalProblems = problemsInTopic.length;

      const completedProblems = problemsInTopic.filter(
        (p) => p.status === "completed",
      ).length;

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
  }, [topics, problems, loading]);

  return {
    loading,
    topicsWithStats,
  };
}
