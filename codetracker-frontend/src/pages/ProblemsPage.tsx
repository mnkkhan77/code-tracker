// src/pages/ProblemsPage.tsx
import { Problem } from "@/api/adminAPI";
import { ProblemFormModal } from "@/components/problems/ProblemFormModal";
import { ProblemsDataTable } from "@/components/problems/ProblemsDataTable";
import { ProblemsToolbar } from "@/components/problems/ProblemsToolbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useProblemsPage } from "@/hooks/useProblemsPage";
import { useState } from "react";

export default function ProblemsPage() {
  const {
    filteredProblems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags,
    loading,
    updateProblemStatus,
    updateProblemBestTime,
    addProblem,
    updateProblem,
    deleteProblem,
  } = useProblemsPage();
  const { isAuthenticated, isAdmin } = useAuth();
  const showStatusFeature = isAuthenticated && !isAdmin;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Partial<Problem> | null>(
    null
  );
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingProblem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (problem: Problem) => {
    setEditingProblem(problem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProblem(null);
  };

  const handleSaveProblem = async (problemData: Partial<Problem>) => {
    try {
      if (editingProblem && editingProblem.id) {
        await updateProblem(editingProblem.id, problemData);
      } else {
        await addProblem(problemData);
      }
      closeModal();
    } catch (error) {
      // Error is already toasted in the hook
    }
  };

  const handleDeleteProblem = () => {
    if (problemToDelete) {
      deleteProblem(problemToDelete);
      setProblemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-28" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4 border rounded"
                  >
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Problems
        </h1>
        {isAdmin && <Button onClick={openAddModal}>Add Problem</Button>}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            All Problems ({(filteredProblems || []).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProblemsToolbar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            allTags={allTags}
            problemsCount={(filteredProblems || []).length}
            showStatusFilter={showStatusFeature}
          />
          <ProblemsDataTable
            problems={filteredProblems || []}
            onStatusChange={updateProblemStatus}
            onBestTimeChange={updateProblemBestTime}
            openEditModal={openEditModal}
            setProblemToDelete={setProblemToDelete}
          />
        </CardContent>
      </Card>
      {isAdmin && (
        <>
          <ProblemFormModal
            problem={editingProblem}
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleSaveProblem}
          />
          <AlertDialog
            open={!!problemToDelete}
            onOpenChange={(isOpen) => !isOpen && setProblemToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  problem.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProblemToDelete(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProblem}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
