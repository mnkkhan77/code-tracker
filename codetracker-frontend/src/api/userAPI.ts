import { User, UserStatsDto } from "@/types/api";
import apiClient from "./apiClient";

export const getUserProfile = async (): Promise<User> => {
  try {
    const res = await apiClient.get<User>("/profile/me");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (
  payload: Partial<User>,
): Promise<User> => {
  try {
    const res = await apiClient.patch<User>("/profile/me", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getMyStats = async (): Promise<UserStatsDto> => {
  try {
    const res = await apiClient.get<UserStatsDto>("/profile/me/stats");
    return res.data;
  } catch (error) {
    throw error;
  }
};
