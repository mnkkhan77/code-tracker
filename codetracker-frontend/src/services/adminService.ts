// src/services/adminService.ts
import * as adminAPI from "@/api/adminAPI";
import type { AdminUser } from "@/api/adminAPI";
import type { PageResponse } from "@/types/api";

export const getUsers = (): Promise<PageResponse<AdminUser>> => adminAPI.getUsers();
export const getUser = (id: string): Promise<AdminUser> => adminAPI.getUser(id);
export const addUser = (payload: Partial<AdminUser>): Promise<AdminUser> =>
  adminAPI.addUser(payload);
export const updateUser = (id: string, updates: Partial<AdminUser>): Promise<AdminUser> =>
  adminAPI.updateUser(id, updates);
export const deleteUser = (id: string): Promise<void> =>
  adminAPI.deleteUser(id);
