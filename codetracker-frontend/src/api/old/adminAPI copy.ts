import sampleData from "@/data/sampleData";
export interface User {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "active" | "inactive";
  problemsSolved: number;
}
export interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  topicId: string;
  topicName: string;
  createdDate: string;
  status: "not_started" | "in_progress" | "completed";
  bestTime?: number | null;
  externalUrls?: { platform: string; url: string }[];
}
// --- MOCK DATABASE ---
let mockUsers: User[] = Array.from({ length: 45 }, (_, i) => ({
  id: `user_${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  registrationDate: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0],
  status: Math.random() > 0.2 ? "active" : "inactive",
  problemsSolved: Math.floor(Math.random() * 50),
}));

let mockProblems: Problem[] = sampleData.problems.map((p) => ({
  id: p.id,
  title: p.title,
  difficulty: p.difficulty as "easy" | "medium" | "hard",
  tags: p.tags,
  topicId: p.topicId,
  topicName:
    sampleData.topics.find((t) => t.id === p.topicId)?.name || "Unknown",
  createdDate: new Date(p.createdDate).toISOString().split("T")[0],
  status: p.status as "not_started" | "in_progress" | "completed",
  bestTime: null,
}));

// --- API FUNCTIONS ---
const simulateApiCall = <T>(data: T, delay = 300): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};
// User API
export const getUsers = () => simulateApiCall(mockUsers);
export const addUser = (user: Omit<User, "id" | "registrationDate">) => {
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`,
    registrationDate: new Date().toISOString().split("T")[0],
  };
  mockUsers = [newUser, ...mockUsers];
  return simulateApiCall(newUser);
};
export const updateUser = (userId: string, updates: Partial<User>) => {
  let updatedUser: User | undefined;
  mockUsers = mockUsers.map((u) => {
    if (u.id === userId) {
      updatedUser = { ...u, ...updates };
      return updatedUser;
    }
    return u;
  });
  return simulateApiCall(updatedUser);
};
export const deleteUser = (userId: string) => {
  mockUsers = mockUsers.filter((u) => u.id !== userId);
  return simulateApiCall({ success: true });
};
// Problem API
export const getProblems = () => simulateApiCall(mockProblems);
export const addProblem = (problem: Omit<Problem, "id" | "createdDate">) => {
  const newProblem: Problem = {
    ...problem,
    id: `problem_${Date.now()}`,
    createdDate: new Date().toISOString().split("T")[0],
  };
  mockProblems = [newProblem, ...mockProblems];
  return simulateApiCall(newProblem);
};
export const updateProblem = (problemId: string, updates: Partial<Problem>) => {
  let updatedProblem: Problem | undefined;
  mockProblems = mockProblems.map((p) => {
    if (p.id === problemId) {
      updatedProblem = { ...p, ...updates };
      return updatedProblem;
    }
    return p;
  });
  return simulateApiCall(updatedProblem);
};
export const deleteProblem = (problemId: string) => {
  mockProblems = mockProblems.filter((p) => p.id !== problemId);
  return simulateApiCall({ success: true });
};
