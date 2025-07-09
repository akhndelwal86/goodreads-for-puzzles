-- Create likes table for tracking likes on activities
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL, -- References feed_items.id or other activity records
    activity_type TEXT NOT NULL, -- 'feed_item', 'review', 'puzzle_log', etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure user can only like an activity once
    UNIQUE(user_id, activity_id, activity_type)
);

-- Create indexes for performance
CREATE INDEX idx_likes_activity ON likes(activity_id, activity_type);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_created_at ON likes(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all likes
CREATE POLICY "Users can view all likes" ON likes
    FOR SELECT USING (true);

-- Policy: Users can only insert their own likes
CREATE POLICY "Users can insert their own likes" ON likes
    FOR INSERT WITH CHECK (auth.uid()::text = (
        SELECT clerk_id FROM users WHERE id = user_id
    ));

-- Policy: Users can only delete their own likes
CREATE POLICY "Users can delete their own likes" ON likes
    FOR DELETE USING (auth.uid()::text = (
        SELECT clerk_id FROM users WHERE id = user_id
    ));

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON likes TO authenticated;
GRANT SELECT ON likes TO anon;