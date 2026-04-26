import { useEffect, useState } from "react";

export function useDebouncedSearch(resetPage: () => void, delayMs = 400) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      resetPage();
    }, delayMs);
    return () => clearTimeout(id);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  return { searchInput, setSearchInput, search };
}
