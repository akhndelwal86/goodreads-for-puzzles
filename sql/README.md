# Database Migration: Likes and Comments System

## Overview
This migration adds like and comment functionality to the community feed system. It creates two new tables (`likes` and `comments`) with proper relationships to existing tables and helper functions for efficient data access.

## Files to Execute (In Order)

### 1. `001_create_likes_table.sql`
Creates the `likes` table with:
- User-activity relationship tracking
- Unique constraints to prevent duplicate likes
- Proper indexes for performance
- Row Level Security (RLS) policies

### 2. `002_create_comments_table.sql`
Creates the `comments` table with:
- Threaded comment support (parent_comment_id)
- Content validation
- Auto-updating timestamps
- RLS policies for user permissions

### 3. `003_create_helper_functions.sql`
Creates PostgreSQL functions for:
- `get_like_count(activity_id, activity_type)` - Get like count
- `get_comment_count(activity_id, activity_type)` - Get comment count
- `user_has_liked(user_id, activity_id, activity_type)` - Check if user liked
- `toggle_like(user_id, activity_id, activity_type)` - Toggle like status

## How to Run

1. Open your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste each file's contents in order
4. Execute each SQL statement

## Table Schema

### likes
```sql
id UUID PRIMARY KEY
user_id UUID -> users.id
activity_id UUID (references feed_items.id or other activities)
activity_type TEXT ('feed_item', 'review', 'puzzle_log', etc.)
created_at TIMESTAMPTZ
UNIQUE(user_id, activity_id, activity_type)
```

### comments
```sql
id UUID PRIMARY KEY
user_id UUID -> users.id
activity_id UUID (references feed_items.id or other activities)
activity_type TEXT ('feed_item', 'review', 'puzzle_log', etc.)
content TEXT NOT NULL
parent_comment_id UUID -> comments.id (for replies)
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

## Security

- **Row Level Security** is enabled on both tables
- Users can only insert/update/delete their own likes and comments
- All users can view likes and comments (public social features)
- Proper foreign key constraints ensure data integrity

## Performance

- Indexes created on frequently queried columns
- Helper functions use efficient queries
- Unique constraints prevent duplicate data

## Activity Types

The system supports likes and comments on:
- `'feed_item'` - General community posts
- `'review'` - Puzzle reviews
- `'puzzle_log'` - Completion logs
- `'completion'` - Puzzle completions
- Any other activity type you define

## Usage Examples

```sql
-- Get like count for a feed item
SELECT get_like_count('feed-item-uuid', 'feed_item');

-- Check if user liked an activity
SELECT user_has_liked('user-uuid', 'activity-uuid', 'feed_item');

-- Toggle like (will like if not liked, unlike if liked)
SELECT toggle_like('user-uuid', 'activity-uuid', 'feed_item');

-- Get comments for an activity
SELECT c.*, u.username, u.avatar_url
FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.activity_id = 'activity-uuid'
AND c.activity_type = 'feed_item'
ORDER BY c.created_at ASC;
```

## Next Steps

After running these migrations, you can:
1. Create API endpoints for like/comment operations
2. Update the frontend to use the new interactive features
3. Add real-time updates for better user experience