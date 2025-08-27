export const user = {
  id: "123",
  name: "Demo User",
  email: "demo@example.com",
  initials: "DU",
};
export const topics = [
  {
    id: "topic_1",
    createdDate: 1672531200000,
    name: "Arrays",
    description: "Problems involving array manipulation and algorithms",
    slug: "arrays",
    color: "#3B82F6",
  },
  {
    id: "topic_2",
    createdDate: 1672531200001,
    name: "Dynamic Programming",
    description: "Problems using dynamic programming techniques",
    slug: "dynamic-programming",
    color: "#8B5CF6",
  },
  {
    id: "topic_3",
    createdDate: 1672531200002,
    name: "Trees",
    description: "Binary trees, BSTs, and tree traversal problems",
    slug: "trees",
    color: "#10B981",
  },
  {
    id: "topic_4",
    createdDate: 1672531200003,
    name: "Graphs",
    description: "Graph algorithms and traversal problems",
    slug: "graphs",
    color: "#F59E0B",
  },
];
export const problems = [
  {
    id: "problem_1",
    createdDate: 1672531200004,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    topicId: "topic_1",
    tags: ["hash-table", "array"],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/two-sum/",
      },
    ],
    status: "not_started",
  },
  {
    id: "problem_2",
    createdDate: 1672531200005,
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit.",
    difficulty: "easy",
    topicId: "topic_1",
    tags: ["array", "dynamic-programming"],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      },
    ],
    status: "not_started",
  },
  {
    id: "problem_3",
    createdDate: 1672531200006,
    title: "3Sum",
    description:
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    difficulty: "medium",
    topicId: "topic_1",
    tags: ["array", "two-pointers", "sorting"],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/3sum/",
      },
    ],
    status: "not_started",
  },
  {
    id: "problem_4",
    createdDate: 1672531200007,
    title: "Climbing Stairs",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "easy",
    topicId: "topic_2",
    tags: ["dynamic-programming", "math", "memoization"],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/climbing-stairs/",
      },
    ],
    status: "not_started",
  },
  {
    id: "problem_5",
    createdDate: 1672531200008,
    title: "House Robber",
    description:
      "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected.",
    difficulty: "medium",
    topicId: "topic_2",
    tags: ["array", "dynamic-programming"],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/house-robber/",
      },
    ],
    status: "not_started",
  },
  {
    id: "problem_6",
    createdDate: 1672531200009,
    title: "Maximum Depth of Binary Tree",
    description: "Given the root of a binary tree, return its maximum depth.",
    difficulty: "easy",
    topicId: "topic_3",
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      },
    ],
    status: "not_started",
  },
  {
    id: "problem_7",
    createdDate: 1672531200010,
    title: "Validate Binary Search Tree",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    difficulty: "medium",
    topicId: "topic_3",
    tags: ["tree", "depth-first-search", "binary-search-tree", "binary-tree"],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/validate-binary-search-tree/",
      },
    ],
    status: "not_started",
  },
  {
    id: "problem_8",
    createdDate: 1672531200011,
    title: "Number of Islands",
    description:
      "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    difficulty: "medium",
    topicId: "topic_4",
    tags: [
      "array",
      "depth-first-search",
      "breadth-first-search",
      "union-find",
      "matrix",
    ],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
    ],
    status: "not_started",
  },
  {
    id: "problem_9",
    createdDate: 1672531200012,
    title: "Course Schedule",
    description:
      "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.",
    difficulty: "medium",
    topicId: "topic_4",
    tags: [
      "depth-first-search",
      "breadth-first-search",
      "graph",
      "topological-sort",
    ],
    externalUrls: [
      {
        platform: "LeetCode",
        url: "https://leetcode.com/problems/course-schedule/",
      },
    ],
    status: "not_started",
  },
];
export const userProgress = [
  {
    id: "up_1",
    userId: "user_1",
    problemId: "problem_1",
    status: "completed",
    notes: "Used a hash map for O(n) solution.",
    bestTime: 120,
    attempts: [
      {
        duration: 15,
        date: 1678886400000,
        successful: true,
      },
    ],
    lastAttemptDate: 1678886400000,
    nextReviewDate: 1679886400000,
    completedDate: 1678886400000,
  },
  {
    id: "up_2",
    userId: "user_1",
    problemId: "problem_2",
    status: "in_progress",
    notes: "Struggling with the edge cases.",
    bestTime: null,
    attempts: [
      {
        duration: 25,
        date: 1678972800000,
        successful: false,
      },
    ],
    lastAttemptDate: 1678972800000,
    nextReviewDate: null,
    completedDate: null,
  },
  {
    id: "up_3",
    userId: "user_1",
    problemId: "problem_4",
    status: "completed",
    notes: "DP solution was tricky but got it.",
    bestTime: 300,
    attempts: [
      {
        duration: 45,
        date: 1679059200000,
        successful: true,
      },
    ],
    lastAttemptDate: 1679059200000,
    nextReviewDate: 1709059200000,
    completedDate: 1679059200000,
  },
  {
    id: "up_4",
    userId: "user_1",
    problemId: "problem_6",
    status: "completed",
    notes: "Recursive solution was straightforward.",
    bestTime: 180,
    attempts: [
      {
        duration: 20,
        date: 1679145600000,
        successful: true,
      },
    ],
    lastAttemptDate: 1679145600000,
    nextReviewDate: 1679232000000,
    completedDate: 1679145600000,
  },
];
export default {
  user,
  topics,
  problems,
  userProgress,
};
