# Shufflboard

Visual design prompt builder. Users select or randomly shuffle options across design categories (color palette, typography, layout style, mood, era, industry) to generate formatted prompts for AI tools (Aura.build, Claude, Midjourney, etc.).

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v3**
- **Supabase** — auth (SSR) + Postgres database
- **shadcn/ui** + **Radix UI** — component library
- **TanStack Query** — server state management
- **lucide-react** — icons

## Key Files

- `app/page.tsx` — Landing page
- `app/dashboard/page.tsx` — Main prompt builder UI (categories + prompt preview)
- `app/auth/` — Auth callback handler
- `app/login/` — Login page
- `app/signup/` — Signup page
- `app/api/categories/route.ts` — Fetch categories from Supabase
- `components/ui/` — shadcn/ui components
- `components/prompt-builder/` — Prompt builder components (category-card, prompt-preview, shuffle-button)
- `hooks/` — Custom React hooks
- `lib/supabase/client.ts` — Supabase browser client
- `lib/supabase/server.ts` — Supabase server client (SSR)
- `middleware.ts` — Auth session refresh middleware
- `supabase/migrations/001_initial_schema.sql` — DB schema (profiles, resources, categories tables)
- `types/` — TypeScript types

## Database Schema

- `profiles` — Extends `auth.users` (id, email, name, avatar_url)
- `resources` — Bookmarked design references (title, url, screenshot, tags JSONB)
- `categories` — Prompt categories (name, type, options JSONB array, sort_order)

## Development

```bash
npm run dev   # localhost:3000
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Deployment

Deployed to Vercel. Supabase project is cloud-hosted.

## Conventions

- shadcn/ui components via `components/ui/` — add new ones with `npx shadcn-ui@latest add <component>`
- Supabase SSR via `@supabase/ssr` — use `lib/supabase/server.ts` in Server Components, `lib/supabase/client.ts` in Client Components
- Category options stored as `JSONB` array in the `categories` table
- Shuffle logic is client-side: `Math.random()` over the options array
- See `PROMPT.md` for the full feature spec and planned phase breakdown
