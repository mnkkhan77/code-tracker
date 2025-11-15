// src/hooks/useProfilePage.tsx
import { getUserProfile, updateUserProfile } from "@/api/userAPI";
import { User } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export function useProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!authUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      toast.error("Failed to load profile.");
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
        setProfile(updatedProfile);
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile.");
      } finally {
        setLoading(false);
      }
    },
    [profile]
  );

  return {
    profile,
    loading,
    updateProfile,
  };
}
