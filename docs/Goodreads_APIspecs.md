# Goodreads for Jigsaw Puzzles – API Spec (v1)

## Purpose & Overview

This document defines the RESTful API endpoints supporting the
"Goodreads for Jigsaw Puzzles" platform. It covers core functionality
for catalog, lists, reviews, discovery, activity feeds, and user
profiles—aligned with both the database and UI specifications. Endpoints
power both public (browsing/searching) and user-authenticated
(personalization, contributions) actions, forming the backbone of client
interaction and third-party integrations.

------------------------------------------------------------------------

## Auth & Conventions

- **Authentication**: All user-specific endpoints require JWT- or
  session-based authentication via a third-party provider (e.g., Clerk,
  Auth0, NextAuth). Protected endpoints check for valid user
  credentials; public endpoints permit anonymous access.

- **Routes**: All API endpoints are prefixed with /api/, e.g.,
  /api/puzzles.

- **Pagination**: List endpoints accept ?page=X&limit=Y (defaults: page
  1, limit 20).

- **Filtering/Sorting**: Common GET endpoints support query params, e.g.
  /api/puzzles?piece_count_min=500&sort=popularity.

- **Input Sanitation**: All payloads are validated and sanitized
  server-side.

- **Error Handling**: Consistent error envelope returned with code,
  status, and message; standard HTTP status codes (401, 403, 404, 500,
  etc.).

------------------------------------------------------------------------

## Puzzle Endpoints

### GET /api/puzzles

- **Description**: List or search for puzzles with advanced filtering,
  sorting, and pagination.

- **Query Params**:

  - q: search string

  - tag, category: filter by tag/category

  - piece_count_min, piece_count_max: filter by piece count

  - sort: field to sort by (popularity, rating, date_added)

  - page, limit: pagination controls

- **Sample Response**:

<table style="min-width: 75px">
<tbody>
<tr>
<th><p>Field</p></th>
<th><p>Type</p></th>
<th><p>Description</p></th>
</tr>
&#10;<tr>
<td><p>id</p></td>
<td><p>UUID</p></td>
<td><p>Puzzle ID</p></td>
</tr>
<tr>
<td><p>title</p></td>
<td><p>String</p></td>
<td><p>Puzzle title</p></td>
</tr>
<tr>
<td><p>manufacturer</p></td>
<td><p>String</p></td>
<td><p>Brand or creator</p></td>
</tr>
<tr>
<td><p>image_url</p></td>
<td><p>String</p></td>
<td><p>Cover image URL</p></td>
</tr>
<tr>
<td><p>piece_count</p></td>
<td><p>Integer</p></td>
<td><p>Number of pieces</p></td>
</tr>
<tr>
<td><p>avg_rating</p></td>
<td><p>Float</p></td>
<td><p>Average community rating</p></td>
</tr>
<tr>
<td><p>tags</p></td>
<td><p>[String]</p></td>
<td><p>Tag labels</p></td>
</tr>
<tr>
<td><p>...</p></td>
<td><p>...</p></td>
<td><p>Additional metadata</p></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

### GET /api/puzzles/:id

- **Description**: Fetch detail for a specific puzzle.

- **Sample Response**:

------------------------------------------------------------------------

### POST /api/puzzles

- **Description**: Create a new puzzle entry. Requires authentication;
  new entries are flagged for moderation.

- **Request Body**:

  - title, manufacturer, piece_count, image_url, tags, etc.

- **Response**: Created puzzle object with moderation_pending: true.

------------------------------------------------------------------------

### PATCH /api/puzzles/:id

- **Description**: Update a puzzle (admin or verified brand only).

- **Request Body**: Any updatable field.

- **Response**: Updated object.

------------------------------------------------------------------------

### GET /api/puzzles/:id/reviews

- **Description**: Get all reviews for a puzzle, paginated.

- **Response**: Array of reviews (see Reviews endpoints).

------------------------------------------------------------------------

### GET /api/puzzles/:id/stats

- **Description**: Get aggregate stats (average solve time, average user
  difficulty/fit ratings).

- **Response**:

------------------------------------------------------------------------

## List & ListItems Endpoints

### GET /api/lists

- **Description**: Get all lists belonging to the authenticated user.

- **Response**:

------------------------------------------------------------------------

### POST /api/lists

- **Description**: Create a new custom list.

- **Request Body**: name

- **Response**: List object

------------------------------------------------------------------------

### GET /api/lists/:id

- **Description**: Fetch a specific list (owner or public if shared),
  including contained puzzles.

- **Response**:

------------------------------------------------------------------------

### PATCH /api/lists/:id

- **Description**: Update list name (owner only).

- **Request Body**: name

------------------------------------------------------------------------

### DELETE /api/lists/:id

- **Description**: Remove a list (owner only).

- **Response**: Success/failure envelope

------------------------------------------------------------------------

### POST /api/lists/:id/items

- **Description**: Add a puzzle to a list.

- **Request Body**: puzzle_id

- **Response**: Confirmation/list item object

------------------------------------------------------------------------

### DELETE /api/lists/:id/items/:itemId

- **Description**: Remove a puzzle from a list.

- **Response**: Success envelope

------------------------------------------------------------------------

## Reviews Endpoints

### POST /api/puzzles/:id/reviews

- **Description**: Create a review for a puzzle (per-user, per-puzzle
  limit).

- **Request Body**:

  - rating (1–5)

  - review (text)

- **Response**: Review object

------------------------------------------------------------------------

### PATCH /api/reviews/:id

- **Description**: Edit a review (owner only).

- **Request Body**: Any updatable fields

- **Response**: Updated review object

------------------------------------------------------------------------

### DELETE /api/reviews/:id

- **Description**: Delete a review (owner only).

------------------------------------------------------------------------

### GET /api/reviews/:id

- **Description**: Fetch a review by ID.

------------------------------------------------------------------------

## Puzzle Stats Endpoints

### POST /api/puzzles/:id/stats

- **Description**: Add user-contributed stats for a given puzzle.

- **Request Body**:

  - solve_time (int, minutes)

  - self_difficulty (1–5, optional)

  - fit_quality (1–5, optional)

- **Response**: Stat entry

------------------------------------------------------------------------

### GET /api/puzzles/:id/stats

- **Description**: Get all stats (aggregate + user's own stat if
  present).

- **Response**: Aggregate plus user-specific field (if logged in).

------------------------------------------------------------------------

### PATCH /api/stats/:id

- **Description**: Update stats entry (owner only).

------------------------------------------------------------------------

### DELETE /api/stats/:id

- **Description**: Remove stats entry (owner only).

------------------------------------------------------------------------

## Feed, Follows & Profile Endpoints

### GET /api/feed

- **Description**: Authenticated user's activity feed, including
  followed users.

- **Query Params**: page, limit

- **Response**:

------------------------------------------------------------------------

### POST /api/follows/:targetId

- **Description**: Follow a user.

- **Response**: Success

------------------------------------------------------------------------

### DELETE /api/follows/:targetId

- **Description**: Unfollow a user.

- **Response**: Success

------------------------------------------------------------------------

### GET /api/users/:id

- **Description**: Public profile lookup.

- **Response**:

------------------------------------------------------------------------

### PATCH /api/users/:id

- **Description**: Edit own profile.

- **Request Body**: Editable profile fields

------------------------------------------------------------------------

### GET /api/users/:id/lists

- **Description**: Get public lists for a user.

------------------------------------------------------------------------

## Tag & Category Endpoints

### GET /api/tags

- **Description**: Fetch all available tags.

------------------------------------------------------------------------

### GET /api/categories

- **Description**: Fetch all available categories.

------------------------------------------------------------------------

### GET /api/tags/:id/puzzles

- **Description**: Browse puzzles by tag.

------------------------------------------------------------------------

## AI/Chat Discovery Endpoints

### POST /api/chat-query

- **Description**: Submit a natural language search or navigation query
  for AI-powered puzzle recommendations.

- **Request Body**:

  - query (text)

  - (optionally) context or user ID

- **Auth**: Required (rate limited per user)

- **Response**: Chat session / recommendation results

------------------------------------------------------------------------

### GET /api/chat-query/:id

- **Description**: Fetch results for a prior chat query (and user’s chat
  history).

------------------------------------------------------------------------

## Error Responses

All error responses return this envelope:

<table style="min-width: 75px">
<tbody>
<tr>
<th><p>Field</p></th>
<th><p>Type</p></th>
<th><p>Description</p></th>
</tr>
&#10;<tr>
<td><p>error</p></td>
<td><p>Bool</p></td>
<td><p>Always true</p></td>
</tr>
<tr>
<td><p>code</p></td>
<td><p>String</p></td>
<td><p>Machine-readable code</p></td>
</tr>
<tr>
<td><p>message</p></td>
<td><p>String</p></td>
<td><p>Human-readable message</p></td>
</tr>
<tr>
<td><p>status</p></td>
<td><p>Int</p></td>
<td><p>HTTP status code</p></td>
</tr>
</tbody>
</table>

**Example:**

- **401 Unauthorized**: Not logged in or expired session

- **403 Forbidden**: Auth’d, but forbidden (not owner/admin)

- **404 Not Found**: Resource missing

- **422 Validation Error**: Invalid/missing input

- **500 Internal Server Error**: Unexpected crash

------------------------------------------------------------------------

**End of API Spec**
