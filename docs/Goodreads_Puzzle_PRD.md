# Goodreads for Jigsaw Puzzles – PRD

### TL;DR

A global, community-driven platform for jigsaw puzzle enthusiasts and
newcomers, offering comprehensive discovery, rich crowdsourced metadata,
user-generated lists, dynamic "smart lists," ratings, reviews, a lively
social activity feed, and robust AI-powered conversational puzzle
recommendations. Users can track, review, and share their puzzle
experiences, **log their completed puzzles with media**, contribute
their own statistics, **upload new puzzles**, **add or edit purchase
links**, explore by unique categories, **brands**, and collections,
interact with an AI chat for personalized puzzle suggestions, and
connect with a global puzzle-loving community. Rich engagement and
social stats per puzzle, image-rich activity feeds, and a dual CTA for
"Find Your Next Puzzle" and "Log Your Own Puzzle" are core. **Community
and forums are acknowledged as v2.**

------------------------------------------------------------------------

## Goals

### Business Goals

- Achieve 10,000 user sign-ups within the first 6 months.

- Build a catalog with 50,000+ accurately detailed puzzles in the first
  year.

- Grow weekly active users (WAU) to 2,000+ by the end of year one.

- Reach 70% catalog coverage of the top 200 puzzle brands globally in
  the initial 12 months.

- Drive engagement, achieving an average of 3+ user actions (list adds,
  ratings, reviews, logs, media uploads, follows, chat queries) per
  active user per week.

### User Goals

- Effortlessly discover jigsaw puzzles from all over the world with
  advanced search, smart lists, conversational AI recommendations, and
  richly filtered browsing, **including by brand**.

- Track personal puzzle history, including "want to solve," "solved,"
  custom lists, personal statistics per puzzle, and **log completed
  puzzles with time, media, and notes**.

- Access and contribute to in-depth, trustworthy metadata (e.g.,
  complexity, average time to solve, quality scores, **brand, fit, false
  fit, shape versatility, finish, pick test**).

- Share experiences and insights through ratings, reviews, **deeper
  review attributes**, and individual puzzle stats.

- **Upload new puzzles** (with images, metadata, and purchase link), not
  just by brands but by any user.

- **Edit/add purchase links** to existing or new puzzles.

- Connect and interact with the global puzzle community through
  following, feeds, dynamic collections, and AI-driven suggestions, with
  **activity feeds rich in puzzle log images/media**.

- **Be able to join community discussions/forums (v2).**

### Non-Goals

- No in-platform buying, selling, or trading functionality for v1.

- No advanced gamification, leveling, or reward systems at launch.

- No multi-language support beyond English in the initial release.

------------------------------------------------------------------------

## User Stories

### Persona: Puzzle Enthusiast (Experienced Solver)

- As a puzzle enthusiast, I want to browse and filter puzzles by
  **brand/manufacturer,** piece count, difficulty, and category/tags.

- As a puzzle enthusiast, I want to **log my puzzle completions with
  photos, videos, time taken, and notes,** so I have a rich personal
  history and can share my journey.

- As a puzzle enthusiast, I want to add solved puzzles to my list and
  provide ratings, reviews, and my own puzzle statistics (like solve
  time).

- As a puzzle enthusiast, I want to see smart lists like "Most Solved,"
  "Highest Rated," and "Trending."

- As a puzzle enthusiast, I want to view and contribute **detailed
  review metadata (loose fit, false fit, shape versatility, finish, pick
  test, etc.)**.

- As a puzzle enthusiast, I want to follow others, view their
  **media-rich activity feed**, and get inspiration.

- As a puzzle enthusiast, I want to ask for puzzle recommendations in
  natural language and get matches instantly via AI chat.

- As a puzzle enthusiast, I want puzzle detail pages to show at-a-glance
  **community stats**: how many people want to solve/buy it, how many
  have solved it, average time to solve, etc.

- As a puzzle enthusiast, I want to **add or update a purchase link** to
  any puzzle.

### Persona: New User / Casual Solver

- As a new user, I want an easy way to search and explore
  beginner-friendly or trending puzzles through dynamic smart lists and
  categories, **and also by brand**.

- As a new user, I want to add puzzles to a “want to solve” or “want to
  buy” list and read community-contributed stats and metadata, including
  **brand data and review breakdowns**.

- As a new user, I want to **log my puzzle completions with images,
  time, and thoughts**, and see these in my profile/feed.

- As a new user, I want to contribute my review and experience after
  solving a puzzle, including new **review attributes**.

- As a new user, I want to describe what I like in plain language and
  get matching puzzle suggestions.

### Persona: Puzzle Brand/Seller

- As a puzzle brand, I want to submit new puzzles for inclusion with
  proper metadata, categories, tags, and purchase links.

- As a puzzle brand, I want puzzle details to accurately represent
  product features and images, and appear in relevant collections,
  categories, and **brand-based navigation**.

- As a puzzle brand, I want analytics on how often our puzzles appear in
  smart lists.

- **As a regular user, I want to upload puzzles too (not only
  brands/sellers).**

------------------------------------------------------------------------

## Functional Requirements

### 1. Metadata System & Puzzle Catalog (Priority: Highest)

- **Global Puzzle Database:** Central repository of puzzles with
  editable/enrichable metadata (title, **brand/manufacturer**, size,
  image, year, etc.).

- **Brands as First-Class Entity:** Brand/manufacturer field required
  for all puzzles; users can browse the catalog by brand/manufacturer.

- **Advanced Metadata Fields:** Complexity, average/median completion
  time, fit/material, average and range of perceived difficulty,
  quality, user-generated tags, multi-categorization, linked sellers,
  **review details (loose fit, false fit, shape versatility, finish,
  pick test, etc.)**.

- **Dynamic Tagging & Categories:** Puzzles support curated taxonomies
  (e.g., Whimsical, Nature, Vintage, 3D) and free tagging for granular
  discovery.

- **Collections:** By brand, category, theme, piece count, era, artist,
  difficulty, collector groupings.

- **Moderation Pipeline:** Admin tools for reviewing and approving new
  puzzle submissions, metadata changes, tags, and media.

- **Purchase Link Management:** Any user may add/edit a purchase/buy
  link to a puzzle.

### 2. User-Contributed Puzzle Uploads & Logging (Priority: Highest)

- **User Puzzle Uploads:** Any authenticated user can upload/add puzzles
  to the catalog, providing metadata, images, and (optionally) purchase
  links.

- **Puzzle Logging:** Users can log completion of puzzles, submitting
  photos, videos, time taken, notes (text), and review metadata. Each
  log is social—visible on feeds and profiles.

- **Log Aggregation:** Puzzle detail pages aggregate key stats: number
  of "want to solve," "want to buy," "solved," average/median solve
  time, **and summarized review attributes.**

- **Feed Media:** Activity feeds display puzzle logs with images and
  media.

- **Moderation:** All uploads/logs pass through a review queue.

### 3. Lists, Reviews, Ratings, Smart Lists, & Deep Review Metadata (Priority: High)

- **Default Lists:** "Want to Solve," "Want to Buy," "Bought," "Solved."

- **Custom Lists:** Unlimited for users.

- **Smart Lists:** Most Solved, Most Bought, Most Reviewed, Highest
  Rated, Trending Now, New Releases, Recently Reviewed, Hidden Gems,
  Puzzles Popular in Country, Editor’s Picks, Fastest Average Solve
  Time, Most Added to "Want to Buy," Most Popular Brands.

- **Ratings, Reviews, Personal Stats:** Users can rate, review, and log
  time for each puzzle. Reviews include structured metadata (loose fit,
  false fit, shape versatility, finish, pick test, etc.).

- **Aggregated Review Insights:** Automatically aggregate and summarize
  review metadata for display and AI-powered commentary on puzzle pages
  ("users report high false fit on this puzzle").

### 4. User Accounts & Social Features (Priority: High)

- **User Profiles:** Rich public profiles displaying all lists, logs,
  reviews (with media), stats, followed users, and social activity
  timeline.

- **Following:** Follow/unfollow users and view their public activity;
  privacy settings for profile and logs.

- **Seller/Brand Profiles:** Dedicated brand/manufacturer catalog pages,
  analytics, and collections. Brands and regular users are first-class
  uploaders.

### 5. Activity Feed (Priority: High)

- **Personalized Feed:** Aggregates activity from followed users and
  trending actions (logs, list adds, reviews, stats logged, puzzle
  uploads), highlighting submitted images/media as core feed content.

- **Feed Surfacing:** Showcases logs with images/media: "Maria just
  finished a puzzle \[image\]."

- **Notifications:** For follows, replies, puzzle status/log changes,
  moderation (optional v1).

### 6. Search, Browse, and Discovery (Priority: High)

- **Advanced Search:** By title, brand, piece count, difficulty,
  category, tags, purchase link, review metadata (fit, false fit, etc.),
  quality, and other metadata.

- **Brand Navigation:** Explicit browse-by-brand section for all puzzles
  of a particular brand/manufacturer.

- **Category/Collection Navigation:** Browse by curated category,
  dynamic collection, tags.

- **Filters & Recommendations:** Stackable filters across all metadata,
  brands, review stats, solve times.

- **Mobile/Touch:** Optimized experience, fast filters, brand/category
  quick navs.

### 7. Home Page and Primary CTAs (Priority: High)

- **Dual CTA Design:** Homepage features two primary actions: "Find Your
  Next Puzzle" and "**Log Your Puzzle**".

- **Discovery and Logging Prominence:** Both finding and logging puzzles
  are visually promoted, with hints, recent uploads/logs, and
  brand/category discovery.

- **Featured Brands:** Prominent brand-based smart lists/collections on
  home.

### 8. Seller/Brand & User Onboarding (Priority: Medium)

- **Puzzle Submission:** Both brands and any user can submit puzzles.

- **Form Fields:** Metadata, brand, images, categories, tags, purchase
  links, etc.

- **Moderation:** Review/approval before public listing.

### 9. Instagram Sharing (Priority: Medium)

- **Integration:** Share puzzle logs (with images), lists, reviews to
  Instagram.

### 10. Community/Discussion Forums (v2)

- **Community:** Ability for users to join forums/discussions
  categorised by puzzle, brand, or topic.

- **Visibility:** Forums highlighted from puzzle pages and profiles in
  v2.

- **Moderation:** Basic reporting and moderation tools.

------------------------------------------------------------------------

## User Experience

**Entry Point & First-Time User Experience**

- Landing page features a bold, visual layout: latest/personalized smart
  lists (e.g., Most Solved, Brand Collections), discover by
  brand/category, a conversational AI chat for puzzle discovery, and two
  major CTAs—**"Find Your Next Puzzle"** and **"Log Your Puzzle"**.

- Newcomers are onboarded to both browsing/discovering
  (classic/brand/chat) and rich logging (with media upload) as key
  flows.

- Non-logged-in visitors can browse, but require sign-up to log, upload,
  or review.

- Hints showcase how to explore by brand and encourage logging of
  recently finished puzzles.

**Core Experience**

- **AI Conversational Discovery:** Users chat in natural language, with
  context-rich replies. AI uses both metadata and aggregated community
  stats (incl. average solve time, most popular brand, review metadata
  summaries).

- **Brand Browsing:** Dedicated entry point for browsing all puzzles by
  brand/manufacturer; brand pages list all related puzzles and
  statistics.

- **Puzzle Logging & Upload:**

  - Users can log a completed puzzle: upload images/videos, enter solve
    time, review, and write a note.

  - Creation of new puzzles (user-uploaded or brand) with media,
    categories/tags, metadata, and purchase link.

- **Puzzle Detail Page:**

  - Rich display: all metadata, tags, brand, purchase link,
    review/aggregate stats.

  - Dynamic counts of 'want to solve,' 'want to buy,' 'solved,' etc.

  - Show number who solved, average solve time, review metadata
    aggregates (graph/summary), and AI-driven insights ("users find this
    puzzle has high false fit").

  - List of purchase links, with ability for any user to add missing or
    new links; contributors are credited.

- **Lists & Collections:**

  - Smart lists are continually updated and discoverable via
    home/explore/brand/category hubs.

  - Lists and logs have graphical/list views, sortable and filterable by
    metadata, recent logs shown with images.

- **Personal Profiles & Stats:**

  - Users display all their logs (with media), solve stats, lists,
    reviews (with review metadata breakdown), and activity/feed.

  - “Badges” or highlights for key activities (solved puzzles, logging
    streaks, media uploads).

- **Social Features & Feed:**

  - Feed highlights not just reviews and list adds, but **completed logs
    with images/video:** "Anshul finished 'Sunset Peaks' \[photo\]."

  - All major activities (puzzle uploaded/logged, purchase link updated,
    review with media) are reflected.

**UI/UX Highlights**

- Mobile-first, modern layouts, sticky bottom navigation with core
  sections (Explore, Log Puzzle, Feed, Profile, AI Chat).

- Home and explore are visually rich with puzzle images, brand logos,
  media from user logs, and call-to-action banners for both key
  journeys.

- Simple multi-step forms for puzzle upload (brand, categories,
  metadata, purchase link, etc.).

- Logging UI: drag-and-drop or tap-to-upload for photos/video, easy time
  entry, metadata rating sliders/toggles for detailed review.

- Profile/feed: Timeline interleaves text/logs/media for engaging
  scroll.

- Feed, explore, and puzzle pages all intelligently surface
  user-generated stats and AI summaries.

**Advanced Features & Edge Cases**

- Graceful error handling for duplicate uploads, media issues,
  moderation feedback.

- Privacy controls for puzzle logs/media.

- AI-generated summaries clearly marked, with context tooltips.

- Attribution for user-contributed purchase links or puzzle uploads.

- Community moderation workflows for image and content reporting.

------------------------------------------------------------------------

## Narrative

Elena, a seasoned jigsaw puzzle fan, lands on the homepage and is
greeted by trending lists, smart brand collections, and the dual
options: **"Find Your Next Puzzle"** and **"Log Your Puzzle."** She
browses puzzles by her favorite manufacturer and begins exploring
through interactive, AI-powered chat-based discovery.

She logs her latest puzzle completion, uploading a photo of her
assembled masterpiece, her solve time, and rating its fit and finish via
quick toggles. The log (with image) appears immediately in her profile
and activity feed: "Elena just finished 'Majestic Garden' \[image\]."

Later, Elena discovers a rare puzzle not in the catalog—she uploads it
herself, filling in brand, image, categories, and a purchase link. On
the puzzle page, she sees at-a-glance stats: how many have “wanted,”
bought, or solved this; the average solve time; and AI commentary
summarizing reviews: "Most solvers found tight fits and smooth finish."

Her profile fills with solved puzzles and media, and she browses the
lively feed for inspiration. Each day, Elena both finds new puzzles to
try and logs her growing collection—sometimes joining forum discussions
(v2). Discovery, engagement, and sharing feel seamless.

------------------------------------------------------------------------

## Success Metrics

### User-Centric Metrics

- Number of active user sign-ups (monthly/weekly)

- Average number of puzzles added to lists/logged per user per month

- Percentage of users logging a puzzle with media

- Percentage of puzzles uploaded by regular users (not brands)

- Session duration and return rate

- Number/frequency of AI chat queries per user

- Engagement rate for logging, uploading, adding/editing purchase links

- Review attribute (fit, false fit, etc.) participation rates

### Business Metrics

- Catalog completeness (unique puzzles/brands/metadata/with purchase
  link)

- External link click-through rate to buy puzzles

- Aggregated stats per puzzle (want to solve/buy, solved, average solve
  time) coverage

- Smart list engagement

- Seller/brand/user sign-up and onboarding rates

### Technical Metrics

- Mobile page load time (\<2.5s on 3G/4G)

- Puzzle detail and browsing uptime (\>99.9%)

- Moderation turnaround time (\<24 hours)

- Media upload success/error rate

- Log submission and aggregation latency

### Tracking Plan

- User sign-up and login

- Logging and uploading actions (with media)

- List creation, add, remove events

- Review and rating submissions incl. fit/false fit, etc.

- Purchase link additions/edits

- Brand navigation and browse events

- AI chat queries and engagement

- Feed interactions and profile visits

- Puzzle submission/approval funnel

- External buy link clicks

------------------------------------------------------------------------

## Technical Considerations

### Technical Needs

- Mobile-first responsive front-end (web/app)

- Back end: puzzle catalog/metadata (incl. brands), user accounts,
  stats, lists, reviews (with attributes), tags, image/media storage,
  logs, purchase links, activity feed, AI chat

- Moderation/admin dashboard for approving uploads/logs, metadata, tags,
  media

- Rich image/video/media infra (media storage, display, CDN)

- Attribution/versioning for user-generated data (logs, uploads,
  purchase links)

### Integration Points

- Outbound links to e-commerce (Amazon, brand shops), user-editable

- AI/LLM module for conversational recommendations and review
  aggregation

- Instagram API for sharing puzzle logs/media (v1/optional)

- Community/forum tool integration (v2)

### AI & Data Infrastructure

- AI parser for matching chat queries to puzzles using all metadata,
  including review aggregates ("users say this puzzle is best for pick
  test").

- Aggregation & analysis of review attributes for display, AI insight,
  and filter/sort.

- User log/review analysis pipeline for real-time stats (solve time,
  fit, media highlights).

### Data Storage & Privacy

- Secure handling of user data, personal stats, images, logs, lists,
  review metadata, and chat history.

- Media optimization for upload/serving; CDN/fast load on mobile.

- Privacy controls for puzzle logs/media (public/private),
  GDPR-compliance.

### Scalability & Performance

- Scalable, cloud-native DB and API for millions of puzzles, large
  volumes of user logs/media.

- Caching and index strategies for brand filters, rich search, AI chat,
  activity feeds.

- Resilient moderation queue for uploads/logs.

### Potential Challenges

- Preventing spam/bad data in user uploads or metadata

- Managing moderation for large volumes of user logs/images

- Handling copyright for images/puzzle data

- Fast aggregation for social stats and AI summaries

- Consistent, rational UX for logging vs. uploading vs. reviewing

------------------------------------------------------------------------

## Milestones & Sequencing

### Project Estimate

- MVP Launch: 3–4 months

### Team Size & Composition

- 1 Product Owner

- 2 Full-Stack Developers

- 1 Designer (UX/UI, data viz)

- 0.5 Operations/Moderation

### Suggested Phases

**1. Foundation & Catalog Launch (Month 1–2)**

- Deliver: Core DB/CMS, onboarding, initial catalog with brand fields,
  user puzzle uploads, brand navigation, advanced metadata, moderation,
  basic log upload (with media), smart list engine, tag taxonomy, AI
  chat (v1).

- Dependencies: Initial seed data (puzzles with brands, images), brand
  schema, moderation flows.

**2. Lists, Reviews, Stats, Logs, and Profile (Month 2–3)**

- Deliver: Lists, logging UI (photo/video/time/metadata), rating/review
  with attributes, profile timeline/media, log/social stats on puzzle
  details, purchase link CRUD.

- Dependencies: Catalog/brand/media infra, logging workflows.

**3. Social Feed, Discovery, Home CTAs, and Brand/Category Browsing
(Month 3)**

- Deliver: Feed with image-rich logs, home dual CTA UI, browse by brand
  section, smart/explore lists, improved AI chat module.

- Dependencies: Core logging/social infrastructure stable.

**4. Instagram, Polish, Moderation Optimizations (Month 3.5–4)**

- Deliver: Instagram sharing, QA, design polish, visual bugfix,
  moderation queue enhancements.

- Dependencies: Media infra/UX, analytics.

**5. Launch & Learn (Month 4+)**

- Deliver: Public release, live A/B of dual CTAs, media engagement
  tracking, v2 roadmap (community forums, richer AI).

------------------------------------------------------------------------

## v2/Deferred: Community & Forums

- Launch puzzle-centric and brand-centric discussion forums.

- Threaded discussions, media-rich posts.

- Moderation and reporting flow.

- Forum highlights on puzzle and brand pages.

- Integration with profiles and activity feeds.

------------------------------------------------------------------------

**End of PRD**
