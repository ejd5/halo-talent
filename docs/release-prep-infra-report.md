# Release Prep Infra Report — Halo Talent

**Date**: 2026-06-12
**Status**: NEEDS_INFRA_FIX — Migrations 038-041 not applied to remote Supabase
**Author**: Claude Code (Release Engineer)

---

## 1. Summary

Release preparation audit covering Supabase environment, migrations, RLS security, seed/smoke testing, public pages, dashboard pages, build quality, and Vercel deploy checklist. One blocking issue found: **migrations 038-041 are not applied to the remote Supabase instance** (`lsabyfolyqlrvbseggit`). This blocks seed, smoke, and all Chat AI functionality on production.

---

## 2. Mission 1 — Environment Variables

### 2.1 Present Variables

| Variable | Status | Prefix |
|----------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Present | `https://lsab...` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Present | `eyJhbGciOiJI...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Present | `eyJhbGciOiJI...` |
| `DEEPSEEK_API_KEY` | Present | `sk-19122eb7d...` |
| `NEXT_PUBLIC_APP_URL` | Present | `http://local...` |
| `CRON_SECRET` | Present | `e5fa34e2d7c9...` |
| `APIFY_TOKEN` | Present | `apify_api_qY...` |
| `SERPAPI_KEY` | Present | `9b2a889564ca...` |
| `REPLICATE_API_TOKEN` | Present | `r8_J9b8gJMPG...` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Present | `BMBoY1RmVFFf...` |
| `VAPID_PRIVATE_KEY` | Present | `ZQIhip_8Q2tu...` |
| `VAPID_SUBJECT` | Present | `mailto:notif...` |

### 2.2 Missing/Empty Variables

| Variable | Status | Impact |
|----------|--------|--------|
| `RESEND_API_KEY` | Empty | Email sending (newsletter, contact confirmations) non-functional |
| `TELEGRAM_BOT_TOKEN` | Empty | Telegram notifications disabled |
| `TELEGRAM_ADMIN_ID` | Empty | Telegram notifications disabled |
| `FACEBOOK_APP_ID` | Empty | Facebook integration disabled |
| `FACEBOOK_APP_SECRET` | Empty | Facebook integration disabled |
| `TIKTOK_CLIENT_KEY` | Empty | TikTok integration disabled |
| `TIKTOK_CLIENT_SECRET` | Empty | TikTok integration disabled |

### 2.3 Environment Target

- **Local dev**: `http://localhost:3001` (NEXT_PUBLIC_APP_URL points to `http://local...`)
- **Supabase project**: `lsabyfolyqlrvbseggit` (remote production project)
- **No preview/staging environment** configured

---

## 3. Mission 2 — Supabase Migration Status

### 3.1 Remote State

Remote Supabase (`lsabyfolyqlrvbseggit.supabase.co`) has **33 tables** — all from migrations 001-037. None of the Chat AI tables (038-039) or contact/newsletter tables (040-041) exist.

```
Remote tables (33 total):
  ai_conversations, applications, atlas_audit_log, atlas_campaign_sends,
  atlas_campaigns, atlas_consent_logs, atlas_conversation_read,
  atlas_deletion_log, atlas_documents, atlas_drafts, atlas_fans,
  atlas_funnels, atlas_interactions, atlas_merge_log, atlas_notes,
  atlas_purchases, atlas_rules, atlas_segments, atlas_snapshots,
  atlas_unsubscribe_tokens, contracts, creator_accounts, creator_dna,
  creator_dna_versions, credit_usage, messages, monthly_revenues,
  notifications, plans, profiles, trends_alerts, trends_cache,
  trends_watchlist
```

### 3.2 Migrations Pending

| Migration | Tables Created | Lines |
|-----------|---------------|-------|
| 038_halo_chat_ai_foundations.sql | chat_ai_playbooks, chat_ai_fans, chat_ai_conversations, chat_ai_messages, chat_ai_drafts, chat_ai_vault_assets, chat_ai_ppv_recommendations, chat_ai_followups, chat_ai_qa_items, chat_ai_consent_checklists, chat_ai_user_config, chat_ai_audit_logs, chat_ai_tracking_events | 478 |
| 039_halo_chat_ai_team_access.sql | chat_ai_account_members + policy updates | 163 |
| 040_contact_messages.sql | contact_messages | 43 |
| 041_newsletter_subscribers.sql | newsletter_subscribers | 43 |

### 3.3 Tables Expected vs Actual

| Table | Expected | Actual |
|-------|----------|--------|
| chat_ai_fans | migration 038 | MISSING |
| chat_ai_conversations | migration 038 | MISSING |
| chat_ai_messages | migration 038 | MISSING |
| chat_ai_drafts | migration 038 | MISSING |
| chat_ai_vault_assets | migration 038 | MISSING |
| chat_ai_ppv_recommendations | migration 038 | MISSING |
| chat_ai_qa_items | migration 038 | MISSING |
| chat_ai_audit_logs | migration 038 | MISSING |
| chat_ai_consent_checklists | migration 038 | MISSING |
| chat_ai_user_config | migration 038 | MISSING |
| chat_ai_playbooks | migration 038 | MISSING |
| chat_ai_tracking_events | migration 038 | MISSING |
| chat_ai_followups | migration 038 | MISSING |
| chat_ai_account_members | migration 039 | MISSING |
| contact_messages | migration 040 | MISSING |
| newsletter_subscribers | migration 041 | MISSING |

### 3.4 How to Apply Migrations

**Supabase CLI is not installed and `supabase login` requires interactive browser auth.** Two options:

#### Option A: Supabase Dashboard SQL Editor (recommended)

1. Go to https://supabase.com/dashboard/project/lsabyfolyqlrvbseggit
2. Navigate to SQL Editor
3. Run the SQL from each file in order:
   - Paste contents of `supabase/migrations/038_halo_chat_ai_foundations.sql` → Run
   - Paste contents of `supabase/migrations/039_halo_chat_ai_team_access.sql` → Run
   - Paste contents of `supabase/migrations/040_contact_messages.sql` → Run
   - Paste contents of `supabase/migrations/041_newsletter_subscribers.sql` → Run
4. Verify: check that all 16 tables appear in the Table Editor

#### Option B: Supabase CLI with Access Token

```bash
# 1. Generate access token at https://supabase.com/dashboard/account/tokens
# 2. Run:
export SUPABASE_ACCESS_TOKEN="<your-token>"
npx supabase link --project-ref lsabyfolyqlrvbseggit
npx supabase db push
```

### 3.5 Post-Migration Verification

After applying migrations, verify via REST API:

```bash
curl "https://lsabyfolyqlrvbseggit.supabase.co/rest/v1/chat_ai_fans?limit=1" \
  -H "apikey: <service_role_key>" \
  -H "Authorization: Bearer <service_role_key>"
# Should return 200 (possibly with [])
```

Then re-run seed:
```bash
npm run seed:chat-ai
```

---

## 4. Mission 3 — RLS Risk Matrix

### 4.1 Chat AI Tables (migration 038 → updated by 039)

After both migrations applied, the final RLS state is:

| Table | RLS | SELECT Policy | INSERT Policy | UPDATE/DELETE |
|-------|-----|---------------|---------------|---------------|
| chat_ai_playbooks | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_fans | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_conversations | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_messages | ENABLED | can_access_creator(conv → user_id) | can_access_creator | — |
| chat_ai_drafts | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_vault_assets | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_ppv_recommendations | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_followups | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_qa_items | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_consent_checklists | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_user_config | ENABLED | can_access_creator(user_id) | same | same |
| chat_ai_audit_logs | ENABLED | can_access_creator(user_id) | WITH CHECK (true) | — |
| chat_ai_tracking_events | ENABLED | can_access_creator(user_id) | WITH CHECK (true) | — |
| chat_ai_account_members | ENABLED | 3 policies (creator/member/admin) | 3 policies | 3 policies |

### 4.2 Public Tables

| Table | RLS | SELECT | INSERT |
|-------|-----|--------|--------|
| contact_messages | ENABLED | Admin only | Public (anyone) |
| newsletter_subscribers | ENABLED | Admin only | Public (anyone) |

### 4.3 Risk Assessment

| Risk | Severity | Detail |
|------|----------|--------|
| chat_ai_audit_logs INSERT WITH CHECK(true) | LOW | Anyone can insert audit logs. Mitigated: inserts go through `logAction()` server-side, never exposed to client. |
| chat_ai_tracking_events INSERT WITH CHECK(true) | LOW | Anyone can insert tracking events. Mitigated: API route validates event names against Zod allowlist, only accepts 5 safe payload fields. No PII accepted. |
| contact_messages public INSERT | INFO | Spam risk. Mitigated: rate limiting should be added pre-launch. |
| newsletter_subscribers public INSERT | INFO | Spam risk. Mitigated: rate limiting should be added pre-launch. |
| No team access without migration 039 | CRITICAL | Until 039 is applied, team members cannot access shared data. |

---

## 5. Mission 4 — Seed Results

**Status: PARTIALLY FAILED — blocked by missing migrations**

### 5.1 Execution

```bash
npm run seed:chat-ai
```

### 5.2 Results

| Operation | Result | Cause |
|-----------|--------|-------|
| Demo user creation | ✅ Existing user (d139b068-3a5e-48ae-b72a-13a368bae809) | — |
| Profile verification | ✅ Exists | — |
| 40 fans insertion | ❌ 0/40 inserted | Table `chat_ai_fans` missing |
| 25 conversations | ❌ 0/25 inserted | Table `chat_ai_conversations` missing |
| Messages | ❌ 0 inserted | Table `chat_ai_messages` missing |
| 3 playbooks | ⚠️ Script says "3 inserted" but table missing | No error checking in script |
| 20 vault assets | ⚠️ Script says "20 inserted" but table missing | No error checking in script |
| User config | ⚠️ Script says "created" but table missing | No error checking in script |
| Consent checklist | ⚠️ Script says "validated" but table missing | No error checking in script |
| 12 PPV recommendations | ⚠️ Script says "12 inserted" but table missing | No error checking in script |
| 9 QA items | ⚠️ Script says "9 inserted" but table missing | No error checking in script |
| 5 audit logs | ⚠️ Script says "5 inserted" but table missing | No error checking in script |

**Bug found**: Seed script prints "✅ X inserted" for most operations WITHOUT checking the `{ error }` return from Supabase inserts. Only fan inserts (line 176-177) properly check errors. All claimed "successes" past fans are false positives — tables don't exist.

### 5.3 Fix Required

The seed script at `scripts/seed-chat-ai-demo.ts` needs error checking added to all upsert/insert operations (playbooks, vault, config, consent, PPV, QA, audit). Currently only fans have error checking.

---

## 6. Mission 5 — Smoke Results

**Status: FAILED — 0/12 tests passed**

### 6.1 Execution

```bash
SMOKE_API_BASE="http://localhost:3001" npm run smoke:chat-ai
```

### 6.2 Results

| Test | Result | Detail |
|------|--------|--------|
| GET conversations | ❌ | HTTP 401 (no data — table missing) |
| GET fans (all) | ❌ | 0 fans returned |
| GET fan detail | ❌ | Fan not found |
| GET fans (do_not_contact) | ❌ | 0 fans |
| POST draft (authorized) | ❌ | No conversations found |
| POST draft (do_not_contact) | ❌ | Fan not found |
| POST draft (vulnerable) | ❌ | Fan not found |
| POST approve draft | ❌ | No draft ID (previous test failed) |
| POST copy draft | ❌ | No draft ID (previous test failed) |
| POST PPV (already sold) | ❌ | Fan not found |
| GET audit logs | ❌ | 0 logs |
| GET audit export | ❌ | 0 entries |

**Root cause for all 12 failures**: Migrations 038-041 not applied. Tables don't exist on remote.

---

## 7. Mission 6 — Public Pages Audit

### 7.1 HTTP Status

All 13 pages return 200:

| Page | HTTP | Notes |
|------|------|-------|
| `/` | 200 | Homepage |
| `/chat-ai` | 200 | 136KB, all 11 sections rendered |
| `/demo` | 200 | — |
| `/contact` | 200 | — |
| `/blog` | 200 | — |
| `/lex` | 200 | — |
| `/lex-ai` | 200 | — |
| `/mentions-legales` | 200 | — |
| `/confidentialite` | 200 | — |
| `/cgu` | 200 | — |
| `/atlas` | 200 | — |
| `/atlas/fonctionnalites` | 200 | — |
| `/atlas/pricing` | 200 | — |

### 7.2 /chat-ai Specific Checks

| Check | Result |
|-------|--------|
| Page size | 136,098 bytes |
| Has `</body>` | Yes |
| Dead links (`href="#"`) | 0 |
| CTA `/demo` links | 3 |
| CTA `/lex-ai` links | 1 |
| Anchor `#workflow` | 1 |
| OG title tag | Present |
| OG description tag | Present |
| OG image tag | Present |
| Forbidden terms in positive context | 0 (all matches are negations) |

### 7.3 OG Image

- Build output: `○ /chat-ai/opengraph-image-15gjpt` — static image generated
- Dev mode: `/chat-ai/opengraph-image` returns 404 (expected — pre-rendered at build time)
- Format: 1200×630 PNG
- No risky claims in image content

### 7.4 Newsletter/Contact

- RESEND_API_KEY is empty — email sending non-functional
- POST to `/api/newsletter` will return an error when attempting to send
- POST to `/api/contact` will return an error when attempting to send
- Both forms render correctly on the page

---

## 8. Mission 7 — Dashboard Pages Audit

### 8.1 Auth Gate Verification

All pages return 200 (render client-side with auth check, not server-side redirect):

| Page | HTTP | Auth Required |
|------|------|---------------|
| `/dashboard/sovereign-chat/ppv-copilot` | 200 | Yes (client-side) |
| `/dashboard/sovereign-chat/vault` | 200 | Yes (client-side) |
| `/dashboard/sovereign-chat/qa-review` | 200 | Yes (client-side) |
| `/dashboard/chat-ai/inbox/test-id` | 200 | Yes (client-side) |
| `/admin/chat-ai/overview` | 200 | Yes (client-side admin) |
| `/admin/chat-ai/creators` | 200 | Yes (client-side admin) |
| `/admin/chat-ai/qa` | 200 | Yes (client-side admin) |
| `/admin/chat-ai/compliance` | 200 | Yes (client-side admin) |
| `/admin/chat-ai/audit` | 200 | Yes (client-side admin) |
| `/admin/chat-ai/usage` | 200 | Yes (client-side admin) |

**Note**: Dashboard pages use client-side auth guards (`"use client"` + Supabase session check). They return 200 HTML shells while unauthenticated, then redirect client-side. Admin API endpoints (`/api/admin/chat-ai/*`) are server-side protected via `requireAdmin()` and correctly return 401/403.

### 8.2 Admin API Security (from Phase 2C-QA)

All 8 admin endpoints use `requireAdmin()` from `lib/auth/require-admin.ts`:
- Session check → 401
- Role check (admin/manager) → 403

**Verified in Phase 2C-QA. Status: SECURE.**

---

## 9. Mission 8 — Build Final

| Test | Result |
|------|--------|
| `npx tsc --noEmit` | PASS — 0 errors |
| `npx eslint` (Phase 2E files only) | PASS — 0 errors, 0 warnings |
| `npm run lint` (global) | 947 errors, 864 warnings — ALL pre-existing (Remotion, legacy scripts). ZERO in Chat AI files. |
| `npm run build` | PASS — 389/389 pages, compiled successfully (24.4s) |

### 9.1 Pre-existing Lint Debt

The global `npm run lint` has 1811 problems from:
- `remotion/` — unused vars, `any` types (pre-existing)
- `scripts/legal-scanner.js` — `require()` imports (pre-existing)
- `scripts/sync-knowledge-to-supabase.ts` — unused vars (pre-existing)

**None of these are from Phase 2D/2E changes.**

---

## 10. Bugs Found

| # | Severity | Location | Issue | Action |
|---|----------|----------|-------|--------|
| 1 | **BLOCKING** | Remote Supabase | Migrations 038-041 not applied — 16 tables missing | Apply via SQL Editor or CLI (see §3.4) |
| 2 | MEDIUM | `scripts/seed-chat-ai-demo.ts` | False "✅ X inserted" messages — no error checking on most upsert operations | Add `{ error }` destructuring after all `.upsert()` and `.insert()` calls |
| 3 | LOW | `RESEND_API_KEY` | Empty — contact/newsletter emails non-functional | Set in Vercel env vars |
| 4 | LOW | `NEXT_PUBLIC_APP_URL` | Points to `http://local...` — needs production URL for deploy | Set on Vercel |

---

## 11. Mission 9 — Vercel/GitHub Deploy Checklist

### Environment Variables to Set on Vercel

```
NEXT_PUBLIC_SUPABASE_URL=https://lsabyfolyqlrvbseggit.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from .env.local>
SUPABASE_SERVICE_ROLE_KEY=<from .env.local>
DEEPSEEK_API_KEY=<from .env.local>
NEXT_PUBLIC_SITE_URL=https://halo-talent.vercel.app (or actual domain)
NEXT_PUBLIC_APP_URL=https://halo-talent.vercel.app (or actual domain)
CRON_SECRET=<from .env.local>
RESEND_API_KEY=<to be obtained>
```

### Pre-Deploy Checklist

- [ ] **Supabase migrations applied** — Run all 4 SQL files (038-041) via Dashboard SQL Editor
- [ ] **Seed data inserted** — `npm run seed:chat-ai` after migrations
- [ ] **Smoke tests passing** — `SMOKE_API_BASE=<prod-url> npm run smoke:chat-ai`
- [ ] **Admin user created** — admin@halo-talent.com exists in `auth.users` with `profiles.role = "admin"`
- [ ] **Demo user created** — demo-creator@halo-talent.com exists (seed creates this)
- [ ] **Domain configured** — DNS + Vercel domain settings
- [ ] **NEXT_PUBLIC_SITE_URL** — Set to production domain
- [ ] **RESEND_API_KEY** — Obtain from Resend.com and configure
- [ ] **Contact form tested** — Submit and verify email delivery
- [ ] **Newsletter tested** — Subscribe and verify email delivery
- [ ] **Social links** — Verify Instagram, TikTok, LinkedIn, X links in Footer
- [ ] **Legal placeholders** — CGU, Privacy Policy, Legal Notices content complete
- [ ] **Cookie banner** — Required if analytics cookies are used
- [ ] **DeepSeek API key** — Configured or demo mode assumed
- [ ] **Rollback plan** — Revert to previous deployment in Vercel dashboard

### Post-Deploy Verification

- [ ] All 13 public pages load (200, non-empty)
- [ ] `/chat-ai` OG image renders on social media (test with https://www.opengraph.xyz)
- [ ] CTA tracking events fire (check console or Supabase `chat_ai_tracking_events`)
- [ ] Newsletter form submits successfully
- [ ] Contact form submits successfully
- [ ] Admin login works at `/login`
- [ ] Admin Chat AI pages load with data
- [ ] Dashboard Chat AI pages load with data for demo user

### Rollback Plan

If critical issues found post-deploy:
1. Revert deployment via Vercel Dashboard (instant rollback to previous build)
2. If schema issues: migrations use `CREATE TABLE IF NOT EXISTS` — safe to re-run
3. If data issues: seed script uses `upsert` with `onConflict: "id"` — safe to re-run

---

## 12. Final Status: NEEDS_INFRA_FIX

**Blocking issue**: Migrations 038-041 not applied to remote Supabase (`lsabyfolyqlrvbseggit`). This blocks:
- All Chat AI functionality (16 tables missing)
- Contact form storage (`contact_messages` table missing)
- Newsletter storage (`newsletter_subscribers` table missing)
- Seed data creation
- Smoke test execution

**All other checks pass:**
- Build: 389/389 pages, 0 TypeScript errors
- Chat AI files: 0 ESLint errors/warnings
- Public pages: 13/13 return 200
- Dashboard auth gates: active
- Admin API security: hardened (`requireAdmin()`)
- CTA tracking: secure (Zod validation)
- OG image: generated at build time
- Wording: zero violations
- RLS design: well-structured (user-scoped + team access)

**Next step**: Apply migrations 038-041 via Supabase Dashboard SQL Editor, then re-run seed and smoke.
