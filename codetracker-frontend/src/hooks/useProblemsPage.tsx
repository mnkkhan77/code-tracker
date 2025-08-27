// src/hooks/useProblemsPage.tsx
import { useAuth } from "@/hooks/use-auth";
import { ProblemModel } from "@/mappers/problemMapper";
import * as problemsService from "@/services/problemsService";
import * as progressService from "@/services/progressService";
import { Problem, UserProgress } from "@/types/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useProblemFilters } from "./useProblemFilters";

export function useProblemsPage() {
  const { user, isAdmin } = useAuth();
  const [problems, setProblems] = useState<ProblemModel[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [problemsData, progressData] = await Promise.all([
        problemsService.getAllProblems(),
        user && !isAdmin
          ? progressService.getUserProgress()
          : Promise.resolve([]),
      ]);
      setProblems(problemsData || []);
      setUserProgress(progressData || []);
    } catch (error) {
      toast.error("Failed to load problems data.");
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const problemsWithStatus = useMemo(() => {
    if (user && !isAdmin) {
      return problems.map((problem) => {
        const progress = userProgress.find((p) => p.problemId === problem.id);
        return {
          ...problem,
          status: progress ? progress.status : ("not_started" as const),
          bestTime: progress ? progress.bestTime : null,
        };
      });
    }
    return problems.map((p) => ({
      ...p,
      status: "not_started" as const,
      bestTime: null,
    }));
  }, [problems, userProgress, user, isAdmin]);

  const {
    filteredProblems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags,
  } = useProblemFilters(problemsWithStatus);

  const invalidateProgress = async () => {
    if (user && !isAdmin) {
      const progressData = await progressService.getUserProgress();
      setUserProgress(progressData || []);
    }
  };

  const invalidateProblems = async () => {
    const problemsData = await problemsService.getAllProblems();
    setProblems(problemsData || []);
  };

  const updateProblemStatus = useCallback(
    async (
      problemId: string,
      newStatus: "not_started" | "in_progress" | "completed"
    ) => {
      if (!user || isAdmin) return;
      const progressToUpdate = userProgress.find(
        (p) => p.problemId === problemId
      );
      try {
        if (progressToUpdate) {
          await progressService.updateProgress(progressToUpdate.id, {
            ...progressToUpdate,
            status: newStatus,
          });
        } else {
          await progressService.createProgress({
            userId: user.id,
            problemId,
            status: newStatus,
          });
        }
        toast.success("Status updated!");
        await invalidateProgress();
      } catch (error) {
        toast.error("Failed to update status.");
      }
    },
    [user, isAdmin, userProgress]
  );

  const updateProblemBestTime = useCallback(
    async (problemId: string, newTime: number) => {
      if (!user || isAdmin) return;
      const progressToUpdate = userProgress.find(
        (p) => p.problemId === problemId
      );
      try {
        if (progressToUpdate) {
          await progressService.updateProgress(progressToUpdate.id, {
            ...progressToUpdate,
            bestTime: newTime,
          });
        } else {
          await progressService.createProgress({
            userId: user.id,
            problemId,
            status: "in_progress",
            bestTime: newTime,
          });
        }
        toast.success("Best time updated!");
        await invalidateProgress();
      } catch (error) {
        toast.error("Failed to update best time.");
      }
    },
    [user, isAdmin, userProgress]
  );

  const addProblem = useCallback(async (problemToAdd: Partial<Problem>) => {
    try {
      await problemsService.addProblem(problemToAdd);
      await invalidateProblems();
      toast.success("Problem added successfully!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to add problem.");
      throw error;
    }
  }, []);

  const updateProblem = useCallback(
    async (problemId: string, problemToUpdate: Partial<Problem>) => {
      try {
        await problemsService.updateProblem(problemId, problemToUpdate);
        await invalidateProblems();
        toast.success("Problem updated successfully!");
      } catch (error) {
        toast.error((error as Error).message || "Failed to update problem.");
        throw error;
      }
    },
    []
  );

  const deleteProblem = useCallback(async (problemId: string) => {
    try {
      await problemsService.deleteProblem(problemId);
      await invalidateProblems();
      toast.success("Problem deleted successfully!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete problem.");
    }
  }, []);

  return {
    filteredProblems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags,
    loading,
    updateProblemStatus,
    updateProblemBestTime,
    addProblem,
    updateProblem,
    deleteProblem,
  };
}
