# Goodreads for Jigsaw Puzzles – Database Schema (v1, Updated)

## Purpose & Scope

This document provides a scalable, modular, and extensible database
schema blueprint for v1 of the Goodreads for Jigsaw Puzzles platform. It
is designed for long-term flexibility while enabling a fast, focused v1
launch. The structure supports user-generated content, basic social
features, activity feeds, advanced metadata, media logging, browsing by
brand, and future expansion for AI, e-commerce, moderation, and
community modules.

------------------------------------------------------------------------

## Core Tables

### Users

- id (UUID, PK)

- username

- email

- avatar_url

- bio

- created_at

- ... (authentication, OAuth, preferences)

------------------------------------------------------------------------

### Brands

- id (UUID, PK)

- name

- description

- image_url

- website_url

- created_at

------------------------------------------------------------------------

### Puzzles

- id (UUID, PK)

- title

- brand_id (FK to Brands)

- image_url

- piece_count

- material

- year

- theme

- description

- purchase_link (nullable, crowdsource/overwrite allowed)

- uploader_id (FK to Users; supports user or brand uploads)

- approval_status (enum: pending, approved, rejected)

- created_at

- updated_at

------------------------------------------------------------------------

### Lists

- id (UUID, PK)

- user_id (FK to Users)

- name (e.g., "Want to Solve", "Solved", custom)

- description

- created_at

- type (enum: standard, custom, etc.)

------------------------------------------------------------------------

### ListItems

- id (UUID, PK)

- list_id (FK to Lists)

- puzzle_id (FK to Puzzles)

- added_at

------------------------------------------------------------------------

### Reviews

- id (UUID, PK)

- user_id (FK to Users)

- puzzle_id (FK to Puzzles)

- rating (1–5)

- review_text

- loose_fit (1–5 int, nullable)

- loose_fit_explanation (string, nullable)

- false_fit (1–5 int, nullable)

- false_fit_explanation

- shape_versatility (1–5 int, nullable)

- shape_versatility_explanation

- finish (1–5 int, nullable)

- finish_explanation

- pick_test (boolean: true/false, nullable)

- pick_test_explanation

- other_metadata_notes

- created_at

------------------------------------------------------------------------

### PuzzleLogs

Records a user logging a puzzle they've completed, with media.

- id (UUID, PK)

- user_id (FK to Users)

- puzzle_id (FK to Puzzles)

- solve_time_seconds (nullable)

- note (nullable)

- photo_urls (JSON array of image URIs)

- video_urls (JSON array of video URIs)

- logged_at

------------------------------------------------------------------------

### Tags

- id (UUID, PK)

- name

- type

- created_at

------------------------------------------------------------------------

### PuzzleTags

- id (UUID, PK)

- puzzle_id (FK to Puzzles)

- tag_id (FK to Tags)

- created_at

------------------------------------------------------------------------

### Follows

- id (UUID, PK)

- follower_id (FK to Users)

- followed_user_id (FK to Users)

- created_at

------------------------------------------------------------------------

### FeedItems

- id (UUID, PK)

- user_id (FK to Users)

- type (enum: review, solved, add_to_list, puzzle_upload,
  added_purchase_link, etc.)

- target_puzzle_id (nullable, FK to Puzzles)

- target_list_id (nullable, FK to Lists)

- target_review_id (nullable, FK to Reviews)

- target_puzzle_log_id (nullable, FK to PuzzleLogs)

- image_url (nullable, primary display image/media attached to action)

- media_urls (nullable, JSON array for multiple media)

- text (nullable, activity text/description)

- created_at

------------------------------------------------------------------------

## Computed/Materialized Fields (for Puzzle Details)

- solve_count (number of users who have solved/logged this puzzle)

- want_to_solve_count

- want_to_buy_count

- avg_solve_time_seconds, median_solve_time_seconds

- solved_user_ids (for efficient aggregate queries)

- AI-aggregated review metadata summaries (precomputed or on-demand,
  e.g., “Common issues: false fits”)

(These can be materialized views or denormalized summary fields for
performance.)

------------------------------------------------------------------------

## Relationship Diagram (ASCII)

**Legend:**

- \[A\]---\<owns\>---\[B\]: Table A "owns" or is parent of Table B
  (one-to-many)

- \[A\]---\<by\>---\[B\]: Reference to Brands from Puzzles

- \[A\]---\<contains\>---\[B\]: List contains ListItems

- \[A\]---\<ref\>---\[B\]: Reference via foreign key

- \[A\]---\<activity\>---\[B\]: Triggers activity/event (Feed)

- \[A\]---\[B\]: General join, association, or reference

------------------------------------------------------------------------

## Extensibility/Scalability Notes

- **Brand Browsing:** Brands are now top-level; puzzles reference them,
  queries support /brands/:brand_id/puzzles for discoverability.

- **Puzzle Logging & Media:** Users log solves, upload media, provide
  time and notes—building a rich, visually-driven personal history and
  detailed puzzle timelines.

- **User-Uploaded Puzzles:** The uploader is tracked (user or brand);
  puzzles require approval/moderation for catalog quality.

- **Purchase Links:** Any puzzle can have a crowdsource-editable
  purchase link, supporting viral/commercial growth.

- **Review Metadata:** Fine-grained review fields and explanations
  facilitate community calibration, robust AI summarization, and
  trust-building content.

- **Aggregated Puzzle Stats:** Designed for high-performance puzzle
  detail pages and insights into community behavior.

- **Feed as Social Canvas:** FeedItems table can now link to media/logs,
  supporting richer activity visuals and engagement.

------------------------------------------------------------------------

## v2 / Community & Forums (Roadmap)

- Plan to add tables: ForumThreads, ForumMessages, ThreadParticipants,
  with references back to Users, Puzzles, and Brands for topic linkage
  and context-driven engagement.

------------------------------------------------------------------------

## Next Steps/Usage

- **Engineering Implementation:** Use this schema as the contract for
  API/backend services and rapid prototyping with Postgres (Supabase
  supported; schema 1:1 compatible).

- **Design/AI Handoff:** Share these tables and relationships with
  UI/UX, engineers, and gen AI tools for automated code/UI generation.

- **Seeds & Testing:** Populate Brands, Puzzles, Users, etc., early for
  meaningful journeys and easy QA.

- **Performance:** Review and tune indexes, keys, and computed views as
  scale and data volume increases—schema ready for large-scale querying.

- **Team Onboarding:** This is the centralized blueprint for all new
  product, design, and engineering contributors.

------------------------------------------------------------------------
