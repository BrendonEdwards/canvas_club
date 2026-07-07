# Canvas Club v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the best of all branches into `feature/canvas-club-v2`: real returning-customer auth with sessions, exploding style selection persisted to a taste profile, license-safe local images, and the review's correctness/hygiene fixes.

**Architecture:** Next.js 15 App Router. Client wizard (split into per-step components) → REST API routes → `UserStore` interface with a file-JSON implementation. Sessions are `jose`-signed JWTs in HttpOnly cookies; passwords hashed with `bcryptjs`. One canonical art-data module feeds wizard, ratings, dashboard, and recommendations.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind + shadcn/ui, bcryptjs, jose, vitest.

## Global Constraints

- Never commit to or push `main`. All work on `feature/canvas-club-v2`.
- Pricing tiers: Basic £15, Standard £30, Premium £50, Custom £15/piece capped at 10 pieces. Yearly discount 15%.
- All artwork images served from `public/art/` via `next/image`, with attribution metadata (artist, title, source, license).
- No card/payment inputs anywhere; wizard ends with account creation + pilot-waitlist confirmation.
- No password hashes or secrets in logs.
- British English in UI copy (existing convention: Customise, Watercolour, personalised).
- Package manager: pnpm (`pnpm-lock.yaml`); never add `package-lock.json`.

---

### Task 1: Merge foundation branch and clean junk

**Files:**
- Merge: `origin/refactor-art-subscription` into `feature/canvas-club-v2`
- Delete: `package-lock.json`, `image_debug.png`, `image_debug_2.png`, `verification_failure.png`, `next_output.log`

- [ ] **Step 1:** `git merge origin/refactor-art-subscription --no-edit`. Resolve conflicts preferring the refactor branch for app code, `main` for `package.json`/`pnpm-lock.yaml` (keeps the CVE-fixed Next.js).
- [ ] **Step 2:** `git rm package-lock.json image_debug.png image_debug_2.png verification_failure.png next_output.log`
- [ ] **Step 3:** `pnpm install` then `pnpm dev` — confirm the app boots and `/` renders.
- [ ] **Step 4:** Commit: `chore: merge refactor-art-subscription, drop debug artifacts and npm lockfile`

### Task 2: Test tooling and dependencies

**Files:**
- Modify: `package.json` (add `bcryptjs`, `jose`, dev: `vitest`, `@types/bcryptjs`; script `"test": "vitest run"`)
- Create: `vitest.config.ts` (alias `@` → repo root, environment `node`)

- [ ] **Step 1:** `pnpm add bcryptjs jose && pnpm add -D vitest @types/bcryptjs`
- [ ] **Step 2:** Create `vitest.config.ts`; add smoke test `lib/__tests__/smoke.test.ts` (`expect(1+1).toBe(2)`); `pnpm test` → PASS.
- [ ] **Step 3:** Commit: `chore: add vitest, bcryptjs, jose`

### Task 3: Data layer — UserStore interface + file implementation

**Files:**
- Modify: `lib/types.ts`
- Create: `lib/store.ts`, `lib/store-file.ts`, `lib/__tests__/store-file.test.ts`
- Delete: `lib/db.ts` (superseded), `lib/preferences.json`

**Interfaces (Produces):**
```ts
// lib/types.ts
export interface Preferences { mainStyles: string[]; subStyles: string[]; ratings: Record<string, "love" | "like" | "dislike"> }
export interface Subscription { plan: string; customPieces?: number; artistTier: string; artType: string; size: string; frameCommitment: boolean; billingCycle: "monthly" | "yearly"; monthlyPrice: number }
export interface User { email: string; passwordHash: string; name: string; joinedDate: string; preferences: Preferences; subscription: Subscription | null }
// lib/store.ts
export interface UserStore {
  getUserByEmail(email: string): Promise<User | null>
  createUser(user: User): Promise<User>            // throws Error("USER_EXISTS")
  updateUser(email: string, updates: Partial<User>): Promise<User | null>
}
export function getStore(): UserStore              // returns file store singleton
```

- [ ] **Step 1:** Write failing tests: create→get roundtrip, duplicate email throws `USER_EXISTS`, update merges, unknown update returns null. Use a temp dir via `DATA_DIR` env override.
- [ ] **Step 2:** `pnpm test` → FAIL (module missing).
- [ ] **Step 3:** Implement `lib/store-file.ts` (port of refactor branch's `lib/db.ts`: ensure dir, read-or-init JSON, write-back; path `process.env.DATA_DIR ?? path.join(process.cwd(),"data")`). `lib/store.ts` exports interface + `getStore()`.
- [ ] **Step 4:** `pnpm test` → PASS. Delete `lib/db.ts`, `lib/preferences.json`.
- [ ] **Step 5:** Commit: `feat: UserStore interface with file-backed implementation`

### Task 4: Sessions + auth API

**Files:**
- Create: `lib/session.ts`, `lib/__tests__/session.test.ts`, `app/api/auth/logout/route.ts`, `app/api/auth/me/route.ts`, `app/api/user/me/preferences/route.ts`
- Rewrite: `app/api/auth/register/route.ts`, `app/api/auth/login/route.ts`
- Delete: `app/api/user/[email]/route.ts`, `app/api/user/[email]/preferences/route.ts`, `app/api/preferences/route.ts`

**Interfaces (Produces):**
```ts
// lib/session.ts
export async function createSessionToken(email: string): Promise<string>   // jose HS256 JWT, 7d expiry, secret SESSION_SECRET ?? dev fallback
export async function verifySessionToken(token: string): Promise<string | null> // returns email or null
export const SESSION_COOKIE = "canvas_session"
export async function getSessionEmail(): Promise<string | null>            // reads next/headers cookies()
```
API contract (all JSON):
- `POST /api/auth/register` `{email,password,name?,preferences?,subscription?}` → 200 safe user + Set-Cookie; 400 missing/short password (<6); 409 duplicate.
- `POST /api/auth/login` `{email,password}` → 200 safe user + Set-Cookie; 401 invalid credentials.
- `POST /api/auth/logout` → 200, clears cookie.
- `GET /api/auth/me` → 200 safe user or 401.
- `GET/PUT /api/user/me/preferences` → session-scoped read/update of `preferences`; 401 without session.
Safe user = `User` minus `passwordHash`. Passwords: `bcrypt.hash(pw, 10)` / `bcrypt.compare`. Emails normalised `trim().toLowerCase()`.

- [ ] **Step 1:** Failing tests for `session.ts`: token roundtrip returns email; tampered token → null.
- [ ] **Step 2:** `pnpm test` → FAIL. Implement `lib/session.ts`. `pnpm test` → PASS.
- [ ] **Step 3:** Rewrite the four auth routes + preferences route per the contract above (cookie: httpOnly, sameSite "lax", path "/", secure in production, maxAge 7d). Remove all `console.log` of credentials.
- [ ] **Step 4:** Delete old email-parameter routes. `pnpm build`-level check via `npx tsc --noEmit` scoped to changed files if project not yet clean.
- [ ] **Step 5:** Commit: `feat: cookie sessions, bcrypt auth, session-scoped preferences API`

### Task 5: useAuth hook with loading state + page wiring

**Files:**
- Rewrite: `hooks/use-auth.ts`
- Modify: `app/page.tsx`, `app/login/page.tsx`, `app/dashboard/page.tsx`

**Interfaces (Produces):**
```ts
export function useAuth(): {
  user: SafeUser | null
  loading: boolean
  login(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }>
  logout(): Promise<void>
  refresh(): Promise<void>
}
```
Implementation: on mount fetch `/api/auth/me`; `loading` true until it settles. `login` POSTs `/api/auth/login`, sets user from response. `logout` POSTs logout, clears user, `router` handled by callers. localStorage no longer used for identity.

- [ ] **Step 1:** Rewrite hook. Update `app/login/page.tsx` to call `login(email,password)` and surface `{error}`; keep show/hide password toggle (port from ux branch, no social buttons).
- [ ] **Step 2:** `app/page.tsx`: while `loading` render nothing; if `user` redirect `/dashboard`; else wizard + "Returning customer? Log in" link.
- [ ] **Step 3:** `app/dashboard/page.tsx`: gate on `loading` before redirecting to `/login`; fetch `/api/auth/me` data instead of `/api/user/[email]`; preferences saves go to `/api/user/me/preferences`.
- [ ] **Step 4:** Manual check: register via curl, then `curl -b cookie /api/auth/me` returns user. Commit: `feat: session-backed useAuth with loading state; fix login-redirect race`

### Task 6: Canonical art data with taxonomy, attribution, local images

**Files:**
- Rewrite: `lib/art-data.ts`
- Create: `scripts/fetch-art.mjs`, `public/art/**` (downloaded), `lib/__tests__/art-data.test.ts`

**Interfaces (Produces):**
```ts
export interface ArtImage { src: string; artist: string; title: string; source: string; license: string }
export interface SubStyle { id: string; name: string; image: ArtImage }
export interface ArtStyle {
  id: string; name: string; image: ArtImage; description: string
  taxonomy: { visualTags: string[]; colourTraits: string[]; motifs: string[]; eraMedium: string[] }
  subStyles: SubStyle[]
}
export const ART_STYLES: ArtStyle[]
export const RATING_DECK: { id: string; styleId: string; image: ArtImage }[]  // one per top style
export function findSubStyle(id: string): { style: ArtStyle; sub: SubStyle } | null
```
Content: keep the refactor branch's style/sub-style structure (12+ top styles, 2–6 subs each); fold in taxonomy fields per style adapted from `public/data/style-dictionary.json` (visual tags, colour traits, motifs, era/medium). Images: public-domain works from Wikimedia Commons (`upload.wikimedia.org` full-res thumbs) for historical styles/subs (Monet, Van Gogh, Vermeer, Hokusai, Turner, Caillebotte, etc. — artists dead >70 yrs only; NO Picasso/Braque/Kusama/living artists); Unsplash photos (download URL, Unsplash licence) for modern/photographic styles. `scripts/fetch-art.mjs` downloads a manifest of `{id, url}` pairs into `public/art/<id>.jpg` with a `User-Agent` header; any failure → generate a deterministic SVG gradient placeholder `public/art/<id>.svg` instead so the build never depends on the network.

- [ ] **Step 1:** Write manifest + fetch script; run `node scripts/fetch-art.mjs`; verify files exist and are >5KB (else placeholder generated).
- [ ] **Step 2:** Rewrite `lib/art-data.ts` per interface; test: every `image.src` starts with `/art/` and the file exists on disk; `findSubStyle` resolves a known id and returns null for unknown.
- [ ] **Step 3:** `pnpm test` → PASS. Commit: `feat: canonical art data with taxonomy, attribution and local licensed images`

### Task 7: Wizard refactor — per-step components, exploding styles, waitlist finish

**Files:**
- Create: `components/wizard/intro-step.tsx`, `styles-step.tsx`, `ratings-step.tsx`, `plan-step.tsx`, `customise-step.tsx`, `review-step.tsx`, `account-step.tsx`, `use-wizard-state.ts`, `lib/pricing.ts`, `lib/__tests__/pricing.test.ts`
- Rewrite: `art-subscription.tsx` (shell: header/progress/nav only), `components/StyleSelector.tsx` (next/image, parent auto-select, attribution captions)

**Interfaces (Produces):**
```ts
// lib/pricing.ts
export const PLAN_PRICES = { Basic: 15, Standard: 30, Premium: 50, CUSTOM_PER_PIECE: 15 } as const
export const CUSTOM_MAX_PIECES = 10
export interface PriceBreakdown { base: number; artistTier: number; artType: number; size: number; frame: number; discount: number; total: number }
export function calculatePrice(form: WizardForm): PriceBreakdown   // pure; yearly = 15% off subtotal
// use-wizard-state.ts
export interface WizardForm { mainStyles: string[]; subStyles: string[]; ratings: Record<string,"love"|"like"|"dislike">; subscriptionPlan: string; customPieces: number; artistTier: string; artType: string; size: string; frameCommitment: boolean; billingCycle: "monthly"|"yearly"; email: string; password: string; name: string; referralCode: string }
export function useWizardState(): { form; setField; toggleStyle; toggleSubStyle; rate; undoRate; errors; validateStep(step:number): boolean; price: PriceBreakdown }
```
Behaviour requirements:
- `toggleSubStyle(id)` also adds the parent style to `mainStyles` if absent (spec: parent auto-select).
- Ratings step iterates the full `RATING_DECK` keyed by artwork id; progress `n of deck.length`; undo restores previous index; keyboard 1/2/3 only (no Ctrl/Cmd+Z hijack, no arrow keys stolen).
- Step indicator 1-based ("Step 1 of 7"); custom pieces clamped 1–`CUSTOM_MAX_PIECES` with matching validation message.
- Account step: email + password (≥6) + confirm + optional referral; submit → `POST /api/auth/register` with preferences `{mainStyles, subStyles, ratings}` and subscription summary; on 200 redirect `/dashboard?welcome=1`; on 409 show "You already have an account — log in instead" with link to `/login`.
- Success copy: pilot-waitlist framing ("You're on the pilot list — your first curated selection is being prepared"), no card fields anywhere.

- [ ] **Step 1:** Failing tests for `calculatePrice` (Basic monthly £15; Standard yearly = 30×0.85 subtotal math incl. frame £12; Custom 10 pieces = £150; multiplier chain matches current formula with new bases).
- [ ] **Step 2:** Implement `lib/pricing.ts`; tests PASS. Commit: `feat: pricing module aligned to business case (£15/£30/£50, custom cap 10)`
- [ ] **Step 3:** Build `use-wizard-state.ts` + step components by carving up the existing `art-subscription.tsx` JSX (keep visual design, swap data source to `ART_STYLES`/`RATING_DECK`, `next/image` for all artwork, attribution caption under rating card).
- [ ] **Step 4:** Rewrite `art-subscription.tsx` shell (~150 lines): step registry, progress bar, back/next, per-step validation gate.
- [ ] **Step 5:** `pnpm dev`; walk all 7 steps in browser; fix breakage. Commit: `refactor: split wizard into step components; exploding styles + waitlist account finish`

### Task 8: Dashboard + recommendations

**Files:**
- Modify: `app/dashboard/page.tsx`
- Create: `app/api/recommendations/route.ts`, `lib/recommend.ts`, `lib/__tests__/recommend.test.ts`

**Interfaces (Produces):**
```ts
// lib/recommend.ts
export interface Recommendation { id: string; title: string; artist: string; styleId: string; subStyleId?: string; image: ArtImage; score: number }
export function recommend(prefs: Preferences, limit?: number): Recommendation[]
```
Scoring over a catalogue derived from `ART_STYLES` sub-style images: +3 exact subStyle match, +2 mainStyle match, +2 style rated "love", +1 "like", −3 "dislike"; sort desc, tie-break stable by id; default limit 6. `GET /api/recommendations` reads the session user's preferences and returns `{recommendations}` (401 without session).

- [ ] **Step 1:** Failing tests: love+subStyle ranks first; disliked style excluded from top results; empty prefs returns 6 items (cold start).
- [ ] **Step 2:** Implement; tests PASS.
- [ ] **Step 3:** Dashboard: Overview tab (plan, joined date, pilot badge), Preferences tab (StyleSelector editing via `/api/user/me/preferences`), Recommendations grid ("Picked for you") with artist/title attribution; welcome banner when `?welcome=1`.
- [ ] **Step 4:** Commit: `feat: taste-matched recommendations on dashboard`

### Task 9: Hygiene — strict builds, CI, dead code

**Files:**
- Modify: `next.config.mjs` (remove `ignoreBuildErrors`, `ignoreDuringBuilds`, `images.unoptimized`), `app/page.tsx` (fix `.tsx` extension import), `.gitignore` (ensure `data/`), `tsconfig.json` if needed
- Create: `.github/workflows/ci.yml`
- Delete: any remaining `public/data/style-dictionary.json` duplication (folded into art-data), stale `styles/globals.css` if unreferenced

- [ ] **Step 1:** Remove ignore flags; run `pnpm lint` and `npx tsc --noEmit`; fix all reported errors (typed `errors` records, event types, remove unused imports/helpers like `getArtStyleForIndex`).
- [ ] **Step 2:** `pnpm build` → succeeds.
- [ ] **Step 3:** `ci.yml`: on push/PR → pnpm install, lint, test, build (Node 20, pnpm cache).
- [ ] **Step 4:** Commit: `chore: strict TS/ESLint builds, CI workflow, remove dead code`

### Task 10: Browser verification + design polish

- [ ] **Step 1:** `pnpm dev`; drive the full new-customer journey in the browser (wizard steps 1–7 incl. exploding a style and selecting sub-genres, rating deck, register) and the returning-customer journey (logout → login → dashboard → edit preferences → recommendations update). Screenshot each screen.
- [ ] **Step 2:** Apply frontend-design guidance to the screenshots' weak points (spacing, hierarchy, image aspect consistency, attribution captions); iterate until the flow reads as one designed system.
- [ ] **Step 3:** Run `pnpm test && pnpm build` one final time. Commit: `polish: visual pass over wizard and dashboard`
