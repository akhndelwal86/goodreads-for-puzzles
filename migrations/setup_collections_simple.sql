-- Simple Collections Setup
-- This script sets up the collections table and sample data

-- First, check if collections table exists, if not rename from lists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lists' AND table_schema = 'public') THEN
        ALTER TABLE lists RENAME TO collections;
        ALTER TABLE list_items RENAME TO collection_items;
        ALTER TABLE collection_items RENAME COLUMN list_id TO collection_id;
    END IF;
END $$;

-- Add new columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'collection_type') THEN
        ALTER TABLE collections 
        ADD COLUMN collection_type VARCHAR(20) DEFAULT 'user-created',
        ADD COLUMN theme VARCHAR(50),
        ADD COLUMN visibility VARCHAR(20) DEFAULT 'public',
        ADD COLUMN cover_image_url TEXT,
        ADD COLUMN auto_criteria JSONB,
        ADD COLUMN is_featured BOOLEAN DEFAULT false,
        ADD COLUMN followers_count INTEGER DEFAULT 0,
        ADD COLUMN likes_count INTEGER DEFAULT 0,
        ADD COLUMN completion_rate DECIMAL(5,2) DEFAULT 0.00,
        ADD COLUMN total_pieces INTEGER DEFAULT 0,
        ADD COLUMN difficulty_level VARCHAR(20),
        ADD COLUMN tags TEXT[],
        ADD COLUMN creator_notes TEXT,
        ADD COLUMN last_updated_at TIMESTAMPTZ DEFAULT NOW(),
        ADD COLUMN published_at TIMESTAMPTZ,
        ADD COLUMN featured_at TIMESTAMPTZ;
    END IF;
END $$;

-- Create themes table if it doesn't exist
CREATE TABLE IF NOT EXISTS collection_themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    color_class VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert themes
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
('abstract', 'Abstract & Patterns', 'Geometric patterns and abstract designs', 'Shapes', 'text-pink-600', 10)
ON CONFLICT (name) DO NOTHING;

-- Insert sample official collections
INSERT INTO collections (
    collection_type, name, description, theme, visibility, is_featured, 
    creator_notes, published_at, featured_at, user_id, followers_count, likes_count
) VALUES 
('official', 'Van Gogh Masterpieces', 'Complete collection of Van Gogh puzzle reproductions featuring his most famous works including Starry Night, Sunflowers, and Irises', 'art', 'public', true, 'Curated selection of the greatest Van Gogh artworks in puzzle form with premium quality reproductions', NOW(), NOW(), NULL, 127, 89),
('official', 'National Parks Collection', 'Stunning landscapes from Americas most beautiful national parks including Yellowstone, Grand Canyon, and Yosemite', 'nature', 'public', true, 'Breathtaking photography from iconic American national parks', NOW(), NOW(), NULL, 203, 156),
('official', 'Fantasy Realms', 'Epic fantasy artwork collection for adventure and magic lovers featuring dragons, castles, and mystical creatures', 'fantasy', 'public', true, 'Immerse yourself in magical worlds and epic adventures', NOW(), NOW(), NULL, 98, 72),
('brand', 'Ravensburger Classics', 'Timeless puzzles from the world-renowned Ravensburger collection featuring their most beloved designs', 'vintage', 'public', true, 'Premium quality puzzles from the masters of puzzling', NOW(), NOW(), NULL, 145, 98),
('official', 'Wildlife Safari', 'Amazing wildlife photography showcasing animals from around the globe in their natural habitats', 'animals', 'public', false, 'Professional wildlife photography from National Geographic contributors', NOW(), NULL, NULL, 67, 45),
('brand', 'White Mountain Favorites', 'Popular puzzle designs from White Mountain featuring Americana and nostalgic themes', 'vintage', 'public', false, 'Classic American scenes and nostalgic imagery', NOW(), NULL, NULL, 78, 52)
ON CONFLICT DO NOTHING;

-- Create social tables if they don't exist
CREATE TABLE IF NOT EXISTS collection_followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, user_id)
);

CREATE TABLE IF NOT EXISTS collection_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    liked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_collections_type ON collections(collection_type);
CREATE INDEX IF NOT EXISTS idx_collections_theme ON collections(theme);
CREATE INDEX IF NOT EXISTS idx_collections_visibility ON collections(visibility);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON collections(is_featured) WHERE is_featured = true;