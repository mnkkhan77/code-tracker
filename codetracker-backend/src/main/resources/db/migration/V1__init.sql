-- V1__init.sql

-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========== USERS ==========
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  fullname varchar(255),
  name varchar(255),
  role varchar(20) NOT NULL,
  bio text,
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========== ENUMS ==========
CREATE TYPE problem_difficulty AS ENUM ('EASY','MEDIUM','HARD');
CREATE TYPE purchase_status AS ENUM ('PENDING','COMPLETED','FAILED');
CREATE TYPE product_type AS ENUM ('SUBSCRIPTION','RESUME_ANALYSIS','CREDITS');

-- ========== TOPICS ==========
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  name varchar(200) NOT NULL,
  description text,
  slug varchar(200) NOT NULL UNIQUE
);

-- ========== PROBLEMS ==========
CREATE TABLE problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(500) NOT NULL,
  difficulty problem_difficulty NOT NULL,
  slug varchar(500),
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_date TIMESTAMP WITHOUT TIME ZONE,
  CONSTRAINT uq_problem_title UNIQUE (title)
);

-- ========== TAGS ==========
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE
);

CREATE TABLE problem_tags (
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (problem_id, tag_id)
);

-- ========== EXTERNAL URLS ==========
CREATE TABLE external_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  platform varchar(100),
  url text
);

-- ========== USER PROGRESS ==========
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  status varchar(30),
  notes text,
  best_time int,
  last_attempt_date TIMESTAMP WITHOUT TIME ZONE,
  next_review_date TIMESTAMP WITHOUT TIME ZONE,
  completed_date TIMESTAMP WITHOUT TIME ZONE
);

-- ========== ATTEMPTS ==========
CREATE TABLE attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_progress_id uuid REFERENCES user_progress(id) ON DELETE CASCADE,
  duration int,
  attempt_date TIMESTAMP WITHOUT TIME ZONE,
  successful boolean
);

-- ========== PURCHASES ==========
CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  product_type product_type NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency varchar(10) DEFAULT 'USD',
  status purchase_status NOT NULL,
  paid_at TIMESTAMP WITHOUT TIME ZONE,
  provider_ref varchar(255)
);

-- ========== REMINDERS ==========
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    next_reminder_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========== REMINDER PROBLEMS ==========
CREATE TABLE reminder_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reminder_id UUID NOT NULL,
    problem_id UUID NOT NULL,
    repetition_count INT DEFAULT 0,
    interval_days INT DEFAULT 0,
    next_review_date TIMESTAMP,
    CONSTRAINT fk_reminder FOREIGN KEY (reminder_id) REFERENCES reminders(id) ON DELETE CASCADE,
    CONSTRAINT fk_problem FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    CONSTRAINT uq_reminder_problem UNIQUE (reminder_id, problem_id)
);


-- ========== SEED DATA ==========

-- ========== USERS ==========
-- Passwords: admins use 'Admin@123', users use 'User@123'
-- crypt() with gen_salt('bf', 10) produces bcrypt hashes compatible with Spring Security BCryptPasswordEncoder
INSERT INTO users (id, email, password, name, role, bio, created_date) VALUES
  (gen_random_uuid(), 'admin1@codetracker.local', crypt('Admin@123', gen_salt('bf', 10)), 'Admin One',   'ADMIN', 'Superuser',          NOW() - INTERVAL '50 days'),
  (gen_random_uuid(), 'admin2@codetracker.local', crypt('Admin@123', gen_salt('bf', 10)), 'Admin Two',   'ADMIN', 'Admin account',      NOW() - INTERVAL '40 days'),
  (gen_random_uuid(), 'admin3@codetracker.local', crypt('Admin@123', gen_salt('bf', 10)), 'Admin Three', 'ADMIN', 'Third admin',        NOW() - INTERVAL '30 days'),
  (gen_random_uuid(), 'user1@codetracker.local',  crypt('User@123',  gen_salt('bf', 10)), 'User One',    'USER',  'Just user one',      NOW() - INTERVAL '28 days'),
  (gen_random_uuid(), 'user2@codetracker.local',  crypt('User@123',  gen_salt('bf', 10)), 'User Two',    'USER',  'Just user two',      NOW() - INTERVAL '25 days'),
  (gen_random_uuid(), 'user3@codetracker.local',  crypt('User@123',  gen_salt('bf', 10)), 'User Three',  'USER',  'Enthusiastic coder', NOW() - INTERVAL '20 days'),
  (gen_random_uuid(), 'user4@codetracker.local',  crypt('User@123',  gen_salt('bf', 10)), 'User Four',   'USER',  'Loves DP',           NOW() - INTERVAL '15 days'),
  (gen_random_uuid(), 'user5@codetracker.local',  crypt('User@123',  gen_salt('bf', 10)), 'User Five',   'USER',  'Graph expert',       NOW() - INTERVAL '10 days');

-- ========== TOPICS ==========
INSERT INTO topics (id, name, description, slug) VALUES
  (gen_random_uuid(), 'Arrays',              'Problems involving array manipulation',      'arrays'),
  (gen_random_uuid(), 'Strings',             'String manipulation and parsing',            'strings'),
  (gen_random_uuid(), 'Linked Lists',        'Singly/doubly linked list challenges',       'linked-lists'),
  (gen_random_uuid(), 'Trees',               'Binary trees, BSTs, traversals',             'trees'),
  (gen_random_uuid(), 'Graphs',              'Graph algorithms, BFS, DFS, paths',          'graphs'),
  (gen_random_uuid(), 'Dynamic Programming', 'DP and memoization problems',                'dynamic-programming');

-- ========== TAGS ==========
INSERT INTO tags (id, name) VALUES
  (gen_random_uuid(), 'Two-Pointers'),
  (gen_random_uuid(), 'Hashing'),
  (gen_random_uuid(), 'Recursion'),
  (gen_random_uuid(), 'BFS'),
  (gen_random_uuid(), 'DFS'),
  (gen_random_uuid(), 'DP'),
  (gen_random_uuid(), 'Greedy'),
  (gen_random_uuid(), 'Backtracking'),
  (gen_random_uuid(), 'Sliding Window'),
  (gen_random_uuid(), 'Math');

-- ========== TOP 50 LEETCODE PROBLEMS ==========
INSERT INTO problems (id, title, difficulty, slug, topic_id, created_date)
SELECT gen_random_uuid(), p.title, p.difficulty::problem_difficulty, p.slug, t.id, NOW()
FROM (VALUES
  -- Arrays
  ('Two Sum',                                      'EASY',   'two-sum',                                      'Arrays'),
  ('Best Time to Buy and Sell Stock',              'EASY',   'best-time-to-buy-and-sell-stock',              'Arrays'),
  ('Contains Duplicate',                           'EASY',   'contains-duplicate',                           'Arrays'),
  ('Missing Number',                               'EASY',   'missing-number',                               'Arrays'),
  ('Maximum Subarray',                             'MEDIUM', 'maximum-subarray',                             'Arrays'),
  ('Product of Array Except Self',                 'MEDIUM', 'product-of-array-except-self',                 'Arrays'),
  ('Container With Most Water',                    'MEDIUM', 'container-with-most-water',                    'Arrays'),
  ('3Sum',                                         'MEDIUM', 'three-sum',                                    'Arrays'),
  ('Find Minimum in Rotated Sorted Array',         'MEDIUM', 'find-minimum-in-rotated-sorted-array',         'Arrays'),
  ('Search in Rotated Sorted Array',               'MEDIUM', 'search-in-rotated-sorted-array',               'Arrays'),
  ('Maximum Product Subarray',                     'MEDIUM', 'maximum-product-subarray',                     'Arrays'),
  ('Merge Intervals',                              'MEDIUM', 'merge-intervals',                              'Arrays'),
  ('Insert Interval',                              'MEDIUM', 'insert-interval',                              'Arrays'),
  ('Jump Game',                                    'MEDIUM', 'jump-game',                                    'Arrays'),
  ('Combination Sum',                              'MEDIUM', 'combination-sum',                              'Arrays'),
  ('Permutations',                                 'MEDIUM', 'permutations',                                 'Arrays'),
  ('Subsets',                                      'MEDIUM', 'subsets',                                      'Arrays'),
  ('Trapping Rain Water',                          'HARD',   'trapping-rain-water',                          'Arrays'),
  -- Strings
  ('Valid Anagram',                                'EASY',   'valid-anagram',                                'Strings'),
  ('Valid Parentheses',                            'EASY',   'valid-parentheses',                            'Strings'),
  ('Longest Substring Without Repeating Characters','MEDIUM','longest-substring-without-repeating-characters','Strings'),
  ('Longest Palindromic Substring',                'MEDIUM', 'longest-palindromic-substring',                'Strings'),
  ('Group Anagrams',                               'MEDIUM', 'group-anagrams',                               'Strings'),
  ('Minimum Window Substring',                     'HARD',   'minimum-window-substring',                     'Strings'),
  -- Linked Lists
  ('Reverse Linked List',                          'EASY',   'reverse-linked-list',                          'Linked Lists'),
  ('Merge Two Sorted Lists',                       'EASY',   'merge-two-sorted-lists',                       'Linked Lists'),
  ('Linked List Cycle',                            'EASY',   'linked-list-cycle',                            'Linked Lists'),
  ('Palindrome Linked List',                       'EASY',   'palindrome-linked-list',                       'Linked Lists'),
  ('Remove Nth Node From End of List',             'MEDIUM', 'remove-nth-node-from-end-of-list',             'Linked Lists'),
  ('Add Two Numbers',                              'MEDIUM', 'add-two-numbers',                              'Linked Lists'),
  ('Reorder List',                                 'MEDIUM', 'reorder-list',                                 'Linked Lists'),
  -- Trees
  ('Maximum Depth of Binary Tree',                 'EASY',   'maximum-depth-of-binary-tree',                 'Trees'),
  ('Invert Binary Tree',                           'EASY',   'invert-binary-tree',                           'Trees'),
  ('Symmetric Tree',                               'EASY',   'symmetric-tree',                               'Trees'),
  ('Same Tree',                                    'EASY',   'same-tree',                                    'Trees'),
  ('Convert Sorted Array to Binary Search Tree',   'EASY',   'convert-sorted-array-to-binary-search-tree',   'Trees'),
  ('Validate Binary Search Tree',                  'MEDIUM', 'validate-binary-search-tree',                  'Trees'),
  ('Binary Tree Level Order Traversal',            'MEDIUM', 'binary-tree-level-order-traversal',            'Trees'),
  ('Lowest Common Ancestor of a BST',              'MEDIUM', 'lowest-common-ancestor-of-a-binary-search-tree','Trees'),
  ('Kth Smallest Element in a BST',                'MEDIUM', 'kth-smallest-element-in-a-bst',                'Trees'),
  -- Graphs
  ('Flood Fill',                                   'EASY',   'flood-fill',                                   'Graphs'),
  ('Number of Islands',                            'MEDIUM', 'number-of-islands',                            'Graphs'),
  ('Clone Graph',                                  'MEDIUM', 'clone-graph',                                  'Graphs'),
  ('Course Schedule',                              'MEDIUM', 'course-schedule',                              'Graphs'),
  ('Pacific Atlantic Water Flow',                  'MEDIUM', 'pacific-atlantic-water-flow',                  'Graphs'),
  ('Word Search',                                  'MEDIUM', 'word-search',                                  'Graphs'),
  -- Dynamic Programming
  ('Climbing Stairs',                              'EASY',   'climbing-stairs',                              'Dynamic Programming'),
  ('House Robber',                                 'MEDIUM', 'house-robber',                                 'Dynamic Programming'),
  ('Coin Change',                                  'MEDIUM', 'coin-change',                                  'Dynamic Programming'),
  ('Longest Increasing Subsequence',               'MEDIUM', 'longest-increasing-subsequence',               'Dynamic Programming'),
  ('Word Break',                                   'MEDIUM', 'word-break',                                   'Dynamic Programming'),
  ('Longest Common Subsequence',                   'MEDIUM', 'longest-common-subsequence',                   'Dynamic Programming')
) AS p(title, difficulty, slug, topic_name)
JOIN topics t ON t.name = p.topic_name;

-- ========== EXTERNAL URLS ==========
INSERT INTO external_urls (id, problem_id, platform, url)
SELECT gen_random_uuid(), pr.id, 'LeetCode', 'https://leetcode.com/problems/' || pr.slug || '/'
FROM problems pr
WHERE pr.slug IS NOT NULL;

-- ========== PROBLEM TAGS ==========
INSERT INTO problem_tags (problem_id, tag_id)
SELECT pr.id, tg.id
FROM (VALUES
  -- Arrays
  ('Two Sum',                                       'Hashing'),
  ('Two Sum',                                       'Two-Pointers'),
  ('Best Time to Buy and Sell Stock',               'Sliding Window'),
  ('Best Time to Buy and Sell Stock',               'Greedy'),
  ('Contains Duplicate',                            'Hashing'),
  ('Missing Number',                                'Math'),
  ('Maximum Subarray',                              'DP'),
  ('Maximum Subarray',                              'Greedy'),
  ('Container With Most Water',                     'Two-Pointers'),
  ('3Sum',                                          'Two-Pointers'),
  ('Find Minimum in Rotated Sorted Array',          'Two-Pointers'),
  ('Search in Rotated Sorted Array',                'Two-Pointers'),
  ('Maximum Product Subarray',                      'DP'),
  ('Merge Intervals',                               'Greedy'),
  ('Insert Interval',                               'Greedy'),
  ('Jump Game',                                     'Greedy'),
  ('Combination Sum',                               'Backtracking'),
  ('Permutations',                                  'Backtracking'),
  ('Subsets',                                       'Backtracking'),
  -- Strings
  ('Valid Anagram',                                 'Hashing'),
  ('Longest Substring Without Repeating Characters','Sliding Window'),
  ('Longest Substring Without Repeating Characters','Hashing'),
  ('Longest Palindromic Substring',                 'DP'),
  ('Group Anagrams',                                'Hashing'),
  ('Minimum Window Substring',                      'Sliding Window'),
  -- Linked Lists
  ('Reverse Linked List',                           'Recursion'),
  ('Linked List Cycle',                             'Two-Pointers'),
  ('Palindrome Linked List',                        'Two-Pointers'),
  ('Remove Nth Node From End of List',              'Two-Pointers'),
  ('Reorder List',                                  'Two-Pointers'),
  -- Trees
  ('Maximum Depth of Binary Tree',                  'DFS'),
  ('Maximum Depth of Binary Tree',                  'Recursion'),
  ('Invert Binary Tree',                            'Recursion'),
  ('Symmetric Tree',                                'Recursion'),
  ('Same Tree',                                     'Recursion'),
  ('Validate Binary Search Tree',                   'DFS'),
  ('Validate Binary Search Tree',                   'Recursion'),
  ('Binary Tree Level Order Traversal',             'BFS'),
  ('Convert Sorted Array to Binary Search Tree',    'Recursion'),
  -- Graphs
  ('Flood Fill',                                    'BFS'),
  ('Flood Fill',                                    'DFS'),
  ('Number of Islands',                             'BFS'),
  ('Number of Islands',                             'DFS'),
  ('Clone Graph',                                   'BFS'),
  ('Course Schedule',                               'BFS'),
  ('Course Schedule',                               'DFS'),
  ('Pacific Atlantic Water Flow',                   'BFS'),
  ('Pacific Atlantic Water Flow',                   'DFS'),
  ('Word Search',                                   'Backtracking'),
  ('Word Search',                                   'DFS'),
  -- Dynamic Programming
  ('Climbing Stairs',                               'DP'),
  ('House Robber',                                  'DP'),
  ('Coin Change',                                   'DP'),
  ('Longest Increasing Subsequence',                'DP'),
  ('Word Break',                                    'DP'),
  ('Longest Common Subsequence',                    'DP')
) AS pt(problem_title, tag_name)
JOIN problems pr ON pr.title = pt.problem_title
JOIN tags tg ON tg.name = pt.tag_name;
