// src/mappers/problemMapper.ts
import { Problem } from "@/types/api";

export type ProblemModel = Problem & {
  displayDifficulty: "Easy" | "Medium" | "Hard";
};

export function mapProblemDtoToModel(dto: Problem): ProblemModel {
  const displayDifficulty =
    dto.difficulty === "easy"
      ? "Easy"
      : dto.difficulty === "medium"
        ? "Medium"
        : "Hard";
  return { ...dto, displayDifficulty };
}

export function mapProblemsDtoToModel(dtos: Problem[]): ProblemModel[] {
  return dtos.map(mapProblemDtoToModel);
}
