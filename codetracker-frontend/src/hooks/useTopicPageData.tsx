// src/hooks/useTopicPageData.tsx
import { ProblemModel } from "@/mappers/problemMapper";
import * as problemsService from "@/services/problemsService";
import * as progressService from "@/services/progressService";
import { Difficulty, ProgressStatus, Topic, UserProgress } from "@/types/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./use-auth";
import { useProblemFilters } from "./useProblemFilters";

export function useTopicPageData(slug: string) {
  const { user, isAdmin } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<ProblemModel[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const {
        topic: currentTopic,
        problems: problemsData,
        progressByProblemId,
      } = await problemsService.getTopicPageData(slug, user?.id);

      setTopic(currentTopic);
      const correctedProblems = (problemsData || []).map((p) => ({
        ...p,
        difficulty: (p.difficulty as string).toLowerCase() as Difficulty,
      }));
      setProblems(correctedProblems);

      if (progressByProblemId) {
        setUserProgress(Object.values(progressByProblemId));
      } else {
        setUserProgress([]);
      }
    } catch (error) {
      toast.error("Failed to load topic data.");
    } finally {
      setLoading(false);
    }
  }, [slug, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const problemsForTopic = useMemo(() => {
    if (!topic) return [];

    const progressByProblemId = new Map(
      userProgress.map((p) => [p.problemId, p])
    );

    return problems.map((problem) => ({ ...problem }));
  }, [topic, problems, userProgress]);

  const {
    filteredProblems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags,
  } = useProblemFilters(problemsForTopic);

  const invalidateProgress = async () => {
    if (user && !isAdmin) {
      const progressData = await progressService.getUserProgress();
      setUserProgress(progressData || []);
    }
  };

  const updateProblemStatus = useCallback(
    async (problemId: string, status: ProgressStatus) => {
      if (!user) return;

      const progressToUpdate = userProgress.find(
        (p) => p.problemId === problemId
      );
      try {
        let updatedProgress: UserProgress;
        if (progressToUpdate) {
          updatedProgress = await progressService.upsertProgress(
            // progressToUpdate.id,
            {
              ...progressToUpdate,
              status,
            }
          );
        } else {
          updatedProgress = await progressService.upsertProgress({
            userId: user.id,
            problemId,
            status,
          });
        }
        toast.success("Status updated!");

        setUserProgress((currentProgress) => {
          const progressExists = currentProgress.some(
            (p) => p.id === updatedProgress.id
          );
          if (progressExists) {
            return currentProgress.map((p) =>
              p.id === updatedProgress.id ? updatedProgress : p
            );
          } else {
            return [...currentProgress, updatedProgress];
          }
        });
        setProblems((prev) =>
          prev.map((p) => (p.id === problemId ? { ...p, status } : p))
        );
      } catch (error) {
        toast.error("Failed to update status.");
      }
    },
    [user, userProgress]
  );

  const updateProblemBestTime = useCallback(
    async (problemId: string, bestTime: number) => {
      if (!user) return;

      const progressToUpdate = userProgress.find(
        (p) => p.problemId === problemId
      );
      try {
        let updatedProgress: UserProgress;
        if (progressToUpdate) {
          updatedProgress = await progressService.upsertProgress(
            // progressToUpdate.id,
            {
              ...progressToUpdate,
              bestTime,
            }
          );
        } else {
          updatedProgress = await progressService.upsertProgress({
            userId: user.id,
            problemId,
            bestTime,
            status: "in_progress",
          });
        }
        toast.success("Best time updated!");

        setUserProgress((currentProgress) => {
          const progressExists = currentProgress.some(
            (p) => p.id === updatedProgress.id
          );
          if (progressExists) {
            return currentProgress.map((p) =>
              p.id === updatedProgress.id ? updatedProgress : p
            );
          } else {
            return [...currentProgress, updatedProgress];
          }
        });
        setProblems((prev) =>
          prev.map((p) => (p.id === problemId ? { ...p, bestTime } : p))
        );
      } catch (error) {
        toast.error("Failed to update best time.");
      }
    },
    [user, userProgress]
  );

  return {
    loading,
    topic,
    problems: filteredProblems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags,
    updateProblemStatus,
    updateProblemBestTime,
  };
}
