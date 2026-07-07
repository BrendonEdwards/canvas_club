# Canvas Club v2 — Design

**Date:** 2026-07-07
**Branch:** `feature/canvas-club-v2` (based on `main`; `main` and the Vercel deployment are never touched)

## Goal

Consolidate the best work from all branches into one coherent product iteration that fixes the
three owner priorities:

1. **Returning customers** — real accounts, real login, no repeat of the sign-up wizard.
2. **Image handling** — license-safe, locally hosted, attributed artwork imagery via `next/image`.
3. **Exploding styles** — pick a top-level style (e.g. Cubism), drill into sub-genres.

Plus the correctness, security, and hygiene fixes from the 2026-07-07 code review, aligned with
the Commercial Business Case (July 2026).

## Decisions (owner defaults, chosen in review session)

| Decision | Choice | Rationale |
|---|---|---|
| Persistence | File JSON DB behind a `UserStore` interface | Fully functional locally; no external resources created; Supabase/Postgres swap is one implementation file later. Documented limitation: not durable on Vercel serverless. |
| Checkout | Account creation + pilot waitlist confirmation; no card fields | Matches business case p.9 (“validation before scale”); collects the taste data that matters. |
| Pricing | £15 / £30 / £50 tiers; Custom capped at 10 pieces | Aligns app with business-case model (£33 blended). Prevents absurd auto-quotes. |

## What we take from each branch

| Branch | Take | Leave |
|---|---|---|
| `refactor-art-subscription` | StyleSelector (exploding styles), registration at checkout, login/register/user API shape, dashboard page, `lib/types.ts`, `data/` gitignore pattern | sha256 hashing, console.log of hashes, package-lock.json, debug PNGs/logs |
| `codex/implement-style-dictionary-and-caching-layer` | Taxonomy fields (visual tags, colour traits, motifs, era/medium) folded into `lib/art-data.ts` | Unwired cache utilities |
| `codex_edit` | Recommendations endpoint concept → `/api/recommendations` matched against taste profile | Parallel taste-context implementation |
| `codex/create-feature-branch-for-ux-improvements` | Password show/hide toggle; price-calculation refactor (`getBasePrice`, `formatCurrency`) | Dead social-login buttons, link to nonexistent /reset-password |

## Architecture

### Auth (new)
- `bcryptjs` password hashing (replaces unsalted sha256).
- Session = HttpOnly, SameSite=Lax cookie containing a `jose`-signed JWT (`{ sub: email }`,
  7-day expiry, secret from `SESSION_SECRET` env with dev fallback).
- Routes: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me` (server-verified identity; no more trusting client-claimed emails).
- `useAuth` hook: `{ user, loading, login, logout }` backed by `/api/auth/me`.
  The `loading` flag fixes the redirect race that bounced logged-in users to `/login`.
- `GET/PUT /api/user/me/preferences` replace `/api/user/[email]/…` (no reading other users'
  data by guessing an email).

### Data layer (new)
- `lib/store.ts`: `UserStore` interface (`getUserByEmail`, `createUser`, `updateUser`).
- `lib/store-file.ts`: JSON file implementation at `data/db.json` (gitignored).
- `lib/types.ts`: `User { email, passwordHash, name, joinedDate, preferences, subscription }`,
  `Preferences { mainStyles, subStyles, ratings }`.

### Style & artwork data (consolidated, single source of truth)
- `lib/art-data.ts`: `ArtStyle { id, name, image, description, taxonomy { visualTags,
  colourTraits, motifs, eraMedium }, subStyles: SubStyle[] }` and
  `SubStyle { id, name, image, description? }`.
- Every image entry carries attribution: `{ src, artist, title, source, license }`.
- All three duplicated style lists on `main` (wizard grid, rating deck, preferences page)
  read from this module.

### Images
- Assets downloaded once into `public/art/` — public-domain works (Wikimedia Commons,
  artist death >70 yrs) for historical styles; Unsplash-licensed photos for modern styles.
- Rendered via `next/image` with `sizes`; `images.unoptimized` removed from next.config.
- Attribution shown in the UI (artist + title caption), per partner-overview non-negotiables.

### Wizard (refactored)
- `art-subscription.tsx` split: `components/wizard/` with one component per step
  (Intro, Styles, Ratings, Plan, Customise, Review, CreateAccount) + a `useWizardState` hook
  holding form state, validation, and pricing.
- Step 1 uses `StyleSelector` (exploding sub-genres; selecting a sub-genre auto-selects parent).
- Step 2 rating deck sourced from `lib/art-data.ts`; rates every artwork in the deck
  (no more 10-of-15 cap); ratings stored keyed by artwork id, not array index.
- Final step: email + password + optional referral code → register → session → redirect to
  `/dashboard` with “You're on the pilot list” confirmation. No card inputs.
- Fixes: step counter 1-based, custom-pieces validation matches its message, dead helpers
  removed, Ctrl/Cmd+Z no longer hijacked globally.

### Dashboard (adopted from refactor branch, adapted)
- Overview (plan, join date, pilot status), Preferences tab (edit styles/sub-styles via
  StyleSelector + view ratings), Recommendations section fed by `/api/recommendations`
  (scores catalogue artworks against mainStyles/subStyles/ratings).
- Logged-in visitors to `/` are redirected here.

### Hygiene
- `ignoreBuildErrors` / `ignoreDuringBuilds` removed; resulting type/lint errors fixed.
- Vitest unit tests: pricing calculation, recommendation scoring, file store, session
  sign/verify.
- GitHub Actions workflow: install, lint, test, build on PRs.
- Old `/account`, `/account/preferences`, `/order` pages and `/api/preferences` removed
  (superseded by dashboard).

## Error handling
- API routes: JSON errors with proper status codes (400 validation, 401 auth, 409 duplicate
  email, 500 fallback); no secrets or hashes ever logged.
- Store read errors degrade to empty DB with a console warning (dev-only store).
- Client forms surface API error messages inline; loading states on submit buttons.

## Testing & verification
- Unit: vitest for lib logic (pricing, scoring, store, session).
- End-to-end: drive the real flow in a browser (dev server) — new-customer journey,
  logout, returning-customer login → dashboard, preference editing — with screenshots.
- Visual polish pass using the frontend-design guidance against those screenshots.

## Out of scope (this iteration)
- Real payment processing (Stripe) — wizard ends at pilot waitlist by design.
- Production database / Supabase migration — isolated behind `UserStore` for later.
- Corporate accounts, artwork rotation logistics, partner portal.
- Deploying the branch anywhere.
