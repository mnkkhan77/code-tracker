// src/pages/TopicPage.tsx
import { ProblemsDataTable } from "@/components/problems/ProblemsDataTable";
import { ProblemsToolbar } from "@/components/problems/ProblemsToolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useTopicPageData } from "@/hooks/useTopicPageData";
import { useParams } from "react-router-dom";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    topic,
    loading,
    problems,
    statusFilter,
    setStatusFilter,
    difficultyFilter,
    setDifficultyFilter,
    tagFilter,
    setTagFilter,
    allTags,
    updateProblemStatus,
    updateProblemBestTime,
  } = useTopicPageData(slug!);
  const { isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return <div className="text-center py-12">Topic not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
        <p className="text-muted-foreground mt-2">{topic.description}</p>
      </div>
      <ProblemsToolbar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        allTags={allTags}
        problemsCount={problems.length}
        showStatusFilter={!isAdmin}
      />
      <ProblemsDataTable
        problems={problems}
        onStatusChange={updateProblemStatus}
        onBestTimeChange={updateProblemBestTime}
        openEditModal={() => {}}
        setProblemToDelete={() => {}}
      />
    </div>
  );
}
