-- Create user_follows table for following/follower relationships
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can't follow the same person twice
    UNIQUE(follower_id, following_id),
    
    -- Ensure a user can't follow themselves
    CONSTRAINT check_no_self_follow CHECK (follower_id != following_id)
);

-- Add indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_created_at ON user_follows(created_at);

-- Add follower/following counts to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Create function to update follower counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment following count for follower
        UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
        -- Increment followers count for the followed user
        UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement following count for follower
        UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
        -- Decrement followers count for the unfollowed user
        UPDATE users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update follow counts
DROP TRIGGER IF EXISTS trigger_update_follow_counts ON user_follows;
CREATE TRIGGER trigger_update_follow_counts
    AFTER INSERT OR DELETE ON user_follows
    FOR EACH ROW
    EXECUTE FUNCTION update_follow_counts();

-- Enable Row Level Security
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see all follow relationships (for discovery)
CREATE POLICY "Users can view all follows" ON user_follows
    FOR SELECT USING (true);

-- Policy: Users can only create/delete their own follows
CREATE POLICY "Users can manage their own follows" ON user_follows
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT clerk_id FROM users WHERE id = follower_id
    ));

CREATE POLICY "Users can delete their own follows" ON user_follows
    FOR DELETE USING (auth.uid()::text IN (
        SELECT clerk_id FROM users WHERE id = follower_id
    ));

-- Initialize follower/following counts for existing users
UPDATE users SET 
    followers_count = (
        SELECT COUNT(*) FROM user_follows WHERE following_id = users.id
    ),
    following_count = (
        SELECT COUNT(*) FROM user_follows WHERE follower_id = users.id
    );