// src/contexts/UserDataContext.tsx
import { useAuth } from "@/hooks/use-auth";
import * as authService from "@/services/authService";
import { Ctx, User } from "@/types/api";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

const UserDataContext = createContext<Ctx | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await authService.getMe();
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updated: Partial<User>) => {
    if (!profile) return;
    setLoading(true);
    try {
      const updatedProfile = await authService.updateMe(updated);
      setProfile(updatedProfile);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
      throw new Error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserDataContext.Provider
      value={{ profile, loading, refreshProfile: fetchProfile, updateProfile }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const ctx = useContext(UserDataContext);
  if (!ctx)
    throw new Error("useUserData must be used within a UserDataProvider");
  return ctx;
};
