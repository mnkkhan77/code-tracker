// This is a mock API. In a real application, this would be making calls to a backend.
import sampleData from "@/data/sampleData.ts";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  problemsSolved?: number;
  currentStreak?: number;
  totalSubmissions?: number;
  rank?: string;
  joinDate?: string;
}

// Use a session-based object that can be reset, similar to problemsApi.ts
let sessionUserProfile = {
  ...sampleData.user,
  ...sampleData.userProgress.reduce(
    (acc, p) => {
      if (p.status === "completed")
        acc.problemsSolved = (acc.problemsSolved || 0) + 1;
      return acc;
    },
    {
      id: "user_123",
      name: sampleData.user.name,
      email: sampleData.user.email,
      bio: "Software developer and competitive programmer. Loves solving complex problems and learning new algorithms.",
      avatarUrl: "https://github.com/shadcn.png",
      problemsSolved: 0,
      currentStreak: 12,
      totalSubmissions: 234,
      rank: "#1,204",
      joinDate: "2023-01-15",
    }
  ),
};

const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you'd be cloning the response, not the mock object.
      resolve(JSON.parse(JSON.stringify(data)));
    }, delay);
  });
};

export const getUserProfile = async (): Promise<UserProfile> => {
  console.log("API: Fetching user profile...");
  return simulateApiCall(sessionUserProfile);
};

export const updateUserProfile = async (
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  console.log("API: Updating user profile with", updates);
  sessionUserProfile = { ...sessionUserProfile, ...updates };
  return simulateApiCall(sessionUserProfile);
};
