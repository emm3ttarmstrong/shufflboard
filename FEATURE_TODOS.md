# Feature Todos

Prioritized feature recommendations for Shufflboard, based on a full codebase review.

---

## Priority 1: Prompt Builder UI (Core Pivot)

The core prompt-builder pivot is implemented in the dashboard. Remaining work here is hardening, persistence, and keeping docs/schema aligned with the UI.

- [x] **Default in-app categories** — `lib/constants.ts` defines the six prompt-builder categories used by the dashboard.
- [x] **Create `components/prompt-builder/category-card.tsx`** — A card component per category displaying option chips in a grid. Supports single-select with visual feedback for the selected state. Includes a per-category shuffle (dice) icon button.
- [x] **Create `components/ui/chip.tsx`** — A selectable option chip component (pill-style) used inside category cards. Selected/unselected states with smooth transitions.
- [x] **Create `components/prompt-builder/prompt-preview.tsx`** — A live-updating panel that renders the formatted prompt based on current selections. Includes copy-to-clipboard button with toast feedback and a character count indicator.
- [x] **Create `components/prompt-builder/shuffle-button.tsx`** — A reusable shuffle button (dice icon) that triggers random selection. Used both per-category and as the global "Shuffle All" action.
- [x] **Replace dashboard page** — `app/dashboard/page.tsx` now uses the prompt builder layout: category cards on the left, prompt preview on the right, "Shuffle All" button at the top.
- [x] **Prompt builder state management** — Selections and locks are managed in React state.
- [x] **Prompt template formatting** — `PROMPT_TEMPLATE` in `lib/constants.ts` handles formatted prompt generation.
- [ ] **Align Supabase seed data** — Update SQL migration seed data if the database-backed categories path becomes active again.

## Priority 2: Shuffle Mechanics & Polish

Once the core UI exists, these features make it feel alive.

- [x] **Per-category shuffle animation** — Clicking the dice icon briefly cycles through options before landing on the random pick.
- [x] **"Shuffle All" animation** — Shuffling all categories uses a staggered cascade.
- [x] **Lock/unlock per category** — Locked categories are excluded from "Shuffle All" but can still be shuffled individually.
- [x] **Mobile-responsive layout** — Category cards and prompt preview stack on narrow viewports.

## Priority 3: User Customization

Features that increase retention and personalization.

- [ ] **Save favorite prompt combinations** — Let users save their current set of selections as a named "favorite" they can reload later. Requires a new `saved_prompts` table (user_id, name, selections JSONB, created_at) and corresponding API route + hook.
- [ ] **Prompt history** — Automatically log each copied prompt with a timestamp. Display in a collapsible history drawer or separate page. Helps users recall what they've tried.
- [ ] **Custom categories** — Allow users to create their own categories with custom option lists. The `categories` table already supports user-scoped rows (`user_id` column), so the schema is ready — just needs UI (add category form) and API wiring.
- [ ] **Custom options on existing categories** — Let users add options to the default categories. Store as user-scoped overrides merged with defaults at render time.

## Priority 4: UX & Account Features

Low-effort improvements that round out the experience.

- [ ] **Profile page** — Implement the currently disabled Profile menu item. Allow users to update their display name and avatar. The `profiles` table already has `name` and `avatar_url` columns.
- [ ] **Settings page** — Implement the currently disabled Settings menu item. Include category management (reorder, hide defaults), prompt template customization, and account preferences.
- [ ] **Dark mode toggle** — Tailwind dark classes are referenced in the config but there's no toggle. Add a theme switcher in the header or settings. Persist preference in `localStorage` or user profile.
- [ ] **Keyboard shortcuts** — Power-user shortcuts: `Space` to shuffle all, `1-6` to shuffle individual categories, `Cmd+C` to copy prompt, `L` to lock/unlock focused category.
- [ ] **Onboarding tour** — First-time users see a brief walkthrough (tooltips or overlay) explaining shuffle, select, copy workflow. Dismiss permanently after completion.

## Priority 5: Technical & Infrastructure

Items needed for production readiness and maintainability.

- [ ] **Add tests** — No test files exist currently. Add unit tests for shuffle logic, prompt formatting, and state management. Add integration tests for API routes. Consider Vitest + React Testing Library.
- [ ] **Vercel deployment pipeline** — Set up CI/CD with preview deployments on PRs. Configure environment variables for production Supabase instance.
- [ ] **Error boundaries** — Add React error boundaries around the prompt builder and individual category cards so a single component failure doesn't crash the whole dashboard.
- [ ] **Analytics events** — Track key interactions: shuffle count, copy count, most-used categories, session duration. Lightweight implementation (Vercel Analytics or PostHog).
- [ ] **Rate limiting on API routes** — The current API routes have no rate limiting. Add basic protection against abuse, especially on write endpoints.

## Priority 6: Future Explorations

Bigger bets for later consideration.

- [ ] **Direct AI integration** — After copying the prompt, offer a "Send to AI" button that calls an LLM API (OpenAI/Claude) directly and shows the design description or mockup. `.env.example` already has an `OPENAI_API_KEY` placeholder.
- [ ] **Shareable prompt links** — Generate a public URL for a specific set of selections so users can share prompts with collaborators without accounts.
- [ ] **Prompt templates library** — Offer multiple prompt templates beyond the default (e.g., "Mobile App Brief", "Logo Design Brief", "Brand Identity Brief") that arrange the same categories into different sentence structures.
- [ ] **Export to Figma/Moodboard** — Given selections, auto-generate a visual moodboard (color swatches, font previews, reference images) as a downloadable image or Figma plugin.

---

_Generated 2026-02-28 from a full codebase review. See `PROMPT.md` for the original project vision._
