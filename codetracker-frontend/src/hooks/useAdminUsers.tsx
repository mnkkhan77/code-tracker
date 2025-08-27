// src/hooks/useAdminUsers.tsx
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
  User,
} from "@/api/adminAPI";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const userList = await getUsers();
      setUsers(userList);
      setError(null);
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to fetch users.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (
    userData: Omit<
      User,
      "id" | "registrationDate" | "_creationTime" | "status" | "problemsSolved"
    >
  ) => {
    try {
      const newUser = await addUser(userData);
      setUsers((prev) => [newUser, ...prev]);
      toast.success("User added successfully!");
      return newUser;
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to add user.";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = await updateUser(userId, updates);
      if (updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? updatedUser : u))
        );
        toast.success("User updated successfully!");
      }
      return updatedUser;
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to update user.";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted successfully!");
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to delete user.";
      toast.error(errorMessage);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser: handleAddUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
  };
}
