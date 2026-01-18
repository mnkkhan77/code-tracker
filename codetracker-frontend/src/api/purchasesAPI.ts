// src/api/purchasesAPI.ts
import { Purchase } from "@/types/api";
import apiClient from "./apiClient";

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  try {
    const res = await apiClient.get<Purchase[]>(`/purchases/user/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createPurchase = async (
  purchase: Partial<Purchase>,
): Promise<Purchase> => {
  try {
    const res = await apiClient.post<Purchase>("/purchases", purchase);
    return res.data;
  } catch (error) {
    throw error;
  }
};
