// src/services/purchasesService.ts
import * as purchasesAPI from "@/api/purchasesAPI";
import { Purchase } from "@/types/api";

export const getUserPurchases = (userId: string): Promise<Purchase[]> =>
  purchasesAPI.getUserPurchases(userId);

export const createPurchase = (payload: Partial<Purchase>): Promise<Purchase> =>
  purchasesAPI.createPurchase(payload);
