// src/api/authAPI.ts
import { User } from "@/types/api";
import apiClient from "./apiClient";

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
  bio?: string;
}): Promise<User> => {
  try {
    const res = await apiClient.post("/auth/register", payload);
    return res.data;
  } catch (error) {
    // Optionally handle/log error
    throw error;
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<{ token: string; email: string }> => {
  try {
    const res = await apiClient.post("/auth/login", { email, password });
    const { token, email: returnedEmail } = res.data as {
      token: string;
      email: string;
    };
    if (typeof window !== "undefined" && token)
      localStorage.setItem("token", token);
    return { token, email: returnedEmail };
  } catch (error) {
    // Optionally handle/log error
    throw error;
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const res = await apiClient.get<User>("/profile/me");
    return res.data;
  } catch (error) {
    // Optionally handle/log error
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  // If you add a logout endpoint later:
  // await apiClient.post("/auth/logout");
};
