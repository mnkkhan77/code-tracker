// src/api/authAPI.ts
import { User } from "@/types/api";
import apiClient from "./apiClient";

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
  bio?: string;
}) => {
  // Backend returns { message: "Registered successfully" }
  const res = await apiClient.post("/auth/register", payload);
  return res.data;
};

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; email: string }> => {
  const res = await apiClient.post("/auth/login", { email, password });
  const { token } = res.data as { token: string; email: string };
  if (token) localStorage.setItem("token", token);
  return res.data;
};

// Source of truth for the logged-in user
export const getProfile = async (): Promise<User> => {
  const res = await apiClient.get<User>("/profile/me");
  return res.data;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem("token");
  // If you add a logout endpoint later:
  // await apiClient.post("/auth/logout");
};
