// src/contexts/UserDataContext.tsx
import { useAuth } from "@/hooks/use-auth";
import * as authService from "@/services/authService";
import { Ctx, User } from "@/types/api";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { toast } from "sonner";

const UserDataContext = createContext<Ctx | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);

  // Sync profile from auth user (no extra getMe() call)
  const resolvedProfile = profile ?? user;

  const refreshProfile = async () => {
    // no-op: use-auth owns the canonical user state
  };

  const updateProfile = async (updated: Partial<User>) => {
    if (!resolvedProfile) return;
    setUpdating(true);
    try {
      const updatedProfile = await authService.updateMe(updated);
      setProfile(updatedProfile);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
      throw new Error("Profile update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        profile: resolvedProfile,
        loading: authLoading || updating,
        refreshProfile,
        updateProfile,
      }}
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
