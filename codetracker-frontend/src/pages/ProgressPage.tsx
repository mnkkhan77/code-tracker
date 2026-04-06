// src/pages/ProgressPage.tsx
import { getMyAttempts } from "@/api/attemptsAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Attempt } from "@/types/api";
import { CheckCircle, Clock, Target, TrendingUp, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProgressPageContent() {
  const { userStats, loading } = useDashboardStats();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);

  useEffect(() => {
    getMyAttempts().then((data) => {
      setAttempts(data);
      setAttemptsLoading(false);
    });
  }, []);

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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">No progress data available</h2>
        <p className="text-muted-foreground">
          Start solving problems to see your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Your Progress
      </h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problems Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.progressPercentage}%
            </div>
            <Progress
              value={userStats.progressPercentage}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">problems started</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Time Spent
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(userStats.totalTimeSpent / 60)} min
            </div>
            <p className="text-xs text-muted-foreground">across all attempts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Keep Going!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Consistency is key. Keep practicing to improve your skills and climb
            the ranks.
          </p>
          <Button asChild>
            <Link to="/topics">Find a New Problem</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Attempt History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attemptsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No attempts recorded yet. Start solving problems!
            </p>
          ) : (
            <div className="divide-y">
              {attempts.slice(0, 20).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between py-3 gap-4"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {attempt.successful ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span className="text-sm text-muted-foreground truncate">
                      {attempt.date
                        ? new Date(attempt.date).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {attempt.duration != null && (
                      <Badge variant="secondary" className="text-xs">
                        {attempt.duration}s
                      </Badge>
                    )}
                    <Badge
                      variant={attempt.successful ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {attempt.successful ? "Passed" : "Failed"}
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
