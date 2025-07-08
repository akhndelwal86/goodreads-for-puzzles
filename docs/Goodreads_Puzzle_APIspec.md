# Jigsaw Puzzles Platform – API Spec (Massively Revised v2+)

## Purpose & Overview

This API spec enables a fully modern, social, and community-driven
jigsaw puzzle platform. It supports the My Puzzles state machine, user
and profile stats/logging (with privacy), rich reviews and media,
brand/admin dashboards, advanced discovery, smart lists, events,
community/forum, collaborative solving, lending/borrowing,
notifications, and more. Designed for deep integration with both
interfaces and AI/builder tooling.

------------------------------------------------------------------------

## Auth & Conventions

- **Authentication:** All personal endpoints require JWT/session auth.
  Admin/Brand features require elevated roles.

- **Route Prefix:** /api/

- **Pagination:** ?page=X&limit=Y

- **Filtering/Sorting:** As described per-endpoint.

- **Error Handling:** Standardized error envelope with HTTP status codes
  and reasons.

- **Rate Limiting:** Per-user for heavy endpoints (e.g., AI search,
  media upload).

------------------------------------------------------------------------

## My Puzzles State Machine Endpoints

### GET /api/users/:user_id/my-puzzles

- **Description:** Get user’s entire puzzle library, grouped by state:

  - wishlist, library, work_in_progress, completed, abandoned

- **Query:** state, search, sort, page, limit

- **Returns:** List of puzzles with state, last updated, percent
  complete, etc.

### POST /api/my-puzzles/:puzzle_id/transition

- **Description:** Move a puzzle between user states (e.g.,
  wishlist→library, library→work_in_progress, etc.)

- **Body:** to_state, optional: note

- **Returns:** Updated entry with new state, timestamp, transitions log.

### POST /api/my-puzzles/:puzzle_id/log

- **Description:** Log progress on a puzzle in “work_in_progress” (or
  update progress after completion/abandon).

- **Body:**

  - progress_percent (0-100)

  - notes (rich text)

  - media (array of uploaded IDs)

  - difficulty, fit_quality, pick_test, time_spent (optional stats)

- **Returns:** Log entry.

### POST /api/my-puzzles/:puzzle_id/media

- **Description:** Upload a photo/video for puzzle progress, review, or
  completed gallery.

- **Body:** Media file(s), type (progress/review/completion)

- **Returns:** Media metadata object(s).

------------------------------------------------------------------------

## Review, Rating & Meta Endpoints

### POST /api/puzzles/:puzzle_id/reviews

- **Description:** Add/edit user review. One per user per puzzle;
  editable after completion.

- **Body:**

  - rating (1–5), difficulty, fit_quality, pick_test, review (rich
    text), media (link existing upload)

- **Returns:** Review object.

### PATCH /api/reviews/:review_id

- **Description:** Edit review.

- **Body:** Same fields as create.

- **Returns:** Updated review object.

### GET /api/reviews/:review_id

- **Description:** Fetch review with meta and media.

- **Returns:** Review object with media, progress logs, etc.

### GET /api/puzzles/:puzzle_id/reviews

- **Description:** Paginated reviews with meta-aggregation:

  - Breakdowns: avg difficulty, fit, time-to-complete, pros/cons, graphs

  - AI-generated highlights summary (/ai-aggregate)

- **Returns:** Reviews array and meta summary.

------------------------------------------------------------------------

## User Profile APIs

### GET /api/users/:user_id

- **Description:** Public profile: stats, highlights, achievements,
  badges, puzzle stats, favourite puzzles, library, completed,
  followers/following count, profile privacy flags.

- **Returns:** Profile object, with configurable public-private
  sections.

### PATCH /api/users/:user_id

- **Description:** Edit own profile, including privacy settings.

- **Body:** Editable fields (bio, avatar, privacy toggles, highlights,
  featured puzzles, etc.)

- **Returns:** Updated profile object.

### GET /api/users/:user_id/stats

- **Description:** Lifetime stats: puzzles solved, time spent, solve
  streaks, most difficult, most logged, etc.

### GET /api/users/:user_id/activity

- **Description:** Sorted list of logs: logs, reviews, transitions,
  forum posts, lending/borrowing.

------------------------------------------------------------------------

## Profile Social Features

### POST /api/users/:user_id/follow

- **Description:** Follow another user.

- **Returns:** Success.

### DELETE /api/users/:user_id/follow

- **Description:** Unfollow.

### GET /api/users/:user_id/followers

- **Description:** Paginated list of followers.

### GET /api/users/:user_id/following

- **Description:** Paginated list of followed users.

### POST /api/users/:user_id/favourite

- **Description:** Mark/unmark a user’s profile or puzzle as
  "favourite".

------------------------------------------------------------------------

## Brand Dashboard APIs

### POST /api/brands/:brand_id/catalog-upload

- **Description:** Upload puzzle catalog (file, form, or API-driven).
  Batched parsing/validation.

- **Body:** File (CSV, Excel, JSON) or structured catalog object.

- **Returns:** Catalog batch status.

### PATCH /api/brands/:brand_id/puzzles/:puzzle_id

- **Description:** Brands edit their puzzles (metadata, images, buy
  links, etc.)

### GET /api/brands/:brand_id/analytics

- **Description:** Analytics for brand: most added to wishlist/library,
  user rating trends, completions, click stats.

------------------------------------------------------------------------

## Admin API Endpoints

### GET /api/admin/moderation/queue

- **Description:** List of puzzles/reviews/forum posts/media awaiting
  moderation.

### POST /api/admin/moderation/bulk-approve

- **Body:** Array of IDs to approve/reject.

### DELETE /api/admin/puzzles/:puzzle_id

- **Description:** Remove/restore any uploaded puzzle.

### POST /api/admin/trigger-workflow

- **Description:** Special workflow actions (e.g., feature puzzle,
  highlight event).

### GET /api/admin/stats

- **Description:** Top-level stats (growth, abuse, engagement, flagged
  content).

------------------------------------------------------------------------

## Dynamic Smart Lists, Leaderboards, and Discovery

### GET /api/smart-lists

- **Description:** Fetch dynamic lists, e.g.:

  - “Recently Added”, “Most Completed”, “Highest Rated”, “Most
    Wishlisted”, “Rare Finds”, “Streak Leaders”, “Local Lending Stars”,
    etc.

### GET /api/leaderboards

- **Description:** Fetch leaderboards for various dimensions:

  - solves by week/brand/category, “puzzle of the day” solvers, longest
    streaks, user engagement.

### GET /api/discover

- **Description:** Advanced search API, supports full facet filtering:

  - brand, tag, category, size, piece_count, difficulty, price, new
    arrivals, trending, AI query, etc.

------------------------------------------------------------------------

## Events Endpoints

### POST /api/events

- **Description:** Create puzzle event (admin/brand/user).

- **Body:** Name, description, event type, eligible puzzles, prizes,
  schedule.

### GET /api/events

- **Description:** List upcoming and past events.

### GET /api/events/:event_id

- **Description:** Fetch event details, participating users,
  leaderboard, chat (if available).

### POST /api/events/:event_id/join

- **Description:** Register/join event.

### POST /api/events/:event_id/submit-result

- **Description:** Submit event result (e.g., time, media proof, notes).

------------------------------------------------------------------------

## Puzzle Details, Review Meta, AI Aggregates

### GET /api/puzzles/:puzzle_id

- **Description:** Fetch detailed puzzle info.

- **Returns:** Full metadata, brand, buy links, average user stats,
  gallery, reviews, aggregated verdicts (“Best For”, “Most
  Challenging”), user progress logs, and AI-generated review summary.

### GET /api/puzzles/:puzzle_id/gallery

- **Description:** Get all user/brand/media images/videos for a puzzle.

### GET /api/puzzles/:puzzle_id/purchase-links

- **Description:** Get all validated buy links (brand/user submitted,
  affiliate info, live price/stock if feasible).

------------------------------------------------------------------------

## Community & Forum Endpoints

### GET /api/community

- **Description:** Top-level community navigation: forums, subforums,
  featured topics, trending threads.

### GET /api/community/forums

- **Description:** List all forums/subforums (by topic, puzzle, brand,
  “help”, “off-topic”, etc.)

### GET /api/community/threads

- **Description:** List threads, filter (by puzzle, tag, popularity,
  activity, user).

### POST /api/community/threads

- **Description:** Create thread (title, body, puzzle, tags).

### GET /api/community/threads/:thread_id

- **Description:** Fetch thread with paginated posts, rich media,
  reactions, moderation status.

### POST /api/community/threads/:thread_id/posts

- **Description:** Reply to a thread.

### PATCH /api/community/posts/:post_id

- **Description:** Edit post (owner or mod).

### DELETE /api/community/posts/:post_id

- **Description:** Remove post (owner or mod/admin).

### POST /api/community/report

- **Description:** Report thread/post for moderation.

------------------------------------------------------------------------

## Puzzle Lending/Borrowing APIs

### GET /api/lending/listings

- **Description:** Browse puzzles available for lending/borrowing,
  filter by location, puzzle, user.

### POST /api/lending/listings

- **Description:** Offer a puzzle for lending.

### POST /api/lending/requests

- **Description:** Request to borrow a puzzle.

- **Body:** Puzzle, duration, notes.

### GET /api/lending/my-requests

- **Description:** See user’s open/active lending requests.

### PATCH /api/lending/requests/:request_id

- **Description:** Update request (accept, reject, mark as in-progress,
  complete).

### POST /api/lending/chat/:listing_id

- **Description:** Messaging related to a lending transaction.

------------------------------------------------------------------------

## Notifications, Streaks & Challenges, Collaboration

### GET /api/notifications

- **Description:** User’s notifications: solves by friends, challenge
  invites/wins, moderation actions, lending/borrowing updates.

### POST /api/challenges

- **Description:** Create/join user or brand challenge.

### GET /api/challenges

- **Description:** List active and past challenges.

### POST /api/my-puzzles/:puzzle_id/collaborators

- **Description:** Invite or manage collaborators/family to log/journal
  on a puzzle (co-op modes).

------------------------------------------------------------------------

## AI-Assisted Discovery & Tools

### POST /api/ai/query

- **Description:** Submit a discovery or recommendation query (natural
  language).

- **Body:** Query text, context, user

- **Returns:** Puzzle recs, smart lists, or next actions.

### GET /api/ai/highlights/:puzzle_id

- **Description:** Fetch AI-generated highlights, summaries, reviews
  meta for puzzle detail page.

------------------------------------------------------------------------

## General Error & Envelope

- **Consistent error envelope:**

  - code, status, message, details

- **Sample:**

------------------------------------------------------------------------

*End of API Spec (v2+)*
