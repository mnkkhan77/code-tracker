// src/api/atsAPI.ts
import apiClient from "./apiClient";

export const getUserCredits = async () => {
  try {
    const res = await apiClient.get("/ats/credits");
    return res.data;
  } catch (e) {
    return { credits: 0 };
  }
};

export const purchaseCredits = async (
  packageType: "small" | "medium" | "large"
) => {
  try {
    const res = await apiClient.post("/ats/purchase", { packageType });
    return res.data;
  } catch (e) {
    return { success: false };
  }
};

export const uploadResumeForAnalysis = async (file: File) => {
  const form = new FormData();
  form.append("resume", file);
  try {
    const res = await apiClient.post("/ats/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (e) {
    // fallback simulation
    return { success: false, error: "Unable to reach ATS service" };
  }
};

export const getUserResumes = async () => {
  try {
    const res = await apiClient.get("/ats/resumes");
    return res.data;
  } catch (e) {
    return [];
  }
};
