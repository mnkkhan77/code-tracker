import apiClient from "./apiClient";

export type ProductType =
  | "SUBSCRIPTION"
  | "RESUME_ANALYSIS"
  | "CREDITS"
  | "CREDITS_SMALL"
  | "CREDITS_MEDIUM"
  | "CREDITS_LARGE";

export interface CheckoutResponse {
  sessionUrl: string;
  purchaseId: string;
}

export const createCheckoutSession = async (productType: ProductType): Promise<CheckoutResponse> => {
  const res = await apiClient.post<CheckoutResponse>("/payments/checkout", { productType });
  return res.data;
};
