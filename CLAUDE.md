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

4. **Dual Todo System**: Use BOTH systems for optimal workflow:
   - **TodoWrite Tool**: Initialize with same tasks for real-time progress tracking (gives me live visibility)
   - **`./tasks/todo.md` File**: Maintain detailed documentation for historical reference
   - Update TodoWrite throughout execution for immediate progress visibility
   - Update `./tasks/todo.md` with final review when complete

5. **Execute the plan**: Begin working on the todo items one by one, marking them as complete in both systems as you go.

6. **Progress updates**: For every step, give me a high-level explanation of what changes you made without showing code unless I ask.

7. **Simplicity principle**: Make every task and code change as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.

8. **Final review**: Add a review section to the `./tasks/todo.md` file with:
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

## Dual Todo System Workflow

### Planning Phase
1. Create detailed plan in `./tasks/todo.md` with problem summary and task list
2. Initialize TodoWrite with same tasks for real-time tracking
3. Wait for user approval before starting work

### Execution Phase  
1. Use TodoWrite to mark tasks as in_progress/completed (gives user live visibility)
2. Provide progress updates without showing code unless requested
3. Follow simplicity principle - minimal changes, maximum impact

### Completion Phase
1. Update `./tasks/todo.md` with final review section
2. Keep TodoWrite final state for session reference
3. Document files modified, issues, and next steps

## Workflow Enforcement

1. If you don't see a `./tasks/todo.md` file, create it first
2. If the file exists but is empty, populate it with the plan
3. If the file has content, append new tasks or update existing ones
4. Always use relative path `./tasks/todo.md` not absolute paths
5. **ALWAYS** use both TodoWrite AND todo.md - they serve different purposes

## Common Commands

- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production  
- **Lint**: `npm run lint` - Run ESLint
- **Clean Development**: `npm run dev:clean` - Remove .next and restart dev server
- **Fresh Development**: `npm run fresh` - Complete reset (permissions, cache, node_modules)
- **Debug Cache**: `npm run debug:cache` - Check cache directory status

## Project Architecture

This is a **Next.js 14 App Router** application for jigsaw puzzle enthusiasts - the "Puzzlr" platform.

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

# Next.js Development Guidelines
- Always stop the dev server before making config changes
- Never modify next.config.js, tailwind.config.ts, and package.json simultaneously
- After package installations, always restart the dev server
- Use 'npm run fresh' when experiencing cache issues
- Disable Turbopack in development to prevent cache corruption
- Test builds regularly with 'npm run build'

# Next.js Development Server - Clean & Restart Protocol

## 🔄 Standard Clean & Restart Protocol

Use this when experiencing webpack errors, Fast Refresh issues, or build cache corruption.

### Step 1: Stop Server
```bash
pkill -f "next" && sleep 2
```
- Kills all Next.js processes
- Adds sleep to ensure clean termination

### Step 2: Remove Build Caches
```bash
rm -rf .next .swc .turbo out dist build node_modules/.cache
```
**What each directory is:**
- `.next` - Next.js build cache (main culprit for webpack errors)
- `.swc` - SWC compiler cache  
- `.turbo` - Turbopack cache
- `out`, `dist`, `build` - Other build output directories
- `node_modules/.cache` - Node modules cache

### Step 3: Clear npm Cache
```bash
npm cache clean --force
```
- Clears npm's package cache
- `--force` ensures thorough cleanup

### Step 4: Restart Development Server
```bash
npm run dev
```
- Starts fresh server in background

### Step 5: Verify Working
```bash
# Test main endpoints (wait 10-15 seconds for startup)
curl -I http://localhost:3000 | head -3
curl -I http://localhost:3000/community | head -3
curl -I http://localhost:3000/api/activity | head -3
```

---

## 🚨 Nuclear Option - For Severe Corruption

Use this when the standard protocol fails or you see persistent errors.

### Complete Reset Protocol
```bash
# 1. Stop server
pkill -f "next" && sleep 3

# 2. Remove ALL caches and dependencies
rm -rf .next .swc .turbo out dist build node_modules/.cache

# 3. Remove dependencies (use sudo if permission issues)
rm -rf node_modules package-lock.json
# If permission denied: sudo rm -rf node_modules package-lock.json

# 4. Clear caches
npm cache clean --force

# 5. Fresh install and start
npm install
npm run dev
```


---

## ✅ Success Indicators

After cleanup, you should see:
- **Clean startup**: No webpack errors in logs
- **HTTP 200 responses**: All test endpoints working
- **Fast compilation**: Quick subsequent builds
- **No Fast Refresh warnings**: Smooth hot reloading

---

## 📋 Quick Reference Commands

### Stop Server Only
```bash
pkill -f "next"
```

### Clean Cache Only
```bash
rm -rf .next .swc .turbo node_modules/.cache && npm cache clean --force
```

### Full Reset (One-liner)
```bash
pkill -f "next" && rm -rf .next .swc .turbo out dist build node_modules/.cache && npm cache clean --force && npm run dev
```

### Nuclear Reset (One-liner)
```bash
pkill -f "next" && rm -rf .next .swc .turbo out dist build node_modules/.cache node_modules package-lock.json && npm cache clean --force && npm install && npm run dev
```

---

## 🔧 Why This Works

- **Webpack chunk errors** = `.next` directory corruption
- **"Fast Refresh reload"** = Build cache inconsistency  
- **"Cannot find module"** = Module resolution cache corruption
- **500 errors on static assets** = Build manifest corruption

This protocol resolves **95% of Next.js development server issues** by ensuring a completely clean build state.

---

## 💡 Pro Tips

1. **Always wait 10-15 seconds** after `npm run dev` before testing
2. **Use `curl` commands** to verify server is responding properly
3. **Check process list** with `ps aux | grep next` to confirm clean shutdown
4. **For persistent issues**, try the nuclear option - it's faster than debugging
5. **Keep this protocol handy** - you'll use it often in Next.js development!

---

## 🚀 Ready Commands for Copy-Paste

**Standard Clean & Restart:**
```bash
pkill -f "next" && sleep 2 && rm -rf .next .swc .turbo out dist build node_modules/.cache && npm cache clean --force && npm run dev
```

**Nuclear Reset:**
```bash
pkill -f "next" && sleep 3 && rm -rf .next .swc .turbo out dist build node_modules/.cache node_modules package-lock.json && npm cache clean --force && npm install && npm run dev
```

---

## ⚠️ CRITICAL: Claude Code Timeout Issue

**IMPORTANT FOR CLAUDE CODE USAGE:**

When using Claude Code's Bash tool to start the development server:

### The Problem
- The Bash tool has a timeout mechanism (default 2 minutes, max 10 minutes)
- `npm run dev` is a long-running process that needs to stay active
- When the timeout expires, it kills the Next.js server process
- This makes it appear the server is "running" when it's actually terminated

### The Solution
1. **Use one-liner commands** that complete quickly:
   ```bash
   pkill -f "next" && sleep 2 && rm -rf .next && npm run dev &
   ```

2. **For verification, use separate commands:**
   ```bash
   # Check if process is running
   ps aux | grep -E "(next|node)" | grep -v grep
   
   # Test HTTP response (wait 15 seconds after start)
   sleep 15 && curl -s -I http://localhost:3000
   ```

3. **NEVER rely on timeout-based server starts** - they will fail
4. **ALWAYS verify with HTTP requests** - don't trust "Ready" messages alone
5. **Be honest about server status** - if curl returns 000 or error, server is NOT running

### Verification Checklist
- [ ] `ps aux | grep next` shows active Node.js process
- [ ] `curl -s -I http://localhost:3000` returns HTTP/1.1 200 or similar
- [ ] No 500 errors in development logs
- [ ] Compilation completes without module resolution errors

### Failed Startup Indicators
- `curl` returns `000` error code
- No Node.js/Next.js processes in `ps aux`
- Module resolution errors (missing Supabase modules, etc.)
- Build cache corruption warnings

**Remember: The development server MUST be running continuously in the background. If commands timeout, the server dies.**

---

#
