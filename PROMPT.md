# Shufflboard: Design Prompt Builder

## Vision

Transform Shufflboard from a design bookmarking app into a **visual design prompt builder**. Users select or shuffle options across design categories to generate formatted prompts for AI tools like Aura.build, Claude, Midjourney, etc.

**Core interaction:** Select options manually OR shuffle randomly per category (or shuffle all) → Copy formatted prompt

## Target Users

- Designers needing quick style direction
- Agency owners briefing AI tools
- Anyone who wants structured design prompts without decision fatigue

## Current State

- Auth flow works (login/signup via Supabase)
- Categories table exists with options JSONB
- Dashboard has filter sidebar structure (can be repurposed)
- Deployed to Vercel, Supabase hosted

## What to Build

### Phase 1: Core Prompt Builder UI

1. **New dashboard layout** - Replace resource grid with prompt builder interface:
   - Left: Category cards with selectable options
   - Right: Live prompt preview + copy button
   - Top: "Shuffle All" button

2. **Category card component** - For each category:
   - Category name header
   - Grid/list of option chips (selectable, single or multi based on category)
   - Individual "Shuffle" button (dice icon) per category
   - Visual feedback for selected state

3. **Default categories to seed:**
   ```
   - Color Palette: ["Dark + Moody", "Light + Airy", "Warm Earth Tones", "Cool Blues", "Vibrant + Saturated", "Muted + Desaturated", "Monochromatic", "High Contrast"]
   - Typography: ["Geometric Sans", "Humanist Sans", "Modern Serif", "Classic Serif", "Display/Decorative", "Monospace", "Hand-drawn", "Mixed Pairing"]
   - Layout Style: ["Minimal Whitespace", "Dense/Editorial", "Asymmetric", "Grid-based", "Full-bleed Images", "Card-based", "Single Column", "Bento Grid"]
   - Visual Mood: ["Luxurious", "Playful", "Corporate", "Artistic", "Technical", "Friendly", "Bold", "Subtle"]
   - Design Era: ["Y2K", "Art Deco", "Mid-century Modern", "80s Memphis", "90s Grunge", "Bauhaus", "Contemporary", "Futuristic"]
   - Industry Context: ["Tech/SaaS", "Fashion", "Finance", "Healthcare", "Food & Beverage", "Real Estate", "Creative Agency", "E-commerce"]
   ```

4. **Prompt output panel:**
   - Live-updating formatted prompt based on selections
   - Template: "Design a [Industry Context] landing page with [Color Palette] colors, [Typography] typography, [Layout Style] layout. The visual mood should be [Visual Mood] with [Design Era] aesthetic influences."
   - Copy to clipboard button with success toast
   - Character count (some AI tools have limits)

### Phase 2: Shuffle Mechanics

1. **Per-category shuffle:** Click dice icon → randomly select 1 option from that category with animation
2. **Shuffle All:** Single button to randomize all categories at once
3. **Animation:** Brief shuffle animation (options cycling) before landing on selection
4. **Lock feature:** Lock individual categories to exclude from "Shuffle All"

### Phase 3: User Customization (Future)

- Add custom categories
- Add custom options to existing categories
- Save favorite prompt combinations
- Prompt history

## Technical Approach

### State Management
- Use React state for selections: `Record<string, string[]>` (category → selected options)
- Shuffle logic: `Math.random()` to pick from options array
- Consider Zustand if state gets complex

### Components to Create/Modify
- `app/dashboard/page.tsx` - Replace with prompt builder layout
- `components/prompt-builder/category-card.tsx` - New
- `components/prompt-builder/prompt-preview.tsx` - New
- `components/prompt-builder/shuffle-button.tsx` - New
- `components/ui/chip.tsx` - Selectable option chip

### Database Changes
- Update default categories seed data (migration)
- No schema changes needed - reuse existing `categories` table

### API Routes
- Existing `/api/categories` works for fetching
- May need endpoint for saving favorite prompts later

## Design Guidelines

- Clean, minimal UI - let the options be the focus
- Use existing shadcn/ui components where possible
- Smooth micro-interactions for shuffle (framer-motion or CSS)
- Mobile-responsive: stack category cards vertically
- Dark mode support (Tailwind dark: classes)

## Success Criteria

The feature is complete when:
- [ ] User can see all categories with their options on dashboard
- [ ] User can click to select/deselect options in each category
- [ ] User can shuffle individual categories
- [ ] User can "Shuffle All" to randomize everything
- [ ] Formatted prompt updates live based on selections
- [ ] User can copy prompt to clipboard
- [ ] UI is responsive on mobile
- [ ] Animations feel polished (not jarring)

## Out of Scope (for now)

- User accounts/saving (auth already works, just not using it yet)
- Custom categories (Phase 3)
- Sharing prompts publicly
- Integration with AI APIs directly

## Completion Promise

When Phase 1 + Phase 2 are complete with all success criteria met, output:

```
<promise>SHUFFLE COMPLETE</promise>
```

---

## Reference Files

- Current dashboard: `app/dashboard/page.tsx`
- Categories API: `app/api/categories/route.ts`
- Supabase client: `lib/supabase/client.ts`
- UI components: `components/ui/`
- Schema: `supabase/migrations/001_initial_schema.sql`
