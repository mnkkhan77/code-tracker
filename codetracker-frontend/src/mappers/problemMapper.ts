// src/mappers/problemMapper.ts
import { Problem } from "@/types/api";

// src/mappers/problemMapper.ts
export type ProblemModel = Problem & {
  displayDifficulty: "Easy" | "Medium" | "Hard";
  status: "not_started" | "in_progress" | "completed"; // Add status
  bestTime: number | null; // Add bestTime
};

export function mapProblemDtoToModel(dto: any): ProblemModel {
  const displayDifficulty =
    dto.difficulty === "easy" || dto.difficulty === "EASY"
      ? "Easy"
      : dto.difficulty === "medium" || dto.difficulty === "MEDIUM"
        ? "Medium"
        : "Hard";

  return {
    ...dto,
    displayDifficulty,
    status: dto.status || "not_started", // Handle status
    bestTime: dto.bestTime || null, // Handle bestTime
  };
}

export function mapProblemsDtoToModel(dtos: Problem[]): ProblemModel[] {
  return dtos.map(mapProblemDtoToModel);
}
