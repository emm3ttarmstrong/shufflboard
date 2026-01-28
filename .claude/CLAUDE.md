# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shufflboard is a design inspiration management app. Users save design resources (websites, images, tweets) with tags for filtering.

**Stack:** Next.js 16 (App Router), Supabase (PostgreSQL + Auth + Storage), TanStack Query, Tailwind CSS + shadcn/ui

## Commands

```bash
npm run dev    # Start dev server (port 3000)
npm run build  # Production build
npm run lint   # ESLint
```

## Architecture

### Data Flow
1. **Client components** use TanStack Query hooks (`hooks/use-resources.ts`) to fetch/mutate data
2. **Hooks** call Next.js API routes (`app/api/resources/route.ts`)
3. **API routes** use server-side Supabase client with auth verification
4. **Supabase RLS** provides additional security layer

### Supabase Client Pattern
- **Server components/API routes:** `await createClient()` from `@/lib/supabase/server` (async, uses cookies)
- **Client components:** `createClient()` from `@/lib/supabase/client` (sync)
- **Middleware:** `updateSession()` from `@/lib/supabase/middleware` (handles auth session refresh)

### Auth Flow
- Middleware (`middleware.ts`) protects `/dashboard/*` routes via `updateSession()`
- Logged-in users redirected from `/login`, `/signup` to `/dashboard`
- API routes verify auth with `supabase.auth.getUser()` before operations

### Resource Tags
Tags stored as JSONB: `{"Category": ["Tag1", "Tag2"]}`
- Filtering uses Supabase `contains()` operator
- GIN index on tags field for performance

## Database Schema

Three main tables with RLS enabled:
- `profiles` - extends `auth.users`, auto-created via trigger
- `resources` - user's saved design inspirations
- `categories` - tag categories (global defaults + user custom)

Migrations in `supabase/migrations/` - run in SQL Editor when setting up.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Project Status

Core app complete. Pending: Supabase project creation, migrations, storage bucket, Vercel deployment.
