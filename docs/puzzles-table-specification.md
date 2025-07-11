# Puzzles Table Specification

## Core Columns (Basic Information)

| Column | Type | Nullable | Description | Example |
|--------|------|----------|-------------|---------|
| `id` | uuid | NO | Primary key, auto-generated UUID | `f52e16fa-bddd-497c-aa31-2d881291cc93` |
| `title` | text | YES | Puzzle name/title | `"Neuschwanstein Castle"` |
| `brand_id` | uuid | YES | Foreign key to brands table | `d9903265-e3a3-45b8-b5fe-5c7d0360aa54` |
| `image_url` | text | YES | URL to puzzle cover image | `"https://images.unsplash.com/photo-1467..."` |
| `piece_count` | integer | YES | Number of puzzle pieces | `1000` |
| `material` | text | YES | Puzzle material composition | `"Cardboard"` |
| `year` | integer | YES | Year puzzle was published/released | `2023` |
| `theme` | text | YES | Puzzle theme/category | `"Architecture"` |
| `description` | text | YES | Detailed puzzle description | `"Beautiful castle in Bavaria, Germany..."` |
| `purchase_link` | text | YES | URL where puzzle can be purchased | `"https://www.amazon.com/dp/B08XYZ123"` |
| `uploader_id` | uuid | YES | Foreign key to users table (who added it) | `e484c62e-3f34-4a40-a32a-3eeae1a00e89` |
| `approval_status` | text | YES | Moderation status | `"approved"` |
| `created_at` | timestamptz | YES | Record creation timestamp | `"2025-07-03T11:56:00.596518+00:00"` |
| `updated_at` | timestamptz | YES | Last modification timestamp | `"2025-07-03T11:56:00.596518+00:00"` |

## Specification Columns (Physical Product Details)

| Column | Type | Nullable | Description | Example Values |
|--------|------|----------|-------------|----------------|
| `finished_size_width` | decimal(5,2) | YES | Completed puzzle width in inches | `27.00` |
| `finished_size_height` | decimal(5,2) | YES | Completed puzzle height in inches | `20.00` |
| `age_range_min` | integer | YES | Minimum recommended age in years | `12` |
| `age_range_max` | integer | YES | Maximum recommended age in years | `99` |
| `surface_finish` | text | YES | Puzzle surface finish type | `"Anti-glare Matte"` |
| `sku` | text | YES | Stock Keeping Unit / product code | `"D99-1000-F52E16"` |
| `included_items` | jsonb | YES | JSON array of items included in box | `["Premium puzzle pieces", "Full-color reference poster", ...]` |
| `key_features` | jsonb | YES | JSON array of key product features | `[{"title": "Precision Cut", "description": "Perfect interlocking pieces", "icon": "precision"}]` |
| `box_width` | decimal(5,2) | YES | Packaging box width in inches | `10.50` |
| `box_height` | decimal(5,2) | YES | Packaging box height in inches | `8.50` |
| `box_depth` | decimal(5,2) | YES | Packaging box depth in inches | `2.00` |
| `weight_grams` | integer | YES | Total product weight in grams | `800` |