-- V7__credits_to_numeric.sql
-- Change credits column from INTEGER to NUMERIC to support fractional credits (e.g. 2.5)

ALTER TABLE users ALTER COLUMN credits TYPE NUMERIC(10,2) USING credits::NUMERIC;
ALTER TABLE users ALTER COLUMN credits SET DEFAULT 0;
