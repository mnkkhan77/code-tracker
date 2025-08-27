// src/pages/admin/AdminRevenuePage
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface RevenueData {
  daily: {
    today: number;
    yesterday: number;
    change: number;
  };
  monthly: {
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  overall: {
    total: number;
    totalTransactions: number;
    averageTransaction: number;
  };
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

// Mock revenue data
const mockRevenueData: RevenueData = {
  daily: {
    today: 245.5,
    yesterday: 189.25,
    change: 29.7,
  },
  monthly: {
    thisMonth: 5420.75,
    lastMonth: 4890.25,
    change: 10.8,
  },
  overall: {
    total: 24567.89,
    totalTransactions: 1234,
    averageTransaction: 19.91,
  },
};

// Mock transactions
const mockTransactions: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
  id: `txn_${i + 1}`,
  userId: `user_${Math.floor(Math.random() * 100) + 1}`,
  userName: `User ${Math.floor(Math.random() * 100) + 1}`,
  amount: Math.floor(Math.random() * 50) + 5,
  type: ["Credit Purchase", "Premium Subscription", "Resume Analysis"][
    Math.floor(Math.random() * 3)
  ],
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  status: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)] as
    | "completed"
    | "pending"
    | "failed",
}));

export default function AdminRevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRevenueData(mockRevenueData);
      setTransactions(mockTransactions);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Revenue data not available</h2>
        <p className="text-muted-foreground">
          Unable to load revenue information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Revenue Analytics
        </h1>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueData.daily.today)}
            </div>
            <p
              className={`text-xs ${getChangeColor(revenueData.daily.change)}`}
            >
              {revenueData.daily.change >= 0 ? "+" : ""}
              {revenueData.daily.change.toFixed(1)}% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueData.monthly.thisMonth)}
            </div>
            <p
              className={`text-xs ${getChangeColor(revenueData.monthly.change)}`}
            >
              {revenueData.monthly.change >= 0 ? "+" : ""}
              {revenueData.monthly.change.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueData.overall.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {revenueData.overall.totalTransactions} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Transaction
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueData.overall.averageTransaction)}
            </div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">{transaction.userName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {transaction.type}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.date}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getStatusColor(transaction.status)}`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Today</span>
                <span className="text-sm font-bold">
                  {formatCurrency(revenueData.daily.today)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Yesterday</span>
                <span className="text-sm">
                  {formatCurrency(revenueData.daily.yesterday)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Change</span>
                <span
                  className={`text-sm font-medium ${getChangeColor(revenueData.daily.change)}`}
                >
                  {revenueData.daily.change >= 0 ? "+" : ""}
                  {revenueData.daily.change.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">This Month</span>
                <span className="text-sm font-bold">
                  {formatCurrency(revenueData.monthly.thisMonth)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Month</span>
                <span className="text-sm">
                  {formatCurrency(revenueData.monthly.lastMonth)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Change</span>
                <span
                  className={`text-sm font-medium ${getChangeColor(revenueData.monthly.change)}`}
                >
                  {revenueData.monthly.change >= 0 ? "+" : ""}
                  {revenueData.monthly.change.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
