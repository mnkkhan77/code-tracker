-- V4__add_ats_support.sql

-- Add credits balance to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 0;

-- Resume upload history
CREATE TABLE resumes (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename     VARCHAR(255) NOT NULL,
    file_path    TEXT NOT NULL,
    uploaded_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    status       VARCHAR(50) NOT NULL DEFAULT 'UPLOADED'
);
