# Vercel Environment Variables — Deployment Checklist

**Date**: 2026-06-12
**Project**: Halo Talent

---

## Required Variables (must be set in both Preview and Production)

| # | Variable | Type | Modules | Risk if Absent |
|---|----------|------|---------|----------------|
| 1 | `NEXT_PUBLIC_SUPABASE_URL` | Public | Browser/client Supabase, health check, proxy, seed/smoke scripts | App won't connect to DB. All pages fail. |
| 2 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Browser/client Supabase, server-side SSR client | Auth fails. No user sessions. |
| 3 | `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Admin client (`createAdminClient`), Halo Lex ingestion, seed/smoke scripts | Admin operations fail. RLS-bypass queries blocked. Seed/ingestion fail. |
| 4 | `DEEPSEEK_API_KEY` | **Secret** | Chat AI draft/PPV, Halo Lex LLM, AI chat, Atlas inbox | All AI features return errors. Chat AI unusable. |
| 5 | `NEXT_PUBLIC_APP_URL` | Public | Internal API calls (fan brain, memory, trends, campaigns), admin invites, push tracking | Internal fetch calls fail. Invite links broken. |
| 6 | `CRON_SECRET` | **Secret** | 13 cron endpoints (trends, atlas, legal-scan, token refresh, credit reset, etc.) | All cron jobs return 401. Background processing stops. |

## Conditionally Required

| # | Variable | Type | Required For | Risk if Absent |
|---|----------|------|-------------|----------------|
| 7 | `NEXT_PUBLIC_SITE_URL` | Public | Studio OAuth, publishing | OAuth redirects default to `localhost:3005`. Publishing broken. |
| 8 | `RESEND_API_KEY` | **Secret** | Email (contact, newsletter, lead capture, invites) | Email silently skipped — contact/ newsletter store in Supabase but send no email. |
| 9 | `TELEGRAM_BOT_TOKEN` | **Secret** | Admin alerts, audit notifications | Telegram alerts disabled. Audit log works but no push. |
| 10 | `TELEGRAM_ADMIN_ID` | **Secret** | Admin alerts | Same as above. |

## Optional (feature-specific)

| # | Variable | Type | Required For | Risk if Absent |
|---|----------|------|-------------|----------------|
| 11 | `APIFY_TOKEN` | **Secret** | TikTok/Google trends scraping | Trends features degrade gracefully (empty results). |
| 12 | `SERPAPI_KEY` | **Secret** | Google Trends SerpApi | Google Trends data unavailable. Other trends still work. |
| 13 | `REPLICATE_API_TOKEN` | **Secret** | Studio image generation (Flux Schnell) | Image generation fails. Studio image features unusable. |
| 14 | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public | Web push notifications | Push notifications fail. |
| 15 | `VAPID_PRIVATE_KEY` | **Secret** | Web push notifications | Same as above. |
| 16 | `VAPID_SUBJECT` | Public | Web push notifications | Defaults to `mailto:notifications@refundize.com`. |

---

## Preview Values

For Vercel Preview, set these pointing to the preview deployment:

| Variable | Preview Value | Notes |
|----------|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lsabyfolyqlrvbseggit.supabase.co` | Same Supabase project for all envs |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as production | Public anon key — same across envs |
| `SUPABASE_SERVICE_ROLE_KEY` | Same as production | Use same key for Preview (same DB) |
| `DEEPSEEK_API_KEY` | Same as production | DeepSeek has no env separation |
| `NEXT_PUBLIC_APP_URL` | `https://<preview-slug>.vercel.app` | Auto-set by Vercel: `VERCEL_URL` |
| `NEXT_PUBLIC_SITE_URL` | `https://<preview-slug>.vercel.app` | Auto-set by Vercel: `VERCEL_URL` |
| `CRON_SECRET` | Same as production | Single secret for all cron auth |
| `RESEND_API_KEY` | Same as production (or omit) | Optional for Preview |
| `TELEGRAM_BOT_TOKEN` | Same as production (or omit) | Optional for Preview |
| `TELEGRAM_ADMIN_ID` | Same as production (or omit) | Optional for Preview |

**Important**: `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL` should use `VERCEL_URL` auto-detection in Preview. The app's internal fetch calls will use this URL to call its own API routes.

---

## Production Values

| Variable | Production Value | Notes |
|----------|-----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lsabyfolyqlrvbseggit.supabase.co` | Same project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same key | |
| `SUPABASE_SERVICE_ROLE_KEY` | Same key | Ensure it's the production project key |
| `DEEPSEEK_API_KEY` | Production DeepSeek key | |
| `NEXT_PUBLIC_APP_URL` | `https://<production-domain>.com` | Final domain |
| `NEXT_PUBLIC_SITE_URL` | `https://<production-domain>.com` | Final domain |
| `CRON_SECRET` | Random string (min 32 chars) | Generate via `openssl rand -hex 32` |
| `RESEND_API_KEY` | Production Resend key | |
| `TELEGRAM_BOT_TOKEN` | Production Telegram bot | |
| `TELEGRAM_ADMIN_ID` | Production admin chat ID | |

---

## Vercel CLI Setup Commands (template)

```bash
# Required — add to both Preview and Production
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY production preview
vercel env add DEEPSEEK_API_KEY production preview
vercel env add CRON_SECRET production preview

# Conditionally required
vercel env add NEXT_PUBLIC_APP_URL production preview   # or use VERCEL_URL auto-detection
vercel env add NEXT_PUBLIC_SITE_URL production preview   # or use VERCEL_URL auto-detection
vercel env add RESEND_API_KEY production preview   # optional for preview

# Optional — add only if features are used
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_ADMIN_ID production
vercel env add APIFY_TOKEN production
vercel env add SERPAPI_KEY production
vercel env add REPLICATE_API_TOKEN production
vercel env add NEXT_PUBLIC_VAPID_PUBLIC_KEY production
vercel env add VAPID_PRIVATE_KEY production
vercel env add VAPID_SUBJECT production
```

---

## Mobile (Expo) — NOT in Vercel

The mobile app uses `EXPO_PUBLIC_` prefixed env vars. These must be set in Expo's environment, NOT Vercel:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## Notes

- **`NEXT_PUBLIC_APP_URL`**: Many internal API calls (fan brain, memory store, trend tools, campaign sends, admin invites) use this to construct full URLs. On Vercel, the `VERCEL_URL` env var is auto-populated with the deployment URL. The app can use `process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL` for auto-detection.
- **`RESEND_API_KEY`**: The email module gracefully degrades — if unset, it logs instead of sending. Contact/newsletter store data in Supabase regardless. Safe to omit in Preview.
- **`DEEPSEEK_API_KEY`**: No graceful degradation. Chat AI and Halo Lex will throw errors if unset. Must be set for these features to work.
- **`CRON_SECRET`**: 13 endpoints validate against this. Must be set for all background processing. Generate a strong random value.
