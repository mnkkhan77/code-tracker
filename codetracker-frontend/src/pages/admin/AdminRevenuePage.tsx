// src/pages/admin/AdminRevenuePage
import { getRevenueData, RevenueData } from "@/api/adminAPI";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const changeColor = (change: number) =>
  change >= 0 ? "text-green-600" : "text-red-600";

const changeLabel = (change: number) =>
  `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

const statusClass = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRevenueData()
      .then(setData)
      .catch(() => setError("Failed to load revenue data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-52" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Revenue Analytics</h1>
        <p className="text-destructive">{error ?? "No data available."}</p>
      </div>
    );
  }

  const { daily, monthly, overall, transactions } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Revenue Analytics</h1>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(daily.today)}</div>
            <p className={`text-xs ${changeColor(daily.change)}`}>
              {changeLabel(daily.change)} from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthly.thisMonth)}</div>
            <p className={`text-xs ${changeColor(monthly.change)}`}>
              {changeLabel(monthly.change)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overall.total)}</div>
            <p className="text-xs text-muted-foreground">
              {overall.totalTransactions.toLocaleString()} completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overall.averageTransaction)}</div>
            <p className="text-xs text-muted-foreground">per completed transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Today</span>
              <span className="text-sm font-bold">{formatCurrency(daily.today)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Yesterday</span>
              <span className="text-sm">{formatCurrency(daily.yesterday)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Change</span>
              <span className={`text-sm font-medium ${changeColor(daily.change)}`}>
                {changeLabel(daily.change)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">This Month</span>
              <span className="text-sm font-bold">{formatCurrency(monthly.thisMonth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Month</span>
              <span className="text-sm">{formatCurrency(monthly.lastMonth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Change</span>
              <span className={`text-sm font-medium ${changeColor(monthly.change)}`}>
                {changeLabel(monthly.change)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{t.userName}</h4>
                    <p className="text-sm text-muted-foreground">{t.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(t.amount)}</div>
                      <div className="text-sm text-muted-foreground">{t.date ?? "—"}</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`capitalize ${statusClass(t.status)}`}
                    >
                      {t.status}
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
