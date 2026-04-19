// src/hooks/usePaginationState.ts
import { PageResponse } from "@/types/api";
import { useCallback, useState } from "react";

export function usePaginationState(pageSize = 20) {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const updateFromPage = useCallback(<T>(response: PageResponse<T>) => {
    setTotalPages(response.page.totalPages);
    setTotalElements(response.page.totalElements);
  }, []);

  const resetPage = useCallback(() => setPage(0), []);

  return {
    page,
    setPage,
    totalPages,
    totalElements,
    PAGE_SIZE: pageSize,
    updateFromPage,
    resetPage,
  };
}
