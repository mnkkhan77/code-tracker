// src/pages/Dashboard

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  Play,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

function DashboardContent() {
  const { loading, userStats, upcomingReviews, topics } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Could not load user statistics.</p>
      </div>
    );
  }

  const totalProblems = userStats.totalProblems;
  const completed = userStats.completed;
  const inProgress = userStats.inProgress;
  const notStarted = totalProblems - completed - inProgress;
  const progressPercentage =
    totalProblems > 0 ? Math.round((completed / totalProblems) * 100) : 0;
  const totalTimeSpent = userStats.totalTimeSpent;

  const statsCards = [
    {
      title: "Total Problems",
      value: userStats.totalProblems,
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      title: "Completed",
      value: userStats.completed,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      borderColor: "border-green-100 dark:border-green-800/30",
    },
    {
      title: "In Progress",
      value: userStats.inProgress,
      icon: Play,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
      borderColor: "border-orange-100 dark:border-orange-800/30",
    },
    {
      title: "Not Started",
      value: userStats.notStarted,
      icon: Circle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      borderColor: "border-border",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 bg-background p-6 rounded-lg">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Here's your coding progress overview
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card
                className={`h-full border ${stat.borderColor} ${stat.bgColor} transition-all hover:shadow-md`}
              >
                <CardContent className="p-4 md:p-6 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Progress Overview */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <TrendingUp className="w-5 h-5" />
                  <span>Overall Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion Rate</span>
                    <span>{userStats.progressPercentage}%</span>
                  </div>
                  <Progress
                    value={userStats.progressPercentage}
                    className="h-2 bg-muted [&>div]:bg-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {userStats.completed}
                    </p>
                    <p className="text-sm text-muted-foreground">Solved</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-ring">
                      {Math.round(userStats.totalTimeSpent / 60)}h
                    </p>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                  </div>
                </div>

                <div className="flex-1" />
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link to="/topics">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Topics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <Clock className="w-5 h-5" />
                  <span>Due for Review</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {upcomingReviews && upcomingReviews.length > 0 ? (
                  <div className="flex flex-col h-full">
                    <div className="space-y-3">
                      {upcomingReviews.slice(0, 5).map((review) => (
                        <div
                          key={review.id}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <Circle className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {review.problem?.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {review.topic?.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex-grow" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      asChild
                    >
                      <Link to="/reminders">View All</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center flex-1 flex flex-col justify-center items-center py-6">
                    <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No reviews due right now
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Topics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Topics Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.slice(0, 6).map((topic) => (
                  <motion.div key={topic.id} whileHover={{ scale: 1.03 }}>
                    <Link
                      to={`/topics/${topic.slug}`}
                      className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{topic.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {topic.completed}/{topic.totalProblems}
                        </span>
                      </div>
                      <Progress
                        value={topic.progressPercentage}
                        className="h-1.5 bg-muted [&>div]:bg-primary"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link to="/topics">View All Topics</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
