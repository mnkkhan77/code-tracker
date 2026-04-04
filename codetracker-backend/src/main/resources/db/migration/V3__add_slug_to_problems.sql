-- V3__add_slug_to_problems.sql

ALTER TABLE problems ADD COLUMN IF NOT EXISTS slug VARCHAR(500);
