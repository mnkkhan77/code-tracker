import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";

interface ProblemsToolbarProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (difficulty: string) => void;
  tagFilter: string[];
  setTagFilter: (tags: string[]) => void;
  allTags: string[];
  problemsCount: number;
  showStatusFilter?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  sortDir: string;
  onSortChange: (sortBy: string, sortDir: string) => void;
}

export function ProblemsToolbar({
  statusFilter,
  setStatusFilter,
  difficultyFilter,
  setDifficultyFilter,
  tagFilter,
  setTagFilter,
  allTags,
  problemsCount,
  showStatusFilter = true,
  searchValue,
  onSearchChange,
  sortBy,
  sortDir,
  onSortChange,
}: ProblemsToolbarProps) {
  const handleTagToggle = (tag: string) => {
    setTagFilter(
      tagFilter.includes(tag)
        ? tagFilter.filter((t) => t !== tag)
        : [...tagFilter, tag],
    );
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setDifficultyFilter("all");
    setTagFilter([]);
    onSearchChange("");
    onSortChange("title", "asc");
  };

  const areFiltersActive =
    statusFilter !== "all" ||
    difficultyFilter !== "all" ||
    tagFilter.length > 0 ||
    searchValue !== "" ||
    sortBy !== "title" ||
    sortDir !== "asc";

  const sortValue = `${sortBy},${sortDir}`;
  const handleSortChange = (value: string) => {
    const [by, dir] = value.split(",");
    onSortChange(by, dir);
  };

  return (
    <div className="flex flex-col gap-3 py-4">
      {/* Search row */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search problems by name..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters + sort row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex w-full flex-wrap items-center gap-2">
          {showStatusFilter && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[180px] justify-between"
                type="button"
              >
                <span className="truncate">
                  {(tagFilter ?? []).length > 0
                    ? `${(tagFilter ?? []).length} tag${tagFilter.length > 1 ? "s" : ""} selected`
                    : "Filter by tags"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {(allTags ?? []).map((tag) => (
                      <CommandItem key={tag} onSelect={() => handleTagToggle(tag)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            tagFilter.includes(tag) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Select value={sortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title,asc">Title (A → Z)</SelectItem>
              <SelectItem value="title,desc">Title (Z → A)</SelectItem>
              <SelectItem value="difficulty,asc">Difficulty (Easy → Hard)</SelectItem>
              <SelectItem value="difficulty,desc">Difficulty (Hard → Easy)</SelectItem>
              {showStatusFilter && (
                <>
                  <SelectItem value="bestTime,asc">Best Time (Fast → Slow)</SelectItem>
                  <SelectItem value="bestTime,desc">Best Time (Slow → Fast)</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {areFiltersActive && (
            <Button variant="ghost" onClick={clearFilters} className="h-9 px-2">
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="shrink-0 text-sm text-muted-foreground">
          {problemsCount} problem{problemsCount !== 1 && "s"}
        </p>
      </div>
    </div>
  );
}
