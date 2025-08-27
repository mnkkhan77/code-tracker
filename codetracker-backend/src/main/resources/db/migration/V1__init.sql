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
    entity_type VARCHAR(50) NOT NULL, -- PROBLEM, QUIZ, LESSON
    entity_id UUID NOT NULL,
    next_reminder_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- ========== REMINDER PROBLEM==========
CREATE TABLE reminder_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reminder_id UUID NOT NULL,
    problem_id UUID NOT NULL,
    repetition_count INT DEFAULT 0,
    interval_days INT DEFAULT 0, -- can be 3, 7, 15, 30, 90
    next_review_date TIMESTAMP,
    CONSTRAINT fk_reminder FOREIGN KEY (reminder_id) REFERENCES reminders(id) ON DELETE CASCADE,
    CONSTRAINT fk_problem FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    CONSTRAINT uq_reminder_problem UNIQUE (reminder_id, problem_id)
);


-- ========== SEED DATA ==========

--INSERT INTO users (id, email, password, name, role, created_date) VALUES
--  (gen_random_uuid(), 'admin@codetracker.local', '$2a$10$7d3bq8W1...replace-with-bcrypt', 'Admin User', 'ADMIN', NOW());

-- ========== USERS ==========
INSERT INTO users (id, email, password, name, role, bio, created_date) VALUES
  (gen_random_uuid(), 'admin1@codetracker.local', '$2a$10$bcrypt_admin1...', 'Admin One', 'ADMIN', 'Superuser', NOW() - INTERVAL '50 days'),
  (gen_random_uuid(), 'admin2@codetracker.local', '$2a$10$bcrypt_admin2...', 'Admin Two', 'ADMIN', 'Admin account', NOW() - INTERVAL '40 days'),
  (gen_random_uuid(), 'admin3@codetracker.local', '$2a$10$bcrypt_admin3...', 'Admin Three', 'ADMIN', 'Third admin', NOW() - INTERVAL '30 days'),
  (gen_random_uuid(), 'user1@codetracker.local', '$2a$10$bcrypt_user1...', 'User One', 'USER', 'Just user one', NOW() - INTERVAL '28 days'),
  (gen_random_uuid(), 'user2@codetracker.local', '$2a$10$bcrypt_user2...', 'User Two', 'USER', 'Just user two', NOW() - INTERVAL '25 days'),
  (gen_random_uuid(), 'user3@codetracker.local', '$2a$10$bcrypt_user3...', 'User Three', 'USER', 'Enthusiastic coder', NOW() - INTERVAL '20 days'),
  (gen_random_uuid(), 'user4@codetracker.local', '$2a$10$bcrypt_user4...', 'User Four', 'USER', 'Loves DP', NOW() - INTERVAL '15 days'),
  (gen_random_uuid(), 'user5@codetracker.local', '$2a$10$bcrypt_user5...', 'User Five', 'USER', 'Graph expert', NOW() - INTERVAL '10 days');

-- ========== TOPICS ==========
INSERT INTO topics (id, name, description, slug) VALUES
  (gen_random_uuid(), 'Arrays', 'Problems involving array manipulation', 'arrays'),
  (gen_random_uuid(), 'Strings', 'String manipulation and parsing', 'strings'),
  (gen_random_uuid(), 'Linked Lists', 'Singly/doubly linked list challenges', 'linked-lists'),
  (gen_random_uuid(), 'Trees', 'Binary trees, BSTs, traversals', 'trees'),
  (gen_random_uuid(), 'Graphs', 'Graph algorithms, BFS, DFS, paths', 'graphs'),
  (gen_random_uuid(), 'Dynamic Programming', 'DP and memoization problems', 'dynamic-programming');

-- ========== TAGS ==========
INSERT INTO tags (id, name) VALUES
  (gen_random_uuid(), 'Two‑Pointers'),
  (gen_random_uuid(), 'Hashing'),
  (gen_random_uuid(), 'Recursion'),
  (gen_random_uuid(), 'BFS'),
  (gen_random_uuid(), 'DFS'),
  (gen_random_uuid(), 'DP'),
  (gen_random_uuid(), 'Greedy'),
  (gen_random_uuid(), 'Backtracking'),
  (gen_random_uuid(), 'Sliding Window'),
  (gen_random_uuid(), 'Math');

-- ========== PROBLEMS (sample with proper SELECTs) ==========
-- Insert 'Two Sum' problem by resolving topic_id and user_id
INSERT INTO problems (id, title, difficulty, topic_id, created_by, created_date)
SELECT
  gen_random_uuid(),
  'Two Sum',
  'EASY',
  t.id,
  u.id,
  NOW() - INTERVAL '35 days'
FROM topics t, users u
WHERE t.name = 'Arrays' AND u.email = 'user1@codetracker.local';

-- Repeat similar inserts for other problems...

-- ========== EXTERNAL URLS ==========
INSERT INTO external_urls (id, problem_id, platform, url)
SELECT
  gen_random_uuid(),
  p.id,
  'LeetCode',
  'https://leetcode.com/problems/two-sum/'
FROM problems p
WHERE p.title = 'Two Sum';

-- ========== PROBLEM_TAGS ==========
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id
FROM problems p, tags t
WHERE p.title = 'Two Sum' AND t.name = 'Hashing';

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id
FROM problems p, tags t
WHERE p.title = 'Two Sum' AND t.name = 'Two‑Pointers';

-- ========== USER PROGRESS ==========
INSERT INTO user_progress (id, user_id, problem_id, status, best_time, last_attempt_date, next_review_date, completed_date)
SELECT
  gen_random_uuid(),
  u.id,
  p.id,
  'COMPLETED',
  120,
  NOW() - INTERVAL '5 days',
  NULL,
  NOW() - INTERVAL '5 days'
FROM users u, problems p
WHERE u.email = 'user1@codetracker.local' AND p.title = 'Two Sum';

-- ========== ATTEMPTS ==========
INSERT INTO attempts (id, user_progress_id, duration, attempt_date, successful)
SELECT
  gen_random_uuid(),
  up.id,
  300,
  NOW() - INTERVAL '6 days',
  TRUE
FROM user_progress up
JOIN users u ON up.user_id = u.id
JOIN problems p ON up.problem_id = p.id
WHERE u.email = 'user1@codetracker.local' AND p.title = 'Two Sum';

-- ========== REMINDERS ==========
INSERT INTO reminders (id, user_id, entity_type, entity_id, next_reminder_date)
SELECT
  gen_random_uuid(),
  u.id,
  'PROBLEM',
  p.id,
  NOW() + INTERVAL '3 days'
FROM users u, problems p
WHERE u.email = 'user1@codetracker.local' AND p.title = 'Two Sum';

-- ========== REMINDER_PROBLEMS ==========
INSERT INTO reminder_problems (id, reminder_id, problem_id, repetition_count, interval_days, next_review_date)
SELECT
  gen_random_uuid(),
  r.id,
  p.id,
  1,
  3,
  NOW() + INTERVAL '3 days'
FROM reminders r
JOIN users u ON r.user_id = u.id
JOIN problems p ON r.entity_id = p.id
WHERE u.email = 'user1@codetracker.local' AND p.title = 'Two Sum';

-- ========== PURCHASES ==========
INSERT INTO purchases (id, user_id, product_type, amount, currency, status, paid_at, provider_ref)
SELECT
  gen_random_uuid(),
  u.id,
  'SUBSCRIPTION',
  10.00,
  'USD',
  'COMPLETED',
  NOW() - INTERVAL '20 days',
  'txn_1001'
FROM users u
WHERE u.email = 'user2@codetracker.local';
