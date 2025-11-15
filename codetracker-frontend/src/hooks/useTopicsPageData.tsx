// src/hooks/useTopicsPageData.tsx
import { ProblemModel } from "@/mappers/problemMapper";
import * as problemsService from "@/services/problemsService";
import { Topic } from "@/types/api";
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
            ? problemsService.getProblemsWithProgress()
            : problemsService.getAllProblems(),
        ]);

        setTopics(topicsData || []);
        setProblems(problemsData || []);
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

    return topics.map((topic) => {
      const problemsInTopic = problems.filter(
        (p) => p.topicName === topic.name
      );
      const totalProblems = problemsInTopic.length;

      const completedProblems = problemsInTopic.filter(
        (p) => p.status === "completed"
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
