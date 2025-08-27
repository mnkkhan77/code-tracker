// src/hooks/useDashboardStats.tsx
import { useAuth } from "@/hooks/use-auth";
import * as problemsService from "@/services/problemsService";
import * as progressService from "@/services/progressService";
import { Problem, Topic, UserProgress } from "@/types/api";
import { useEffect, useMemo, useState } from "react";

/**
 * Dashboard stats hook
 * - Loosely coupled: uses services (not raw api) and auth hook for current user
 * - Defensive: accepts different status casings and missing arrays
 */
export function useDashboardStats() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [rawTopics, setRawTopics] = useState<Topic[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        // fetch problems and topics (site-wide)
        const [problemsRes, topicsRes] = await Promise.all([
          problemsService.getAllProblems(),
          problemsService.getTopics(),
        ]);

        if (!mounted) return;
        // problemsService may return ProblemModel which extends Problem; that's OK
        setProblems(problemsRes as unknown as Problem[]);
        setRawTopics(topicsRes as Topic[]);

        // fetch current user's progress only if logged in
        if (isAuthenticated && user?.id) {
          try {
            const progress = await progressService.getUserProgress(user.id);
            if (!mounted) return;
            setUserProgress(progress);
          } catch (e) {
            // non-fatal: set empty progress
            setUserProgress([]);
          }
        } else {
          setUserProgress([]);
        }
      } catch (e) {
        // keep defaults on failure; optionally log error.
        setProblems([]);
        setRawTopics([]);
        setUserProgress([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id]);

  const userStats = useMemo(() => {
    if (loading) return null;

    const totalProblems = problems.length;

    // normalize status strings (handle "COMPLETED", "completed", "IN_PROGRESS", "in_progress", ...)
    const norm = (s: any) => String(s ?? "").toLowerCase();

    const completed = userProgress.filter(
      (p) => norm(p.status) === "completed"
    ).length;
    const inProgress = userProgress.filter(
      (p) => norm(p.status) === "in_progress"
    ).length;
    const notStarted = Math.max(0, totalProblems - completed - inProgress);
    const progressPercentage =
      totalProblems > 0 ? Math.round((completed / totalProblems) * 100) : 0;

    const totalTimeSpent = userProgress.reduce((total, progress) => {
      const attempts = Array.isArray((progress as any).attempts)
        ? (progress as any).attempts
        : [];
      const attemptsSum = attempts.reduce((sum: number, attempt: any) => {
        return sum + (Number(attempt?.duration) || 0);
      }, 0);
      return total + attemptsSum;
    }, 0);

    return {
      totalProblems,
      completed,
      inProgress,
      notStarted,
      progressPercentage,
      totalTimeSpent,
    };
  }, [loading, problems, userProgress]);

  const now = Date.now();
  const upcomingReviews = useMemo(() => {
    if (loading) return [];

    return (userProgress || [])
      .filter((progress) => {
        if (!progress.nextReviewDate) return false;
        const nextDate = new Date(progress.nextReviewDate).getTime();
        return !isNaN(nextDate) && nextDate <= now; // due now or earlier
      })
      .map((progress) => {
        const problem =
          problems.find((p) => p.id === progress.problemId) ?? null;
        const topic = problem
          ? (rawTopics.find((t) => t.id === problem.topicId) ?? null)
          : null;
        return {
          ...progress,
          problem,
          topic,
        };
      })
      .filter((item) => item.problem && item.topic);
  }, [loading, userProgress, problems, rawTopics, now]);

  const topics = useMemo(() => {
    if (loading) return [];

    const norm = (s: any) => String(s ?? "").toLowerCase();

    return (rawTopics || []).map((topic) => {
      const problemsInTopic = problems.filter((p) => p.topicId === topic.id);
      const completedInTopic = (userProgress || []).filter((progress) => {
        const problem = problems.find((p) => p.id === progress.problemId);
        return (
          problem &&
          problem.topicId === topic.id &&
          norm(progress.status) === "completed"
        );
      }).length;

      const progressPercentage =
        problemsInTopic.length > 0
          ? Math.round((completedInTopic / problemsInTopic.length) * 100)
          : 0;

      return {
        ...topic,
        completed: completedInTopic,
        totalProblems: problemsInTopic.length,
        progressPercentage,
      };
    });
  }, [loading, rawTopics, problems, userProgress]);

  return {
    loading,
    userStats,
    upcomingReviews,
    topics,
  };
}
