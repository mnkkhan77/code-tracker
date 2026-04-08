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
  upcomingReviews?: ReminderProblem[];
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
  bestTime?: number | null; // ensure nullable for consistency
  nextReviewDate?: string;
  lastAttemptAt?: string;
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
  duration?: number; // seconds/minutes (backend field)
  date?: string;     // ISO datetime from backend
  successful?: boolean;
  // legacy frontend-only fields
  userId?: string;
  problemId?: string;
  timestamp?: number;
}

export interface AddAttemptDto {
  duration?: number;
  successful?: boolean;
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
  id: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  nextReminderDate?: string;
  createdAt?: string;
  updatedAt?: string;
  // legacy local-only fields (kept for localStorage fallback compatibility)
  title?: string;
  notes?: string;
  remindAt?: string;
  completed?: boolean;
}

/** Spaced repetition entry — one problem scheduled for review via SM-2 */
export interface ReminderProblem {
  id: string;
  problem?: {
    id: string;
    title: string;
    difficulty: string;
    topicSlug: string | null;
  };
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string; // ISO datetime
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
