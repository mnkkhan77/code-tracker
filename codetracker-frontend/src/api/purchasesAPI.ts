// src/api/purchasesAPI.ts
import { Purchase } from "@/types/api";
import apiClient from "./apiClient";

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  const res = await apiClient.get<Purchase[]>(`/purchases/user/${userId}`);
  return res.data;
};

export const createPurchase = async (
  purchase: Partial<Purchase>
): Promise<Purchase> => {
  const res = await apiClient.post<Purchase>("/purchases", purchase);
  return res.data;
};
