// src/pages/admin/AdminProblemsPage
import {
  AdminProblem,
  AdminProblemRequest,
  createAdminProblem,
  deleteAdminProblem,
  getAdminProblems,
} from "@/api/adminAPI";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePaginationState } from "@/hooks/usePaginationState";
import { getTopics } from "@/api/problemsAPI";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Topic } from "@/types/api";
import { MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProblemFormModal from "./ProblemFormModal";

const difficultyColor: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { page, setPage, totalPages, totalElements, PAGE_SIZE, updateFromPage } =
    usePaginationState(20);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const [result, t] = await Promise.all([getAdminProblems(page, PAGE_SIZE), getTopics()]);
      setProblems(result.content);
      updateFromPage(result);
      setTopics(t);
    } catch {
      toast.error("Failed to load problems.");
    } finally {
      setLoading(false);
    }
  }, [page, PAGE_SIZE, updateFromPage]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleCreate = async (data: AdminProblemRequest) => {
    await createAdminProblem(data);
    setModalOpen(false);
    toast.success("Problem created.");
    await fetchProblems();
  };

  const handleDelete = async (id: string) => {
    await deleteAdminProblem(id);
    toast.success("Problem deleted.");
    await fetchProblems();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Problem Management</CardTitle>
              <CardDescription>Create, edit, and delete problems.</CardDescription>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Problem
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No problems yet.
                    </TableCell>
                  </TableRow>
                )}
                {problems.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${difficultyColor[p.difficulty] ?? ""}`}>
                        {p.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.topicName}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 3).map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                        {p.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{p.tags.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.externalUrls.length} link{p.externalUrls.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/problems/${p.id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete problem?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete <strong>{p.title}</strong> and all associated progress data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(p.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {modalOpen && (
        <ProblemFormModal
          topics={topics}
          onSave={handleCreate}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
