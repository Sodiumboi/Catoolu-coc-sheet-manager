DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50)  UNIQUE NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE characters (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name          VARCHAR(255) NOT NULL,
    occupation    VARCHAR(255),
    game_type     VARCHAR(100) DEFAULT 'Classic (1920''s)',
    sheet_data    JSONB NOT NULL,
    portrait_data TEXT,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_characters_user_id ON characters(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'Schema created successfully!' AS status;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_token   ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);
