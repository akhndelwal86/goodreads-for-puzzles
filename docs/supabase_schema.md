<!-- AUTO-GENERATED SCHEMA DOCUMENTATION -->
<!-- Generated: 2025-07-11T11:25:40.301Z -->
<!-- Source: http://localhost:3000/api/db/schema -->
<!-- DO NOT EDIT MANUALLY - Run 'npm run db:sync-schema' to update -->

# Database Schema

**Generated:** 2025-07-11T11:25:40.292Z
**Database:** postgres
**Schema:** public

## Tables (14)

### users

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| clerk_id | text | UNKNOWN | - |
| username | text | UNKNOWN | - |
| email | text | UNKNOWN | - |
| avatar_url | text | UNKNOWN | - |
| bio | text | UNKNOWN | - |
| created_at | text | UNKNOWN | - |
| updated_at | text | UNKNOWN | - |
| followers_count | integer | UNKNOWN | - |
| following_count | integer | UNKNOWN | - |

---

### brands

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| name | text | UNKNOWN | - |
| description | text | UNKNOWN | - |
| image_url | nullable | YES | - |
| website_url | nullable | YES | - |
| created_at | text | UNKNOWN | - |

---

### puzzles

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| title | text | UNKNOWN | - |
| brand_id | uuid | UNKNOWN | - |
| image_url | text | UNKNOWN | - |
| piece_count | integer | UNKNOWN | - |
| material | text | UNKNOWN | - |
| year | integer | UNKNOWN | - |
| theme | text | UNKNOWN | - |
| description | text | UNKNOWN | - |
| purchase_link | text | UNKNOWN | - |
| uploader_id | nullable | YES | - |
| approval_status | text | UNKNOWN | - |
| created_at | text | UNKNOWN | - |
| updated_at | text | UNKNOWN | - |
| finished_size_width | nullable | YES | - |
| finished_size_height | nullable | YES | - |
| age_range_min | nullable | YES | - |
| age_range_max | nullable | YES | - |
| surface_finish | nullable | YES | - |
| sku | nullable | YES | - |
| included_items | jsonb | UNKNOWN | - |
| key_features | jsonb | UNKNOWN | - |
| box_width | nullable | YES | - |
| box_height | nullable | YES | - |
| box_depth | nullable | YES | - |
| weight_grams | nullable | YES | - |

**Relationships:**
- brand_id → brands.id
- uploader_id → users.id

---

### lists

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| user_id | nullable | YES | - |
| name | text | UNKNOWN | - |
| description | text | UNKNOWN | - |
| type | text | UNKNOWN | - |
| created_at | text | UNKNOWN | - |
| slug | text | UNKNOWN | - |

**Relationships:**
- user_id → users.id

---

### list_items

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| list_id | uuid | UNKNOWN | - |
| puzzle_id | uuid | UNKNOWN | - |
| added_at | text | UNKNOWN | - |

**Relationships:**
- list_id → lists.id
- puzzle_id → puzzles.id

---

### puzzle_logs

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| user_id | uuid | UNKNOWN | - |
| puzzle_id | uuid | UNKNOWN | - |
| solve_time_seconds | integer | UNKNOWN | - |
| note | text | UNKNOWN | - |
| photo_urls | jsonb | UNKNOWN | - |
| video_urls | jsonb | UNKNOWN | - |
| logged_at | nullable | YES | - |
| status | text | UNKNOWN | - |
| started_at | nullable | YES | - |
| progress_percentage | integer | UNKNOWN | - |
| difficulty_rating | integer | UNKNOWN | - |
| user_rating | integer | UNKNOWN | - |
| is_private | boolean | UNKNOWN | - |
| updated_at | text | UNKNOWN | - |

**Relationships:**
- user_id → users.id
- puzzle_id → puzzles.id

---

### reviews

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| user_id | uuid | UNKNOWN | - |
| puzzle_id | uuid | UNKNOWN | - |
| rating | integer | UNKNOWN | - |
| review_text | text | UNKNOWN | - |
| loose_fit | integer | UNKNOWN | - |
| loose_fit_explanation | nullable | YES | - |
| false_fit | integer | UNKNOWN | - |
| false_fit_explanation | nullable | YES | - |
| shape_versatility | integer | UNKNOWN | - |
| shape_versatility_explanation | nullable | YES | - |
| finish | integer | UNKNOWN | - |
| finish_explanation | nullable | YES | - |
| pick_test | boolean | UNKNOWN | - |
| pick_test_explanation | nullable | YES | - |
| other_metadata_notes | nullable | YES | - |
| created_at | text | UNKNOWN | - |

**Relationships:**
- user_id → users.id
- puzzle_id → puzzles.id

---

### tags

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| name | text | UNKNOWN | - |
| type | text | UNKNOWN | - |
| created_at | text | UNKNOWN | - |

---

### puzzle_tags

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| puzzle_id | uuid | UNKNOWN | - |
| tag_id | nullable | YES | - |
| created_at | text | UNKNOWN | - |

**Relationships:**
- puzzle_id → puzzles.id
- tag_id → tags.id

---

### puzzle_aggregates

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| title | text | UNKNOWN | - |
| avg_rating | integer | UNKNOWN | - |
| review_count | integer | UNKNOWN | - |
| avg_loose_fit | integer | UNKNOWN | - |
| avg_false_fit | integer | UNKNOWN | - |
| avg_shape_versatility | integer | UNKNOWN | - |
| avg_finish | integer | UNKNOWN | - |
| pick_test_success_rate | integer | UNKNOWN | - |
| loose_fit_count | integer | UNKNOWN | - |
| false_fit_count | integer | UNKNOWN | - |
| shape_versatility_count | integer | UNKNOWN | - |
| finish_count | integer | UNKNOWN | - |
| pick_test_count | integer | UNKNOWN | - |
| last_updated | text | UNKNOWN | - |

---

### feed_items

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| user_id | uuid | UNKNOWN | - |
| type | text | UNKNOWN | - |
| target_puzzle_id | nullable | YES | - |
| target_list_id | nullable | YES | - |
| target_review_id | nullable | YES | - |
| target_puzzle_log_id | nullable | YES | - |
| image_url | text | UNKNOWN | - |
| media_urls | jsonb | UNKNOWN | - |
| text | text | UNKNOWN | - |
| created_at | text | UNKNOWN | - |

**Relationships:**
- user_id → users.id
- target_puzzle_id → puzzles.id
- target_list_id → lists.id

---

### follows

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| follower_id | uuid | UNKNOWN | - |
| followed_user_id | uuid | UNKNOWN | - |
| created_at | text | UNKNOWN | - |

**Relationships:**
- follower_id → users.id
- followed_user_id → users.id

---

### likes

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| user_id | uuid | UNKNOWN | - |
| activity_id | uuid | UNKNOWN | - |
| activity_type | text | UNKNOWN | - |
| created_at | text | UNKNOWN | - |

**Relationships:**
- user_id → users.id

---

### comments

| Column | Type | Nullable | Default |
|--------|------|----------|----------|
| id | uuid | UNKNOWN | - |
| user_id | uuid | UNKNOWN | - |
| activity_id | uuid | UNKNOWN | - |
| activity_type | text | UNKNOWN | - |
| content | text | UNKNOWN | - |
| parent_comment_id | nullable | YES | - |
| created_at | text | UNKNOWN | - |
| updated_at | text | UNKNOWN | - |

**Relationships:**
- user_id → users.id
- parent_comment_id → comments.id

---

