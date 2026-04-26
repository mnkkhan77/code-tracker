// src/hooks/useProblemsPage.tsx
import { getAllTags } from "@/api/problemsAPI";
import { scheduleReviewApi } from "@/api/remindersAPI";
import { useAuth } from "@/hooks/use-auth";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { usePaginationState } from "@/hooks/usePaginationState";
import { ProblemModel } from "@/mappers/problemMapper";
import * as problemsService from "@/services/problemsService";
import * as progressService from "@/services/progressService";
import { PageResponse, Problem, ProgressStatus } from "@/types/api";
import { buildCacheKey, CachedPage } from "@/utils/problemCacheKey";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useProblemsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [problems, setProblems] = useState<ProblemModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { page, setPage, totalPages, totalElements, PAGE_SIZE, updateFromPage, resetPage } =
    usePaginationState(20);

  const [statusFilter, setStatusFilterState] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilterState] = useState<string>("all");
  const [tagFilter, setTagFilterState] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const { searchInput, setSearchInput, search } = useDebouncedSearch(resetPage);

  // Sort
  const [sortBy, setSortByState] = useState("title");
  const [sortDir, setSortDirState] = useState("asc");

  const cache = useRef(new Map<string, CachedPage>());
  const hasEverLoaded = useRef(false);
  const clearCache = useCallback(() => cache.current.clear(), []);

  const setStatusFilter = useCallback((val: string) => { setStatusFilterState(val); resetPage(); }, [resetPage]);
  const setDifficultyFilter = useCallback((val: string) => { setDifficultyFilterState(val); resetPage(); }, [resetPage]);
  const setTagFilter = useCallback((val: string[]) => { setTagFilterState(val); resetPage(); }, [resetPage]);
  const onSortChange = useCallback((by: string, dir: string) => {
    setSortByState(by);
    setSortDirState(dir);
    resetPage();
  }, [resetPage]);

  useEffect(() => {
    if (user) {
      getAllTags().then(setAllTags).catch((err) => console.error("Failed to load tags:", err));
    }
  }, [user]);

  const fetchProblems = useCallback(async (bustCache = false) => {
    if (authLoading) return;
    setLoading(true);
    try {
      if (user && !isAdmin) {
        const cacheKey = buildCacheKey(page, difficultyFilter, statusFilter, tagFilter, search, sortBy, sortDir);

        if (!bustCache && cache.current.has(cacheKey)) {
          const cached = cache.current.get(cacheKey)!;
          setProblems(cached.content);
          updateFromPage(cached as PageResponse<ProblemModel>);
          return;
        }

        const filters = {
          difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          tags: tagFilter.length > 0 ? tagFilter : undefined,
          search: search || undefined,
          sortBy: sortBy !== "title" || sortDir !== "asc" ? sortBy : undefined,
          sortDir: sortBy !== "title" || sortDir !== "asc" ? sortDir : undefined,
        };
        const data = await problemsService.getProblemsWithProgress(page, PAGE_SIZE, filters);
        cache.current.set(cacheKey, { content: data.content, page: data.page });
        setProblems(data.content || []);
        updateFromPage(data);
      } else {
        const filters = {
          difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
          tags: tagFilter.length > 0 ? tagFilter : undefined,
          search: search || undefined,
          sortBy: sortBy !== "title" || sortDir !== "asc" ? sortBy : undefined,
          sortDir: sortBy !== "title" || sortDir !== "asc" ? sortDir : undefined,
        };
        const data = await problemsService.getPaginatedProblems(page, PAGE_SIZE, filters);
        setProblems(data.content || []);
        updateFromPage(data);
      }
    } catch {
      toast.error("Failed to load problems data.");
    } finally {
      hasEverLoaded.current = true;
      setLoading(false);
    }
  }, [authLoading, user, isAdmin, page, statusFilter, difficultyFilter, tagFilter, search, sortBy, sortDir, PAGE_SIZE, updateFromPage]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  const updateProblemStatus = useCallback(
    async (problemId: string, newStatus: ProgressStatus) => {
      if (!user || isAdmin) return;
      try {
        await progressService.upsertProgress({ problemId, status: newStatus });
        toast.success("Status updated!");
        clearCache();
        await fetchProblems(true);
      } catch {
        toast.error("Failed to update status.");
      }
    },
    [user, isAdmin, fetchProblems, clearCache],
  );

  const updateProblemBestTime = useCallback(
    async (problemId: string, newTime: number) => {
      if (!user || isAdmin) return;
      try {
        await progressService.upsertProgress({ problemId, bestTime: newTime });
        toast.success("Best time updated!");
        clearCache();
        await fetchProblems(true);
      } catch (error: any) {
        toast.error(error?.message || "Failed to update best time.");
      }
    },
    [user, isAdmin, fetchProblems, clearCache],
  );

  const scheduleReview = useCallback(
    async (problemId: string) => {
      if (!user || isAdmin) return;
      try {
        await scheduleReviewApi(problemId);
        toast.success("Scheduled for spaced repetition review!");
      } catch (error: any) {
        toast.error(error?.message || "Failed to schedule review.");
      }
    },
    [user, isAdmin],
  );

  const addProblem = useCallback(
    async (problemToAdd: Partial<Problem>) => {
      try {
        await problemsService.addProblem(problemToAdd);
        clearCache();
        await fetchProblems(true);
        toast.success("Problem added successfully!");
      } catch (error: any) {
        toast.error(error?.message || "Failed to add problem.");
        throw error;
      }
    },
    [fetchProblems, clearCache],
  );

  const updateProblem = useCallback(
    async (problemId: string, problemToUpdate: Partial<Problem>) => {
      try {
        await problemsService.updateProblem(problemId, problemToUpdate);
        clearCache();
        await fetchProblems(true);
        toast.success("Problem updated successfully!");
      } catch (error: any) {
        toast.error(error?.message || "Failed to update problem.");
        throw error;
      }
    },
    [fetchProblems, clearCache],
  );

  const deleteProblem = useCallback(
    async (problemId: string) => {
      try {
        await problemsService.deleteProblem(problemId);
        clearCache();
        await fetchProblems(true);
        toast.success("Problem deleted successfully!");
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete problem.");
      }
    },
    [fetchProblems, clearCache],
  );

  const filteredProblems = problems;

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
    searchValue: searchInput,
    onSearchChange: setSearchInput,
    sortBy,
    sortDir,
    onSortChange,
    updateProblemStatus,
    updateProblemBestTime,
    scheduleReview,
    addProblem,
    updateProblem,
    deleteProblem,
    isInitialLoading: loading && !hasEverLoaded.current,
    page,
    setPage,
    totalPages,
    totalElements,
    PAGE_SIZE,
  };
}
