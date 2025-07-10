-- Enhance existing follows table with missing features
-- This adds follower counts, triggers, and RLS to the existing follows table

-- Add follower/following counts to users table (if not already present)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Add indexes for efficient queries on follows table
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followed_user ON follows(followed_user_id);
CREATE INDEX IF NOT EXISTS idx_follows_created_at ON follows(created_at);

-- Create function to update follower counts
CREATE OR REPLACE FUNCTION update_follow_counts_v2()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment following count for follower
        UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
        -- Increment followers count for the followed user
        UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.followed_user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement following count for follower
        UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
        -- Decrement followers count for the unfollowed user
        UPDATE users SET followers_count = followers_count - 1 WHERE id = OLD.followed_user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update follow counts
DROP TRIGGER IF EXISTS trigger_update_follow_counts_v2 ON follows;
CREATE TRIGGER trigger_update_follow_counts_v2
    AFTER INSERT OR DELETE ON follows
    FOR EACH ROW
    EXECUTE FUNCTION update_follow_counts_v2();

-- Enable Row Level Security on follows table
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all follows" ON follows;
DROP POLICY IF EXISTS "Users can manage their own follows" ON follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON follows;

-- Policy: Users can see all follow relationships (for discovery)
CREATE POLICY "Users can view all follows" ON follows
    FOR SELECT USING (true);

-- Policy: Users can only create/delete their own follows
CREATE POLICY "Users can manage their own follows" ON follows
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT clerk_id FROM users WHERE id = follower_id
    ));

CREATE POLICY "Users can delete their own follows" ON follows
    FOR DELETE USING (auth.uid()::text IN (
        SELECT clerk_id FROM users WHERE id = follower_id
    ));

-- Initialize follower/following counts for existing users based on existing data
UPDATE users SET 
    followers_count = (
        SELECT COUNT(*) FROM follows WHERE followed_user_id = users.id
    ),
    following_count = (
        SELECT COUNT(*) FROM follows WHERE follower_id = users.id
    );

-- Add unique constraint to prevent duplicate follows if not already present
-- Note: This will fail if duplicate follows already exist - clean those up first if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_follow_relationship'
    ) THEN
        ALTER TABLE follows 
        ADD CONSTRAINT unique_follow_relationship 
        UNIQUE (follower_id, followed_user_id);
    END IF;
END $$;

-- Add check constraint to prevent self-following if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_no_self_follow_v2'
    ) THEN
        ALTER TABLE follows 
        ADD CONSTRAINT check_no_self_follow_v2 
        CHECK (follower_id != followed_user_id);
    END IF;
END $$;