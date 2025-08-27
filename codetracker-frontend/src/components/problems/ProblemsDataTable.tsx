import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { Problem as BaseProblem } from "@/types/api";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BestTimeEditor } from "./BestTimeEditor";

type Problem = BaseProblem & {
  status: "not_started" | "in_progress" | "completed";
  bestTime: number | null;
};

interface ProblemsDataTableProps {
  problems: Problem[];
  onStatusChange: (
    problemId: string,
    newStatus: "not_started" | "in_progress" | "completed"
  ) => void;
  onBestTimeChange: (problemId: string, newTime: number) => void;
  openEditModal: (problem: BaseProblem) => void;
  setProblemToDelete: (problemId: string) => void;
}

export function ProblemsDataTable({
  problems,
  onStatusChange,
  onBestTimeChange,
  openEditModal,
  setProblemToDelete,
}: ProblemsDataTableProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const showStatusColumn = isAuthenticated && !isAdmin;

  const getDifficultyColor = (difficulty: "easy" | "medium" | "hard") => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusTriggerClass = (
    status: "not_started" | "in_progress" | "completed"
  ) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200/60 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200/60 dark:bg-yellow-900/40 dark:text-yellow-300 dark:hover:bg-yellow-900/60";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200/60 dark:bg-gray-800/40 dark:text-gray-300 dark:hover:bg-gray-800/60";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">#</TableHead>
            {showStatusColumn && (
              <TableHead className="w-[120px]">Status</TableHead>
            )}
            <TableHead>Title</TableHead>
            {showStatusColumn && (
              <TableHead className="w-[180px]">Best Time</TableHead>
            )}
            <TableHead className="hidden w-[120px] md:table-cell">
              Difficulty
            </TableHead>
            <TableHead className="hidden w-[300px] lg:table-cell">
              Tags
            </TableHead>
            {isAdmin && (
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.length > 0 ? (
            problems.map((problem, index) => (
              <TableRow key={problem.id}>
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>
                {showStatusColumn && (
                  <TableCell>
                    <Select
                      key={`${problem.id}-${problem.status}`}
                      value={problem.status}
                      onValueChange={(
                        newStatus: "not_started" | "in_progress" | "completed"
                      ) => {
                        onStatusChange(problem.id, newStatus);
                      }}
                    >
                      <SelectTrigger
                        className={`w-[120px] border-none px-2 font-medium capitalize focus:ring-0 ${getStatusTriggerClass(problem.status)}`}
                      >
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                )}
                <TableCell
                  className="max-w-sm truncate font-medium"
                  title={problem.title}
                >
                  {isAdmin ? (
                    <Link
                      to={`/admin/problems/${problem.id}`}
                      className="hover:underline"
                    >
                      {problem.title}
                    </Link>
                  ) : (
                    <span>{problem.title}</span>
                  )}
                </TableCell>
                {showStatusColumn && (
                  <TableCell>
                    <BestTimeEditor
                      key={`${problem.id}-${problem.bestTime}`}
                      timeInSeconds={problem.bestTime}
                      onSave={(newTime) =>
                        onBestTimeChange(problem.id, newTime)
                      }
                    />
                  </TableCell>
                )}
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant="outline"
                    className={`capitalize ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(problem.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(problem)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setProblemToDelete(problem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={isAdmin || showStatusColumn ? 6 : 4}
                className="h-24 text-center"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
