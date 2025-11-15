// src/hooks/useProblemsPage.tsx
import { useAuth } from "@/hooks/use-auth";
import { ProblemModel } from "@/mappers/problemMapper";
import * as problemsService from "@/services/problemsService";
import * as progressService from "@/services/progressService";
import { Problem, ProgressStatus } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useProblemFilters } from "./useProblemFilters";

export function useProblemsPage() {
  const { user, isAdmin } = useAuth();
  const [problems, setProblems] = useState<ProblemModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        user && !isAdmin
          ? await problemsService.getProblemsWithProgress()
          : await problemsService.getAllProblems();
      setProblems(data || []);
    } catch (error) {
      toast.error("Failed to load problems data.");
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // ---- Update handlers ----
  const updateProblemStatus = useCallback(
    async (problemId: string, newStatus: ProgressStatus) => {
      if (!user || isAdmin) return;
      try {
        await progressService.upsertProgress({
          problemId,
          status: newStatus,
          userId: user.id,
        });
        toast.success("Status updated!");
        await fetchProblems(); // only problems refresh, no separate progress
      } catch (error) {
        toast.error("Failed to update status.");
      }
    },
    [user, isAdmin, fetchProblems]
  );

  const updateProblemBestTime = useCallback(
    async (problemId: string, newStatus: ProgressStatus, newTime: number) => {
      if (!user || isAdmin) return;
      try {
        await progressService.upsertProgress({
          problemId,
          bestTime: newTime,
          status: newStatus,
          userId: user.id,
        });
        toast.success("Best time updated!");
        await fetchProblems();
      } catch (error) {
        toast.error("Failed to update best time.");
      }
    },
    [user, isAdmin, fetchProblems]
  );

  // ---- Admin CRUD ----
  const addProblem = useCallback(
    async (problemToAdd: Partial<Problem>) => {
      try {
        await problemsService.addProblem(problemToAdd);
        await fetchProblems();
        toast.success("Problem added successfully!");
      } catch (error) {
        toast.error((error as Error).message || "Failed to add problem.");
        throw error;
      }
    },
    [fetchProblems]
  );

  const updateProblem = useCallback(
    async (problemId: string, problemToUpdate: Partial<Problem>) => {
      try {
        await problemsService.updateProblem(problemId, problemToUpdate);
        await fetchProblems();
        toast.success("Problem updated successfully!");
      } catch (error) {
        toast.error((error as Error).message || "Failed to update problem.");
        throw error;
      }
    },
    [fetchProblems]
  );

  const deleteProblem = useCallback(
    async (problemId: string) => {
      try {
        await problemsService.deleteProblem(problemId);
        await fetchProblems();
        toast.success("Problem deleted successfully!");
      } catch (error) {
        toast.error((error as Error).message || "Failed to delete problem.");
      }
    },
    [fetchProblems]
  );

  // ---- Filtering ----
  const {
    filteredProblems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags,
  } = useProblemFilters(problems);

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
