// src/hooks/useAdminUsers.tsx
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
  AdminUser as User,
} from "@/api/adminAPI";
import { usePaginationState } from "@/hooks/usePaginationState";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { page, setPage, totalPages, totalElements, PAGE_SIZE, updateFromPage } =
    usePaginationState(20);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers(page, PAGE_SIZE);
      setUsers(data.content);
      updateFromPage(data);
      setError(null);
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to fetch users.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, PAGE_SIZE, updateFromPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (
    userData: Omit<User, "id" | "registrationDate" | "_creationTime" | "status" | "problemsSolved">,
  ) => {
    try {
      const newUser = await addUser(userData);
      await fetchUsers();
      toast.success("User added successfully!");
      return newUser;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error || err?.message || "Failed to add user.";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = await updateUser(userId, updates);
      if (updatedUser) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
        toast.success("User updated successfully!");
      }
      return updatedUser;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error || err?.message || "Failed to update user.";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await fetchUsers();
      toast.success("User deleted successfully!");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error || err?.message || "Failed to delete user.";
      toast.error(errorMessage);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    page,
    setPage,
    totalPages,
    totalElements,
    PAGE_SIZE,
    addUser: handleAddUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
  };
}
