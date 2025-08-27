// src/mappers/userMapper.ts
import { User } from "@/types/api";

export type UserModel = User;

export function mapUserDtoToModel(dto: User): UserModel {
  return dto;
}
