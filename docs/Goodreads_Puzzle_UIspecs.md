# Goodreads for Jigsaw Puzzles – UI/Design Spec (Updated)

## UI Library & Design Foundation

- **Design Style:** Modern, minimalist, high-impact. Emphasizes visual
  storytelling with clean layouts, generous whitespace, accessible
  navigation. Secondary motif around Brands/Manufacturers for navigation
  and cataloging.

- **Color Palette:** Neutral backgrounds, bold accent colors for
  highlights (electric blue or emerald), strong use of brand colors for
  brand pages/components.

- **Typography:** Geometric sans-serif (Inter/Neue Haas Grotesk), clear
  hierarchy, ample spacing, large readable headings.

- **Mobile-First:** All screens/components fully responsive; intuitive
  gestures/tap targets prioritized.

- **Aesthetic Standards:** Uncluttered, tactile; smooth transitions,
  visually “snappy” grid interactions, consistent UI atoms/components.

- **Accessibility:** Meets/exceeds WCAG AA+. Alt text, high contrast,
  full keyboard navigation, labeled forms/media, completely accessible
  interactive elements.

------------------------------------------------------------------------

## Purpose & Scope

**Purpose:**  
Deliver a detailed, actionable blueprint for a visually leading
“Goodreads for Jigsaw Puzzles,” focusing on puzzle discovery, logging
(with rich media), user and brand engagement, community, and stateful
puzzle journeys.

**Scope:**

- Home/Explore (brand, smart lists, activity, CTAs)

- My Puzzles page (wishlist, library, WIP, completed, abandoned – with
  state transitions, stats, logs)

- Dynamic Profile (public/private toggles, stats, lists, highlights,
  privacy controls)

- Brand Dashboard (catalog uploads, import templates, analytics, brand
  components)

- Admin Dashboard (moderation, approval, workflow, history, filtering)

- Puzzle Search, Results, & Rich Detail Pages (AI meta, reviews,
  logging, stats, buy links)

- Activity Feed

- Smart Lists, Leaderboards, Filtering/Discovery

- Events Module/Page (calendar, leaderboard, results)

- Community/Forum (threads, groups, media, lending/borrowing)

- Notifications/Alerts & Onboarding flows

- All primary and edge states

------------------------------------------------------------------------

## Core Journeys & UX Flows

### Home / Explore

- **Main Banner:** Split hero with dual CTAs:

  - **Find Your Next Puzzle:** Central search or discovery chat,
    featured prompts, brand/genre quick explore.

  - **Log Your Puzzle:** Equally prominent button, floating/add on
    mobile, persistent throughout navigation.

- **Puzzle of the Day:** Large, visual, with quick actions (add to
  wishlist, mark as started, log solve).

- **Smart Lists:** Horizontally scrolling carousels—Recently Added, Most
  Solved, Highest Rated, Top Wishlist, Editor’s Pick, Themed/Trending.

- **Leaderboards:** Snippet view highlighting top solvers, fastest
  times, most reviews, etc.; “see full leaderboard” CTA.

- **Activity Feed Preview:** Latest user actions (logs, reviews,
  wishlist adds), rich media, dynamic and engaging.

- **Discovery/Recent Explorer:** Section for exploring by category,
  brand, tags, piece count, size, difficulty—quick filter chips and deep
  links.

------------------------------------------------------------------------

### My Puzzles

- **Tabs/Sections:**

  - **Wishlist** (Want to buy)

  - **Library** (Owned)

  - **Work in Progress** (WIP)

  - **Completed**

  - **Abandoned**

- **Transitions:** Visual (drag/drop between sections), or prominent
  CTAs (e.g., “Buy Now,” “Start Puzzle,” “Mark as Complete,” “Abandon
  Puzzle,” “Resume”).

- **Stats & Log UIs:**

  - **Progress Bar/Timeline:** Visualizes solve percentage, time,
    photos/media at each step.

  - **Detailed Log:** Structured journal supporting text entries, upload
    of photos/videos, star & meta ratings (difficulty, fit, quality,
    pick test, completion experience, etc.).

  - **Review/Edit/Notes:** Editable logs on complete, with ability to
    update notes/media.

  - **State Machine Display:** Visualizes allowed transitions/next
    action for each puzzle.

- **Bulk Actions:** Multi-select puzzles, batch move (e.g., mark several
  as abandoned), bulk log media, batch rating/review.

- **Edge States:** Empty lists (encourage discover), “No progress yet?”
  for WIP, calls to action for each state.

------------------------------------------------------------------------

### Profile (User)

- **Public/Private Toggle:** Simple, clear privacy controls at section
  and overall profile level.

- **Headers/Stats:** Avatar, username, total puzzles solved, in
  progress, wishlist count, library size, badges/achievements,
  followers/following.

- **Favorites/Highlights:** “Favorite Puzzles” carousel/grid, pin
  favorite log(s), display “Most Rated,” “Fastest Solves.”

- **Visibility Controls:** Manage what is public/private (media,
  reviews, completed puzzles, stats, lists).

- **Lists:** Easily view public lists (wishlist, library, completed),
  with toggle for private-only viewing.

- **Profile Actions:** Edit, share, follow, privacy settings
  (modal/slide-out drawer).

------------------------------------------------------------------------

### Brand Dashboard

- **Nav Entry:** Global nav for “Brand Dashboard” for logged-in brands;
  accessible only to verified brands/partners.

- **Upload Flow:** Clean UI to bulk-upload puzzles via template;
  drag-and-drop file import, CSV/Excel support with mapping.

- **Catalog Grid:** Branded grid, with live status (approved, pending,
  rejected), filter/sort, quick edit for entries.

- **Analytics:** Visuals for trending puzzles, recent solvers, top-rated
  puzzles, times solved, wishlist adds, clicks on buy links.

- **Branding Components:** Upload/manage brand logo, banner, colors;
  instant preview of how branding appears across site.

- **Brand Profile Callouts:** Followers, social stats, notifications for
  puzzle approvals or needed edits.

- **Edge/Assistance:** Issues with upload/template highlighted; bulk
  status change/approval; context help/easy support link.

------------------------------------------------------------------------

### Admin Dashboard

- **Moderation Interface:** Queue view for new uploads (by brand and by
  users), clear status indicator, media preview, approve/reject/archive
  actions.

- **Action History:** Track all admin actions (approval, rejection,
  edits); granular filtering by puzzle, user, brand, status.

- **Filters & Search:** By state (pending/approved/rejected), uploader,
  reported issues, flagged for review, meta.

- **Workflow:** Bulk actions for review/approval, flag for secondary
  review, escalation.

- **UI Patterns:** Clean, low visual noise; affordances for quick hover
  previews, inline actions, smart suggestions.

- **Edge Cases:** Duplicates, ambiguous meta, brand conflict—flag and
  present resolution UI.

------------------------------------------------------------------------

### Puzzle Search, Browsing & Discovery

- **Persistent Filters:** Browse by brand, tag, category, size, piece
  count, difficulty, timeframe, popularity; collapsible “deep filters”
  side panel.

- **Smart Lists:** Accessible via nav/suggested sections; e.g., Recently
  Added, Most Solved, Highest Rated, Rarest, “On Fire.”

- **Leaderboards:** Drill-downs by user, by puzzle, by brand; sortable
  dimensions (solve speed, ratings given, unique puzzles, etc.).

- **Results List/Grid:** Puzzle cards with key stats, quick actions,
  thumbnail image/video, single-tap “Add to
  Wishlist/Library/WIP/Completed/Abandoned.”

------------------------------------------------------------------------

### Puzzle Detail Page

- **Media Gallery:** High-res images/videos, media slider, lightbox,
  upload/view all logs.

- **Meta Section:** Title, Brand+logo, piece count, tags, difficulty,
  core stats.

- **Review Meta / AI Infographic:** Aggregated review stats displayed as
  charts/bars/icons (fit, difficulty, quality, pick test, etc.), plus
  AI-generated review summary with “people say” highlights.

- **Smart Buy Links:** Prominent, easily updatable, visual store icons
  and status (verified/user-supplied), history link.

- **Completion/Stats Graphs:** Time-to-complete plots, completion rate
  vs. abandoned, who solved it and when.

- **Logging/Journey Timeline:** Visual journey of users’ logs, including
  progress photos/notes at each step.

- **Quick Actions:** Add to list, move state, log progress/media, review
  (rate & write), share, report issue.

------------------------------------------------------------------------

### Events Module/Page

- **Calendar View:** Upcoming and past events, filter by type
  (competition, meetup, virtual, brand).

- **Event Cards:** Title, date/time, preview image, core stats,
  join/register CTA, description, hosting brand or organizer.

- **Leaderboard:** Within each event, show realtime/after-the-fact
  leaderboard (most puzzles solved, fastest times, most creative log,
  etc.).

- **Results:** Published placements; ability to view peer logs/media
  from event.

------------------------------------------------------------------------

### Community/Forum

- **Threaded Discussions:** Modern, minimal, deeply threaded; newest,
  most active, top-rated sorting.

- **Post Composer:** Rich text, image/video embedding/upload, tag
  puzzles, @mention brand or user.

- **Media Grid:** All media in a thread or group surfaced visually and
  filterable.

- **Groups/Clubs:** Start or join clubs; per club, list members,
  highlight featured puzzle, custom threads/media sharing.

- **Lending/Borrowing Flows:** Discovery of lender/borrower,
  request/offer UI, chat popup, logistics tracker (status:
  requested/accepted/in transit/returned), rating component for P2P
  trust.

- **Search/Sort:** Powerful forum search, filter by
  puzzle/topic/brand/tag.

- **Moderation Features:** Flag/report, admin controls, status banners
  for posts/threads.

- **Edge:** Lending agreements, lost/damaged puzzles—prebuilt resolution
  workflow, warning banners.

------------------------------------------------------------------------

### Notifications, Alerts, Onboarding

- **Notification Center:** Bell/icon in header; all system/user
  notifications (puzzle approved, request, review, event, lending
  status, etc.), badges, unread counts.

- **Toasts/Snackbars:** Immediate on-screen confirmations for all key
  actions (log created, list added, upload success, moderation action
  taken, lending status changed).

- **Onboarding:** First-login flow guides users to complete profile,
  explore smart lists, engage with a brand, log first puzzle, and set
  notifications/privacy. Highlights short “what’s new” for returning
  users.

- **Privacy/Consent UI:** Clear, repeatable choices for public/private
  profile/data and media sharing, with tooltips and learn-more landing.

------------------------------------------------------------------------

## UI & Accessibility Standards

- **Aesthetic Direction:** Minimalist, white space, brand-supportive
  accenting, images and stats front-and-center.

- **Branding:** Dynamic accent for brand vis, strong logo presence on
  brand/all relevant screens.

- **Motion/Transitions:** Fluid, fast-add and drag/drop for list/state
  moves, deliberate microinteractions.

- **Typography:** Clear, accessible, strong visual distinction between
  actions, data, notes, media.

- **Padding/Spacing:** 8/16/24px grid; grids/lists coalesce to preserve
  hierarchy even with media-dense logs.

- **Accessibility:** Keyboard access, aria-labels, high color contrast,
  media alt/fallback, focused error states, and accessible,
  clearly-labeled controls.

- **CTAs:** Consistent positioning, large hit areas, obvious visual
  feedback on interactions.

------------------------------------------------------------------------

## Component Library / UI Inventory

- **Puzzle Card:** State status, image, meta, quick-add buttons, mini
  progress bar, AI highlights.

- **Brand Card:** Brand logo, color highlight, stats, follow button.

- **Progress Log/List:** Timeline, add/edit notes and media, state
  visual, review meta input.

- **Profile Header:** Avatar, stats, privacy toggles, badges.

- **List Controls:** State transitions/drag, bulk actions, add/remove,
  preview cover images.

- **Uploaders:** Puzzle (catalog), Media (logs/reviews), Brand asset
  uploader.

- **Review Form:** Star/meta sliders, notes, media, AI-generate blurb
  button.

- **Catalog Table:** For brands/admin, sortable/editable rows, template
  download, bulk import status.

- **Forum/Post Thread:** Threaded post, media embed/input, club/mention
  tools.

- **Lending/Borrow UI:** Search, toggle, logistics chat, status tracker,
  feedback/rating.

- **Event Card:** Banner, stats, join/register, result/leaderboard.

------------------------------------------------------------------------

## Screen Layout Sketches (Described)

### Home/Explore

- **Banner:** Dual CTA hero for “Find Puzzle” & “Log Puzzle”.

- **Smart Lists/Carousels:** Trending, most solved, new releases.

- **Leaderboards & Event Teasers:** Widget highlights, tap to full page.

- **Discovery Chips:** Categories, brands, tags.

- **Activity Feed:** Latest logs, reviews—with rich visuals and inline
  actions.

- **Mobile:** Bottom floating “Add/Log” CTA at all time.

### My Puzzles

- **Top Navigation:** Tabs for Wishlist, Library, WIP, Completed,
  Abandoned.

- **Grid/List:** Each puzzle displays state, progress, core meta, and
  add/edit/log actions.

- **Transitions:** Visual drag-drop or bulk-action for moving between
  lists.

- **Log Modal:** Pops for in-progress puzzles, add notes/media, visual
  timeline.

- **Edge States:** Empty list states guide to discover, “abandoned”
  shows revive/return CTA.

### Profile

- **Editable Header:** Avatar, stats, achievements; privacy toggles
  per-section and overall.

- **Favorites/Highlights:** Pin key puzzles/logs.

- **Public Lists:** Toggle for viewing/visibility management.

- **Followers/Following:** Social UI for discovery/connection.

- **Settings:** Slide-out/drawer for advanced privacy and account
  actions.

### Brand & Admin Dashboards

- **Brand Catalog:** Upload/import, live status, brand styling.

- **Admin Queue:** Pending/approved/rejected, quick inline preview,
  filter, and bulk-approve.

- **Analytics & Notifications:** Live stats, activity feed, submission
  banners.

### Puzzle Detail

- **Hero Gallery:** Switchable media, stats overlay.

- **Review Meta/AI Infographics:** Deep-dive charts, text highlights.

- **Completion Log Graph:** Community stats, personal logs timeline.

- **Action Bar:** State transition, quick log, add to list, rate, edit
  buy link.

### Events, Community, Lending/Borrow

- **Events:** Calendar view, event detail modal/card,
  leaderboard/results, media/replay.

- **Forums:** Minimalist thread view, group join/create, media-rich
  posts, search/sort.

- **Lending/Borrow:** Offer/request, chat log, logistics tracker,
  resolution modals.

### Notifications & Onboarding

- **Notification hub:** Dropdown with grouped read/unread, badge count.

- **Alerts/Toasts:** Persistent clear feedback, actionable alerts.

- **Onboarding Modals:** Visual, stepwise, action-first (complete
  profile, add puzzle, explore smart list, etc.).

------------------------------------------------------------------------

## Final Notes

- **Stateful My Puzzles experience:** Visual, simple, drag-and-drop,
  fast bulk edit/log.

- **Rich Logging:** Media-first, with structured/journal entries, meta
  reviews, and easy timeline update.

- **Best-in-class profile control:** Every stat/log/list can be
  public/private. Highlights and personalization celebrated.

- **Brand and Admin excellence:** Brands empowered with dynamic,
  analytics-driven dashboard; admins with fast review and moderation.

- **Social, Smart, and Eventful:** Activity-driven, highly discoverable
  homepage; full-featured events and community; modern, frictionless
  lending/borrowing tools for trust.

- **Full edge-case awareness:** Every list, state, empty/error, or
  pending scenario receives explicit, positive UX treatment.

------------------------------------------------------------------------
