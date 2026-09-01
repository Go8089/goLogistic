-- Add preferred notification channel to users table with default EMAIL
ALTER TABLE users
ADD COLUMN IF NOT EXISTS notification_channel VARCHAR(32) NOT NULL DEFAULT 'EMAIL';

-- Backfill existing NULLs just in case
UPDATE users SET notification_channel = 'EMAIL' WHERE notification_channel IS NULL;