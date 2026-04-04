-- V2__add_tokens_table.sql

CREATE TABLE tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_value VARCHAR(512) UNIQUE,
    revoked     BOOLEAN NOT NULL DEFAULT FALSE,
    expired     BOOLEAN NOT NULL DEFAULT FALSE,
    user_id     UUID NOT NULL,
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
