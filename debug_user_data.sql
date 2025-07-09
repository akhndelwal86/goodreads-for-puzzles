-- Debug script to check user data
-- Run this in your Supabase SQL editor to see what's in the users table

-- Check current user data
SELECT 
    id,
    clerk_id,
    username,
    email,
    avatar_url,
    created_at,
    updated_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- Check for users with null or empty usernames
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN username IS NULL THEN 1 END) as null_usernames,
    COUNT(CASE WHEN username = '' THEN 1 END) as empty_usernames,
    COUNT(CASE WHEN username IS NOT NULL AND username != '' THEN 1 END) as valid_usernames
FROM users;

-- Check recent posts and their user data
SELECT 
    fi.id,
    fi.type,
    fi.text,
    fi.created_at,
    u.username,
    u.email,
    u.clerk_id
FROM feed_items fi
JOIN users u ON fi.user_id = u.id
ORDER BY fi.created_at DESC
LIMIT 10;