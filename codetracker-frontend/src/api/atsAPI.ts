// src/api/atsAPI.ts
import apiClient from "./apiClient";

export const getUserCredits = async () => {
  try {
    const res = await apiClient.get("/ats/credits");
    return res.data ?? { credits: 0 };
  } catch (e: any) {
    return { credits: 0, error: e?.message };
  }
};

export const purchaseCredits = async (
  packageType: "small" | "medium" | "large",
) => {
  try {
    const res = await apiClient.post("/ats/purchase", { packageType });
    return res.data ?? { success: false };
  } catch (e: any) {
    return { success: false, error: e?.message };
  }
};

export const uploadResumeForAnalysis = async (file: File) => {
  const form = new FormData();
  form.append("resume", file);
  try {
    const res = await apiClient.post("/ats/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return (
      res.data ?? { success: false, error: "No response from ATS service" }
    );
  } catch (e: any) {
    return {
      success: false,
      error: e?.message || "Unable to reach ATS service",
    };
  }
};

export const getUserResumes = async () => {
  try {
    const res = await apiClient.get("/ats/resumes");
    return res.data ?? [];
  } catch (e: any) {
    return [];
  }
};
