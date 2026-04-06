// src/pages/RemindersPage.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDueReviewsApi, recordReviewApi } from "@/api/remindersAPI";
import { ReminderProblem } from "@/types/api";
import { motion } from "framer-motion";
import { Brain, Clock, Target } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const QUALITY_LABELS: Record<number, { label: string; variant: "outline" | "default" | "destructive" | "secondary" }> = {
  0: { label: "Blackout", variant: "destructive" },
  1: { label: "Wrong", variant: "destructive" },
  2: { label: "Hard", variant: "outline" },
  3: { label: "OK", variant: "secondary" },
  4: { label: "Good", variant: "default" },
  5: { label: "Perfect", variant: "default" },
};

function getDifficultyClass(difficulty: string) {
  switch (difficulty) {
    case "easy":   return "bg-green-500/20 text-green-500 border-green-500/20";
    case "medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/20";
    case "hard":   return "bg-red-500/20 text-red-500 border-red-500/20";
    default:       return "";
  }
}

function RemindersPageContent() {
  const [dueReviews, setDueReviews] = useState<ReminderProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);

  const loadDue = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDueReviewsApi();
      setDueReviews(Array.isArray(data) ? data : []);
    } catch {
      setDueReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDue(); }, [loadDue]);

  const handleReview = async (rp: ReminderProblem, quality: number) => {
    setReviewing(rp.id);
    try {
      const updated = await recordReviewApi(rp.id, quality);
      setDueReviews((prev) => prev.filter((r) => r.id !== updated.id));
      const days = updated.intervalDays;
      toast.success(`Next review in ${days} day${days === 1 ? "" : "s"}`);
    } catch {
      toast.error("Failed to record review");
    } finally {
      setReviewing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Spaced Repetition Reviews
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Rate how well you recalled each problem to schedule the next review.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Due for Review ({dueReviews.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dueReviews.length > 0 ? (
              <div className="space-y-4">
                {dueReviews.map((rp, index) => (
                  <motion.div
                    key={rp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 rounded-lg border space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold truncate">
                          {rp.problem?.title ?? "Unknown Problem"}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {rp.problem?.difficulty && (
                            <Badge
                              variant="outline"
                              className={getDifficultyClass(rp.problem.difficulty)}
                            >
                              {rp.problem.difficulty}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            Rep #{rp.repetitionCount} · EF {rp.easeFactor.toFixed(2)} · every {rp.intervalDays}d
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/topics/${rp.problem?.topicId ?? ""}`}>
                          View Problem
                        </Link>
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground self-center mr-1">
                        How well did you recall?
                      </span>
                      {([0, 1, 2, 3, 4, 5] as const).map((q) => (
                        <Button
                          key={q}
                          size="sm"
                          variant={QUALITY_LABELS[q].variant}
                          disabled={reviewing === rp.id}
                          onClick={() => handleReview(rp, q)}
                          className="text-xs"
                        >
                          {q} – {QUALITY_LABELS[q].label}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">All Caught Up!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No problems due for review right now.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/topics">Practice More Problems</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function RemindersPage() {
  return <RemindersPageContent />;
}
