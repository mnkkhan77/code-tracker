// src/api/dashboardAPI.ts
import { DashboardStats } from "@/types/api";
import apiClient from "./apiClient";

export const getDashboardData = async (): Promise<DashboardStats> => {
  try {
    const res = await apiClient.get<DashboardStats>("/dashboard");
    return res.data;
  } catch (error) {
    // Optionally handle/log error
    throw error;
  }
};
