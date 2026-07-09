# Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every P0/P1 gap in `docs/superpowers/specs/2026-07-09-production-readiness-gaps.md` so Canvas Club can charge real members, run real quarterly rotations through partner galleries, and operate the Business Plan v3 pilot.

**Architecture:** Extend the existing pattern everywhere: typed domain objects in `lib/types.ts`, a store interface with Supabase + file implementations, thin session-guarded API routes, client pages consuming them. New subsystems (billing, email, rotations, ledger) each get their own `lib/` module with unit tests, a Supabase migration committed under `supabase/migrations/`, and API routes under `app/api/`. Pure logic (assignment engine, splits, token hashing) is always separated from I/O so it is unit-testable.

**Tech Stack:** Next.js 15 App Router, TypeScript, Supabase Postgres + Storage, Stripe (Checkout + Billing Portal + webhooks), Resend (email), vitest, Playwright, Sentry.

## Global Constraints

- All customer prices are VAT-inclusive; royalties compute on net (÷1.2) — reuse `lib/pricing.ts` (`VAT_RATE`, `PLANS`, `FRAME_KIT_PRICES`).
- Buy-to-keep split: 50% artist / 25% gallery / 25% Canvas Club on net sale (spec B7, plan v3 §5.6).
- Every new table: RLS enabled, no policies (deny-all; server uses secret key) — same posture as `users`/`prints`.
- Every store: interface + `Supabase*Store` + `File*Store` (pattern: `lib/prints-store.ts`); file store keeps dev/tests offline.
- Migrations are committed as files in `supabase/migrations/NNN_name.sql` AND applied via Supabase MCP `apply_migration` with the same name.
- UI uses the existing gallery token system (wall/ink/red-dot, Fraunces/Archivo, museum labels). No em dashes in copy. British English.
- Secrets only in env; never in code, migrations, or logs. New env vars documented in `docs/runbook.md` and `.env.local`.
- TDD for every `lib/` module; API routes verified by curl steps; UI verified by Playwright steps.
- Commit after every task with a conventional message; run `pnpm test && pnpm lint && npx tsc --noEmit` before each commit.
- `[EXT]` steps need Brendon's input (keys, DNS, copy); each such task states its blocking input at the top and everything after the marker can be finished later without rework.

## Milestone map (dependency order)

| # | Milestone | Spec items | Blocking [EXT] |
|---|---|---|---|
| M0 | Platform guardrails | D2, H1, H2, H3, H4(doc) | none |
| M1 | Addresses, email, password reset | B4, C1, C2, D1, D6 | Resend key + DNS |
| M2 | Billing | A1-A5, D4, F3(export/delete) | Stripe keys |
| M3 | Rotations + assignment | B1, B2, B9, E3, I1 | none |
| M4 | Fulfilment + returns + ledger | B3, B5(manual), B6, B8 | none |
| M5 | Catalogue, imagery, buy-to-keep | E1, E2, B7 | none |
| M6 | Legal + consent | F1, F2, F4, F5, F3(consent) | legal copy + company details |
| M7 | Observability, QA, admin | G1-G6, H5, H6, I4, D3 | Sentry/analytics accounts |

Deferred P2 (tracked, not planned here): D5 email verification, D7 session table, I2 pause, I3 referrals, I5 originals export beyond admin count, I6 post-delivery ratings, B5 carrier API.

---

## Milestone 0: Platform guardrails

### Task 0.1: Fail-fast env validation

**Files:**
- Create: `lib/env.ts`, `lib/__tests__/env.test.ts`
- Modify: `lib/store.ts:16-22`, `lib/prints-store.ts:151-157`, `lib/session.ts:6-10`

**Interfaces:**
- Produces: `requireEnv(name: string): string` (throws `Error("Missing required env: <name>")`), `isProduction(): boolean` (`process.env.NODE_ENV === "production"`), `envOrDevFallback(name: string, devFallback: string): string` (returns fallback only when NOT production, else `requireEnv`).

- [ ] **Step 1: Failing tests** — `env.test.ts`: `requireEnv` returns value when set; throws with exact message when unset; `envOrDevFallback` returns fallback when `NODE_ENV=test`; throws when `NODE_ENV=production` and unset (use `vi.stubEnv`).
- [ ] **Step 2:** Run `pnpm test lib/__tests__/env.test.ts` → FAIL (module missing).
- [ ] **Step 3:** Implement `lib/env.ts` per interface (12 lines, no deps).
- [ ] **Step 4:** Wire in: `session.ts` secret → `envOrDevFallback("SESSION_SECRET", "canvas-club-dev-secret-do-not-use-in-production")`; in `store.ts` and `prints-store.ts`, when `isProduction()` and either Supabase var is missing, `throw new Error("Supabase env missing in production")` instead of silently using the file store.
- [ ] **Step 5:** `pnpm test` all green; commit `feat: fail-fast env validation in production`.

### Task 0.2: Security headers + SEO baseline

**Files:**
- Modify: `next.config.mjs`, `app/layout.tsx`
- Create: `app/icon.svg`, `app/opengraph-image.png` (generate: ink `CC` monogram + red dot on wall background, 1200×630, via the Pillow venv used for the contact sheet), `app/robots.ts`, `app/sitemap.ts`

**Interfaces:** none downstream.

- [ ] **Step 1:** `next.config.mjs` `headers()` → on `/(.*)`: `Strict-Transport-Security: max-age=63072000; includeSubDomains`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. (CSP deferred to M7 with Sentry, to set report-uri once.)
- [ ] **Step 2:** `app/robots.ts` allow all, disallow `/api/`, `/partner`, `/dashboard`; `app/sitemap.ts` list `/`, `/login` (M5 adds gallery pages; M6 adds legal pages).
- [ ] **Step 3:** `layout.tsx` metadata: add `metadataBase` (env `NEXT_PUBLIC_SITE_URL`, dev fallback `http://localhost:3000`), `openGraph` {title, description, images}.
- [ ] **Step 4:** Verify: `curl -sI localhost:3000 | grep -iE "x-frame|referrer"` shows headers; `curl localhost:3000/robots.txt` renders. Commit `feat: security headers, robots, sitemap, OG baseline`.

### Task 0.3: Committed migrations + runbook

**Files:**
- Create: `supabase/migrations/001_users.sql`, `supabase/migrations/002_gallery_roles_and_prints.sql` (transcribe the two applied migrations verbatim from Supabase MCP `list_migrations`/dashboard), `docs/runbook.md`

- [ ] **Step 1:** Transcribe both existing migrations into files; header comment: `-- applied to project rkechryksozrapnsfexw on <date> via MCP`.
- [ ] **Step 2:** Write `docs/runbook.md`: env var table (name, purpose, where to get it) covering `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL` and placeholders for M1/M2/M7 vars; deploy steps (Vercel project, env setup, `main` = production, branch = preview); migration workflow (write file → apply via MCP with matching name → commit); backups section: current Supabase free-tier position, restore steps, and the [EXT] decision on paid PITR before real member data (spec H4); local dev quickstart; test accounts.
- [ ] **Step 3:** Commit `docs: committed migrations and operations runbook`.

---

## Milestone 1: Addresses, email, password reset — [EXT: RESEND_API_KEY + sending-domain DNS before Step "send live"]

### Task 1.1: Shipping address on the member record

**Files:**
- Modify: `lib/types.ts`, `app/api/auth/register/route.ts`, `app/api/user/me/preferences/route.ts` (no change; addresses get their own route), `components/wizard/account-step.tsx`, `components/wizard/use-wizard-state.ts`, `app/dashboard/page.tsx`
- Create: `supabase/migrations/003_address.sql`, `app/api/user/me/address/route.ts`, `lib/__tests__/address.test.ts` (validation only)

**Interfaces:**
- Produces: `interface Address { name: string; line1: string; line2?: string; city: string; postcode: string }` on `User.address?: Address`; `validateAddress(a: Partial<Address>): string | null` in new `lib/address.ts` (returns first error message or null; postcode regex `/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i`).
- Migration: `alter table public.users add column if not exists address jsonb;`

- [ ] **Step 1:** TDD `validateAddress` (valid UK postcode passes incl. lowercase/space variants; missing line1/city/postcode fail with specific messages).
- [ ] **Step 2:** Migration file + apply via MCP (`003_address`).
- [ ] **Step 3:** Types + Supabase/file store passthrough (jsonb column mapped like `preferences`).
- [ ] **Step 4:** Wizard Account step: address fieldset (Name on parcel, Address line 1, line 2 optional, City, Postcode) validated in `validateStep("Account")` via `validateAddress`; include in `registrationPayload()`; register route persists it.
- [ ] **Step 5:** `GET/PUT /api/user/me/address` (session-guarded, PUT validates); dashboard "Delivery details" card showing address with inline edit form using the same fields.
- [ ] **Step 6:** Playwright: complete wizard with address → dashboard shows it; edit postcode → persists after reload. Commit `feat: shipping address capture and management`.

### Task 1.2: Email module (Resend) with dev capture

**Files:**
- Create: `lib/email.ts`, `lib/email-templates.ts`, `lib/__tests__/email-templates.test.ts`
- Modify: `docs/runbook.md` (RESEND_API_KEY, EMAIL_FROM), `.env.local`

**Interfaces:**
- Produces: `sendEmail(msg: { to: string; subject: string; text: string; html?: string }): Promise<void>` — uses Resend REST (`fetch`, no SDK) when `RESEND_API_KEY` set; otherwise appends JSON line to `data/outbox.jsonl` (dev capture, gitignored) so flows are testable offline. Template functions returning `{subject, text, html}`: `welcomeEmail(name)`, `passwordResetEmail(resetUrl)`, `dispatchEmail(name, works: {title, artist}[], trackingRef)`, `returnReminderEmail(name, dueDate, returnUrl)`, `pickListEmail(galleryName, count, portalUrl)`.
- HTML style: single-column, wall background, ink text, museum-label footer with company details placeholder `{{COMPANY_FOOTER}}` (M6 fills it).

- [ ] **Step 1:** TDD templates: each returns non-empty subject/text; reset email contains the URL verbatim; no em dashes in any copy.
- [ ] **Step 2:** Implement templates + `sendEmail` with dev-capture branch.
- [ ] **Step 3:** Manual: call `sendEmail` from a scratch script → `data/outbox.jsonl` gets a line. Commit `feat: transactional email module with offline outbox`.
- [ ] **Step 4 [EXT]:** When key + DNS exist: set env, send a live welcome email to Brendon, verify DKIM pass in received headers. Runbook updated.

### Task 1.3: Password reset flow

**Files:**
- Create: `supabase/migrations/004_password_resets.sql`, `lib/reset-tokens.ts`, `lib/__tests__/reset-tokens.test.ts`, `app/api/auth/reset/request/route.ts`, `app/api/auth/reset/confirm/route.ts`, `app/reset/page.tsx`
- Modify: `app/login/page.tsx` (add "Forgot password?" link), `lib/store.ts` + both store impls (add reset-token methods)

**Interfaces:**
- Migration: `create table public.password_resets (token_hash text primary key, email text not null, expires_at timestamptz not null); alter table public.password_resets enable row level security;`
- Produces in `lib/reset-tokens.ts` (pure): `generateResetToken(): { token: string; tokenHash: string }` (32 random bytes hex; hash = sha256 hex), `hashResetToken(token: string): string`.
- Store additions: `createResetToken(tokenHash, email, expiresAt)`, `consumeResetToken(tokenHash): Promise<string | null>` (returns email and deletes iff exists and unexpired).
- Routes: `POST /api/auth/reset/request {email}` → always 200 (no user enumeration); if user exists, store token (1h expiry) and `sendEmail(passwordResetEmail(url))` where url = `${NEXT_PUBLIC_SITE_URL}/reset?token=...`. `POST /api/auth/reset/confirm {token, password}` → consume, validate password ≥ 8, bcrypt-hash, `updateUser`, 200; 400 `"This reset link has expired or been used"` otherwise.

- [ ] **Step 1:** TDD token module (token≠hash, hash deterministic, 64-char hex).
- [ ] **Step 2:** Migration + store methods (file store: `data/resets.json`; TDD file-store consume-once + expiry semantics).
- [ ] **Step 3:** Routes per contract; `/reset` page: password + confirm inputs, reads token from query, success links to `/login`.
- [ ] **Step 4:** Raise password minimum to 8 everywhere: register route, reset confirm, `use-wizard-state.ts` validator, account-step copy ("At least 8 characters").
- [ ] **Step 5:** E2E via curl + outbox: request reset for seeded member → read URL from `data/outbox.jsonl` → confirm with new password → old password 401, new password 200. Commit `feat: password reset flow; 8-char password minimum`.

---

## Milestone 2: Billing (Stripe) — [EXT: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, price setup]

### Task 2.1: Billing state + Stripe products

**Files:**
- Create: `supabase/migrations/005_billing.sql`, `lib/billing.ts`, `lib/__tests__/billing.test.ts`, `scripts/setup-stripe.mjs`
- Modify: `lib/types.ts`, both user stores

**Interfaces:**
- `User` gains: `stripeCustomerId?: string`, `billingStatus: "none" | "active" | "past_due" | "cancelled"` (default `"none"`). Migration: `alter table public.users add column if not exists stripe_customer_id text, add column if not exists billing_status text not null default 'none';`
- `lib/billing.ts` produces: `getStripe(): Stripe` (lazy, `requireEnv("STRIPE_SECRET_KEY")`), `PLAN_PRICE_LOOKUP: Record<PlanName, string>` = lookup_keys `plan_basic|plan_standard|plan_premium`, `FRAME_KIT_LOOKUP: Record<number, string>` = `frame_kit_1|frame_kit_3|frame_kit_5`, `mapStripeStatus(s: Stripe.Subscription.Status): User["billingStatus"]` (pure: `active|trialing→active`, `past_due|unpaid→past_due`, `canceled|incomplete_expired→cancelled`, else `none`).
- `scripts/setup-stripe.mjs` [EXT]: idempotently creates products/prices with those lookup keys, GBP, `tax_behavior: "inclusive"`, amounts from `lib/pricing.ts` (1500/3000/5000; 3500/7900/11900 one-time).

- [ ] **Step 1:** `pnpm add stripe`. TDD `mapStripeStatus` (pure).
- [ ] **Step 2:** Migration + types + store mapping (both impls).
- [ ] **Step 3:** Implement `lib/billing.ts`; write setup script. Commit `feat: billing state and Stripe client scaffolding`.
- [ ] **Step 4 [EXT]:** With test keys in env: run setup script; verify products in Stripe test dashboard.

### Task 2.2: Checkout + webhook + portal

**Files:**
- Create: `app/api/billing/checkout/route.ts`, `app/api/billing/webhook/route.ts`, `app/api/billing/portal/route.ts`
- Modify: `app/dashboard/page.tsx` (plan card: billing status badge + "Start membership"/"Manage billing" button), `components/wizard/account-step.tsx` success copy ("check your dashboard to start your membership")

**Interfaces:**
- `POST /api/billing/checkout` (session-guarded): creates/reuses Stripe customer (store id), Checkout Session `mode: "subscription"` with plan price by lookup key + Frame Kit one-time line when `user.subscription.frameKit && billingStatus === "none"`, `success_url: /dashboard?billing=success`, `cancel_url: /dashboard?billing=cancelled`; returns `{url}`; client redirects.
- `POST /api/billing/webhook`: raw-body signature verify (`STRIPE_WEBHOOK_SECRET`); on `checkout.session.completed` + `customer.subscription.updated|deleted` + `invoice.payment_failed`: look up user by `stripe_customer_id`, `updateUser({billingStatus: mapStripeStatus(...)})`. Store needs `getUserByStripeCustomerId(id)` (add to interface + both impls, TDD in file store).
- `POST /api/billing/portal`: returns `{url}` of a Billing Portal session (cancellation self-serve = spec A4).

- [ ] **Step 1:** TDD file-store `getUserByStripeCustomerId`.
- [ ] **Step 2:** Implement three routes per contract (webhook route: `export const runtime = "nodejs"`, read raw body via `await req.text()`).
- [ ] **Step 3:** Dashboard wiring: `billingStatus === "active"` → "Manage billing" → portal; else red-dot-accented "Start membership: £X/month" → checkout.
- [ ] **Step 4 [EXT]:** `stripe listen --forward-to localhost:3000/api/billing/webhook`; test-card checkout end-to-end; verify `billing_status` flips to `active` in Supabase; cancel in portal → `cancelled`. Commit `feat: Stripe checkout, webhook, and self-serve billing portal`.

### Task 2.3: Account management + GDPR export/delete

**Files:**
- Create: `app/api/user/me/route.ts` (DELETE), `app/api/user/me/export/route.ts` (GET), `app/account/page.tsx`
- Modify: `app/dashboard/page.tsx` (link "Account settings"), `lib/store.ts` + impls (`deleteUser(email)`), `app/api/auth/*` (change-password handled here via current-password check)

**Interfaces:**
- `/account` page (session-guarded): change password (current + new≥8 → verify bcrypt, update), change email (password + new email → uniqueness check, update, re-issue session cookie), download-my-data button (GET export → JSON file of user record minus hash + rotations/ledger when they exist), delete account (type-DELETE confirm → cancels Stripe subscription if `stripeCustomerId` via `subscriptions.cancel`, `deleteUser`, clears cookie, redirects `/`).
- `deleteUser` in both stores (file store TDD).

- [ ] **Step 1:** TDD `deleteUser` file store.
- [ ] **Step 2:** Routes: `PUT /api/user/me` `{action: "password"|"email", ...}` with the checks above; `DELETE /api/user/me`; `GET /api/user/me/export` returns `Content-Disposition: attachment`.
- [ ] **Step 3:** Build `/account` page (token-system UI, four cards).
- [ ] **Step 4:** curl E2E: change password → old 401/new 200; export contains email + preferences; delete → login 401, Supabase row gone. Commit `feat: account settings with GDPR export and delete`.

---

## Milestone 3: Rotations and the assignment engine

### Task 3.1: Rotations data model + store

**Files:**
- Create: `supabase/migrations/006_rotations.sql`, `lib/rotations-store.ts`, `lib/__tests__/rotations-store.test.ts`
- Modify: `lib/types.ts`

**Interfaces:**
```ts
export type RotationStatus = "curating" | "picklist" | "dispatched" | "closed"
export interface Rotation { id: string; memberEmail: string; galleryId: string; status: RotationStatus; returnDue: string | null; trackingRef: string | null; returnToken: string; createdAt: string }
export type RotationItemStatus = "assigned" | "dispatched" | "returned" | "purchased"
export interface RotationItem { id: string; rotationId: string; printId: string; title: string; artist: string; status: RotationItemStatus; conditionNote: string | null }
export interface RotationStore {
  create(r: Omit<Rotation, "id" | "createdAt">, items: Omit<RotationItem, "id" | "rotationId">[]): Promise<Rotation>
  getByMember(email: string): Promise<{ rotation: Rotation; items: RotationItem[] }[]>
  getByGalleryAndStatus(galleryId: string, status: RotationStatus): Promise<{ rotation: Rotation; items: RotationItem[] }[]>
  getByReturnToken(token: string): Promise<{ rotation: Rotation; items: RotationItem[] } | null>
  updateRotation(id: string, updates: Partial<Pick<Rotation, "status" | "returnDue" | "trackingRef">>): Promise<Rotation | null>
  updateItem(id: string, updates: Partial<Pick<RotationItem, "status" | "conditionNote">>): Promise<RotationItem | null>
}
export function getRotationStore(): RotationStore // env-switched like getStore()
```
- Migration: `rotations` + `rotation_items` tables mirroring the interface (snake_case, uuids, `return_token text unique not null`), indexes on `(member_email)`, `(gallery_id, status)`, `(return_token)`; RLS deny-all. Item rows denormalise `title`/`artist` so history survives print edits.

- [ ] **Step 1:** TDD file store: create-with-items roundtrip; getByMember ordering (newest first); token lookup; item status update; unknown ids → null.
- [ ] **Step 2:** Migration file + MCP apply; Supabase impl (insert rotation then items; reads join in two queries).
- [ ] **Step 3:** Commit `feat: rotations data model and store`.

### Task 3.2: Assignment engine (pure) + admin trigger

**Files:**
- Create: `lib/assignment.ts`, `lib/__tests__/assignment.test.ts`, `app/api/admin/rotations/route.ts`
- Modify: `lib/types.ts` (add `"admin"` to `UserRole`)

**Interfaces:**
```ts
export interface AssignmentInput { preferences: Preferences; sizePreference: string; planPrints: number; availablePrints: GalleryPrint[]; previouslyAssignedPrintIds: string[] }
export interface AssignmentResult { printIds: string[]; galleryId: string; reasons: Record<string, string> }
export function assignRotation(input: AssignmentInput): AssignmentResult | { error: string }
```
- Pure scoring per plan v3 §7.2: +3 subStyle match, +2 mainStyle, +2/-3 love/dislike rating on styleId, +1 size preference satisfied (`sizes` includes preference or preference is `Mixed`); filter `status === "listed" && stockCount > 0` and not previously assigned; single gallery per rotation (pick the gallery whose top-N total score is highest — pilot ships one tube from one gallery); error `"Not enough available stock to build this rotation"` when best gallery can't fill `planPrints`.
- `POST /api/admin/rotations {memberEmail}` (admin-guarded): loads member + all listed prints + member's history → `assignRotation` → `RotationStore.create` (status `curating`, returnToken = 32-hex via `crypto.randomBytes`), decrements nothing yet (stock decrements at dispatch, M4). Returns created rotation. `GET` lists all rotations by status for the admin UI (M7).

- [ ] **Step 1:** TDD engine: loved+substyle print ranks first; disliked style excluded when alternatives exist; never assigns previously assigned ids; single-gallery constraint chooses higher-scoring gallery; stock-short gallery skipped; error case message exact.
- [ ] **Step 2:** Implement engine; admin role guard helper `requireAdmin()` in `lib/auth-server.ts` (403 otherwise); route per contract.
- [ ] **Step 3:** Seed an admin: SQL `update users set role='admin' where email='<brendon's account>'` documented in runbook (do not hardcode).
- [ ] **Step 4:** curl: create rotation for seeded member against Red House stock → 200 with N items. Commit `feat: rules-based assignment engine and admin rotation trigger`.

### Task 3.3: Member rotation visibility + real-stock recommendations + extend

**Files:**
- Create: `app/api/rotations/me/route.ts`, `app/api/rotations/me/extend/route.ts`, `components/current-collection.tsx`
- Modify: `app/dashboard/page.tsx` (replace hardcoded "First Box Preparing" block), `lib/recommend.ts`, `app/api/recommendations/route.ts`

**Interfaces:**
- `GET /api/rotations/me` → `{ current: { rotation, items }| null, history: [...] }` (current = newest not `closed`).
- `POST /api/rotations/me/extend` → allowed when current status is `dispatched`; pushes `returnDue` +90 days, returns updated rotation (spec I1; one extension per rotation: reject with 400 `"This rotation has already been extended"` if returnDue was already extended — track via `trackingRef` untouched + compare: add `extended boolean default false` column in migration 006 to keep it honest).
- `recommendFromStock(prefs: Preferences, prints: GalleryPrint[], limit?: number): Recommendation[]` added to `lib/recommend.ts` (same scoring; falls back to existing catalogue `recommend()` when fewer than 3 stocked matches); recommendations route uses it with live prints.

- [ ] **Step 1:** TDD `recommendFromStock` (stock match outranks catalogue fallback; fallback fills to limit).
- [ ] **Step 2:** Routes; dashboard: when current rotation exists show works (title, artist, museum label, status, return date, red-dot on `purchased` items) + "Keep this collection another quarter" button wired to extend; else keep the preparing card.
- [ ] **Step 3:** Playwright: admin-create rotation for test member → dashboard shows the collection; extend button updates the date and refuses a second time. Commit `feat: member rotation view, extend-rotation, stock-aware recommendations`.

---

## Milestone 4: Fulfilment, returns, royalty ledger

### Task 4.1: Pick list + dispatch in the partner portal

**Files:**
- Create: `app/api/partner/picklist/route.ts`, `app/api/partner/dispatch/route.ts`, `components/partner/pick-list.tsx`
- Modify: `app/partner/page.tsx` (tabs: "Stock" | "Pick list"), `app/api/admin/rotations/route.ts` (admin can move `curating → picklist`)

**Interfaces:**
- `GET /api/partner/picklist` (gallery-guarded) → rotations for this gallery with status `picklist`, each: member address (from `User.address`), items (title/artist/size), rotation id.
- `POST /api/partner/dispatch {rotationId, trackingRef}` (gallery-guarded, rotation must belong to gallery, status `picklist`): sets status `dispatched`, `returnDue = today + 90d`, saves trackingRef; decrements `stockCount` per item's print (floor 0); marks items `dispatched`; sends `dispatchEmail` to member; sends nothing to gallery.
- Admin `PATCH /api/admin/rotations {rotationId, status: "picklist"}` triggers `pickListEmail` to the gallery account's email.

- [ ] **Step 1:** TDD (file stores): dispatch decrements stock exactly once per item and is rejected (409) when status ≠ `picklist`.
- [ ] **Step 2:** Routes per contract; portal Pick list tab: card per rotation (address block, works list, tracking-ref input, "Mark dispatched" button).
- [ ] **Step 3:** E2E: admin moves rotation to picklist → outbox has gallery email → portal shows it → dispatch with ref `TEST-123` → stock down, member outbox email contains ref, dashboard status `dispatched`. Commit `feat: gallery pick list and dispatch flow`.

### Task 4.2: QR return flow

**Files:**
- Create: `app/returns/[token]/page.tsx`, `app/api/returns/[token]/route.ts`, `app/api/partner/returns/route.ts`
- Modify: `components/current-collection.tsx` (show return QR when status is `dispatched`), `app/partner/page.tsx` (Returns tab), `lib/email-templates.ts` (reminder already exists; used by 4.3)

**Interfaces:**
- QR: render `${NEXT_PUBLIC_SITE_URL}/returns/<returnToken>` as SVG QR client-side (`pnpm add qrcode`; generate data URL in the component; no server dependency).
- `GET /api/returns/[token]` → public, token-authenticated summary `{galleryName, items, status}`. `POST` (public, token-auth) records `memberConfirmedReturnAt` (column in migration 006: `member_confirmed_return_at timestamptz`); rotation status stays `dispatched` until the gallery confirms receipt.
- `POST /api/partner/returns {rotationId, items: [{itemId, ok: boolean, conditionNote?}]}` (gallery-guarded): items with `ok` → status `returned` + print stock +1; not-ok → `returned` + conditionNote (damage handling is a note, not a blocker, for pilot); when all items terminal (`returned|purchased`) rotation → `closed`.

- [ ] **Step 1:** TDD file-store: gallery-confirm restocks only `ok` items; rotation closes when all items terminal.
- [ ] **Step 2:** Public return page: works list + "I've dropped this at a locker" confirm; portal Returns tab mirrors pick-list layout with per-item OK/damage toggles.
- [ ] **Step 3:** E2E through curl + Playwright: full loop dispatch → member confirm → gallery confirm → stock restored, rotation closed, dashboard shows history. Commit `feat: QR return flow with gallery inspection and restock`.

### Task 4.3: Royalty ledger + statements + return reminders

**Files:**
- Create: `supabase/migrations/007_ledger.sql`, `lib/ledger.ts`, `lib/__tests__/ledger.test.ts`, `app/api/partner/statement/route.ts`, `app/api/admin/reminders/route.ts`
- Modify: dispatch route (write rotation royalty entries), `app/partner/page.tsx` (Statement tab)

**Interfaces:**
```ts
export interface LedgerEntry { id: string; type: "rotation_royalty" | "sale"; galleryId: string; printId: string; rotationItemId: string | null; artistAmount: number; galleryAmount: number; platformAmount: number; createdAt: string }
export function rotationRoyalty(netMonthlyRevenue: number, planPrints: number): { artistAmount: number; galleryAmount: number; platformAmount: number } // emerging split 20/10/70 of net, divided per print, rounded to pence
export function saleSplit(netSaleAmount: number): { artistAmount: number; galleryAmount: number; platformAmount: number } // 50/25/25
```
- Migration: `ledger` table mirroring interface + `LedgerStore` (`append`, `listByGallery(galleryId, monthISO)`) with both impls.
- Dispatch writes one `rotation_royalty` entry per item using member's plan (`PLANS[plan].monthly / 1.2` net × 3 months / prints — one quarter's royalty recognised at dispatch, per plan v3 §5.5 monthly statements note in the statement view).
- `GET /api/partner/statement?month=2026-07` → gallery's entries + totals; portal Statement tab renders table + CSV download (client-side blob).
- `POST /api/admin/reminders` (admin or Vercel cron with `CRON_SECRET` header): for rotations with `returnDue` in 14 or 3 days and not reminded at that threshold (add `reminders_sent jsonb default '[]'` to migration 006), send `returnReminderEmail`. Wire `vercel.json` cron daily 08:00.

- [ ] **Step 1:** TDD `rotationRoyalty` (Standard £30 → net £25 → quarter £75 → pool 30% = £22.50 → per print £7.50 split £5.00/£2.50 artist/gallery... assert exact pence: artist 500, gallery 250, platform 1750 per print in pence) and `saleSplit` (£120 sale → net £100 → 50/25/25).
- [ ] **Step 2:** Migration + store + dispatch integration + statement route/tab + reminders route + `vercel.json`.
- [ ] **Step 3:** E2E: dispatch → statement shows entries and correct totals; reminders endpoint with a rotation due in 3 days writes outbox email once, not twice. Commit `feat: royalty ledger, gallery statements, return reminders`.

---

## Milestone 5: Catalogue, imagery, buy-to-keep

### Task 5.1: Print imagery via Supabase Storage

**Files:**
- Create: `supabase/migrations/008_print_images.sql` (`alter table public.prints add column if not exists image_path text;`), `app/api/partner/prints/upload/route.ts`
- Modify: `lib/types.ts` (`GalleryPrint.imagePath?: string`), `lib/prints-store.ts` (map column), `app/partner/page.tsx` (file input in Add-print dialog + thumbnail in list), `next.config.mjs` (`images.remotePatterns` for `rkechryksozrapnsfexw.supabase.co`)

**Interfaces:**
- Storage bucket `print-images` (public-read), created once via the Supabase MCP/dashboard and documented in the runbook. The upload route uses the service client's `storage.from("print-images")`.
- `POST /api/partner/prints/upload` (gallery-guarded, multipart): accepts jpeg/png/webp ≤ 8MB, path `galleryId/<uuid>.<ext>`, returns `{imagePath: publicUrl}`; client sends it with print create/PATCH.

- [ ] **Step 1:** Create bucket (public) + migration; store mapping.
- [ ] **Step 2:** Upload route (validate content-type + size; reject others 415/413) + dialog file input + list thumbnails (next/image).
- [ ] **Step 3:** Playwright: add print with an image from `public/art/seascape.jpg` → thumbnail renders in portal list. Commit `feat: print imagery upload and display`.

### Task 5.2: Public gallery catalogue pages

**Files:**
- Create: `app/galleries/page.tsx`, `app/galleries/[id]/page.tsx`, `app/api/galleries/[id]/prints/route.ts`
- Modify: `components/wizard/intro-step.tsx` (hub cards link to pages), `app/sitemap.ts` (add gallery routes), `app/dashboard/page.tsx` ("Browse partner galleries" link)

**Interfaces:**
- `GET /api/galleries/[id]/prints` (public): listed prints only, fields `{id, title, artist, styleId, sizes, retailPrice, imagePath}` — stock counts NOT exposed publicly.
- `/galleries` index: hub cards from `GALLERY_HUBS`; `/galleries/[id]`: gallery header (name, location, role), grid of prints with museum labels + "Available through membership" framing + buy-to-keep price.

- [ ] **Step 1:** API route + pages in the token system (server components fetching via store directly, not the API, for SSR speed — route exists for client refresh needs).
- [ ] **Step 2:** Playwright: `/galleries/red-house` renders seeded prints with images; unlisted prints absent; page is publicly accessible logged-out. Commit `feat: public partner gallery catalogue pages`.

### Task 5.3: Buy-to-keep

**Files:**
- Create: `app/api/billing/buy/route.ts`, extend `app/api/billing/webhook/route.ts`
- Modify: `components/current-collection.tsx` ("Love it? Keep it" button per dispatched item), `lib/ledger.ts` consumers

**Interfaces:**
- `POST /api/billing/buy {rotationItemId}` (session-guarded; item must belong to caller, status `dispatched`): Stripe Checkout `mode: "payment"`, `price_data` ad hoc GBP `retailPrice` inclusive tax, metadata `{rotationItemId, printId, galleryId}`, success `/dashboard?purchase=success`.
- Webhook `checkout.session.completed` with `metadata.rotationItemId`: mark item `purchased`, decrement nothing (stock already decremented at dispatch — the work simply never returns), append `sale` ledger entry via `saleSplit(retailPrice / 1.2)`.

- [ ] **Step 1:** TDD: webhook handler unit (given metadata + stores, item flips to purchased and ledger gains a sale entry with correct split — factor handler into `lib/billing-events.ts` pure-ish function taking stores as args for testability).
- [ ] **Step 2:** Route + button + webhook branch.
- [ ] **Step 3 [EXT]:** Stripe test-mode E2E: buy an item → dashboard shows red-dot "Yours", statement shows the sale. Commit `feat: buy-to-keep checkout with commission ledger`.

---

## Milestone 6: Legal and consent — [EXT: reviewed copy + company details before merge]

### Task 6.1: Legal pages + footer + consent

**Files:**
- Create: `app/(legal)/terms/page.tsx`, `app/(legal)/privacy/page.tsx`, `components/site-footer.tsx`
- Modify: `app/layout.tsx` (footer on all pages), `components/wizard/account-step.tsx` (consent checkboxes), `app/api/auth/register/route.ts` (persist `marketingConsent`), `supabase/migrations/009_consent.sql`, `app/sitemap.ts`

**Interfaces:**
- Zero new dependencies: legal content lives as plain `.tsx` prose pages styled with the token system (drop the `content/*.md` files from the file list; the pages own their copy).
- Draft content written by the implementer covering plan v3 obligations (rotation terms, damage, 14-day cooling-off, cancellation via portal, buy-to-keep, data processors list) with `{{COMPANY_NAME}}`, `{{COMPANY_NUMBER}}`, `{{COMPANY_ADDRESS}}` placeholders and a red banner "DRAFT: pending legal review" until [EXT] sign-off replaces placeholders and removes the banner.
- Register gains `marketingConsent: boolean` (checkbox, unticked, "Email me occasional news from Canvas Club and partner galleries") + required T&C tick ("I agree to the membership terms" linking `/terms`; block submit without it). Migration: `alter table public.users add column if not exists marketing_consent boolean not null default false;`
- Footer: company placeholder line, links to `/terms`, `/privacy`, `/galleries`, contact mailto. Email templates' `{{COMPANY_FOOTER}}` filled from one shared constant `lib/company.ts` (`COMPANY_FOOTER_TEXT`).

- [ ] **Step 1:** Migration + register/consent plumbing + wizard checkboxes (validation: terms required).
- [ ] **Step 2:** Draft both pages + footer + `lib/company.ts`; wire email footer.
- [ ] **Step 3:** Playwright: cannot register without terms tick; footer links render on `/`, `/dashboard`, `/galleries`. Commit `feat: draft legal pages, consent capture, site footer`.
- [ ] **Step 4 [EXT]:** Replace placeholders with real company details + signed-off copy; remove draft banners.

---

## Milestone 7: Observability, QA, admin

### Task 7.1: Sentry + request logging + rate limiting

**Files:**
- Create: `lib/rate-limit.ts`, `lib/__tests__/rate-limit.test.ts`, `instrumentation.ts`, `sentry.client.config.ts`, `sentry.server.config.ts`
- Modify: `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts`, `app/api/auth/reset/request/route.ts`, `next.config.mjs` (Sentry wrapper + CSP header incl. Sentry ingest)

**Interfaces:**
- `checkRateLimit(bucket: string, key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSeconds: number }` — in-memory Map sliding window (documented limitation: per-instance; adequate for pilot on one region). Auth routes: 10/15min per IP (`x-forwarded-for` first hop) → 429 with `Retry-After`.
- Sentry via `@sentry/nextjs` wizardless manual setup, DSN from env `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN`, `tracesSampleRate: 0.1`. [EXT: DSN]
- Logging: tiny `logRequest(route, status, ms, emailHash?)` console JSON in the auth/billing/partner routes (Vercel captures stdout).

- [ ] **Step 1:** TDD rate limiter (allows N, blocks N+1, window expiry restores, buckets independent).
- [ ] **Step 2:** Wire limiter + logging; `pnpm add @sentry/nextjs`; configs; CSP header now added: `default-src 'self'; img-src 'self' data: https://rkechryksozrapnsfexw.supabase.co; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.ingest.sentry.io https://api.stripe.com; frame-src https://checkout.stripe.com https://billing.stripe.com`.
- [ ] **Step 3:** Verify: 11 rapid failed logins → 429; build passes with CSP (check console for violations across wizard/dashboard/portal). Commit `feat: rate limiting, Sentry, structured logging, CSP`.

### Task 7.2: Committed E2E suite in CI

**Files:**
- Create: `playwright.config.ts`, `e2e/wizard.spec.ts`, `e2e/returning-member.spec.ts`, `e2e/partner.spec.ts`, `e2e/rotation-loop.spec.ts`, `e2e/a11y.spec.ts`
- Modify: `.github/workflows/ci.yml`, `package.json` (`"e2e": "playwright test"`)

**Interfaces:**
- Config: `webServer: { command: "pnpm dev", url: "http://localhost:3000" }`, env forces file stores (unset Supabase vars) + fresh `DATA_DIR` per run, chromium only.
- Specs assert the golden paths built in M1-M5 (signup incl. address + terms tick; login → dashboard; partner add print/stock/pick-list dispatch; admin-assign → dispatch → member return confirm → gallery restock; axe scan (`@axe-core/playwright`) on `/`, `/login`, `/dashboard`, `/partner` with zero serious/critical violations — fix findings, notably `stone`-on-`wall` contrast if flagged (H5)).
- CI: new job `e2e` after build, `npx playwright install --with-deps chromium`, artifact traces on failure.

- [ ] **Step 1:** Config + wizard/returning specs green locally.
- [ ] **Step 2:** Partner + rotation-loop specs green.
- [ ] **Step 3:** a11y spec; fix violations found (adjust `--muted-foreground` lightness if contrast < 4.5:1 for body-size text).
- [ ] **Step 4:** CI wiring; push; confirm green on GitHub. Commit `test: end-to-end suite with accessibility gates in CI`.

### Task 7.3: Admin dashboard + analytics + uptime + mobile pass

**Files:**
- Create: `app/admin/page.tsx`
- Modify: `app/api/admin/rotations/route.ts` (already lists; add member/gallery summaries: `GET /api/admin/overview`), `app/layout.tsx` (Plausible script when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` set)

**Interfaces:**
- `/admin` (admin-guarded): counts (members by billing status, originals-interest count for I5, rotations by status, prints/stock by gallery), rotations table with status-advance buttons (`curating → picklist`), "Create rotation" form (member email), link to trigger reminders.
- Analytics: single `<script defer data-domain=... src="https://plausible.io/js/script.js">` gated on env. [EXT: account]
- Uptime: document chosen pinger in runbook hitting `/` and `/api/auth/me` (expect 401 = alive). [EXT: provider choice]
- Mobile pass (H6): Playwright viewport 375×812 screenshots of wizard steps, dashboard, portal; fix cramping found (expected: step-nav labels → hide below `sm`, portal print rows → stack vertically, salon hero height clamp).

- [ ] **Step 1:** Overview route + admin page.
- [ ] **Step 2:** Analytics gate + runbook uptime section.
- [ ] **Step 3:** Mobile screenshot pass; apply fixes; re-shoot.
- [ ] **Step 4:** Full suite (`pnpm test && pnpm lint && pnpm build && pnpm e2e`) green. Commit `feat: admin dashboard, analytics gate, mobile polish`.

---

## Definition of done (maps back to spec)

Every P0/P1 spec item lands in: A1-A5→M2, B1-B9→M3/M4 (B5 manual path; API = deferred P2), C1-C2→M1, D1/D2/D3/D4/D6→M1/M0/M7/M2, E1-E3→M5/M3, F1-F5→M6 (+F3 export/delete in M2), G1-G6→M7, H1-H4→M0, H5/H6→M7, I1→M3, I4→M7. Deferred P2 list unchanged. After M7: tag `v1.0-pilot`, merge to `main` deliberately (Vercel prod), run the runbook checklist.
