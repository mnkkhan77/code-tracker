// src/hooks/useProfilePage.tsx
import { getUserProfile, updateUserProfile } from "@/api/userAPI";
import { User } from "@/types/api";

export type UserProfile = User;
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export function useProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!authUser) {
      setProfile(null); // Ensure profile is cleared if no authUser
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile ?? null); // Fallback to null if undefined
    } catch (error: any) {
      toast.error(error?.message || "Failed to load profile.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!profile) return;
      setLoading(true);
      try {
        const updatedProfile = await updateUserProfile(updates);
        setProfile(updatedProfile ?? profile); // Fallback to previous profile if undefined
        toast.success("Profile updated successfully!");
      } catch (error: any) {
        toast.error(error?.message || "Failed to update profile.");
      } finally {
        setLoading(false);
      }
    },
    [profile],
  );

  return {
    profile,
    loading,
    updateProfile,
  };
}
