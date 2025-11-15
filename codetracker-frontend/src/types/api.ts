// src/types/api.ts

// --- Auth & User ---
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
  avatarUrl?: string;
  problemsSolved?: number;
  currentStreak?: number;
  totalSubmissions?: number;
  rank?: string | number;
}

export interface UserStatsDto {
  totalProblems: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  progressPercentage: number;
  totalTimeSpent: number;
  upcomingReviews?: any[]; // TODO: refine type
}

// --- Topics & Problems ---
export type Difficulty = "easy" | "medium" | "hard";
export type ProgressStatus = "not_started" | "in_progress" | "completed";

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  problems: Problem[];
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags?: string[];
  topicId: string;
  topicName?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string | null;
  status?: ProgressStatus;
  bestTime?: number | null;
  externalUrls?: ExternalUrl[];
}

// --- User Progress ---
export interface UserProgress {
  id: string;
  userId: string;
  problemId: string;
  status: ProgressStatus;
  bestTime?: number; // seconds
  nextReviewDate?: string; // ISO
  lastAttemptAt?: string; // ISO
}

export interface CreateProgressDto {
  problemId: string;
  status?: ProgressStatus;
  bestTime?: number;
}

export interface UpdateProgressDto {
  status?: ProgressStatus;
  bestTime?: number;
  nextReviewDate?: string;
}

// --- Attempts ---
export interface Attempt {
  id: string;
  userId: string;
  problemId: string;
  duration?: number; // seconds
  timestamp: number; // epoch millis
}

export interface AddAttemptDto {
  userId: string;
  problemId: string;
  duration?: number;
  timestamp?: number; // if omitted, backend can set now
}

// --- Purchases / Credits / ATS (optional) ---
export interface Purchase {
  id: string;
  userId: string;
  packageType: "small" | "medium" | "large";
  amount?: number;
  createdAt: string; // ISO
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: "usage" | "bonus";
  description?: string;
  createdAt: string; // ISO
}

export interface Resume {
  id: string;
  fileName: string;
  uploadedAt: string; // ISO
}

export interface Reminder {
  id: string; // uuid
  userId?: string; // optional: tie to a user when available
  title: string;
  notes?: string;
  remindAt?: string; // ISO datetime string when reminder should trigger
  completed?: boolean;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
}

export interface TopicWithStats extends Topic {
  completedProblems: number;
  totalProblems: number;
  progressPercentage: number;
}

export interface DashboardStats {
  totalProblems: number;
  solvedProblems: number;
  attemptedProblems: number;
}

export type Ctx = {
  profile: User | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updated: Partial<User>) => Promise<void>;
};

export interface ExternalUrl {
  platform: string;
  url: string;
}

export interface Tag {
  id: number;
  name: string;
}
