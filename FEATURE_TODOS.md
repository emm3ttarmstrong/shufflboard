# Feature Todos

Prioritized feature recommendations for Shufflboard, based on a full codebase review.

---

## Priority 1: Prompt Builder UI (Core Pivot)

The app's vision (see `PROMPT.md`) is to transform from a design bookmarking tool into a **visual design prompt builder**. This is the highest-impact work and the foundation everything else builds on.

- [ ] **Update default categories seed data** — Replace the current bookmarking-oriented categories (Type, Style, Platform, Color Palette) with the six prompt-builder categories: Color Palette, Typography, Layout Style, Visual Mood, Design Era, Industry Context. Update both `lib/constants.ts` and the SQL migration seed data.
- [ ] **Create `components/prompt-builder/category-card.tsx`** — A card component per category displaying option chips in a grid. Supports single-select with visual feedback for the selected state. Includes a per-category shuffle (dice) icon button.
- [ ] **Create `components/ui/chip.tsx`** — A selectable option chip component (pill-style) used inside category cards. Selected/unselected states with smooth transitions.
- [ ] **Create `components/prompt-builder/prompt-preview.tsx`** — A live-updating panel that renders the formatted prompt based on current selections. Includes copy-to-clipboard button with toast feedback and a character count indicator.
- [ ] **Create `components/prompt-builder/shuffle-button.tsx`** — A reusable shuffle button (dice icon) that triggers random selection. Used both per-category and as the global "Shuffle All" action.
- [ ] **Replace dashboard page** — Swap `app/dashboard/page.tsx` from the resource grid/filter layout to the new prompt builder layout: category cards on the left, prompt preview on the right, "Shuffle All" button at the top.
- [ ] **Prompt builder state management** — Manage selections as `Record<string, string[]>` in React state. Wire up category cards, shuffle buttons, and prompt preview to this shared state. Consider Zustand if complexity grows.
- [ ] **Prompt template formatting** — Implement the template: _"Design a [Industry Context] landing page with [Color Palette] colors, [Typography] typography, [Layout Style] layout. The visual mood should be [Visual Mood] with [Design Era] aesthetic influences."_ Handle missing selections gracefully (omit or show placeholder).

## Priority 2: Shuffle Mechanics & Polish

Once the core UI exists, these features make it feel alive.

- [ ] **Per-category shuffle animation** — Clicking the dice icon on a category should briefly cycle through options visually (2-3 rapid flickers) before landing on the random pick. CSS transitions or `framer-motion`.
- [ ] **"Shuffle All" animation** — Shuffling all categories simultaneously with a staggered cascade effect (each category animates in sequence, not all at once).
- [ ] **Lock/unlock per category** — Add a lock toggle to each category card. Locked categories are excluded from "Shuffle All" but can still be shuffled individually. Visual indicator (lock icon) for locked state.
- [ ] **Mobile-responsive layout** — Stack category cards vertically on narrow viewports. Prompt preview collapses to a bottom sheet or toggleable panel on mobile.

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
