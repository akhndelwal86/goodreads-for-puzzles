# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Your Rules
1. **ALWAYS start by creating a plan**: First think through the problem, read the codebase for relevant files, and write a detailed plan to `./tasks/todo.md`.

2. **Plan structure**: The plan should have:
   - Brief problem summary
   - List of specific todo items with checkboxes `- [ ]`
   - Each item should be actionable and specific
   - Estimated complexity (Simple/Medium/Complex)

3. **Wait for approval**: Before you begin working, check in with me and I will verify the plan. Do not start coding until I approve.

4. **Execute the plan**: Begin working on the todo items one by one, marking them as complete `- [x]` as you go by updating the `./tasks/todo.md` file.

5. **Progress updates**: For every step, give me a high-level explanation of what changes you made without showing code unless I ask.

6. **Simplicity principle**: Make every task and code change as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.

7. **Final review**: Add a review section to the `./tasks/todo.md` file with:
   - Summary of changes made
   - Files modified
   - Any issues encountered
   - Next steps if any

## File Management Requirements

- **ALWAYS** use the exact path: `./tasks/todo.md`
- **ALWAYS** update the same file, don't create new ones
- **ALWAYS** use proper markdown formatting with checkboxes
- **ALWAYS** preserve existing content when updating

## Example Todo Format

```markdown
# Task: [Task Name]
**Date**: [Current Date]
**Status**: Planning/In Progress/Complete

## Problem Summary
[Brief description of what needs to be done]

## Todo Items
- [ ] Read relevant files in codebase
- [ ] Create component structure
- [ ] Implement basic functionality
- [ ] Add styling
- [ ] Test and debug
- [ ] Update documentation

## Review
[To be filled after completion]
- **Files Modified**: 
- **Summary**: 
- **Issues**: 
- **Next Steps**: 
```

## Workflow Enforcement

1. If you don't see a `./tasks/todo.md` file, create it first
2. If the file exists but is empty, populate it with the plan
3. If the file has content, append new tasks or update existing ones
4. Always use relative path `./tasks/todo.md` not absolute paths

## Common Commands

- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production  
- **Lint**: `npm run lint` - Run ESLint
- **Clean Development**: `npm run dev:clean` - Remove .next and restart dev server
- **Fresh Development**: `npm run fresh` - Complete reset (permissions, cache, node_modules)
- **Debug Cache**: `npm run debug:cache` - Check cache directory status

## Project Architecture

This is a **Next.js 14 App Router** application for jigsaw puzzle enthusiasts - a "Goodreads for Puzzles" platform.

### Tech Stack
- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (PostgreSQL + Storage)
- **Authentication**: Clerk with Supabase user sync via `clerk_id`
- **AI**: OpenAI integration for recommendations
- **Icons**: Lucide React

### Key Architecture Patterns

#### Authentication Flow
- **Critical**: Always use `users.clerk_id` to link Clerk authentication to Supabase users table
- Never use Supabase auth fields - Clerk handles all authentication
- User queries must filter by `clerk_id`, not email or other fields

#### Database Integration
- All database operations use Supabase client in `src/lib/supabase.ts`
- **Always filter puzzles by `approval_status = 'approved'`** for public display
- `photo_urls` and `video_urls` are JSONB arrays, not single text fields
- Use `puzzle_aggregates` table for statistics instead of live computation
- `puzzle_logs.status` values: `want-to-do`, `in-progress`, `completed`, `abandoned`

#### Component Structure
```
src/components/
├── ui/              ← shadcn/ui components
├── puzzle/          ← PuzzleCard, PuzzleDetail, creation, rating
├── brands/          ← BrandCarousel, BrandCard
├── home/            ← Homepage sections (stats, categories, smart lists)
├── lists/           ← Smart lists and puzzle list components
├── layout/          ← Navigation, header, footer
└── shared/          ← Reusable components (empty-state, loading)
```

#### API Routes Architecture
- RESTful API endpoints in `src/app/api/`
- Key endpoints: `/api/puzzles`, `/api/brands`, `/api/puzzle-logs`, `/api/reviews`
- All API routes handle authentication and return proper error responses

#### Page Structure
- **Homepage**: Features categories, smart lists, puzzle of the day, brand carousel
- **My Puzzles**: User's personal puzzle collection with status filtering
- **Puzzle Detail**: Individual puzzle pages with reviews, ratings, and logging
- **Browse**: Puzzle discovery with filtering and search

### Database Schema Notes

#### Core Tables
- `users` - User profiles linked via `clerk_id`
- `puzzles` - Puzzle catalog with brand relationships
- `brands` - Puzzle manufacturers
- `puzzle_logs` - User puzzle interactions and progress
- `reviews` - Detailed puzzle reviews with metadata
- `puzzle_aggregates` - Precomputed statistics (ratings, completion counts)

#### Important Relationships
- Users ↔ Puzzles via `puzzle_logs` (many-to-many with status)
- Puzzles ↔ Brands (many-to-one)
- Puzzles ↔ Reviews (one-to-many)
- Puzzles ↔ Tags via `puzzle_tags` (many-to-many)

### Key Features

#### Smart Lists System
- **Trending**: Recent activity-based puzzle discovery
- **Most Completed**: Puzzles with highest completion counts
- **Recently Added**: Latest puzzle additions
- Data fetched via `getSmartListsData()` in `src/lib/supabase.ts`

#### Puzzle Logging
- Users track puzzle progress with status, photos, notes, ratings
- Progress photos stored in Supabase Storage
- Time tracking and completion analytics

#### Review System
- Detailed reviews with quality metadata (loose fit, false fit, etc.)
- 5-star rating system with aggregated statistics
- Review helpfulness and community features

### Development Guidelines

#### Component Patterns
- Use Server Components by default, add `'use client'` only when needed
- Follow established glass card styling: `glass-card border border-white/40`
- Use responsive grid patterns: `grid md:grid-cols-2 gap-0`
- Implement proper loading states and error handling

#### Styling Standards
- Use Tailwind classes exclusively - no custom CSS
- Follow design system in `.cursorrules` for consistent styling
- Use `cn()` utility for conditional classes
- Maintain mobile-first responsive design

#### Type Safety
- All database types defined in `src/types/database.ts`
- Use proper TypeScript throughout
- Leverage Next.js type safety features

### File Management
- User uploads handled via Supabase Storage
- Images stored in `puzzle-media` bucket
- Helper functions: `uploadImage()`, `getImageUrl()` in `src/lib/supabase.ts`

### Testing Strategy
- Test against actual Supabase database
- Verify authentication flows work correctly
- Test responsive design across breakpoints
- Validate all CRUD operations

### Performance Considerations
- Use Next.js Image component for optimized images
- Implement proper caching for database queries
- Use pagination for large dataset displays
- Optimize bundle size with proper imports

This architecture supports a rich social platform for puzzle enthusiasts with comprehensive tracking, discovery, and community features.