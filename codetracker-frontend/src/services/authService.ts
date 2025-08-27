// src/services/authService.ts
import * as authAPI from "@/api/authAPI";
import * as userAPI from "@/api/userAPI";
import { mapUserDtoToModel } from "@/mappers/userMapper";
import { User } from "@/types/api";

export async function login(email: string, password: string) {
  const res = await authAPI.login(email, password); // stores token
  return res;
}

export async function getMe(): Promise<User> {
  const me = await authAPI.getProfile();
  return mapUserDtoToModel(me);
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return authAPI.register(payload);
}

export async function updateMe(patch: Partial<User>): Promise<User> {
  const updated = await userAPI.updateUserProfile(patch);
  return mapUserDtoToModel(updated);
}

export function logout() {
  localStorage.removeItem("token");
}
