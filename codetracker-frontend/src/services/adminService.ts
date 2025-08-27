// src/services/adminService.ts
import * as adminAPI from "@/api/adminAPI";
import { User } from "@/types/api";

export const getUsers = (): Promise<User[]> => adminAPI.getUsers();
export const getUser = (id: string): Promise<User> => adminAPI.getUser(id);
export const addUser = (payload: Partial<User>): Promise<User> =>
  adminAPI.addUser(payload);
export const updateUser = (id: string, updates: Partial<User>): Promise<User> =>
  adminAPI.updateUser(id, updates);
export const deleteUser = (id: string): Promise<void> =>
  adminAPI.deleteUser(id);
