import { PageResponse } from "@/types/api";
import { ProblemModel } from "@/mappers/problemMapper";

export type CachedPage = Pick<PageResponse<ProblemModel>, "content" | "page">;

export function buildCacheKey(
  page: number,
  difficulty: string,
  status: string,
  tags: string[],
  search: string,
  sortBy: string,
  sortDir: string,
): string {
  return [page, difficulty, status, [...tags].sort().join(","), search, sortBy, sortDir].join("|");
}
