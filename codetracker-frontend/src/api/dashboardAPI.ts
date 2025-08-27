// src/api/dashboardAPI.ts
import apiClient from "./apiClient";

export interface DashboardStats {
  totalProblems: number;
  solvedProblems: number;
  attemptedProblems: number;
}

export const getDashboardData = async (): Promise<DashboardStats> => {
  const res = await apiClient.get<DashboardStats>("/dashboard");
  return res.data;
};
