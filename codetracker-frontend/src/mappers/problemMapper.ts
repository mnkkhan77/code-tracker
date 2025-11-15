// src/mappers/problemMapper.ts
import { Problem, ProgressStatus } from "@/types/api";

export type ProblemModel = Problem & {
  displayDifficulty: "Easy" | "Medium" | "Hard";
  status: ProgressStatus;
  bestTime: number | null; // Add bestTime
};

function mapDifficulty(difficulty: string): "Easy" | "Medium" | "Hard" {
  switch (difficulty) {
    case "easy":
    case "EASY":
      return "Easy";
    case "hard":
    case "HARD":
      return "Hard";
    default:
      return "Medium";
  }
}

export function mapProblemsDtoToModel(dto: Problem[]): ProblemModel[] {
  return dto.map((p) => ({
    ...p,
    displayDifficulty: mapDifficulty(p.difficulty),
    status: (p.status as ProgressStatus) ?? "not_started",
    bestTime: p.bestTime ?? null,
  }));
}
