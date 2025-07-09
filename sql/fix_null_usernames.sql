-- Fix existing users with null usernames
-- This will update any users who have null usernames to use their email prefix

-- First, let's see what we have
SELECT 
    id,
    clerk_id,
    username,
    email,
    CASE 
        WHEN username IS NOT NULL AND username != '' THEN 'HAS_USERNAME'
        WHEN email IS NOT NULL AND email != '' THEN 'CAN_USE_EMAIL'
        ELSE 'NEEDS_FALLBACK'
    END as status
FROM users
ORDER BY created_at DESC;

-- Now update null/empty usernames
UPDATE users 
SET username = CASE 
    WHEN username IS NOT NULL AND username != '' THEN username
    WHEN email IS NOT NULL AND email != '' THEN SPLIT_PART(email, '@', 1)
    ELSE 'User'
END,
updated_at = NOW()
WHERE username IS NULL OR username = '';

-- Verify the changes
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN username IS NULL THEN 1 END) as null_usernames,
    COUNT(CASE WHEN username = '' THEN 1 END) as empty_usernames,
    COUNT(CASE WHEN username IS NOT NULL AND username != '' THEN 1 END) as valid_usernames
FROM users;

-- Show updated users
SELECT 
    id,
    clerk_id,
    username,
    email,
    updated_at
FROM users
WHERE updated_at > NOW() - INTERVAL '1 minute'
ORDER BY updated_at DESC;