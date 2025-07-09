-- Helper function to get like count for an activity
CREATE OR REPLACE FUNCTION get_like_count(activity_id UUID, activity_type TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM likes
        WHERE likes.activity_id = $1 AND likes.activity_type = $2
    );
END;
$$ LANGUAGE plpgsql;

-- Helper function to get comment count for an activity
CREATE OR REPLACE FUNCTION get_comment_count(activity_id UUID, activity_type TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM comments
        WHERE comments.activity_id = $1 AND comments.activity_type = $2
    );
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if user has liked an activity
CREATE OR REPLACE FUNCTION user_has_liked(user_id UUID, activity_id UUID, activity_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.user_id = $1 
        AND likes.activity_id = $2 
        AND likes.activity_type = $3
    );
END;
$$ LANGUAGE plpgsql;

-- Helper function to toggle like (like if not liked, unlike if liked)
CREATE OR REPLACE FUNCTION toggle_like(user_id UUID, activity_id UUID, activity_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    like_exists BOOLEAN;
BEGIN
    -- Check if like exists
    SELECT EXISTS (
        SELECT 1 FROM likes 
        WHERE likes.user_id = $1 
        AND likes.activity_id = $2 
        AND likes.activity_type = $3
    ) INTO like_exists;
    
    IF like_exists THEN
        -- Unlike: Delete the like
        DELETE FROM likes 
        WHERE likes.user_id = $1 
        AND likes.activity_id = $2 
        AND likes.activity_type = $3;
        RETURN false; -- Now unliked
    ELSE
        -- Like: Insert new like
        INSERT INTO likes (user_id, activity_id, activity_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, activity_id, activity_type) DO NOTHING;
        RETURN true; -- Now liked
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for helper functions
GRANT EXECUTE ON FUNCTION get_like_count(UUID, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_comment_count(UUID, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION user_has_liked(UUID, UUID, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION toggle_like(UUID, UUID, TEXT) TO authenticated;