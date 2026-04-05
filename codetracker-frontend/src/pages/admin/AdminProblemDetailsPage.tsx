// src/pages/admin/AdminProblemDetailsPage
import {
  AdminProblem,
  AdminProblemRequest,
  deleteAdminProblem,
  getAdminProblem,
  updateAdminProblem,
} from "@/api/adminAPI";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Topic } from "@/types/api";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ProblemFormModal from "./ProblemFormModal";

const difficultyColor: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function AdminProblemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<AdminProblem | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([getAdminProblem(id), getTopics()])
      .then(([p, t]) => {
        setProblem(p);
        setTopics(t);
      })
      .catch(() => toast.error("Failed to load problem."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: AdminProblemRequest) => {
    if (!id) return;
    const updated = await updateAdminProblem(id, data);
    setProblem(updated);
    setEditOpen(false);
    toast.success("Problem updated.");
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteAdminProblem(id);
    toast.success("Problem deleted.");
    navigate("/admin/problems");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="space-y-4">
        <Link to="/admin/problems">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        </Link>
        <p className="text-destructive">Problem not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/admin/problems">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{problem.title}</h1>
            <Badge variant="outline" className={`capitalize ${difficultyColor[problem.difficulty] ?? ""}`}>
              {problem.difficulty}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete problem?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>{problem.title}</strong> and all associated progress data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Topic</span>
                <span className="font-medium">{problem.topicName ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug</span>
                <span className="font-mono text-xs">{problem.slug ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{problem.updatedAt ? new Date(problem.updatedAt).toLocaleDateString() : "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
            <CardContent>
              {problem.tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">External Links</CardTitle></CardHeader>
          <CardContent>
            {problem.externalUrls.length === 0 ? (
              <p className="text-sm text-muted-foreground">No links added.</p>
            ) : (
              <div className="space-y-2">
                {problem.externalUrls.map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium text-sm">{u.platform}</span>
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {u.url.length > 50 ? u.url.slice(0, 50) + "…" : u.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {editOpen && (
        <ProblemFormModal
          topics={topics}
          problem={problem}
          onSave={handleUpdate}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
