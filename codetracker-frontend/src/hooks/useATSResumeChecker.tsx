// src/hooks/useATSResumeChecker.tsx
import {
  AnalysisMode,
  purchaseCredits as apiPurchaseCredits,
  uploadResumeForAnalysis as apiUploadResume,
  deleteResume as apiDeleteResume,
  getUserCredits,
  getUserResumes,
} from "@/api/atsAPI";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Mock auth state, assuming user is logged in by default for mock purposes.
let isAuthenticated = true;

export function useAuth() {
  const [auth, setAuth] = useState(isAuthenticated);

  const signIn = () => {
    isAuthenticated = true;
    setAuth(true);
    toast.success("Successfully signed in!");
  };

  const signOut = () => {
    isAuthenticated = false;
    setAuth(false);
  };

  return { isAuthenticated: auth, signIn, signOut };
}

export function useATSResumeChecker() {
  const [credits, setCredits] = useState(0);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true); // Always set loading to true when fetching
    try {
      const [creditsData, resumesData] = await Promise.all([
        getUserCredits(),
        getUserResumes(),
      ]);
      setCredits(creditsData.credits ?? 0); // Fallback to 0 if undefined
      setResumes(resumesData ?? []); // Fallback to empty array if undefined
    } catch (error: any) {
      toast.error(error?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePurchaseCredits = useCallback(
    async (packageType: "small" | "medium" | "large") => {
      try {
        const result = await apiPurchaseCredits(packageType);
        if (result.success) {
          toast.success(`Successfully purchased ${result.creditsAdded} credits!`);
          const updated = await getUserCredits();
          setCredits(updated.credits ?? 0);
          return true;
        }
        toast.error(result.message || "Purchase failed. Please try again.");
        return false;
      } catch (error) {
        toast.error("Purchase failed. Please try again.");
        return false;
      }
    },
    [],
  );

  const uploadResume = useCallback(
    async (file: File, jobDescription?: string, analysisMode: AnalysisMode = "standard") => {
      try {
        const result = await apiUploadResume(file, jobDescription, analysisMode);
        if (result.success) {
          await fetchData();
          return { success: true, resumeId: result.resumeId, filename: result.filename, status: result.status };
        } else {
          return { success: false, error: result.message || "Upload failed" };
        }
      } catch (error: any) {
        return {
          success: false,
          error: error?.message || "Upload failed",
        };
      }
    },
    [fetchData],
  );

  const deleteResume = useCallback(async (id: string) => {
    const ok = await apiDeleteResume(id);
    if (ok) {
      setResumes(prev => prev.filter((r: any) => r.id !== id));
      toast.success("Resume deleted.");
    } else {
      toast.error("Failed to delete resume.");
    }
    return ok;
  }, []);

  return {
    credits,
    resumes,
    loading,
    purchaseCredits: handlePurchaseCredits,
    uploadResume,
    deleteResume,
  };
}
