-- Clean up: Drop the accidentally created user_follows table
-- We're using the existing follows table instead

-- Drop the triggers and functions for user_follows
DROP TRIGGER IF EXISTS trigger_update_follow_counts ON user_follows;
DROP FUNCTION IF EXISTS update_follow_counts();

-- Drop the user_follows table entirely
DROP TABLE IF EXISTS user_follows CASCADE;