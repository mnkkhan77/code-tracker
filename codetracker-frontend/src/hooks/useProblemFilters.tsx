// src/hooks/useProblemFilters.tsx

import type { ProblemModel } from "@/mappers/problemMapper";
import { useMemo, useState } from "react";

export function useProblemFilters(problems: ProblemModel[]) {
  const [statusFilter, setStatusFilter] = useState<
    ProblemModel["status"] | "all"
  >("all");
  const [difficultyFilter, setDifficultyFilter] = useState<
    ProblemModel["difficulty"] | "all"
  >("all");
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    problems.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    let filtered = problems || [];

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.difficulty.toLowerCase() === difficultyFilter,
      );
    }
    if (tagFilter.length > 0) {
      filtered = filtered.filter((p) =>
        tagFilter.every((tag) => p.tags?.includes(tag)),
      );
    }

    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [problems, statusFilter, difficultyFilter, tagFilter]);

  return {
    filteredProblems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags,
  };
}
