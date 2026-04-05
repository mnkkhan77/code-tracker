import { getAdminAnalytics, AdminAnalytics } from "@/api/adminAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DIFFICULTY_COLORS = { easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444" };
const PRODUCT_COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#ec4899", "#10b981"];
const PROGRESS_COLORS = { completed: "#22c55e", in_progress: "#f59e0b", not_started: "#94a3b8" };

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function StatBadge({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminAnalytics()
      .then(setData)
      .catch(() => setError("Failed to load analytics data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-52" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-destructive">{error ?? "No data available."}</p>
      </div>
    );
  }

  const { userGrowthTrend, problemStats, learningStats, revenueByProductType, monthlyRevenueTrend } = data;

  const difficultyData = [
    { name: "Easy", value: problemStats.easy, fill: DIFFICULTY_COLORS.easy },
    { name: "Medium", value: problemStats.medium, fill: DIFFICULTY_COLORS.medium },
    { name: "Hard", value: problemStats.hard, fill: DIFFICULTY_COLORS.hard },
  ];

  const progressData = [
    { name: "Completed", value: learningStats.completedProblems, fill: PROGRESS_COLORS.completed },
    { name: "In Progress", value: learningStats.inProgressProblems, fill: PROGRESS_COLORS.in_progress },
    { name: "Not Started", value: learningStats.notStartedProblems, fill: PROGRESS_COLORS.not_started },
  ];

  const successRate = learningStats.totalAttempts > 0
    ? Math.round((learningStats.successfulAttempts / learningStats.totalAttempts) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>

      {/* Row 1: User Growth + Monthly Revenue */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Growth (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userGrowthTrend}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" name="New Users" stroke="#6366f1" fill="url(#userGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyRevenueTrend}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="amount" name="Revenue" stroke="#10b981" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Problem Difficulty + Topics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Problems by Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {difficultyData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [v, "Problems"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              <StatBadge label="Easy" value={problemStats.easy} color={DIFFICULTY_COLORS.easy} />
              <StatBadge label="Medium" value={problemStats.medium} color={DIFFICULTY_COLORS.medium} />
              <StatBadge label="Hard" value={problemStats.hard} color={DIFFICULTY_COLORS.hard} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Problems by Topic</CardTitle>
          </CardHeader>
          <CardContent>
            {problemStats.byTopic.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No topic data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={problemStats.byTopic.slice(0, 8)} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="count" name="Problems" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Learning Stats + Revenue by Product */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <p className="text-2xl font-bold">{learningStats.totalAttempts.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total Attempts</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <p className="text-2xl font-bold text-green-500">{successRate}%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Success Rate</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={progressData} margin={{ top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                  {progressData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Product Type</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByProductType.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No revenue data available.</p>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie data={revenueByProductType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="total">
                      {revenueByProductType.map((_, i) => <Cell key={i} fill={PRODUCT_COLORS[i % PRODUCT_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [formatCurrency(v), "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {revenueByProductType.map((item, i) => (
                    <div key={item.productType} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/40">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PRODUCT_COLORS[i % PRODUCT_COLORS.length] }} />
                        <span className="text-xs text-muted-foreground capitalize">{item.productType.replace(/_/g, " ")}</span>
                      </div>
                      <span className="text-xs font-semibold">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
