// src/pages/admin/AdminUserDetailsPage
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  registrationDate: string;
  status: "active" | "inactive";
  bio: string;
  stats: {
    problemsSolved: number;
    problemsAttempted: number;
    topicsCompleted: number;
    totalTopics: number;
  };
  recentActivity: {
    problemId: string;
    problemTitle: string;
    status: "completed" | "in_progress";
    date: string;
  }[];
}

// Mock user details data
const mockUserDetails: UserDetails = {
  id: "user_1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "https://github.com/shadcn.png",
  registrationDate: "2023-01-15",
  status: "active",
  bio: "Software engineer passionate about algorithms and data structures. Loves solving complex problems and helping others learn.",
  stats: {
    problemsSolved: 28,
    problemsAttempted: 45,
    topicsCompleted: 5,
    totalTopics: 12,
  },
  recentActivity: [
    {
      problemId: "problem_1",
      problemTitle: "Two Sum",
      status: "completed",
      date: "2023-10-26",
    },
    {
      problemId: "problem_2",
      problemTitle: "Reverse Linked List",
      status: "completed",
      date: "2023-10-25",
    },
    {
      problemId: "problem_3",
      problemTitle: "Valid Parentheses",
      status: "in_progress",
      date: "2023-10-24",
    },
    {
      problemId: "problem_4",
      problemTitle: "Merge Intervals",
      status: "completed",
      date: "2023-10-22",
    },
  ],
};

export default function AdminUserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user details
    setTimeout(() => {
      // In a real app, you'd fetch data based on userId
      setUser({
        ...mockUserDetails,
        id: userId || "user_1",
        name: `User ${userId?.split("_")[1] || 1}`,
      });
      setLoading(false);
    }, 500);
  }, [userId]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">User not found</h2>
        <p className="text-muted-foreground">
          Could not find details for user ID: {userId}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {user.name}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant={user.status === "active" ? "default" : "secondary"}>
              {user.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Joined on {new Date(user.registrationDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problems Solved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.stats.problemsSolved}
            </div>
            <p className="text-xs text-muted-foreground">
              out of {user.stats.problemsAttempted} attempted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Topics Progress
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.stats.topicsCompleted} / {user.stats.totalTopics}
            </div>
            <Progress
              value={
                (user.stats.topicsCompleted / user.stats.totalTopics) * 100
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Problems the user has recently interacted with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.recentActivity.map((activity) => (
                <TableRow key={activity.problemId}>
                  <TableCell className="font-medium">
                    {activity.problemTitle}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        activity.status === "completed" ? "default" : "outline"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(activity.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
