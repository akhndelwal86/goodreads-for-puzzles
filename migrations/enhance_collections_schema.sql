-- Migration: Enhance Collections Schema for Redesigned Collections Page
-- Date: 2025-07-11
-- Description: Add enhanced metadata to support collection types, themes, visibility, and social features

-- First, let's rename the 'lists' table to 'collections' for clarity
ALTER TABLE lists RENAME TO collections;

-- Add new columns to enhance collections functionality
ALTER TABLE collections 
ADD COLUMN collection_type VARCHAR(20) DEFAULT 'user-created' CHECK (collection_type IN ('official', 'user-created', 'brand', 'auto-generated')),
ADD COLUMN theme VARCHAR(50), -- Art, Nature, Animals, Architecture, Fantasy, etc.
ADD COLUMN visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'friends-only')),
ADD COLUMN cover_image_url TEXT,
ADD COLUMN auto_criteria JSONB, -- Stores filter criteria for auto-generated collections
ADD COLUMN is_featured BOOLEAN DEFAULT false,
ADD COLUMN followers_count INTEGER DEFAULT 0,
ADD COLUMN likes_count INTEGER DEFAULT 0,
ADD COLUMN completion_rate DECIMAL(5,2) DEFAULT 0.00, -- Calculated completion percentage
ADD COLUMN total_pieces INTEGER DEFAULT 0, -- Sum of all puzzle pieces in collection
ADD COLUMN difficulty_level VARCHAR(20), -- Easy, Intermediate, Advanced, Expert
ADD COLUMN tags TEXT[], -- Array of tags for better searchability
ADD COLUMN creator_notes TEXT, -- Additional notes from the creator
ADD COLUMN last_updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN published_at TIMESTAMPTZ, -- When collection was made public
ADD COLUMN featured_at TIMESTAMPTZ; -- When collection was featured

-- Update the foreign key reference in list_items table
ALTER TABLE list_items RENAME TO collection_items;
ALTER TABLE collection_items RENAME COLUMN list_id TO collection_id;

-- Create indexes for better performance
CREATE INDEX idx_collections_type ON collections(collection_type);
CREATE INDEX idx_collections_theme ON collections(theme);
CREATE INDEX idx_collections_visibility ON collections(visibility);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_featured ON collections(is_featured) WHERE is_featured = true;
CREATE INDEX idx_collections_published ON collections(published_at) WHERE published_at IS NOT NULL;

-- Create a themes/categories reference table
CREATE TABLE collection_themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50), -- Lucide icon name
    color_class VARCHAR(50), -- Tailwind color class
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default themes
INSERT INTO collection_themes (name, display_name, description, icon_name, color_class, sort_order) VALUES
('art', 'Art & Paintings', 'Classic and modern artwork reproductions', 'Palette', 'text-purple-600', 1),
('nature', 'Nature & Landscapes', 'Beautiful natural scenes and landscapes', 'Mountain', 'text-green-600', 2),
('animals', 'Animals & Wildlife', 'Cute and wild animals from around the world', 'Cat', 'text-orange-600', 3),
('architecture', 'Architecture & Buildings', 'Stunning buildings and architectural wonders', 'Building2', 'text-blue-600', 4),
('fantasy', 'Fantasy & Sci-Fi', 'Magical and futuristic themed puzzles', 'Sparkles', 'text-violet-600', 5),
('vintage', 'Vintage & Retro', 'Classic puzzles from bygone eras', 'Clock', 'text-amber-600', 6),
('travel', 'Travel & Places', 'Famous destinations and travel spots', 'MapPin', 'text-red-600', 7),
('food', 'Food & Cuisine', 'Delicious food and culinary themes', 'Coffee', 'text-yellow-600', 8),
('seasonal', 'Seasonal & Holidays', 'Holiday and seasonal themed puzzles', 'Snowflake', 'text-cyan-600', 9),
('abstract', 'Abstract & Patterns', 'Geometric patterns and abstract designs', 'Shapes', 'text-pink-600', 10);

-- Create collection followers table for social features
CREATE TABLE collection_followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, user_id)
);

-- Create collection likes table
CREATE TABLE collection_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    liked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, user_id)
);

-- Create indexes for social features
CREATE INDEX idx_collection_followers_collection ON collection_followers(collection_id);
CREATE INDEX idx_collection_followers_user ON collection_followers(user_id);
CREATE INDEX idx_collection_likes_collection ON collection_likes(collection_id);
CREATE INDEX idx_collection_likes_user ON collection_likes(user_id);

-- Update the feed_items table to reference collections instead of lists
UPDATE feed_items SET target_list_id = NULL WHERE target_list_id IS NOT NULL;
ALTER TABLE feed_items RENAME COLUMN target_list_id TO target_collection_id;
ALTER TABLE feed_items ADD CONSTRAINT fk_feed_items_collection 
    FOREIGN KEY (target_collection_id) REFERENCES collections(id) ON DELETE SET NULL;

-- Create a view for collection statistics
CREATE OR REPLACE VIEW collection_stats AS
SELECT 
    c.id as collection_id,
    c.name,
    c.collection_type,
    c.theme,
    c.visibility,
    COUNT(ci.puzzle_id) as puzzle_count,
    COALESCE(SUM(p.piece_count), 0) as total_pieces,
    COALESCE(AVG(pa.avg_rating), 0) as average_rating,
    c.followers_count,
    c.likes_count,
    c.completion_rate,
    c.created_at,
    c.last_updated_at,
    u.username as creator_username,
    u.avatar_url as creator_avatar
FROM collections c
LEFT JOIN collection_items ci ON c.id = ci.collection_id
LEFT JOIN puzzles p ON ci.puzzle_id = p.id
LEFT JOIN puzzle_aggregates pa ON p.id = pa.id
LEFT JOIN users u ON c.user_id = u.id
GROUP BY c.id, u.username, u.avatar_url;

-- Add comments for documentation
COMMENT ON TABLE collections IS 'Enhanced collections table supporting different types, themes, and social features';
COMMENT ON COLUMN collections.collection_type IS 'Type of collection: official, user-created, brand, auto-generated';
COMMENT ON COLUMN collections.theme IS 'Collection theme/category for organization';
COMMENT ON COLUMN collections.visibility IS 'Who can see this collection: public, private, friends-only';
COMMENT ON COLUMN collections.auto_criteria IS 'JSON criteria used for auto-generated collections';
COMMENT ON COLUMN collections.completion_rate IS 'Percentage of puzzles completed by the creator';
COMMENT ON TABLE collection_themes IS 'Available themes/categories for collections';
COMMENT ON TABLE collection_followers IS 'Users following collections for updates';
COMMENT ON TABLE collection_likes IS 'User likes on collections';

-- Insert some sample official collections
INSERT INTO collections (
    collection_type, name, description, theme, visibility, is_featured, 
    creator_notes, published_at, featured_at, user_id
) VALUES 
('official', 'Van Gogh Masterpieces', 'Complete collection of Van Gogh puzzle reproductions featuring his most famous works', 'art', 'public', true, 'Curated selection of the greatest Van Gogh artworks in puzzle form', NOW(), NOW(), NULL),
('official', 'National Parks Collection', 'Stunning landscapes from Americas most beautiful national parks', 'nature', 'public', true, 'Breathtaking photography from iconic American national parks', NOW(), NOW(), NULL),
('official', 'Fantasy Realms', 'Epic fantasy artwork collection for adventure and magic lovers', 'fantasy', 'public', true, 'Immerse yourself in magical worlds and epic adventures', NOW(), NOW(), NULL),
('brand', 'Ravensburger Classics', 'Timeless puzzles from the world-renowned Ravensburger collection', 'vintage', 'public', true, 'Premium quality puzzles from the masters of puzzling', NOW(), NOW(), NULL);