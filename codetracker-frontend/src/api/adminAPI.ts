// src/api/adminAPI.ts
import { Attempt, PageResponse, Problem, Purchase, UserProgress } from "@/types/api";
import apiClient from "./apiClient";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  registrationDate: string;
  problemsSolved: number;
  status: string;
}

// Re-export as User for backward compatibility with AdminUsersPage
export type User = AdminUser;

export interface AdminStats {
  totalUsers: number;
  totalProblems: number;
  totalRevenue: number;
  revenueThisMonth: number;
  newUsersThisMonth: number;
  completedPurchases: number;
}

export interface RevenueTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: string;
  date: string;
  status: "completed" | "pending" | "failed";
  currency: string;
}

export interface RevenueData {
  daily: { today: number; yesterday: number; change: number };
  monthly: { thisMonth: number; lastMonth: number; change: number };
  overall: { total: number; totalTransactions: number; averageTransaction: number };
  transactions: RevenueTransaction[];
}

export const getRevenueData = async (): Promise<RevenueData> => {
  const res = await apiClient.get<RevenueData>("/admin/revenue");
  return res.data;
};

// ---- Admin Problems ----
export interface AdminProblem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topicId: string;
  topicName: string;
  slug: string;
  tags: string[];
  externalUrls: { platform: string; url: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProblemRequest {
  title: string;
  difficulty: string;
  topicId: string;
  slug: string;
  tags: string[];
  externalUrls: { platform: string; url: string }[];
}

export const getAdminProblems = async (page = 0, size = 20): Promise<PageResponse<AdminProblem>> => {
  const res = await apiClient.get<PageResponse<AdminProblem>>("/admin/problems", { params: { page, size } });
  return res.data;
};

export const getAdminProblem = async (id: string): Promise<AdminProblem> => {
  const res = await apiClient.get<AdminProblem>(`/admin/problems/${id}`);
  return res.data;
};

export const createAdminProblem = async (payload: AdminProblemRequest): Promise<AdminProblem> => {
  const res = await apiClient.post<AdminProblem>("/admin/problems", payload);
  return res.data;
};

export const updateAdminProblem = async (id: string, payload: Partial<AdminProblemRequest>): Promise<AdminProblem> => {
  const res = await apiClient.put<AdminProblem>(`/admin/problems/${id}`, payload);
  return res.data;
};

export const deleteAdminProblem = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/problems/${id}`);
};

// ---- Admin Analytics ----
export interface MonthlyDataPoint {
  month: string;
  count: number;
}

export interface TopicDataPoint {
  topic: string;
  count: number;
}

export interface ProblemStats {
  easy: number;
  medium: number;
  hard: number;
  byTopic: TopicDataPoint[];
}

export interface LearningStats {
  totalAttempts: number;
  successfulAttempts: number;
  completedProblems: number;
  inProgressProblems: number;
  notStartedProblems: number;
}

export interface RevenueByProductType {
  productType: string;
  total: number;
  count: number;
}

export interface MonthlyRevenuePoint {
  month: string;
  amount: number;
}

export interface AdminAnalytics {
  userGrowthTrend: MonthlyDataPoint[];
  problemStats: ProblemStats;
  learningStats: LearningStats;
  revenueByProductType: RevenueByProductType[];
  monthlyRevenueTrend: MonthlyRevenuePoint[];
}

export const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  const res = await apiClient.get<AdminAnalytics>("/admin/analytics");
  return res.data;
};

// ---- Admin Stats ----
export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await apiClient.get<AdminStats>("/admin/stats");
  return res.data;
};

// ---- Users (AdminController at /api/admin/users) ----
export const getUsers = async (page = 0, size = 20): Promise<PageResponse<AdminUser>> => {
  const res = await apiClient.get<PageResponse<AdminUser>>("/admin/users", { params: { page, size } });
  return res.data;
};

export const getUser = async (id: string): Promise<User> => {
  const res = await apiClient.get<User>(`/admin/users/${id}`);
  return res.data;
};

export const addUser = async (payload: Partial<User>): Promise<User> => {
  const res = await apiClient.post<User>("/admin/users", payload);
  return res.data;
};

export const updateUser = async (
  id: string,
  updates: Partial<User>,
): Promise<User> => {
  const res = await apiClient.put<User>(`/admin/users/${id}`, updates);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}`);
};

//    -------------- admin access for user data --------------------
export const getProblemsByUserId = async (
  userId: string,
): Promise<Problem[]> => {
  const res = await apiClient.get<Problem[]>(
    `/admin/users/problems/user/${userId}`,
  );
  return res.data;
};

export const getPurchasesByUserId = async (
  userId: string,
): Promise<Purchase[]> => {
  const res = await apiClient.get<Purchase[]>(
    `/admin/users/purchases/user/${userId}`,
  );
  return res.data;
};

export const getAttemptsByUserId = async (
  userId: string,
): Promise<Attempt[]> => {
  const res = await apiClient.get<Attempt[]>(
    `/admin/users/attempts/user/${userId}`,
  );
  return res.data;
};

export const getProgressByUserId = async (
  userId: string,
): Promise<UserProgress[]> => {
  const res = await apiClient.get<UserProgress[]>(
    `/admin/users/progress/user/${userId}`,
  );
  return res.data;
};

