# Shufflboard - Project Instructions

Design inspiration management app for designers. Rebuilt from anything.com vibe code.

**Repo:** https://github.com/emm3ttarmstrong/shufflboard

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth (email/password)
- **Storage:** Supabase Storage
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** TanStack Query
- **Language:** TypeScript

## Project Status
- [x] Core app rebuilt (auth, dashboard, resources, filters)
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] Storage bucket created
- [ ] Vercel deployment
- [ ] Custom domain (optional)

## Next Steps

### 1. Create Supabase Project
1. Go to https://supabase.com/dashboard → New Project
2. Run SQL migrations in SQL Editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_storage_bucket.sql`
3. Go to Storage → Create bucket named `screenshots` (set to public)
4. Copy credentials from Settings > API:
   - Project URL
   - anon public key

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import `shufflboard` repo from GitHub
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### 3. Local Development
```bash
cp .env.example .env.local
# Edit .env.local with Supabase credentials
npm run dev
```

## Project Structure
```
app/
├── api/              # API routes (resources, categories)
├── dashboard/        # Main app (protected)
├── login/            # Auth pages
├── signup/
└── page.tsx          # Landing page

components/
├── ui/               # shadcn/ui components
├── resources/        # Resource grid, cards, modals
├── filters/          # Search bar, filter sidebar
└── layout/           # Header

lib/
├── supabase/         # Supabase clients
├── constants.ts      # Default categories
└── utils.ts          # Utilities

hooks/                # TanStack Query hooks
types/                # TypeScript types
supabase/migrations/  # Database schema
```

## Key Files
- `lib/supabase/server.ts` - Server-side Supabase client
- `middleware.ts` - Auth middleware for route protection
- `app/api/resources/route.ts` - Resources CRUD API
- `components/resources/add-resource-modal.tsx` - Add resource form
- `hooks/use-resources.ts` - Resource data hooks

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Optional, server only
```

## Commands
```bash
npm run dev    # Start dev server on port 3000
npm run build  # Build for production
npm run lint   # Run ESLint
```

## Conventions
- Use `createClient()` from `@/lib/supabase/client` in client components
- Use `createClient()` from `@/lib/supabase/server` in server components/API routes
- All `/dashboard/*` routes are protected via middleware
- Resources use JSONB `tags` field: `{"Category": ["Tag1", "Tag2"]}`

## Future Enhancements
- [ ] AI vision auto-tagging (OpenAI API)
- [ ] Stripe payments for Pro tier
- [ ] OAuth providers (Google, GitHub)
- [ ] Browser extension for quick saving
- [ ] Mobile app (Expo)
