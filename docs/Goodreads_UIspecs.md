# Goodreads for Jigsaw Puzzles – UI/Design Spec

## UI Library & Design Foundation

- **Design Style:** Modern, minimalist, progressive. High visual impact
  with maximum simplicity: generous white space and strong visual
  hierarchy. Branding elements support a secondary motif around
  “Brands/Manufacturers” for navigation and cataloging.

- **Color Palette:** Neutral backgrounds (off-white, subtle greys), bold
  accent (electric blue or emerald) for highlights, consistent brand
  color integrations on brand pages/cards/filters.

- **Typography:** Clean, geometric (e.g., Inter, Neue Haas Grotesk),
  large readable headings, clear information hierarchy, ample spacing.

- **Mobile-First:** Every screen, action, and navigation adapts and
  scales gracefully for mobile; touch/tap gestures prioritized.

- **Aesthetic Standards:** Delightful and uncluttered, with tactile
  interactions, smooth transitions, generous padding, and reusable
  design atoms/components.

- **Accessibility:** Full WCAG AA+ compliance. High-contrast, alt text,
  keyboard navigation, labeled and accessible rich forms, image
  handling.

------------------------------------------------------------------------

## Purpose & Scope

- **Purpose:** Deliver a cohesive, actionable blueprint for designers,
  engineers, and AI tools to ship a visually superior “Goodreads for
  Jigsaw Puzzles” product, with a special focus on puzzle discovery,
  rich logging, user-contributed content, and brand-driven navigation.

- **Scope:**

  - Home/Explore (brand emphasis, dual primary CTAs)

  - Puzzle Search & Results

  - Puzzle Detail (enhanced social/meta stats, AI review summaries)

  - Lists (user/curated/smart)

  - Activity Feed (visual media, logged puzzle highlights)

  - Profile (solves, logs with media, lists, follows)

  - Log Puzzle & Upload Puzzle flows

  - Brand/manufacturer catalog and navigation

  - Chat Discovery (AI interface, embedded and as root screen)

  - Forums/Community Placeholder (for v2)

------------------------------------------------------------------------

## Core Journeys & UX Flows

### Home / Explore

- Large hero area with dual CTAs:

  - **Find Your Next Puzzle:** Central search/chat bar, suggested
    prompts, brand/time/subject exploration.

  - **Log Your Puzzle:** High-visibility button (“Log Your Puzzle”)
    equal in prominence to search. Invites users to record their own
    puzzle progress—shows as primary nav/action at all times.

- Visual brand/manufacturer carousel: prominent below hero, with
  icons/logos/cards. Tap to enter Brand Page.

- Smart Lists (Trending / Themed / AI-curated) horizontally scroll
  below.

- Explore by Tag / Category chips.

- Activity Feed preview: latest user logs (with media), reviews, social
  stats.

------------------------------------------------------------------------

### Brand/Manufacturer Browse

- **Nav Element:** “Brands” always accessible from Home/Explore and
  top/side nav. Optionally, carousel/featured placement.

- **Browse View:** Grid/list of brands with logos/visual branding.

- **Brand Page:**

  - Hero: Banner/logo, brief bio, follow/claim CTA for brands.

  - Catalog: All puzzles under this brand, filtering/sorting supported.

  - Visual style matches brand; custom color accents.

  - Calls to “Add Puzzle for Brand,” list followers/fans count.

------------------------------------------------------------------------

### Logging Your Puzzle (Puzzle Log Flow)

- **CTA Present:** On Home, Profile, everywhere you browse a puzzle, and
  via floating “+ Log” button.

- **Log Page:**

  - **Upload**: Photo/video (multiple), with cropping/preview,
    drag-n-drop and mobile browse.

  - **Fields:** Brand (dropdown/searchable), Puzzle (autocomplete),
    Solve Time (hours/minutes), Date Solved (pre-populated to now),
    Notes/Reflections (optional), Privacy setting (public/private).

  - **Submit:** Clear feedback on successful submission, live preview of
    how it’ll appear in feed/profile.

- **Feed Integration:** Logged puzzles show up instantly in Activity
  Feed and user’s Profile, with media carousel/grid/lightbox.

- **Profile:** Users see log stats, media grid for their solved puzzles,
  sortable and filterable.

------------------------------------------------------------------------

### Uploading a Puzzle (User-Contributed Cataloging)

- **CTA:** “Add a Puzzle” visible wherever catalogs run out, in
  Home/Brand/List views, nav, and no results states.

- **Upload Form:**

  - **Fields:** Brand (choose or add new), Puzzle Name, Piece Count,
    Image(s)/Video(s), Description, Tags/Categories, Difficulty & Meta
    (loose fit, false fit, etc.), Purchase Link (optional, always
    editable later), Source, Validation prompt.

  - **Moderation:** Submission triggers review/approval workflow
    (flagged for admin), but appears as “pending” in user’s profile
    immediately. Status visible on user upload queue.

  - **Brand Assignment:** If user selects new brand, system suggests
    merging/claiming for consistency.

------------------------------------------------------------------------

### Buy Link Add/Edit UI

- **Where:** Puzzle detail page, list cards, and uploader forms.

- **UI:** Small inline form/CTA (“Add or update buy link”) wherever a
  puzzle is shown.

- **Feedback:** Purchase link status clearly shown (“verified,”
  “awaiting review,” “user-submitted”).

- **History:** Audit log or tooltip on most recent edits/adds.

------------------------------------------------------------------------

### Puzzle Detail Page

- **Hero:** Large puzzle visual; overlays for video/gallery if
  available.

- **Meta/Data:**

  - Title, Piece Count, Brand (logo, link), Difficulty, Tags.

  - **Social Stats:**

    - 

    # Added to “Want to Solve”

    - 

    # Added to “Want to Buy”

    - 

    # Solved

    - Avg. Solve Time, last N solvers.

- **Review Metadata Summary:**

  - Inline stats and AI-generated highlight (e.g., “Most users found
    this puzzle good for pick test, high chance of false fits.”)

  - Visual bars or icons: Loose fit, False fit, Shape versatility,
    Finish, Pick test, etc.

- **Gallery:** Images/videos from user logs and reviews.

- **Quick Actions:** Add to list, Mark as Solved, Rate/Review, Share,
  Report, Add/Edit Purchase Link.

- **Tabs:** Overview, Reviews (with meta), Gallery, Similar Puzzles.

------------------------------------------------------------------------

### Activity Feed

- **Feed Cards:** Activity-rich:

  - “Anshul logged a puzzle” – shows image(s)/video, time, puzzle meta.

  - “Maria added a puzzle to Want to Solve” – shows puzzle card, list
    updated.

- **Visuals:** Media previews open in grid or lightbox.

- **Mix:** Solves, uploads, reviews, follow/favorited brands, buy link
  edits, puzzle uploads, all with timestamp and inline actions (like,
  comment, follow).

- **Personal vs. Global:** Users toggle “My Feed” vs “Community Feed.”

------------------------------------------------------------------------

### Lists

- **User Lists & Smart Lists:** Accessible from nav, dashboards, and
  profile. Grids or stackable cards, quick preview/expansion of puzzles.

- **Add to List:** Always available from puzzle cards/details, inline
  modal/sheet with feedback.

- **List Detail:** Cover image (collage if multi-puzzle),
  sortable/filterable, mini social stats.

------------------------------------------------------------------------

### Profile

- **Hero:** User avatar, stats (solves, logs, reviews),
  follower/following.

- **Tabs:** Solved Logs (with media grid), Lists, Reviews.

- **Recent Activity:** Highlighted recent logs, uploads, purchase
  contributions.

- **CTA:** Follow/unfollow, share profile, profile settings.

------------------------------------------------------------------------

### Chat Discovery

- **UI:** Chat box fixed; conversational UI returns puzzle cards, lists,
  or direct navigation.

- **Quick Actions:** “Add this to my Want to Solve,” “View details,”
  “Upload my puzzle.”

- **History:** Persistent chat bubbles; always context-aware for brand,
  log, and upload triggers.

------------------------------------------------------------------------

### Forums/Community (v2 Placeholder)

- **Nav:** Forums/Community in global nav, appears disabled or “Coming
  Soon.”

- **Prep:** Outline of planned features—threads by puzzle, Q&A by topic,
  brand-specific spaces, image/video embedding, moderation/logging.

------------------------------------------------------------------------

## UI & Accessibility Standards

### Aesthetic Direction

- **Minimalist & Resilient:** White space, purposeful use of color,
  brand elements as supportive not overwhelming.

- **Branding:** Brand/manufacturer color accents and logos in catalog,
  browse, and puzzle-detail contexts.

- **Motion:** Fluid transitions for modal add/log flows, slick grid
  reshuffle on filter/change, smooth image/video load for
  logs/gallery/feed.

- **Typography:** Scale for impact, clear label on every action, info
  hierarchy easily scannable.

### Paddings & Spacing

- 8/16/24px baseline grid, oversized tap targets, cozy spacing on
  grids—even when showing rich media.

### Accessibility

- All functionality is accessible via keyboard; aria-roles for
  log/upload forms, image alt for all media.

- CTAs always labeled/aria-announced; form errors detailed contextually.

- Toast/snackbar confirmations everywhere: log success, upload success,
  review saved, buy link added.

- Media (images/video) fully accessible—alt text, descriptive titles,
  fallback handling.

------------------------------------------------------------------------

## Component Inventory

- **Brand Card/List:** Logo visual, puzzle count, follow CTA.

- **Browse by Brand/Explore:** Carousel, grid, quick filter.

- **Log Puzzle Modal/Page:** Image/video upload, solve time entry,
  preview/submit feedback.

- **Puzzle Upload Form:** All cataloging fields, media picker,
  moderation status chip.

- **Puzzle Card:** Meta display, social stats (solves, lists, avg time),
  AI review summary, actions bar.

- **Activity Feed Card:** User, action, puzzle, media, social meta.

- **Review Input:** Meta sliders/toggles (loose fit, etc.), text,
  image/video, AI-powered review summary.

- **Buy Link Inline/Edit:** Short form, status display, audit trail.

- **Profile Media Grid:** User’s logged puzzles, media lightbox.

- **Home Dual CTA:** “Find Your Next Puzzle” + “Log Your Puzzle” equally
  styled and prioritized; large, accessible, always visible.

------------------------------------------------------------------------

## Screen Layout Sketches (Described)

### Home/Explore

- **Hero:** Dual CTA layout—“Find Your Next Puzzle” (search/chat) and
  “Log Your Puzzle” (directs to logging flow), both equally prominent.

- **Browse by Brand:** Horizontally-scrolling brand logos/cards directly
  below.

- **Featured Lists and Tags:** Carousels, filter chips.

- **Activity Feed:** Image- and video-rich, recent logs/reviews, grid
  for visual previews.

- **Mobile:** Bottom fixed “Add Puzzle” / “Log Puzzle,” persistent nav
  to brand browsing.

### Brand Page

- **Brand Banner:** Logo, color-accented background, follow/claim
  option.

- **Puzzle Catalog:** Filterable/sortable by meta, piece count, etc.

- **Brand Meta:** Description, \# of puzzles/logs, followers.

### Puzzle Detail

- **Hero Image/Video:** Full-bleed, with quick-switch gallery.

- **Meta Bar:** Stats, brand logo, social stats.

- **Inline AI Review Summary:** Visual icons/bars for loose fit, pick
  test, etc.; summary prose from AI.

- **Gallery:** User-contributed media, sortable; lightbox display.

- **Purchase Link:** Status, CTA to add/edit.

- **Quick Actions/CTA:** Add to lists, rate/review, log puzzle (visible
  at all times).

### Log Puzzle

- **Uploader:** Drag/drop, mobile picker, instant preview.

- **Fields:** Solve time, notes, privacy.

- **Confirmation:** Instant feedback, “View in Feed” CTA.

- **Profile Integration:** Immediate appearance under solved/logged
  puzzles.

### Upload Puzzle

- **Form:** All fields, media upload, validation, submit.

- **Submission Status:** “Pending moderation” visible to uploader;
  accepted/rejected flow clear.

### Activity Feed

- **Entries:** Show user, action, puzzle, media grid/thumbnail.

- **Lightbox Gallery:** Multi-image/video, easily swipable/zoomable.

### Lists, Profile, Chat Discovery

- As above, enhanced for quick add/log, rich meta on all puzzle
  mini-cards, consistent action locations.

### Forums/Community (v2)

- Placeholder nav, sketch description of coming features.

------------------------------------------------------------------------

## Final Notes

- **Dual-CTA Home:** “Find” and “Log” are both central to product; never
  hide log UI behind menus.

- **Brand-First Navigation:** Strong visual and navigational presence
  throughout; catalog and engagement tied to brands.

- **Richer Log/Review Flows:** Media, meta, and social stats deeply
  integrated on all relevant pages.

- **User Contribution:** Upload flows foregrounded, clear moderation and
  status; buy link edits easy and transparent.

- **Activity Feed:** Celebrates puzzle completion with visual richness;
  designed to spark engagement and inspo.

- **Community Prep:** Forums and threaded conversations planned for next
  major version.

------------------------------------------------------------------------
