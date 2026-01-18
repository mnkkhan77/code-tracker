// src/mappers/problemMapper.ts
import { Problem } from "@/types/api";

export type ProblemModel = Problem & {
  displayDifficulty: "Easy" | "Medium" | "Hard";
  status: "not_started" | "in_progress" | "completed";
};

function mapDifficulty(difficulty: string): "Easy" | "Medium" | "Hard" {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "Easy";
    case "hard":
      return "Hard";
    default:
      return "Medium";
  }
}

export function mapProblemsDtoToModel(dto: Problem[]): ProblemModel[] {
  return dto.map((p) => ({
    ...p,
    displayDifficulty: mapDifficulty(p.difficulty as string),
    status: (p.status ?? "not_started") as
      | "not_started"
      | "in_progress"
      | "completed",
  }));
}
