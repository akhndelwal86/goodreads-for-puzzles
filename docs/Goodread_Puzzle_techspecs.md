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

- Advanced puzzle catalog and metadata search with discovery and
  filtering (by brand, tag, difficulty, size, etc.)

- Smart dynamic lists (recently added, most solved, highest rated,
  trending, leaderboard integrations)

- User stateful library (“My Puzzles”): integrates wishlist,
  owned/library, work in progress (WIP), completed, abandoned, with
  clear transitions (wishlist → library → WIP → completed/abandoned)

- Per-user puzzle logs: progress tracking, rich reviews and notes,
  uploading photo/video/media, logging sessions, tracking solve progress
  bar, difficulty, overall quality, fit, pick test, and more

- User stats and analytics: tracks solves, completion rates, time,
  favourite puzzles, streaks/badges, challenge participation

- Public/private user profiles: configurable privacy for lists and
  stats, rich profile (completed puzzles, library, favourite puzzles,
  follower/following stats, highlights)

- Following/social connections between users; notifications for relevant
  activity, wishlist alerts, and community activity

- Brand dashboard: for brands to upload their catalog in a specific
  format, see analytics on puzzle solves, reviews, top solvers, and
  performance

- Admin dashboard: moderation and approval of submitted/edited puzzles,
  logs, reviews, purchase links, user reports, transaction queue
  management, community/forum moderation, analytics/statistics, and
  workflow views for admin actions

- Puzzle events: event scheduler and infrastructure for tracking,
  joining, and participating in puzzle-centric events and contests

- Detailed puzzle detail page: aggregated user reviews and AI-derived
  highlights, rich photo/video gallery, purchase/buy links,
  social/completion stats, leaderboard glimpses, and meta-insights

- Community and forum infrastructure: thread/post model, rich media,
  robust moderation, puzzle-centric community features and club/groups,
  Q&A, search and tagging

- Lending/borrowing: infrastructure for lending/swapping puzzles between
  users with private chat, transactions, in-app logistics tracking,
  status states, and completion/rating system

- AI chat engine for natural-language puzzle discovery, recommendations,
  and aggregation of review insights (text analysis, leaderboards,
  profile suggestions)

- Robust notification system for state transitions (e.g., wishlist
  alert, lending request, challenge invites, community replies)

- Comprehensive analytics/reporting: user and brand dashboards, stats
  for admins and end-users, event and social reporting

- Phase 2: advanced collaborative solving (co-solving/group logging,
  joint event participation), group challenges, extended badges/rewards,
  marketplace extensions

### Platform/Technical Constraints

- Built with Next.js (React) and deployed on Vercel

- Supabase-managed Postgres database

- Integrates with AI/LLM service for NLP, summarization, recommendations

- Modern JS/TS codebase

- Robust cloud authentication and role management (Clerk, Auth0, or
  NextAuth.js)

- Supabase Storage (public/private media support)

- Optional: Instagram sharing, other social integrations

### Explicitly Out of Scope

- Marketplace/payments in-app (early phase)

- GDPR and advanced privacy compliance (early phase)

- Physical logistics for lending/borrowing (beyond basic messaging and
  status)

- Advanced physical puzzle replacement or fulfilment

------------------------------------------------------------------------

## System Architecture Overview

### Architecture Diagram

### Major Feature Flows

My Puzzles State Machine

- User can add puzzle to Wishlist

- From Wishlist → Library (if purchased/acquired)

- From Library → Work in Progress (user starts solving, logging
  progress)

- In Work in Progress:

  - User logs sessions: photo/video uploads, notes, progress bar, time
    spent, quality/difficulty fields, etc.

  - Can abandon (to Abandoned) or Complete (to Completed) at any time

- In Completed:

  - User can rate/review, upload more logs, edit details

- In Abandoned:

  - User can re-activate to WIP or move to Library

State transitions strictly controlled by UI and backend; logs and state
changes tracked in audit.

------------------------------------------------------------------------

## Component Breakdown

### Frontend

- Next.js (React), optimized for mobile and desktop

- UI for catalog/discovery, My Puzzles/library flows, community/forum,
  user and brand dashboards, detailed puzzle pages, and admin tools

- Media upload and presentation across logs, feed, profile, and forums

### Backend/API

- Next.js API (Node/Edge), business logic includes:

  - State machine for user library (wishlist, library, WIP, complete,
    abandoned)

  - Event scheduler/infra and logs

  - Brand and admin dashboard endpoints

  - Media and moderation

  - Leaderboard, analytics, and reporting services

  - AI recommendation and summarization integration

  - Lending/borrowing and messaging infra

### Database

- Supabase-managed Postgres

- Data model supports:

  - User puzzle state machine, per-user library

  - Rich logs/media/review tables

  - Brand, puzzle, review, and community models

  - Event storage and participation/tracking

  - Lending/borrowing (transactions, chat)

### Authentication

- Clerk.dev, Auth0, or NextAuth.js; role-based for admin, brand, user

### AI/LLM Service

- Summarizes reviews/meta, powers conversational search and
  recommendations, surfaces puzzle/community highlights

### Media Storage

- Supabase Storage, supports media per log/review/community

- Public/private controls, moderation, streaming support

------------------------------------------------------------------------

## Feature Implementation Map

### My Puzzles State Machine & User Library

- **Tables:** user_puzzle_states, tracks state per user-puzzle
  (wishlist, library, wip, complete, abandoned)

- **Transitions:** enforced by backend, with event logs

- **Progress Logging:** sub-table for puzzle logs (media, notes,
  progress %), tied to state (esp. WIP/Complete)

- **Analytics:** per user and aggregated across users

### User Stats/Logs & Profile Privacy

- Stats: total solved, in-progress, abandoned, streaks, badges

- Logs: per-solve progress, rich notes, media, review meta

- Profile: privacy toggles (public/private per stat/list/log),
  highlights on public page, favourites and lists

- Followers/following: tracked for social graph and discovery

### Public/Private Profiles

- Endpoint for public profile view (honours privacy settings)

- Stats: solves, streaks, favourites, completed, library size, recent
  activity

- Highlighted: star puzzles, rare achievements, group solves

### Brand Dashboard

- Brands register and manage their catalog:

  - Bulk upload/CSV and form tools

  - Track analytics—solves, top solvers, ratings, log coverage

  - Moderate/edit own product entries

  - Notifications for flagged issues, user messages

### Admin Dashboard

- Moderation: Queue for pending puzzles/logs/reviews, batch
  approve/flag, auto- and user-flag surfacing

- Stats: site-wide solves, user activity, review moderation, lending
  queue

- Workflow: analytics, transaction/event review, role management

### Smart Lists/Leaderboards & Discovery

- Dynamic lists: top solvers, most reviewed, latest solved, top rated,
  puzzle of the day, trending

- Filters: by all major dimensions (brand, tag, category, difficulty,
  date, social metric, etc.)

- API endpoints to fetch lists per filter

- Phase 2: group challenges, collaborative progress boards

### Puzzle Events

- Event scheduler: create/join upcoming events, manage entries, log
  event solves/progress

- Event/contest analytics: participation, completions, leaderboards

### Detailed Puzzle Page

- Gallery (rich media)

- Aggregated review meta (AI summarization)

- Stats: solved count, average time, top solvers, most common feedback
  meta-dimension

- Purchase/buy links (multiple, user- and brand-submitted, moderated)

- Social stats: completion, wishlist adds, in-progress, lending
  availability

### Community/Forum Infrastructure

- Forums: threads, posts, media, reply and upvote, search/tagging

- Clubs/Groups: multi-user spaces for collective solving, events, forums

- Moderation tools for admin and community leaders

### Lending/Borrowing Infrastructure

- Puzzle transaction records: offer/request states, handover/completion
  flows

- Chat/messaging between lender and borrower

- Lending history on profile

- Feedback/rating post-completion; reporting for disputes

### Notifications, Wishlist Alerts, Streaks/Badges

- Realtime in-app & email push for:

  - Wishlist (price drop, restock)

  - Lending/borrowing requests/status

  - Follower actions, comments, replies, challenge invites

  - Event reminders

  - Streak/badge unlocks

### Analytics/Reporting

- User analytics (solves, contributions, engagement, social graph)

- Brand analytics (puzzle performance, leaderboard, event impact)

- Admin analytics/reporting dashboard (site health, moderation, growth,
  active events/groups)

### Phase 2: Extended Collab/Social Infra

- Co-solving support and collaborative logs

- Group challenges/events

- Extended badge/achievement system

- Expanded lending/borrowing (marketplace, peer-tracking, advanced
  safety)

------------------------------------------------------------------------

## Data Model/Schema Outline

- users: id, display_name, email, avatar, privacy_setting, stats
  (derived), streaks, badges, followers/following

- brands: id, name, description, logo_url, analytics (solves, reviews)

- puzzles: id, brand_id, title, metadata..., image, status,
  purchase_links\[\]

- user_puzzle_states: id, user_id, puzzle_id, state (wishlist, library,
  wip, completed, abandoned), entered_at, exited_at

- puzzle_logs: id, user_id, puzzle_id, progress_pct, photo_url,
  video_url, notes, difficulty, quality, fit, pick_test, created_at

- reviews: id, user_id, puzzle_id, rating, text, meta_fields (loose_fit,
  shape_versatility, finish, etc.), created_at

- lists: id, user_id, name, type (custom/favourite/etc.)

- activity_feed: id, type, user_id, related_id, description, created_at

- purchase_links: id, puzzle_id, url, submitter_id, verified, status

- events: id, title, start_time, end_time, details, participants\[\],
  logs\[\], leaderboard

- forum_threads: id, topic, puzzle_id, group_id, created_by, created_at

- forum_posts: id, thread_id, user_id, body, media_url, created_at

- lending_transactions: id, lender_id, borrower_id, puzzle_id, status,
  chat_id, requested_at, completed_at, rating

- notifications: id, user_id, type, payload, read, created_at

------------------------------------------------------------------------

## API Endpoints (Representative)

- /api/puzzles: CRUD + filter

- /api/brands: CRUD + analytics + catalog upload

- /api/user-puzzle-states: manage state transitions (wishlist, library,
  etc.)

- /api/puzzle-logs: CRUD, progress log, media attachment

- /api/reviews: CRUD with meta and aggregation

- /api/lists: list and custom collection CRUD

- /api/activity-feed: timeline + media

- /api/purchase-links: manage links, verify

- /api/events: event scheduler, join/leave, log activity, view
  leaderboard

- /api/forum: thread/post CRUD, moderation

- /api/lending: offer/request/accept/complete lending, chat, transaction
  feedback

- /api/notifications: list, mark read

- /api/analytics: user, brand, admin reporting

------------------------------------------------------------------------

## Integration & Performance

- **Data seeding:** brands, puzzles, logs, profiles, events,
  lending/public transactions, forums.

- **Indexing:** per-puzzle, per-user, per-event for fast queries,
  analytics

- **Smart caches:** leaderboard and review meta, AI summaries, trending
  lists

- **Media pipeline:** automatic resizing, CDN, moderation queues

- **AI triggers:** summaries/UI refresh on inbound reviews

- **Scaling:** ready for wide adoption (DB, Storage, API horizontally
  scalable)

- **Moderation:** admin UX, spam/abuse detection, escalation triggers

------------------------------------------------------------------------

## Data Privacy & Security

- User privacy settings per profile/list/log

- Role-based actions for moderation, brand, admin

- Media privacy enforcement; flagged media routing

- PII minimization, email only stored for auth

- Automated moderation hooks for uploads and reviews

------------------------------------------------------------------------

## Performance & Scalability

- Indexes and materialized views for stats/leaders

- Fast filter/search across key domains (brand, state, tag)

- Optimized media serving (Supabase Storage + CDN)

- Distributed event processing (challenge/events, notifications)

- AI/LLM services with batching for aggregation and summary

------------------------------------------------------------------------

## Open Questions & Next Steps

- Finalize complex state transitions for “My Puzzles” flows and edge
  cases

- Confirm lending/borrowing logistics boundaries (in-app only or IRL)

- Profile privacy UI details and API param mapping

- Brand analytics/dashboard—audience and primary use cases

- AI pipeline load testing at scale (review meta, notifications)

- Event/challenge management (duration, recurring, joint logging)

- Deep dive on group solving and advanced community infra (phase 2+)

------------------------------------------------------------------------
