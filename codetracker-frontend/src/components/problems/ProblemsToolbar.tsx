import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Check, ChevronsUpDown, X } from "lucide-react";

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
}: ProblemsToolbarProps) {
  const handleTagToggle = (tag: string) => {
    setTagFilter(
      tagFilter.includes(tag)
        ? tagFilter.filter((t) => t !== tag)
        : [...tagFilter, tag]
    );
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setDifficultyFilter("all");
    setTagFilter([]);
  };

  const areFiltersActive =
    statusFilter !== "all" ||
    difficultyFilter !== "all" ||
    tagFilter.length > 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
        {/* Status Filter - only show for authenticated non-admin users */}
        {showStatusFilter && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Difficulty Filter */}
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background border">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Tags Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between sm:w-[200px]"
            >
              <span className="truncate">
                {(tagFilter ?? []).length > 0
                  ? `${(tagFilter ?? []).length} tags selected`
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
                    <CommandItem
                      key={tag}
                      onSelect={() => handleTagToggle(tag)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          tagFilter.includes(tag) ? "opacity-100" : "opacity-0"
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

        {areFiltersActive && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        {problemsCount} problem{problemsCount !== 1 && "s"} found
      </div>
    </div>
  );
}
