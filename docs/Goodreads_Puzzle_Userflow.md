# Goodreads for Jigsaw Puzzles – User Flows

## Purpose & Scope

This document defines the essential user journeys for the MVP and core
features of the "Goodreads for Jigsaw Puzzles" platform. Its objective
is to provide developers, designers, and AI tooling with a clear,
structured understanding of how users interact with the product—ensuring
delivery of a seamless, delightful, and highly engaging experience
across all devices.

------------------------------------------------------------------------

## Key Personas

### 1. Puzzle Enthusiast

- Experienced hobbyists seeking new puzzles, tracking solves, writing
  reviews, and connecting with other enthusiasts.

- Wants to discover challenging puzzles, maintain organized lists, and
  share insights with the community.

### 2. Newbie/Social Solver

- New or casual users beginning to explore the world of jigsaw puzzles.

- Seeks recommendations, follows popular puzzles and users, participates
  in conversations or activity feeds, and tracks progress.

### 3. Brand/Seller

- Puzzle manufacturers or sellers managing catalog visibility or
  uploading new puzzles.

- Aims to showcase products, receive ratings, and boost discovery among
  puzzle lovers.

------------------------------------------------------------------------

## Core User Flows

### 1. Onboarding / Sign-Up

- **Entry Point:**

  - User lands on the homepage or app download.

  - Sees prominent "Sign Up" or "Continue with Google/Apple" options.

- **Sign-Up Steps:**

  - Enters basic info (name, email, password), or chooses SSO.

  - Receives success confirmation and optional email verification.

  - Is prompted to set up a profile picture and a short bio.

- **Post-Signup Experience:**

  - Presented with an onboarding welcome message.

  - Optionally shown featured puzzles or asked to select interests (via
    popular tags/categories or brands).

  - Directed to their profile/dashboard or puzzle discovery home.

**Success State:**  
User is greeted with a personalized home/dashboard, ready to explore
puzzles and begin tracking.

------------------------------------------------------------------------

### 2. Puzzle Discovery

a\) Search

- User clicks into the search field from home or app header.

- Types a puzzle title, keyword, tag (e.g., "landscape"), or brand.

- Sees search suggestions and auto-completed results while typing.

- Hits enter or selects a suggestion.

- Search results page loads: shows puzzle cards with cover image, title,
  piece count, manufacturer/brand, and quick-actions.

- User can apply filters (piece count, difficulty, manufacturer/brand,
  etc.).

- Taps a puzzle to see details, or uses "Add to List" inline.

b\) Browse by Brand (New Core Journey)

- From the homepage ("Browse by Brand" or prominent section), user sees
  grid/list of puzzle brands/manufacturers (with logos and quick stats).

- Option to filter/sort brands (alphabetically, puzzle count,
  popularity).

- Selecting a brand opens a dedicated brand profile/browse page,
  showing:

  - Brand description, official info, logo/banner

  - Catalog of puzzles from the brand (filterable/sortable)

  - Quick community stats (most reviewed, trending puzzles, average
    ratings)

  - Link to brand announcements or forum topics (v2)

c\) AI Chat / Discovery

- User opens the "Ask for Recommendations" chat or voice interface.

- Types natural queries (e.g., "Show me 500-piece puzzles from Brand
  X").

- System replies with conversational recommendations, linked directly to
  puzzle cards or lists.

- User can refine, clarify, or save results in the flow.

d\) Lists / Smart Lists / Categories

- User taps "Browse" or "Categories" for curated smart lists (Most
  Popular, Editor's Picks, etc.), and can explore puzzles by tags,
  difficulty, or newly trending brands.

------------------------------------------------------------------------

### 3. Logging Completed Puzzles (Media-Rich Puzzle Log)

- User selects "Log Your Puzzle" from homepage primary CTA, feed, list,
  or any puzzle detail page.

- **Step-by-step flow:**

  1.  Selects puzzle from existing catalog, or enters basic data to log
      a new one.

  2.  Uploads photo(s) and/or video(s) of the completed puzzle (drag &
      drop or mobile picker).

  3.  Enters time taken to solve (manual entry or via timer).

  4.  Optional: Adds notes about the solving experience.

  5.  Reviews preview; confirms log.

- **Upon submission:**

  - Puzzle log is saved and displayed in user’s public profile
    (“Completed Puzzles”).

  - User’s activity appears in the real-time community feed, including
    images/video.

  - Aggregates are refreshed (e.g., solves, average time, media gallery
    on detail page).

------------------------------------------------------------------------

### 4. Uploading New Puzzles (User/Brand Submission)

- User or Brand selects "Upload New Puzzle" from main navigation or CTA.

- Fills submission form with:

  - Title, brand (select or create), piece count, images, description

  - Tags/categories, purchase link (optional or required)

  - Optionally adds YouTube/unboxing video, release date, materials

- Uploads high-quality image(s) and/or short video(s) representing the
  puzzle.

- Reviews and submits. If user-submitted, entry may enter a moderation
  queue.

- **Moderation Flow:**

  - Puzzle is pending; user is shown confirmation and status
    (email/notification on approval).

  - Upon approval, puzzle appears in catalog under selected brand, and
    submitter is notified.

------------------------------------------------------------------------

### 5. Adding or Editing Purchase Links

- On puzzle detail or upload/edit screens, user sees “Add Purchase Link”
  (or “Edit Link”) button.

- Click to open inline form: paste URL to purchase page, select
  retailer/source (if applicable).

- Submits; link is displayed in puzzle details (pending moderation if
  flagged by system).

- Crowd-contributed links can be upvoted/downvoted and flagged for
  accuracy.

- Existing puzzles without links prompt users to contribute, increasing
  database richness.

------------------------------------------------------------------------

### 6. Viewing Puzzle Detail

- User lands on a puzzle detail page from any discovery, log, feed, or
  brand flow.

- Page includes:

  - Large gallery of images & any video content

  - Title, piece count, manufacturer/brand (with brand link)

  - Description, tags, materials, and other metadata

  - “Add to List” button(s) for easy tracking

  - Purchase link(s) (user- and brand-contributed, with
    attribution/ratings)

  - **Social Aggregates:**

    - Number of users who added to “Want to Solve,” “Want to Buy,”
      “Solved” lists

    - Number of users who have solved this puzzle (with user preview
      gallery)

    - Average time to solve (global and friends)

    - AI-generated summary of review meta-insights (e.g., “Most solvers
      found this to have a tight fit, high shape versatility; be aware
      of some reported false fits”)

  - Community reviews (expanded fields: loose fit, false fit frequency,
    shape versatility, finish, pick test results, additional text &
    images)

  - Activity carousel (“Recently Solved By” with user images)

- User can see and interact with links to brand profile, related
  puzzles, and direct add/log actions.

------------------------------------------------------------------------

### 7. Leaving a Review (Advanced Metadata)

- User taps "Add Review" on puzzle detail or their log.

- **Review form includes:**

  - Star rating

  - Textual review (optional)

  - Upload photo(s) or selfie with the puzzle

  - Advanced fields (sliders or select):

    - Loose fit (1–5)

    - False fit frequency (1–5)

    - Shape versatility (1–5)

    - Finish quality (1–5)

    - Pick test (Yes/No/Partially)

    - Other custom tags/notes

  - Optionally select/anonymize review

- Submits; review is visible immediately.

- Data is aggregated and displayed persistently on puzzle detail (with
  AI-powered meta-insights).

------------------------------------------------------------------------

### 8. Activity Feed (Media-Rich, Real-Time)

- User navigates to "Feed" from main navigation.

- Feed displays, in real time:

  - Solves/logs with user-supplied images/videos and notes (example:
    "Anshul just finished ‘Cloudy Forest’ – 2h32m! \[photo\]")

  - New reviews with advanced metadata

  - New puzzles uploaded or purchase links added (with contributor
    attributions)

  - Followed users’ activity/events, brand spotlights

- Users can click through any item to detailed page or user profile.

- Feed refreshes on event, with media loading animations. Users can
  like/comment/respond if enabled.

------------------------------------------------------------------------

### 9. Adding a Puzzle to List

- User hits "+ Add to List" anywhere (search, detail, feed, brand or
  category page).

- Picker appears for default lists ("Want to Solve", "Solved",
  "Favorites") or custom/new list.

- One tap adds; confirmation shown.

- List(s) update in real time.

- Optionally annotate when adding.

------------------------------------------------------------------------

### 10. Following Profiles

- User visits another user’s or brand’s profile.

- Can view public logs, reviews, lists, and profile/brand info.

- Clicks "Follow" button; follows immediately (with feedback).

- Feed updates to include new followed user’s or brand’s activities.

------------------------------------------------------------------------

### 11. Home Page – Primary Calls To Action

- On arrival (signed in/out), user sees hero with:

  - **Primary CTA:** "Log Your Puzzle" — prominent button, inviting
    users to upload or log a new puzzle with photo/time/media.

  - **Secondary CTA:** "Find Your Next Puzzle" — search or AI-powered
    recommendation.

  - Featured brands, puzzle spotlights, trending logs.

- Optionally, see prompt to "Browse by Brand" or direct navigation.

------------------------------------------------------------------------

### 12. Community & Forum (v2 Journey – To Design)

- Users can join brand or puzzle communities; participate in forum-style
  discussion threads.

- Dedicated tab/section for open Q&A, tips, trading/swapping advice, and
  more.

- Integrated with profiles and activity feed.

------------------------------------------------------------------------

## Edge Cases & Alternate Paths

- **Empty States:**

  - No puzzles for brand: show friendly message and invite user or brand
    to upload.

  - No solve logs: encourage first log with visual prompt.

  - No purchase link: call-to-contribute UI.

- **Moderation/Approval Flows:**

  - Puzzle and purchase link submissions may be held for review; user
    sees pending status.

  - Disputed metadata or spam can be flagged for moderation review.

- **Error Handling:**

  - API/search/upload failures: prominent error, retry option, and
    save-as-draft fallback.

  - Bad/unsupported media: prompt for format/size correction.

  - Unauthorized actions: prompt login/signup, save context.

- **Mobile-Specific Paths:**

  - Touch-friendly controls; drag & drop for media uploads.

  - Responsive flows for logging or reviewing on the go.

  - Persistent CTAs and navigation.

- **Accessibility:**

  - All log/review/media flows accessible via keyboard and screen
    readers.

  - Sufficient contrast and readable interface.

------------------------------------------------------------------------

## UX/UI Notes for Handoff

- Mobile-first, modular UI with flexible card and gallery layouts for
  puzzle, brand, and user media.

- Immediate, animated feedback on all actions (log, review, add to list,
  contribute, follow).

- Always show actionable next steps in empty/error states.

- Real-time updates for feed and social stats, promoting vibrant
  community feel.

- Visual prominence given to logging puzzles and brand navigation.

- Review and meta-insight surfaces should merge manual and AI-powered
  commentary for clarity and engagement.

- All destructive actions should allow undo or cancel.

------------------------------------------------------------------------
