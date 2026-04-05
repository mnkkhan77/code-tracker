// src/pages/admin/AdminDashboard
import { getAdminStats, AdminStats } from "@/api/adminAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, DollarSign, TrendingUp, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  to,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  to?: string;
}) {
  const content = (
    <Card className={to ? "hover:bg-muted/50 transition-colors cursor-pointer" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setError("Failed to load statistics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-52" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-destructive">{error ?? "No data available."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          sub={`${formatCurrency(stats.revenueThisMonth)} this month`}
          icon={DollarSign}
          to="/admin/revenue"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          sub={`+${stats.newUsersThisMonth} joined this month`}
          icon={Users}
          to="/admin/users"
        />
        <StatCard
          title="Total Problems"
          value={stats.totalProblems.toLocaleString()}
          icon={BookOpen}
          to="/problems"
        />
        <StatCard
          title="New Users This Month"
          value={stats.newUsersThisMonth.toLocaleString()}
          icon={UserPlus}
          to="/admin/users"
        />
        <StatCard
          title="Completed Purchases"
          value={stats.completedPurchases.toLocaleString()}
          icon={TrendingUp}
          to="/admin/revenue"
        />
      </div>
    </div>
  );
}
