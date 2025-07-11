-- Migration: Populate puzzle specification columns with intelligent defaults
-- Date: 2025-01-11
-- Description: Add data to existing specification columns based on piece count and material

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
  included_items = '["Premium puzzle pieces","Full-color reference poster","Resealable storage bag","Sturdy storage box","Assembly instructions"]'::jsonb,
  key_features = '[{"title": "Precision Cut", "description": "Perfect interlocking pieces with no false fits", "icon": "precision"},{"title": "HD Imaging", "description": "Crystal clear reproduction with vibrant colors", "icon": "image"},{"title": "Dust-Free", "description": "Clean cutting process with smooth edges", "icon": "clean"}]'::jsonb,
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