// src/hooks/useATSResumeChecker.tsx
import {
  purchaseCredits as apiPurchaseCredits,
  uploadResumeForAnalysis as apiUploadResume,
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
    if (!loading) setLoading(true);
    try {
      const [creditsData, resumesData] = await Promise.all([
        getUserCredits(),
        getUserResumes(),
      ]);
      setCredits(creditsData.credits);
      setResumes(resumesData);
    } catch (error) {
      toast.error("Failed to load mock data.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePurchaseCredits = useCallback(
    async (packageType: "small" | "medium" | "large") => {
      try {
        const result = await apiPurchaseCredits(packageType);
        if (result.success) {
          setCredits(result.newCredits);
          const packages = {
            small: { credits: 10, price: 5 },
            medium: { credits: 20, price: 10 },
            large: { credits: 35, price: 20 },
          };
          toast.success(
            `Successfully purchased ${packages[packageType].credits} credits!`
          );
          return true;
        }
        toast.error("Purchase failed. Please try again.");
        return false;
      } catch (error) {
        toast.error("Purchase failed. Please try again.");
        return false;
      }
    },
    []
  );

  const uploadResume = useCallback(
    async (file: File) => {
      try {
        const result = await apiUploadResume(file);
        if (result.success && result.analysisResult) {
          // Refetch data to update credits and resume list
          fetchData();
          return {
            success: true,
            analysisResult: {
              score: result.analysisResult.score,
              resumeId: result.analysisResult.resume.id,
            },
          };
        } else {
          return {
            success: false,
            error: result.error || "Upload failed",
          };
        }
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Upload failed",
        };
      }
    },
    [fetchData]
  );

  return {
    credits,
    resumes,
    loading,
    purchaseCredits: handlePurchaseCredits,
    uploadResume,
  };
}
