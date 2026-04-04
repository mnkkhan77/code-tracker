-- V6__add_analysis_to_resumes.sql

ALTER TABLE resumes
    ADD COLUMN IF NOT EXISTS ats_score    INTEGER,
    ADD COLUMN IF NOT EXISTS analysis     TEXT;
