// src/pages/RemindersPage.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRemindersPage } from "@/hooks/useRemindersPage";
import { motion } from "framer-motion";
import { Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

function RemindersPageContent() {
  const { reminders, loading } = useRemindersPage();

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/20";
      case "hard":
        return "bg-red-500/20 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          Spaced Repetition Reminders
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Problems that are due for review to strengthen your memory.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Due for Review ({reminders.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reminders.length > 0 ? (
              <div className="space-y-4">
                {reminders.map((reminder, index) => (
                  <motion.div
                    key={reminder.problemId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/topics/${reminder.topic?.slug}`}
                        className="hover:underline"
                      >
                        <p className="text-sm font-medium truncate text-muted-foreground">
                          {reminder.topic?.name}
                        </p>
                        <p className="text-lg font-semibold truncate">
                          {reminder.problem?.title}
                        </p>
                      </Link>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <Badge
                        variant="outline"
                        className={getDifficultyClass(
                          reminder.problem?.difficulty || ""
                        )}
                      >
                        {reminder.problem?.difficulty}
                      </Badge>
                      <Button asChild>
                        <Link to={`/topics/${reminder.topic?.slug}`}>
                          Start Review
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">All Caught Up!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You have no problems due for review right now.
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
