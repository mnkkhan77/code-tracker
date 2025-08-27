import { User, UserStatsDto } from "@/types/api";
import apiClient from "./apiClient";

export const getUserProfile = async (): Promise<User> => {
  const res = await apiClient.get<User>("/profile/me");
  return res.data;
};

export const updateUserProfile = async (
  payload: Partial<User>
): Promise<User> => {
  // Spring: PATCH /api/profile/me (ProfileController.updateMyProfile)
  const res = await apiClient.patch<User>("/profile/me", payload);
  return res.data;
};

export const getMyStats = async (): Promise<UserStatsDto> => {
  const res = await apiClient.get<UserStatsDto>("/profile/me/stats");
  return res.data;
};
