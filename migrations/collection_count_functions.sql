-- Migration: Collection Count Functions
-- Date: 2025-07-11
-- Description: Create database functions for maintaining collection counts

-- Function to increment followers count
CREATE OR REPLACE FUNCTION increment_followers_count(collection_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE collections 
  SET followers_count = followers_count + 1 
  WHERE id = collection_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement followers count
CREATE OR REPLACE FUNCTION decrement_followers_count(collection_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE collections 
  SET followers_count = GREATEST(followers_count - 1, 0)
  WHERE id = collection_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_likes_count(collection_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE collections 
  SET likes_count = likes_count + 1 
  WHERE id = collection_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_likes_count(collection_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE collections 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = collection_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update collection statistics when items are added/removed
CREATE OR REPLACE FUNCTION update_collection_stats(collection_id UUID)
RETURNS VOID AS $$
DECLARE
  puzzle_count INTEGER;
  total_pieces INTEGER;
BEGIN
  -- Count puzzles and total pieces
  SELECT 
    COUNT(ci.puzzle_id),
    COALESCE(SUM(p.piece_count), 0)
  INTO puzzle_count, total_pieces
  FROM collection_items ci
  LEFT JOIN puzzles p ON ci.puzzle_id = p.id
  WHERE ci.collection_id = update_collection_stats.collection_id;
  
  -- Update collection with calculated values
  UPDATE collections 
  SET 
    total_pieces = update_collection_stats.total_pieces,
    last_updated_at = NOW()
  WHERE id = update_collection_stats.collection_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update collection stats when items change
CREATE OR REPLACE FUNCTION trigger_update_collection_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM update_collection_stats(NEW.collection_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_collection_stats(OLD.collection_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for collection items
DROP TRIGGER IF EXISTS update_collection_stats_trigger ON collection_items;
CREATE TRIGGER update_collection_stats_trigger
  AFTER INSERT OR DELETE ON collection_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_collection_stats();

-- Function to search collections with full-text search
CREATE OR REPLACE FUNCTION search_collections(
  search_query TEXT,
  collection_type_filter TEXT DEFAULT NULL,
  theme_filter TEXT DEFAULT NULL,
  visibility_filter TEXT DEFAULT 'public',
  limit_count INTEGER DEFAULT 12,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  collection_type VARCHAR(20),
  theme VARCHAR(50),
  visibility VARCHAR(20),
  cover_image_url TEXT,
  followers_count INTEGER,
  likes_count INTEGER,
  total_pieces INTEGER,
  created_at TIMESTAMPTZ,
  creator_username TEXT,
  creator_avatar TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.collection_type,
    c.theme,
    c.visibility,
    c.cover_image_url,
    c.followers_count,
    c.likes_count,
    c.total_pieces,
    c.created_at,
    u.username as creator_username,
    u.avatar_url as creator_avatar,
    ts_rank(
      to_tsvector('english', c.name || ' ' || COALESCE(c.description, '')),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM collections c
  LEFT JOIN users u ON c.user_id = u.id
  WHERE (
    to_tsvector('english', c.name || ' ' || COALESCE(c.description, '')) @@ plainto_tsquery('english', search_query)
    OR c.name ILIKE '%' || search_query || '%'
    OR c.description ILIKE '%' || search_query || '%'
  )
  AND (collection_type_filter IS NULL OR c.collection_type = collection_type_filter)
  AND (theme_filter IS NULL OR c.theme = theme_filter)
  AND (visibility_filter IS NULL OR c.visibility = visibility_filter)
  ORDER BY rank DESC, c.created_at DESC
  LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;