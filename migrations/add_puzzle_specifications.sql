-- Migration: Add puzzle specification columns
-- Date: 2025-01-11
-- Description: Add missing specification fields to puzzles table for detailed product information

-- Add specification columns to puzzles table
ALTER TABLE puzzles 
ADD COLUMN finished_size_width DECIMAL(5,2),
ADD COLUMN finished_size_height DECIMAL(5,2),
ADD COLUMN age_range_min INTEGER,
ADD COLUMN age_range_max INTEGER,
ADD COLUMN surface_finish TEXT,
ADD COLUMN sku TEXT,
ADD COLUMN included_items JSONB DEFAULT '[]',
ADD COLUMN key_features JSONB DEFAULT '[]',
ADD COLUMN box_width DECIMAL(5,2),
ADD COLUMN box_height DECIMAL(5,2),
ADD COLUMN box_depth DECIMAL(5,2),
ADD COLUMN weight_grams INTEGER;

-- Add some sample data for existing puzzles with common defaults
UPDATE puzzles SET 
  finished_size_width = 
    CASE 
      WHEN piece_count <= 300 THEN 16.0
      WHEN piece_count <= 500 THEN 20.0 
      WHEN piece_count <= 1000 THEN 27.0
      WHEN piece_count <= 1500 THEN 30.0
      ELSE 36.0
    END,
  finished_size_height = 
    CASE 
      WHEN piece_count <= 300 THEN 12.0
      WHEN piece_count <= 500 THEN 14.0
      WHEN piece_count <= 1000 THEN 20.0 
      WHEN piece_count <= 1500 THEN 24.0
      ELSE 28.0
    END,
  age_range_min = 
    CASE 
      WHEN piece_count <= 100 THEN 6
      WHEN piece_count <= 500 THEN 8
      WHEN piece_count <= 1000 THEN 12
      ELSE 14
    END,
  age_range_max = 99,
  surface_finish = 
    CASE 
      WHEN material ILIKE '%premium%' OR material ILIKE '%linen%' THEN 'Linen Finish'
      WHEN material ILIKE '%glossy%' THEN 'Glossy'
      ELSE 'Anti-glare Matte'
    END,
  sku = CONCAT(
    UPPER(SUBSTRING(COALESCE(brand_id::text, 'UNK'), 1, 3)),
    '-',
    piece_count,
    '-',
    UPPER(SUBSTRING(id::text, 1, 6))
  ),
  included_items = '[
    "Premium puzzle pieces",
    "Full-color reference poster", 
    "Resealable storage bag",
    "Sturdy storage box",
    "Assembly instructions"
  ]'::jsonb,
  key_features = '[
    {"title": "Precision Cut", "description": "Perfect interlocking pieces with no false fits", "icon": "precision"},
    {"title": "HD Imaging", "description": "Crystal clear reproduction with vibrant colors", "icon": "image"},
    {"title": "Dust-Free", "description": "Clean cutting process with smooth edges", "icon": "clean"}
  ]'::jsonb,
  box_width = 
    CASE 
      WHEN piece_count <= 500 THEN 9.5
      WHEN piece_count <= 1000 THEN 10.5
      ELSE 12.0
    END,
  box_height = 
    CASE 
      WHEN piece_count <= 500 THEN 7.5
      WHEN piece_count <= 1000 THEN 8.5
      ELSE 9.0
    END,
  box_depth = 2.0,
  weight_grams = 
    CASE 
      WHEN piece_count <= 300 THEN 400
      WHEN piece_count <= 500 THEN 600
      WHEN piece_count <= 1000 THEN 800
      WHEN piece_count <= 1500 THEN 1200
      ELSE 1500
    END
WHERE finished_size_width IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN puzzles.finished_size_width IS 'Finished puzzle width in inches';
COMMENT ON COLUMN puzzles.finished_size_height IS 'Finished puzzle height in inches';
COMMENT ON COLUMN puzzles.age_range_min IS 'Minimum recommended age in years';
COMMENT ON COLUMN puzzles.age_range_max IS 'Maximum recommended age in years';
COMMENT ON COLUMN puzzles.surface_finish IS 'Puzzle surface finish type';
COMMENT ON COLUMN puzzles.sku IS 'Stock keeping unit / product code';
COMMENT ON COLUMN puzzles.included_items IS 'JSON array of items included in the box';
COMMENT ON COLUMN puzzles.key_features IS 'JSON array of key product features';
COMMENT ON COLUMN puzzles.box_width IS 'Box width in inches';
COMMENT ON COLUMN puzzles.box_height IS 'Box height in inches'; 
COMMENT ON COLUMN puzzles.box_depth IS 'Box depth in inches';
COMMENT ON COLUMN puzzles.weight_grams IS 'Total weight in grams';