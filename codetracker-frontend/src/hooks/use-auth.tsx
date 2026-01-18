// src/hooks/use-auth.tsx
import * as authService from "@/services/authService";
import { User } from "@/types/api";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password_hash: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  register: (
    userData: Pick<User, "name" | "email"> & { password: string },
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const signIn = async (email: string, password_hash: string) => {
    try {
      await authService.login(email, password_hash);
      const user = await checkUser();
      toast.success("Successfully signed in!");
      return user;
    } catch (error) {
      toast.error("Sign in failed. Please check your credentials.");
      throw error;
    }
  };

  const register = async (
    userData: Pick<User, "name" | "email"> & { password: string },
  ) => {
    try {
      await authService.register(userData);
      toast.success(`Welcome! Registration successful.`);
    } catch (error: any) {
      // Try to show backend error message if available (axios or fetch style)
      let backendMsg = error?.error;
      if (error?.response?.data?.error) {
        backendMsg = error.response.data.error;
      } else if (error?.data?.error) {
        backendMsg = error.data.error;
      } else if (error?.message) {
        backendMsg = error.message;
      }
      toast.error(backendMsg || "Registration failed. Please try again.");
      throw error;
    }
  };

  const signOut = async () => {
    authService.logout();
    setUser(null);
    toast.success("You have been logged out.", { duration: 2000 });
  };

  const value = {
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    user,
    loading,
    signIn,
    signOut,
    register,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
