// src/pages/Topics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopicsPageData } from "@/hooks/useTopicsPageData";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

function TopicsContent() {
  const { loading, topicsWithStats } = useTopicsPageData();

  if (loading) {
    return <TopicsPageSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Problem Topics
        </h1>
        <p className="text-muted-foreground">
          Choose a topic to start practicing problems
        </p>
      </motion.div>

      {/* Topics Grid or Empty State */}
      {topicsWithStats && topicsWithStats.length > 0 ? (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {topicsWithStats.map((topic) => (
            <motion.div
              key={topic.name}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Link to={`/topics/${topic.slug}`} className="h-full block">
                <Card className="h-full hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {topic.name}
                      </CardTitle>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    {topic.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 h-10">
                        {topic.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2 high-contrast-text">
                        <span>Progress</span>
                        <span>{topic.progressPercentage}%</span>
                      </div>
                      <Progress
                        value={topic.progressPercentage}
                        className="h-2"
                      />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-secondary rounded">
                        <p className="font-semibold text-primary">
                          {topic.completedProblems}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          Completed
                        </p>
                      </div>
                      <div className="text-center p-2 bg-secondary rounded">
                        <p className="font-semibold">{topic.totalProblems}</p>
                        <p className="text-slate-600 dark:text-slate-400">
                          Total
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No topics available</h3>
          <p className="text-muted-foreground">
            Topics will appear here once they're added to the system.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function TopicsPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 space-y-2">
                  <Skeleton className="h-6 w-8 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="p-2 space-y-2">
                  <Skeleton className="h-6 w-8 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Topics() {
  return <TopicsContent />;
}
