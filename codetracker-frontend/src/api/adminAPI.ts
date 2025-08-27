// src/api/adminAPI.ts
import { Attempt, Problem, Purchase, User, UserProgress } from "@/types/api";
import apiClient from "./apiClient";

// ---- Users (AdminController at /api/admin/users) ----
export const getUsers = async (): Promise<User[]> => {
  const res = await apiClient.get<User[]>("/admin/users");
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
  updates: Partial<User>
): Promise<User> => {
  const res = await apiClient.put<User>(`/admin/users/${id}`, updates);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}`);
};

//    -------------- admin access for user data --------------------
export const getProblemsByUserId = async (
  userId: string
): Promise<Problem[]> => {
  const res = await apiClient.get<Problem[]>(
    `/admin/users/problems/user/${userId}`
  );
  return res.data;
};

export const getPurchasesByUserId = async (
  userId: string
): Promise<Purchase[]> => {
  const res = await apiClient.get<Purchase[]>(
    `/admin/users/purchases/user/${userId}`
  );
  return res.data;
};

export const getAttemptsByUserId = async (
  userId: string
): Promise<Attempt[]> => {
  const res = await apiClient.get<Attempt[]>(
    `/admin/users/attempts/user/${userId}`
  );
  return res.data;
};

export const getProgressByUserId = async (
  userId: string
): Promise<UserProgress[]> => {
  const res = await apiClient.get<UserProgress[]>(
    `/admin/users/progress/user/${userId}`
  );
  return res.data;
};

export type { Problem, User };

// src/api/adminApi.ts
export * from "./adminAPI";
