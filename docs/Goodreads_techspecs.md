# Goodreads for Jigsaw Puzzles – Tech/Engineering Spec

## Project Overview

A social platform and comprehensive catalog for jigsaw puzzle lovers,
enabling users to discover, catalog, and track puzzles, connect with the
puzzle community, and receive advanced AI-powered puzzle recommendations
through conversational search. The app is mobile-first, data-driven, and
community-centric, prioritizing an accessible, delightful experience for
casual puzzlers and enthusiasts alike.

------------------------------------------------------------------------

## Key Requirements & Assumptions

### Essential Requirements

- Mobile-first responsive design

- Supabase-managed Postgres database for structured, relational storage
  and rapid prototyping

- Rich, real-time puzzle catalog and metadata search

- Smart lists (most solved, most bought, trending)

- Category/tag-based navigation, filtering, and now **brand/manufacturer
  browsing**

- User profiles with puzzle lists and activity tracking

- Community features: reviews, granular ratings (now including loose
  fit, false fit, shape versatility, finish, pick test, etc.), activity
  feed with support for rich media uploads

- AI chat engine for natural-language puzzle discovery, recommendations,
  and aggregation of review insights (e.g., "puzzles with good pick
  test")

- User puzzle logging: log completed puzzles with photo, video, solve
  time, notes

- Users can upload new puzzles (with moderation workflow and brand
  assignment)

- Anyone can add or edit purchase/buy links to any puzzle (existing or
  new)

- Enhanced puzzle detail pages: show number of “want to solve/buy/list”,
  solved count, average time, AI-generated review summaries (from new
  metadata fields)

- Feed must display puzzle log images

- Homepage must feature “Log Your Puzzle” as a primary CTA alongside
  puzzle discovery

- Supabase Storage for image and video asset management with integration
  to feed, detail, and profile pages

- v2/Community: Discussion forums, puzzle Q&A, and open social forum
  infrastructure

### Platform/Technical Constraints

- Built with Next.js (React) and deployed on Vercel

- Supabase-managed Postgres database (for development, seeding, MVP, and
  rapid iteration)

- Integrates with AI/LLM service like OpenAI API

- Modern JS/TS codebase

- Authentication via a reliable third party (Clerk, Auth0, or
  NextAuth.js)

- Supabase Storage for user-uploaded media; supports privacy and
  moderation

- Optional: Instagram sharing, additional integrations for social

### Explicitly Out of Scope

- GDPR and advanced privacy compliance (for early-stage build)

- In-platform marketplace (no payments, no direct e-commerce)

- Advanced gamification or badge systems

------------------------------------------------------------------------

## System Architecture Overview

### Architecture Diagram

### Flow Example: Log & Discover Puzzles with Social Data

1.  User logs a puzzle (uploads photos, enter solve time, review with
    new metadata).

2.  API accepts log, stores file in Supabase Storage, logs in user
    activity feed.

3.  Puzzle detail page aggregates all logs: “50 users have solved,” “Avg
    time: 3h20m,” “Most frequent: good fit.”

4.  AI surfaces summary text in puzzle details from review metadata
    (e.g., “Users say this puzzle has high shape versatility.”).

5.  Other users can browse by brand, view by activity, or use
    conversational chat for advanced queries.

6.  Feed entries (with photo, time) are rendered in real time.

### Component Breakdown

- **Frontend:** Next.js (React) app, responsive/mobile-first.

- **Backend/API:** Next.js API routes/server actions (Node/Edge),
  business logic includes moderation, brand listings, stats
  aggregations, review AI insights, and media meta management.

- **Database:** Supabase-managed Postgres (for development, seeding,
  MVP; future migration to any hosted Postgres as needed), includes
  brands, puzzle logs/media, advanced review fields.

- **Authentication:** Clerk.dev, Auth0, or NextAuth.js.

- **AI/LLM Service:** OpenAI or equivalent API (for chat,
  recommendations, review metadata summarization).

- **Media Storage:** Supabase Storage for images, videos, uploaded
  content (public/private controls, moderation workflow).

- **Integrations:** Instagram (deep link/web intent), planned community
  forums (v2).

------------------------------------------------------------------------

## Feature Implementation Map

### Puzzle Catalog & Browsing

- Catalog supports browsing/filtering by brand/manufacturer.

- Brand table with relationships to puzzles; indexed for fast querying.

- “Browse by brand” journeys and endpoints.

### User Puzzle Logs

- Users can log puzzles: upload photos, videos, time taken,
  comments/notes.

- Support multi-media upload via Supabase Storage.

- “Puzzle Log” table links user, puzzle, media assets, time, notes, and
  log date.

- Logs shown in puzzle details, activity feed, and user profile.

### Puzzle Upload by Users

- Authenticated users submit new puzzles to the catalog.

- Submission form collects image, all puzzle metadata (incl. brand
  selection), optional purchase link.

- Moderation workflow: mark uploaded puzzle as “pending review” until
  approved by admin.

### Purchase/Buy Links

- Any user can submit or edit a purchase link for any puzzle (existing
  or new).

- Editable field in puzzle edit and upload forms.

- API supports PATCH/POST for purchase_link modifications; backend
  records updated_by and moderation if needed.

### Enhanced Puzzle Detail Pages

- Aggregate stats per puzzle:

  - Number added to “want to solve/buy list”, solved count, average
    solve time.

  - “How many people have solved this” (count unique puzzle logs marked
    as completed).

  - AI-powered summaries of review metadata (e.g., “Most users found
    this puzzle had a loose fit…”).

- Display all uploaded images (gallery), statistics, latest logs with
  images.

### Advanced Review Metadata

- Granular fields in reviews: loose fit (scale), false fit (scale),
  shape versatility, finish, pick test, etc.

- Backend aggregates these ratings for summary stats.

- AI models analyze text reviews and metadata for composite “consensus
  statements.”

- Review form allows structured entry for these fields.

### Activity Feed Improvements

- Feed displays puzzle logs (with photos/video).

- "User X just finished \[Puzzle Name\]!" with their upload/photo and
  solve stats.

- Filtering by brands, tags, users.

- Media in feed routed through Supabase Storage (with privacy control).

### Homepage & Navigation

- Homepage sectioned for:

  - “Log your puzzle” (primary CTA)

  - “Find your next puzzle” (conversational AI/search)

  - “Browse by brand” and top trending

- Navigation integrates logs, browsing, and discovery actions.

### Community/Forum (v2/Next Phase)

- Forum/discussion board tables and endpoints; associated with puzzles,
  tags, topics.

- User thread creation, replies, upvotes, moderation system.

- Integration with user profiles and global search.

- Optional Q&A format.

------------------------------------------------------------------------

## Core Integrations

### Supabase-Managed Postgres Database

- Schema includes: users, puzzles, brands, reviews, logs (media + solve
  data), activity feed, lists, stats, forum tables (v2).

- Supabase as primary dev/QA/prod DB for all tools (Bolt, Cursor, dev
  environments).

- Data migration = SQL export/import if moving to another Postgres
  provider.

### Supabase Storage

- Media (photo/video) assets for logs, profiles, uploads.

- Secure access, privacy control, robust API and admin interface.

- Media used in activity feed, puzzle detail, and user profile.

- Optional: moderation review queue for inappropriate uploads.

### AI/LLM Service

- OpenAI API (or equivalent) for recommendations and aggregation of
  review metadata.

- AI-powered “summary statements” on puzzle pages from review data.

- Chat-driven discovery and advanced search features.

### Authentication

- Clerk.dev, Auth0, or NextAuth.js with role-based permissions for
  admin/editor/moderation actions.

------------------------------------------------------------------------

## Deployment & Environments

- Vercel hosting workflow: GitHub actions/CI, preview/staging/prod

- Supabase dashboard manages separate dev/staging/prod DB and storage

- Secrets managed in Vercel

- Monitoring (Vercel/Sentry) for errors/performance

------------------------------------------------------------------------

## Data Model/Schema Outline

- **users:** id, display_name, email, avatar_url

- **brands:** id, name, description, logo_url

- **puzzles:** id, brand_id, title, metadata..., image, created_by,
  status, purchase_link

- **puzzle_logs:** id, user_id, puzzle_id, photo_url, video_url,
  time_taken, notes, created_at

- **lists:** id, user_id, name, type (“want to solve”, “solved”, etc.)

- **list_items:** id, list_id, puzzle_id, added_at

- **reviews:** id, user_id, puzzle_id, rating, text, loose_fit,
  false_fit, shape_versatility, finish, pick_test, created_at

- **activity_feed:** id, type, user_id, puzzle_id, photo_url (if log),
  description, created_at

- **purchase_links:** id, puzzle_id, url, user_id, status

- **admin/moderation:** id, target (puzzle, log, review, link), status

- **forum_topics (v2):** id, user_id, title, body, created_at, puzzle_id

- **forum_comments (v2):** id, topic_id, user_id, body, created_at

------------------------------------------------------------------------

## API Endpoints (Representative)

- /api/puzzles: GET (filters incl. brand), POST (new puzzle
  \[moderated\]), PATCH (edit puzzle)

- /api/brands: GET (list brands), GET/:id, POST (admin)

- /api/puzzle-logs: POST (log puzzle \[photo, video, time\]), GET (by
  puzzle/user)

- /api/reviews: POST (with advanced fields), GET (aggregated stats)

- /api/purchase-links: POST, PATCH

- /api/activity-feed: GET (with media), filtered query support

- /api/ai/reco: POST (chat-based prompt → puzzle results)

- /api/forum (v2): CRUD endpoints for topics, comments

------------------------------------------------------------------------

## Integration & Performance

- **Data seeding:** Populate with seed data including brands, sample
  puzzles, logs, reviews, lists.

- **Indexing:** Brands, search fields, puzzle stats for fast discovery

- **Bulk aggregations:** Use Postgres functions or materialized views
  for average/total stats per puzzle and AI summary generation triggers

- **Scaling:** Supabase Storage for media, Postgres for
  aggregation—ready for 10k+ DAU with reasonable scaling.

- **Moderation:** Admin flows for reviewing uploaded puzzles, images,
  purchase links.

------------------------------------------------------------------------

## Data Privacy & Security

- Minimal PII: Only username, email.

- Photos/Videos: Privacy options per user, default public for logged
  puzzle images.

- Role-based permissions for uploads, moderation, and editing of
  purchase links/logs.

- Automated moderation hooks for image/video uploads.

------------------------------------------------------------------------

## Performance & Scalability

- Indexes on puzzles, brands, logs, and feed tables.

- Query optimization for real-time aggregations and smart lists.

- Media resizing, CDN distribution via Supabase Storage for fast
  image/video render.

- AI inferences cached for popular puzzles/details.

------------------------------------------------------------------------

## Open Questions & Next Steps

- Finalize moderation workflow (manual, AI-assisted, or hybrid for
  uploads/logs).

- Confirm storage bucket privacy policies.

- Evaluate community/forum solution architecture (internal vs
  external/discourse).

- Revisit AI pipeline for live review meta summarization.

- Instrument analytics for CTA usage (homepage, “log your puzzle”).

- Ongoing: Review database schema as features iterate.

------------------------------------------------------------------------
