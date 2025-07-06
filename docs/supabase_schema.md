# Supabase Database Schema - Complete Reference (Updated)

## 📊 Table Overview

Your database contains **11 tables**:
- `users` - User accounts (hybrid: custom + Supabase auth)
- `brands` - Puzzle manufacturers/creators
- `puzzles` - Main puzzle catalog
- `lists` - User-created puzzle lists
- `list_items` - Items within lists
- `puzzle_logs` - User puzzle completion logs with media
- `reviews` - Detailed puzzle reviews with metadata
- `tags` - Tag system for categorization
- `puzzle_tags` - Many-to-many relationship for puzzle tags
- `puzzle_aggregates` - Computed statistics per puzzle
- `feed_items` - Activity feed entries
- `follows` - User following relationships

---

## 👤 **users** (CRITICAL - Mixed Schema!)
**Purpose:** User accounts combining custom fields with Supabase auth

### Core Custom Fields (Use These!)
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `clerk_id` | text | NO | - | **Clerk authentication ID** |
| `username` | text | YES | - | Display username |
| `email` | text | NO | - | User email |
| `avatar_url` | text | YES | - | Profile picture |
| `bio` | text | YES | - | User bio |
| `created_at` | timestamptz | YES | `now()` | Account creation |
| `updated_at` | timestamptz | YES | `now()` | Last update |

### Supabase Auth Fields (Ignore These!)
- `instance_id`, `aud`, `role`, `encrypted_password`, `email_confirmed_at`, `confirmation_token`, etc.
- These are internal Supabase auth fields - don't use them directly

**⚠️ IMPORTANT:** Your app uses **Clerk for authentication**, so:
- Use `clerk_id` to link to Clerk users
- Ignore all the Supabase auth fields
- Use the custom fields (username, email, avatar_url, bio) for your app

**Relationships:**
- One-to-many with `puzzle_logs`
- One-to-many with `reviews`
- One-to-many with `lists`
- One-to-many with `follows` (both directions)

---

## 🏢 **brands**
**Purpose:** Store puzzle manufacturers and creators

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `name` | text | NO | - | Brand name (unique) |
| `description` | text | YES | - | Brand description |
| `image_url` | text | YES | - | Brand logo/image |
| `website_url` | text | YES | - | Official website |
| `created_at` | timestamptz | YES | `now()` | Creation timestamp |

**Relationships:**
- One-to-many with `puzzles` (brand_id)

---

## 🧩 **puzzles**
**Purpose:** Main puzzle catalog with all puzzle information

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `title` | text | NO | - | Puzzle title |
| `brand_id` | uuid | YES | - | FK to brands.id |
| `image_url` | text | YES | - | Puzzle cover image |
| `piece_count` | integer | YES | - | Number of pieces |
| `material` | text | YES | - | Puzzle material |
| `year` | integer | YES | - | Release year |
| `theme` | text | YES | - | Puzzle theme/category |
| `description` | text | YES | - | Detailed description |
| `purchase_link` | text | YES | - | Where to buy |
| `uploader_id` | uuid | YES | - | FK to users.id |
| `approval_status` | text | YES | `'pending'` | Status: pending/approved/rejected |
| `created_at` | timestamptz | YES | `now()` | Creation timestamp |
| `updated_at` | timestamptz | YES | `now()` | Last update |

**Relationships:**
- Many-to-one with `brands` (brand_id)
- Many-to-one with `users` (uploader_id)
- One-to-many with `puzzle_logs`
- One-to-many with `reviews`
- Many-to-many with `tags` (via puzzle_tags)
- One-to-one with `puzzle_aggregates`

---

## 📝 **lists**
**Purpose:** User-created puzzle collections (Want to Do, Completed, Custom lists)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `user_id` | uuid | YES | - | FK to users.id |
| `name` | text | NO | - | List name |
| `description` | text | YES | - | List description |
| `type` | text | YES | `'custom'` | List type: standard/custom |
| `slug` | text | YES | - | URL-friendly identifier |
| `created_at` | timestamptz | YES | `now()` | Creation timestamp |

**Relationships:**
- Many-to-one with `users` (user_id)
- One-to-many with `list_items`

---

## 📋 **list_items**
**Purpose:** Individual puzzles within lists

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `list_id` | uuid | YES | - | FK to lists.id |
| `puzzle_id` | uuid | YES | - | FK to puzzles.id |
| `added_at` | timestamptz | YES | `now()` | When added to list |

**Relationships:**
- Many-to-one with `lists` (list_id)
- Many-to-one with `puzzles` (puzzle_id)

---

## 📱 **puzzle_logs**
**Purpose:** User puzzle completion tracking with rich media and status

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `user_id` | uuid | YES | - | FK to users.id |
| `puzzle_id` | uuid | YES | - | FK to puzzles.id |
| `solve_time_seconds` | integer | YES | - | Time taken to complete |
| `note` | text | YES | - | User notes |
| `photo_urls` | jsonb | YES | `'[]'` | Array of photo URLs |
| `video_urls` | jsonb | YES | `'[]'` | Array of video URLs |
| `logged_at` | timestamptz | YES | `now()` | Completion timestamp |
| `status` | text | YES | `'wishlist'` | Status: wishlist/library/in-progress/completed/abandoned |
| `started_at` | timestamptz | YES | - | When puzzle was started |
| `progress_percentage` | integer | YES | `0` | Completion percentage (0-100) |
| `difficulty_rating` | integer | YES | - | User's difficulty rating (1-5) |
| `user_rating` | integer | YES | - | User's overall rating (1-5) |
| `is_private` | boolean | YES | `true` | Privacy setting |
| `updated_at` | timestamptz | YES | `now()` | Last update |

**Status Values:**
- `'wishlist'` - Want to solve this puzzle
- `'library'` - Added to personal library
- `'in-progress'` - Currently working on it
- `'completed'` - Finished the puzzle
- `'abandoned'` - Started but gave up

**Relationships:**
- Many-to-one with `users` (user_id)
- Many-to-one with `puzzles` (puzzle_id)

---

## ⭐ **reviews**
**Purpose:** Detailed puzzle reviews with advanced metadata

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `user_id` | uuid | YES | - | FK to users.id |
| `puzzle_id` | uuid | YES | - | FK to puzzles.id |
| `rating` | integer | YES | - | Overall rating (1-5) |
| `review_text` | text | YES | - | Written review |
| `loose_fit` | integer | YES | - | Loose fit rating (1-5) |
| `loose_fit_explanation` | text | YES | - | Explanation |
| `false_fit` | integer | YES | - | False fit frequency (1-5) |
| `false_fit_explanation` | text | YES | - | Explanation |
| `shape_versatility` | integer | YES | - | Shape variety rating (1-5) |
| `shape_versatility_explanation` | text | YES | - | Explanation |
| `finish` | integer | YES | - | Finish quality rating (1-5) |
| `finish_explanation` | text | YES | - | Explanation |
| `pick_test` | boolean | YES | - | Pick test result |
| `pick_test_explanation` | text | YES | - | Explanation |
| `other_metadata_notes` | text | YES | - | Additional notes |
| `created_at` | timestamptz | YES | `now()` | Creation timestamp |

**Relationships:**
- Many-to-one with `users` (user_id)
- Many-to-one with `puzzles` (puzzle_id)

---

## 🏷️ **tags**
**Purpose:** Tag system for puzzle categorization

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `name` | text | NO | - | Tag name |
| `type` | text | YES | - | Tag category/type |
| `created_at` | timestamptz | YES | `now()` | Creation timestamp |

**Relationships:**
- Many-to-many with `puzzles` (via puzzle_tags)

---

## 🔗 **puzzle_tags**
**Purpose:** Many-to-many relationship between puzzles and tags

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `puzzle_id` | uuid | YES | - | FK to puzzles.id |
| `tag_id` | uuid | YES | - | FK to tags.id |
| `created_at` | timestamptz | YES | `now()` | Creation timestamp |

**Relationships:**
- Many-to-one with `puzzles` (puzzle_id)
- Many-to-one with `tags` (tag_id)

---

## 📊 **puzzle_aggregates**
**Purpose:** Computed statistics and aggregated data per puzzle

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | - | Primary key (matches puzzles.id) |
| `title` | text | YES | - | Puzzle title (denormalized) |
| `avg_rating` | numeric | YES | - | Average user rating |
| `review_count` | integer | YES | `0` | Number of reviews |
| `avg_loose_fit` | numeric | YES | - | Average loose fit rating |
| `avg_false_fit` | numeric | YES | - | Average false fit rating |
| `avg_shape_versatility` | numeric | YES | - | Average shape versatility |
| `avg_finish` | numeric | YES | - | Average finish quality |
| `pick_test_success_rate` | numeric | YES | - | Pick test pass rate (0-1) |
| `loose_fit_count` | integer | YES | `0` | Number of loose fit ratings |
| `false_fit_count` | integer | YES | `0` | Number of false fit ratings |
| `shape_versatility_count` | integer | YES | `0` | Number of shape ratings |
| `finish_count` | integer | YES | `0` | Number of finish ratings |
| `pick_test_count` | integer | YES | `0` | Number of pick test results |
| `last_updated` | timestamp | YES | `now()` | Last aggregation update |

**Relationships:**
- One-to-one with `puzzles` (id = puzzles.id)

---

## 📰 **feed_items**
**Purpose:** Activity feed entries for social features

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `user_id` | uuid | YES | - | FK to users.id |
| `type` | text | NO | - | Activity type |
| `target_puzzle_id` | uuid | YES | - | FK to puzzles.id |
| `target_list_id` | uuid | YES | - | FK to lists.id |
| `target_review_id` | uuid | YES | - | FK to reviews.id |
| `target_puzzle_log_id` | uuid | YES | - | FK to puzzle_logs.id |
| `image_url` | text | YES | - | Featured image |
| `media_urls` | jsonb | YES | `'[]'` | Array of media URLs |
| `text` | text | YES | - | Activity description |
| `created_at` | timestamptz | YES | `now()` | Creation timestamp |

**Activity Types:**
- `'review'` - User posted a review
- `'solved'` - User completed a puzzle
- `'add_to_list'` - User added puzzle to list
- `'puzzle_upload'` - User uploaded new puzzle
- `'added_purchase_link'` - User added purchase link

**Relationships:**
- Many-to-one with `users` (user_id)
- Many-to-one with `puzzles` (target_puzzle_id, optional)
- Many-to-one with `lists` (target_list_id, optional)
- Many-to-one with `reviews` (target_review_id, optional)
- Many-to-one with `puzzle_logs` (target_puzzle_log_id, optional)

---

## 👥 **follows**
**Purpose:** User following relationships

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `uuid_generate_v4()` | Primary key |
| `follower_id` | uuid | YES | - | FK to users.id (who follows) |
| `followed_user_id` | uuid | YES | - | FK to users.id (being followed) |
| `created_at` | timestamptz | YES | `now()` | Creation timestamp |

**Relationships:**
- Many-to-one with `users` (follower_id)
- Many-to-one with `users` (followed_user_id)

---

## 🔍 **Common Query Patterns**

### Get user by Clerk ID (MOST IMPORTANT!)
```sql
SELECT * FROM users WHERE clerk_id = $1;
```

### Get puzzles with brand and aggregate data
```sql
SELECT 
  p.*,
  b.name as brand_name,
  pa.avg_rating,
  pa.review_count
FROM puzzles p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN puzzle_aggregates pa ON p.id = pa.id
WHERE p.approval_status = 'approved';
```

### Get user's puzzle logs with puzzle details
```sql
SELECT 
  pl.*,
  p.title,
  p.piece_count,
  b.name as brand_name
FROM puzzle_logs pl
JOIN puzzles p ON pl.puzzle_id = p.id
JOIN brands b ON p.brand_id = b.id
WHERE pl.user_id = $1
ORDER BY pl.logged_at DESC;
```

### Get user's lists with puzzle counts
```sql
SELECT 
  l.*,
  COUNT(li.id) as puzzle_count
FROM lists l
LEFT JOIN list_items li ON l.id = li.list_id
WHERE l.user_id = $1
GROUP BY l.id
ORDER BY l.created_at DESC;
```

### Get puzzle with all metadata and tags
```sql
SELECT 
  p.*,
  b.name as brand_name,
  pa.*,
  ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
FROM puzzles p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN puzzle_aggregates pa ON p.id = pa.id
LEFT JOIN puzzle_tags pt ON p.id = pt.puzzle_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.id = $1
GROUP BY p.id, b.name, pa.id;
```

---

## 💾 **Storage Buckets**

### puzzle-media
- **Purpose:** Store all puzzle-related media
- **Structure:**
  - `puzzles/{puzzle_id}/cover.jpg` - Puzzle cover images
  - `logs/{user_id}/{log_id}/` - User log photos/videos
  - `profiles/{user_id}/avatar.jpg` - User avatars
  - `brands/{brand_id}/logo.jpg` - Brand logos

---

## 🔒 **Critical Authentication Notes**

### **YOUR APP USES CLERK + CUSTOM USER TABLE**
1. **Clerk handles authentication** - login/signup/sessions
2. **Your `users` table stores profile data** linked by `clerk_id`
3. **Always query users by `clerk_id`**, not by email or other fields
4. **Ignore all Supabase auth fields** in the users table

### **Correct User Flow:**
```typescript
// 1. Get Clerk user
const { userId } = auth()

// 2. Get your custom user record
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('clerk_id', userId)
  .single()
```

---

## ⚠️ **Critical Column Names (EXACT SPELLING!)**

- `users.clerk_id` ← **Links to Clerk authentication**
- `puzzle_logs.photo_urls` ← **JSONB array, not photo_url**
- `puzzle_logs.video_urls` ← **JSONB array, not video_url**
- `puzzle_logs.solve_time_seconds` ← **Not solve_time**
- `puzzle_logs.logged_at` ← **Not completed_at**
- `puzzle_logs.status` ← **Text field with specific values**
- `reviews.loose_fit` ← **Not fit_quality**
- `reviews.false_fit` ← **Not false_fits**
- `reviews.shape_versatility` ← **Not shape_variety**
- `puzzles.piece_count` ← **Not pieces**
- `puzzles.brand_id` ← **Not brand**
- `puzzles.approval_status` ← **Required for public display**
- `tags.created_at` ← **Added field not in original**

---

## 🎯 **Key Insights for Cursor:**

1. **Authentication:** Use `clerk_id` to link Clerk users to your `users` table
2. **Media Storage:** All photo/video fields are JSONB arrays
3. **Approval Workflow:** Always filter by `approval_status = 'approved'` for public puzzles
4. **Status Tracking:** `puzzle_logs.status` tracks puzzle progression
5. **Aggregated Data:** Use `puzzle_aggregates` for statistics, don't compute on-the-fly
6. **Privacy:** Respect `puzzle_logs.is_private` for user privacy