// src/hooks/useProblemFilters.tsx

import { useMemo, useState } from "react";

type Problem = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  status: "not_started" | "in_progress" | "completed" | string;
};

/**
 * A dedicated hook to manage all filtering logic for a list of problems.
 * It takes a raw list of problems and returns the filtered list plus all
 * the state and setters needed to control the filters.
 */
export function useProblemFilters(problems: Problem[]) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    (problems || []).forEach((problem) => {
      (problem.tags || []).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    let filtered = problems || [];

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    }
    if (tagFilter.length > 0) {
      filtered = filtered.filter((p) =>
        tagFilter.some((tag) => (p.tags || []).includes(tag))
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
