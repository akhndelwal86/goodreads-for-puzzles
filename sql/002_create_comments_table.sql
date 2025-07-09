-- Create comments table for threaded comments on activities
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL, -- References feed_items.id or other activity records
    activity_type TEXT NOT NULL, -- 'feed_item', 'review', 'puzzle_log', etc.
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For threaded replies
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Ensure content is not empty
    CONSTRAINT comments_content_not_empty CHECK (length(trim(content)) > 0)
);

-- Create indexes for performance
CREATE INDEX idx_comments_activity ON comments(activity_id, activity_type);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_comments_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all comments
CREATE POLICY "Users can view all comments" ON comments
    FOR SELECT USING (true);

-- Policy: Users can insert their own comments
CREATE POLICY "Users can insert their own comments" ON comments
    FOR INSERT WITH CHECK (auth.uid()::text = (
        SELECT clerk_id FROM users WHERE id = user_id
    ));

-- Policy: Users can update their own comments
CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (auth.uid()::text = (
        SELECT clerk_id FROM users WHERE id = user_id
    ));

-- Policy: Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (auth.uid()::text = (
        SELECT clerk_id FROM users WHERE id = user_id
    ));

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO authenticated;
GRANT SELECT ON comments TO anon;