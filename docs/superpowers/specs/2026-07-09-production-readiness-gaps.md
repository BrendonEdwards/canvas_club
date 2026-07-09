# Canvas Club: Production-Readiness Gap Audit

**Date:** 2026-07-09
**Scope:** everything between the current `feature/canvas-club-v2` branch and a state where real members pay real money, real galleries ship real prints, and the business can operate the pilot described in Business Plan v3.
**Method:** codebase audit (routes, stores, env usage, stubs) cross-checked against Business Plan v3 §7.1 Phase 1 and UK consumer-business norms.

## How to read this

- **P0 - launch blockers.** Cannot take a paying member or run one rotation without these.
- **P1 - pilot hardening.** Needed within the first weeks of a live pilot; launching without them is a known, accepted risk.
- **P2 - scale/deferred.** Fine to postpone until after pilot evidence.
- **[EXT]** marks items needing something only Brendon can provide (an account, a key, legal copy, a company number).

Current state for context: auth (bcrypt + JWT cookie sessions), taste-profile wizard, recommendations against the static style catalogue, gallery partner portal (stock CRUD), Supabase Postgres (`users`, `prints`), CI (lint/test/build), 23 unit tests, verified imagery, VAT-inclusive pricing aligned to Business Plan v3.

---

## A. Payments and billing — P0

The wizard ends at a waitlist by design, but "production" means charging members.

- **A1. Stripe subscription checkout.** [EXT: Stripe account + keys] No payment capability exists anywhere. Needed: Stripe Checkout for the three plan tiers (monthly, VAT-inclusive prices), plus the Frame Kit as a one-time line item at signup.
- **A2. Webhook handling.** `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated/deleted` must update member billing state. No webhook route exists.
- **A3. Billing state on the user record.** `User` has no `stripeCustomerId`, no subscription status (`active | past_due | paused | cancelled`), no current-period data. The dashboard shows a price but nothing is billed.
- **A4. Self-serve manage/cancel.** Consumer Contracts Regulations require easy cancellation. Stripe's hosted Customer Portal is the fast path; a "Manage billing" link on the dashboard.
- **A5. Receipts/VAT invoices.** Stripe handles receipts if configured with VAT-inclusive prices and business details. [EXT: VAT registration decision with accountant]

## B. The operations loop — P0

Business Plan v3 §7.1 Phase 1 items 5-10. The consumer front end exists; the machine that actually moves art does not. This is the largest gap.

- **B1. Rotations data model.** No concept of a rotation exists. Needed: `rotations` table (member, quarter, status: `curating | picklist | dispatched | delivered | return_due | returned | closed`) and `rotation_items` (rotation, print, status, condition notes).
- **B2. Assignment engine.** `lib/recommend.ts` scores the *static style catalogue*, not gallery stock. Members must be matched to real `prints` rows with stock > 0, weighted by taste profile, avoiding repeats, respecting size preference and plan count. This is the pilot's core algorithm (rules-based per plan §7.2 — no AI needed).
- **B3. Weekly pick list.** The partner portal footer says pick lists "arrive by email" — nothing generates them. Needed: portal pick-list view (works to pack this week per gallery, member shipping address, mark-as-dispatched) and stock decrement on dispatch.
- **B4. Shipping addresses.** The wizard never collects a delivery address. No address fields exist on `User`. Blocking for any physical dispatch.
- **B5. Labels and carrier.** [EXT: InPost business account] No label generation. Pilot-acceptable path: portal shows address + a reference; labels bought manually. Production path: carrier API integration. The spec treats manual-with-reference as P0 and API integration as P2.
- **B6. QR return flow.** Plan §3.2 promises a QR-led return. Needed: per-rotation return page (QR encodes URL), member confirms return drop-off, gallery confirms receipt + condition, stock re-increments.
- **B7. Buy-to-keep.** Recommendation/dashboard cards have no purchase route. Needed: "Buy this piece" on real assigned works → Stripe one-time payment at the gallery-set `retailPrice` → item leaves circulation → commission split recorded (50/25/25 per plan §5.6).
- **B8. Royalty ledger and statements.** Plan §5.5: every assignment must be recorded so month-end statements per gallery/artist can be generated. Needed: ledger entries written on dispatch and on buy-to-keep; a simple statement view/export in the portal.
- **B9. Member rotation visibility.** Dashboard shows a hardcoded "First box preparing" placeholder. Members need: current collection (real assigned works), return date, return QR, history.

## C. Email — P0

No email capability exists at all. [EXT: Resend/Postmark account + sending domain]

- **C1. Transactional sender + templates:** welcome, password reset, dispatch notification with tracking reference, return reminder (T-14/T-3 days per plan §3.2), buy-to-keep receipt supplement, gallery pick-list notification.
- **C2. From-domain setup** (SPF/DKIM). [EXT: DNS access]

## D. Auth and account security — P0/P1

- **D1. Password reset (P0).** Returning customers who forget passwords are locked out permanently. Needed: reset-token table, request + reset endpoints/pages, email delivery (depends on C1).
- **D2. Production env enforcement (P0).** `SESSION_SECRET` falls back to a dev string, and a missing Supabase key silently falls back to the ephemeral file store. In production both must fail loudly at boot. Add env validation (fail-fast schema check).
- **D3. Rate limiting (P1).** `/api/auth/login` and `/api/auth/register` accept unlimited attempts. Add IP-based limiting (Upstash or in-Postgres counter).
- **D4. Account management (P1).** No change-password, change-email, or delete-account. Delete-account is also a GDPR requirement (see F).
- **D5. Email verification (P2).** Acceptable to skip for pilot; revisit if abuse appears.
- **D6. Password policy (P1).** Raise minimum 6 → 8 characters (both validators + copy).
- **D7. Session hardening (P2).** JWTs are irrevocable for 7 days; acceptable at pilot scale. Document; revisit with a session table if needed.

## E. Member-facing catalogue — P1

Brendon's founding description: "the subscriber would see the galleries we have partnered with catalogues." This does not exist.

- **E1. Gallery pages.** Public/member page per hub (`/galleries/red-house`) listing that gallery's listed prints with imagery and attribution.
- **E2. Print imagery.** `prints` has no image field and the portal has no upload. Needed: image upload (Supabase Storage), column + display. Without images the catalogue, pick list, and buy-to-keep are all text-only.
- **E3. Wire recommendations to real stock.** Once B2 exists, "Picked for You" should prefer real gallery prints and fall back to the style catalogue only when stock is thin.

## F. Legal and compliance (UK) — P0/P1

All copy items [EXT: Brendon/solicitor sign-off; company details].

- **F1. Terms of service + membership terms (P0):** rotation terms, damage liability, late returns, cancellation rights (14-day cooling-off), buy-to-keep terms.
- **F2. Privacy policy (P0)** naming processors (Supabase, Stripe, email provider, Vercel) and lawful bases.
- **F3. GDPR rights plumbing (P1):** export-my-data endpoint, delete-account cascade (D4), marketing-consent checkbox at signup (unticked by default).
- **F4. Company identity footer (P0):** registered name, company number, contact — required on UK commercial sites. [EXT]
- **F5. Cookie position (P1):** only strictly-necessary cookies today (session) → banner not required; document this and keep analytics privacy-friendly to preserve it.

## G. Observability and quality — P1

- **G1. Error monitoring:** Sentry (client + server) with source maps.
- **G2. Structured request logging** on API routes (route, status, duration, user hash).
- **G3. E2E tests in CI.** Playwright is a devDependency and was used ad hoc; no specs are committed. Codify the golden paths (signup wizard, returning login, partner stock CRUD, and — once built — rotation/pick-list/return) and run them in CI against a build.
- **G4. API integration tests** for auth and partner routes (the current 23 unit tests cover libs only).
- **G5. Uptime monitoring + status:** simple external ping on `/` and `/api/auth/me`. [EXT: choice of provider]
- **G6. Analytics:** privacy-friendly page analytics (Plausible/Fathom) to measure the funnel the business plan's milestones depend on. [EXT: account]

## H. Platform hardening — P1

- **H1. Security headers:** CSP, HSTS, X-Frame-Options, Referrer-Policy via `next.config.mjs` headers.
- **H2. SEO/meta baseline:** favicon + brand assets, OG image, per-page metadata, robots.txt, sitemap. The wizard is the landing page; it must be indexable and shareable.
- **H3. Deployment runbook:** Vercel env vars (SUPABASE_URL, SUPABASE_SECRET_KEY, SESSION_SECRET, Stripe keys, email keys), preview-vs-production databases, migration workflow. Commit Supabase migrations as SQL files in-repo (currently they exist only in Supabase's history).
- **H4. Backups:** enable/verify Supabase PITR or scheduled dumps; document restore. [EXT: Supabase plan decision — free tier has limited backup]
- **H5. Accessibility pass:** contrast of `stone` text on `wall` background, focus order through the wizard, dialog behaviour, alt text on portal-added prints, axe run in E2E.
- **H6. Mobile pass:** verify wizard step nav, salon hero, portal table on 360-400px widths; fix cramping.

## I. Product completeness — P1/P2

- **I1. Extend-this-rotation (P1).** The plan's cheapest-quarter churn valve; one button on the dashboard once B1 exists.
- **I2. Pause membership (P2).** Via Stripe portal pause or subscription schedule.
- **I3. Referral codes (P2).** Captured at signup, stored, but nothing validates or rewards them. Either wire a simple ledger or remove the field until it does something.
- **I4. Admin dashboard (P1).** Plan §7.1 item 10. Minimal internal view: members list, rotations by status, trigger/override assignment, gallery activity. Gate by `role: "admin"`.
- **I5. Originals waitlist follow-through (P2).** Interest flag exists; add an admin export/count so the list is usable.
- **I6. Ratings feedback loop (P2).** Post-delivery "rate the works you received" to feed curation (plan §7.2 feedback signals).

## Explicitly out of scope for production-readiness

B2B/corporate accounts, AI-assisted tagging (Phase 3), central 3PL fulfilment, carrier API automation (P2 note in B5), native apps.

## External dependencies summary (Brendon's checklist)

1. Stripe account + API keys (+ VAT/business details for receipts)
2. Email provider account (Resend recommended) + DNS records for the sending domain
3. Production domain name and Vercel project env vars
4. Company registration details for footer/terms
5. Terms/privacy legal review sign-off
6. InPost business account (P2 API path; manual labels fine for pilot)
7. Supabase plan/backup decision
8. Sentry + analytics accounts (free tiers fine)
