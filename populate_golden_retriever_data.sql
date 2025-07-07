-- Populate Golden Retriever Puppies puzzle with full realistic data
-- Puzzle ID: 4503543e-7399-4c07-a733-ab6520f212c1

-- First, let's add or update the puzzle_aggregates entry
INSERT INTO puzzle_aggregates (
  id,
  title,
  avg_rating,
  review_count,
  avg_loose_fit,
  avg_false_fit,
  avg_shape_versatility,
  avg_finish,
  pick_test_success_rate,
  loose_fit_count,
  false_fit_count,
  shape_versatility_count,
  finish_count,
  pick_test_count,
  last_updated
) VALUES (
  '4503543e-7399-4c07-a733-ab6520f212c1',
  'Golden Retriever Puppies',
  4.3,  -- Good rating
  12,   -- 12 reviews
  4.1,  -- Good fit quality
  4.5,  -- Low false fits
  3.8,  -- Decent shape variety
  4.2,  -- Good finish
  0.85, -- 85% pass pick test
  12,   -- All 12 reviews included loose fit
  12,   -- All 12 reviews included false fit
  10,   -- 10 reviews included shape versatility
  12,   -- All 12 reviews included finish
  8,    -- 8 pick tests
  now()
) ON CONFLICT (id) DO UPDATE SET
  avg_rating = EXCLUDED.avg_rating,
  review_count = EXCLUDED.review_count,
  avg_loose_fit = EXCLUDED.avg_loose_fit,
  avg_false_fit = EXCLUDED.avg_false_fit,
  avg_shape_versatility = EXCLUDED.avg_shape_versatility,
  avg_finish = EXCLUDED.avg_finish,
  pick_test_success_rate = EXCLUDED.pick_test_success_rate,
  loose_fit_count = EXCLUDED.loose_fit_count,
  false_fit_count = EXCLUDED.false_fit_count,
  shape_versatility_count = EXCLUDED.shape_versatility_count,
  finish_count = EXCLUDED.finish_count,
  pick_test_count = EXCLUDED.pick_test_count,
  last_updated = now();

-- Add some realistic tags for this puzzle
-- First, create the tags if they don't exist
INSERT INTO tags (name, type) VALUES 
  ('Animals', 'category'),
  ('Dogs', 'subject'),
  ('Cute', 'mood'),
  ('Family Friendly', 'audience'),
  ('Photography', 'style')
ON CONFLICT (name) DO NOTHING;

-- Link the tags to our puzzle
INSERT INTO puzzle_tags (puzzle_id, tag_id)
SELECT 
  '4503543e-7399-4c07-a733-ab6520f212c1'::uuid,
  t.id
FROM tags t 
WHERE t.name IN ('Animals', 'Dogs', 'Cute', 'Family Friendly', 'Photography')
ON CONFLICT DO NOTHING;

-- Add some sample reviews (need to get actual user IDs first)
-- Let's get some user IDs to use
DO $$
DECLARE
    user_ids uuid[];
    puzzle_id uuid := '4503543e-7399-4c07-a733-ab6520f212c1';
    i integer;
BEGIN
    -- Get some user IDs
    SELECT ARRAY(SELECT id FROM users LIMIT 5) INTO user_ids;
    
    -- Only proceed if we have users
    IF array_length(user_ids, 1) > 0 THEN
        -- Add sample reviews
        FOR i IN 1..LEAST(array_length(user_ids, 1), 5) LOOP
            INSERT INTO reviews (
                user_id,
                puzzle_id,
                rating,
                review_text,
                loose_fit,
                loose_fit_explanation,
                false_fit,
                false_fit_explanation,
                shape_versatility,
                shape_versatility_explanation,
                finish,
                finish_explanation,
                pick_test,
                pick_test_explanation,
                created_at
            ) VALUES (
                user_ids[i],
                puzzle_id,
                4 + (random() * 1)::integer, -- Rating 4-5
                CASE i 
                    WHEN 1 THEN 'Absolutely adorable puzzle! The puppies are so cute and the colors are vibrant.'
                    WHEN 2 THEN 'Great quality pieces, though some of the golden fur areas were challenging.'
                    WHEN 3 THEN 'Perfect family puzzle. My kids loved working on this together.'
                    WHEN 4 THEN 'Beautiful image quality and satisfying to complete. Highly recommend!'
                    WHEN 5 THEN 'Solid puzzle with good piece variety. The puppy faces were fun to assemble.'
                END,
                3 + (random() * 2)::integer, -- Loose fit 3-5
                CASE i % 3
                    WHEN 0 THEN 'Pieces fit snugly without being too tight'
                    WHEN 1 THEN 'Good fit, pieces stay in place well'
                    ELSE 'Perfect fit quality, no issues'
                END,
                4 + (random() * 1)::integer, -- False fit 4-5
                CASE i % 2
                    WHEN 0 THEN 'No false fits encountered'
                    ELSE 'Excellent piece design, no false fits'
                END,
                3 + (random() * 2)::integer, -- Shape versatility 3-5  
                CASE i % 3
                    WHEN 0 THEN 'Good variety of piece shapes'
                    WHEN 1 THEN 'Decent shape variety, some repetition'
                    ELSE 'Nice mix of piece shapes and sizes'
                END,
                4 + (random() * 1)::integer, -- Finish 4-5
                CASE i % 2
                    WHEN 0 THEN 'Smooth matte finish, no glare'
                    ELSE 'Great finish quality, colors pop'
                END,
                (random() > 0.3), -- 70% pass pick test
                CASE 
                    WHEN (random() > 0.3) THEN 'Pieces hold together well when picked up'
                    ELSE 'Some pieces come apart when lifting sections'
                END,
                now() - (random() * 30 || ' days')::interval
            ) ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;
END $$;

-- Add some sample puzzle logs (completions)
DO $$
DECLARE
    user_ids uuid[];
    puzzle_id uuid := '4503543e-7399-4c07-a733-ab6520f212c1';
    i integer;
BEGIN
    -- Get user IDs  
    SELECT ARRAY(SELECT id FROM users LIMIT 8) INTO user_ids;
    
    -- Only proceed if we have users
    IF array_length(user_ids, 1) > 0 THEN
        -- Add sample puzzle logs
        FOR i IN 1..LEAST(array_length(user_ids, 1), 8) LOOP
            INSERT INTO puzzle_logs (
                user_id,
                puzzle_id,
                solve_time_seconds,
                note,
                photo_urls,
                logged_at,
                status,
                started_at,
                progress_percentage,
                difficulty_rating,
                user_rating,
                is_private,
                updated_at
            ) VALUES (
                user_ids[i],
                puzzle_id,
                (300 + random() * 600) * 60, -- 5-15 hours in seconds
                CASE i % 4
                    WHEN 0 THEN 'Such a fun puzzle! The puppies were adorable to put together.'
                    WHEN 1 THEN 'Relaxing evening puzzle. Great quality pieces.'
                    WHEN 2 THEN 'Completed this with my family. Everyone loved it!'
                    ELSE 'Beautiful image and satisfying to complete.'
                END,
                '[]'::jsonb, -- No photos for now
                now() - (random() * 60 || ' days')::interval,
                'completed',
                now() - (random() * 60 || ' days')::interval - (random() * 10 || ' days')::interval,
                100,
                2 + (random() * 3)::integer, -- Difficulty 2-5
                4 + (random() * 1)::integer, -- Rating 4-5
                (random() > 0.7), -- 30% private
                now() - (random() * 60 || ' days')::interval
            ) ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;
END $$;

-- Verify the data was inserted
SELECT 
    'puzzle_aggregates' as table_name,
    avg_rating,
    review_count,
    0 as completion_count,
    0 as avg_completion_time_minutes
FROM puzzle_aggregates 
WHERE id = '4503543e-7399-4c07-a733-ab6520f212c1'

UNION ALL

SELECT 
    'tags' as table_name,
    COUNT(*)::numeric as avg_rating,
    0 as review_count,
    0 as completion_count,
    0 as avg_completion_time_minutes
FROM puzzle_tags pt
JOIN tags t ON pt.tag_id = t.id
WHERE pt.puzzle_id = '4503543e-7399-4c07-a733-ab6520f212c1'

UNION ALL

SELECT 
    'reviews' as table_name,
    AVG(rating) as avg_rating,
    COUNT(*)::integer as review_count,
    0 as completion_count,
    0 as avg_completion_time_minutes
FROM reviews 
WHERE puzzle_id = '4503543e-7399-4c07-a733-ab6520f212c1'

UNION ALL

SELECT 
    'puzzle_logs' as table_name,
    0 as avg_rating,
    0 as review_count,
    COUNT(*)::integer as completion_count,
    AVG(solve_time_seconds/60) as avg_completion_time_minutes
FROM puzzle_logs 
WHERE puzzle_id = '4503543e-7399-4c07-a733-ab6520f212c1' 
AND status = 'completed'; 