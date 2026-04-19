// src/hooks/useTopicPageData.tsx
import * as problemsAPI from "@/api/problemsAPI";
import apiClient from "@/api/apiClient";
import { useAuth } from "@/hooks/use-auth";
import { usePaginationState } from "@/hooks/usePaginationState";
import { mapProblemsDtoToModel, ProblemModel } from "@/mappers/problemMapper";
import * as progressService from "@/services/progressService";
import { PageResponse, ProgressStatus, Topic } from "@/types/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type CachedPage = Pick<PageResponse<ProblemModel>, "content" | "page">;

function buildCacheKey(
  page: number, difficulty: string, status: string, tags: string[],
  search: string, sortBy: string, sortDir: string,
) {
  return [page, difficulty, status, [...tags].sort().join(","), search, sortBy, sortDir].join("|");
}

export function useTopicPageData(slug: string) {
  const { user, isAdmin } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<ProblemModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { page, setPage, totalPages, totalElements, PAGE_SIZE, updateFromPage, resetPage } =
    usePaginationState(20);

  const [statusFilter, setStatusFilterState] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilterState] = useState<string>("all");
  const [tagFilter, setTagFilterState] = useState<string[]>([]);
  const [seenTags, setSeenTags] = useState<Set<string>>(new Set());

  // Search: searchInput is immediate (UI), search is debounced (API)
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Sort
  const [sortBy, setSortByState] = useState("title");
  const [sortDir, setSortDirState] = useState("asc");

  const cache = useRef(new Map<string, CachedPage>());
  const clearCache = useCallback(() => cache.current.clear(), []);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      resetPage();
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatusFilter = useCallback((val: string) => { setStatusFilterState(val); resetPage(); }, [resetPage]);
  const setDifficultyFilter = useCallback((val: string) => { setDifficultyFilterState(val); resetPage(); }, [resetPage]);
  const setTagFilter = useCallback((val: string[]) => { setTagFilterState(val); resetPage(); }, [resetPage]);
  const onSortChange = useCallback((by: string, dir: string) => {
    setSortByState(by);
    setSortDirState(dir);
    resetPage();
  }, [resetPage]);

  useEffect(() => {
    if (!slug) return;
    apiClient
      .get<Topic>(`/topics/slug/${slug}`)
      .then((res) => setTopic(res.data))
      .catch(() => setTopic(null));
  }, [slug]);

  const fetchProblems = useCallback(
    async (bustCache = false) => {
      if (!slug) return;
      setLoading(true);
      try {
        const cacheKey = buildCacheKey(page, difficultyFilter, statusFilter, tagFilter, search, sortBy, sortDir);

        if (!bustCache && cache.current.has(cacheKey)) {
          const cached = cache.current.get(cacheKey)!;
          setProblems(cached.content);
          updateFromPage(cached as any);
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

        const rawData =
          user && !isAdmin
            ? await problemsAPI.getTopicProblemsWithProgress(slug, page, PAGE_SIZE, filters)
            : await problemsAPI.getTopicProblems(slug, page, PAGE_SIZE, filters);

        const mapped = mapProblemsDtoToModel(rawData.content);
        cache.current.set(cacheKey, { content: mapped, page: rawData.page });

        setProblems(mapped);
        updateFromPage(rawData);

        setSeenTags((prev) => {
          const updated = new Set(prev);
          mapped.forEach((p) => p.tags?.forEach((t) => updated.add(t)));
          return updated;
        });
      } catch {
        toast.error("Failed to load topic data.");
      } finally {
        setLoading(false);
      }
    },
    [slug, user, isAdmin, page, PAGE_SIZE, statusFilter, difficultyFilter, tagFilter, search, sortBy, sortDir, updateFromPage],
  );

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  const updateProblemStatus = useCallback(
    async (problemId: string, status: ProgressStatus) => {
      if (!user) return;
      try {
        await progressService.upsertProgress({ problemId, status });
        toast.success("Status updated!");
        clearCache();
        await fetchProblems(true);
      } catch (error: any) {
        toast.error(error?.message || "Failed to update status.");
      }
    },
    [user, fetchProblems, clearCache],
  );

  const updateProblemBestTime = useCallback(
    async (problemId: string, bestTime: number) => {
      if (!user) return;
      try {
        await progressService.upsertProgress({ problemId, bestTime });
        toast.success("Best time updated!");
        clearCache();
        await fetchProblems(true);
      } catch (error: any) {
        toast.error(error?.message || "Failed to update best time.");
      }
    },
    [user, fetchProblems, clearCache],
  );

  return {
    loading,
    topic,
    problems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags: Array.from(seenTags).sort(),
    searchValue: searchInput,
    onSearchChange: setSearchInput,
    sortBy,
    sortDir,
    onSortChange,
    page,
    setPage,
    totalPages,
    totalElements,
    PAGE_SIZE,
    updateProblemStatus,
    updateProblemBestTime,
  };
}
