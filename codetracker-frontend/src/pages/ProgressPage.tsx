// src/pages/ProgressPage.tsx
import { getMyAttempts } from "@/api/attemptsAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Attempt } from "@/types/api";
import {
  CheckCircle,
  Clock,
  Flame,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DifficultyBar({
  label,
  completed,
  total,
  color,
}: {
  label: string;
  completed: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={`font-medium ${color}`}>{label}</span>
        <span className="text-muted-foreground">
          {completed} / {total}
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function ProgressPageContent() {
  const { userStats, loading } = useDashboardStats();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);

  useEffect(() => {
    getMyAttempts().then((data) => {
      const sorted = [...data].sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      );
      setAttempts(sorted);
      setAttemptsLoading(false);
    });
  }, []);

  const successCount = attempts.filter((a) => a.successful).length;
  const successRate =
    attempts.length > 0 ? Math.round((successCount / attempts.length) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">No progress data yet</h2>
        <p className="text-muted-foreground mt-1">
          Start solving problems to see your progress.
        </p>
        <Button asChild className="mt-4">
          <Link to="/topics">Find a Problem</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Your Progress
      </h1>

      {/* Top stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              out of {userStats.totalProblems} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.progressPercentage}%
            </div>
            <Progress value={userStats.progressPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Flame className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">problems started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(userStats.totalTimeSpent / 60)} min
            </div>
            <p className="text-xs text-muted-foreground">across all solves</p>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty breakdown + success rate */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4" />
              Difficulty Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DifficultyBar
              label="Easy"
              completed={userStats.easyCompleted}
              total={userStats.easyTotal}
              color="text-green-500"
            />
            <DifficultyBar
              label="Medium"
              completed={userStats.mediumCompleted}
              total={userStats.mediumTotal}
              color="text-yellow-500"
            />
            <DifficultyBar
              label="Hard"
              completed={userStats.hardCompleted}
              total={userStats.hardTotal}
              color="text-red-500"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4" />
              Attempt Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total attempts</span>
              <span className="font-semibold">{attempts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Successful</span>
              <span className="font-semibold text-green-500">{successCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Success rate</span>
              <span className="font-semibold">{successRate}%</span>
            </div>
            <Progress value={successRate} className="h-2" />
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm text-muted-foreground">Not started</span>
              <span className="font-semibold">{userStats.notStarted}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attempts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Attempts
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/topics">Find Problem</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {attemptsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                No attempts yet. Save a best time on any problem to record one.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {attempts.slice(0, 20).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between py-3 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {attempt.successful ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {attempt.problemTitle ?? "Unknown Problem"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {attempt.date
                          ? new Date(attempt.date).toLocaleString()
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {attempt.duration != null && (
                      <Badge variant="secondary" className="text-xs">
                        {formatDuration(attempt.duration)}
                      </Badge>
                    )}
                    <Badge
                      variant={attempt.successful ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {attempt.successful ? "Solved" : "Attempted"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProgressPage() {
  return <ProgressPageContent />;
}
