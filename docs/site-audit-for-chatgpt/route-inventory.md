# Route Inventory — Halo Talent

> Date: 2026-06-11 | Framework: Next.js 16 (App Router) | Data: Supabase / API / mock / static

## Layout Hierarchy

| Layout | Path | Status | Wraps |
|--------|------|--------|-------|
| Root | `app/layout.tsx` | Complete | All pages — ThemeProvider, fonts |
| Marketing | `(marketing)/layout.tsx` | Complete | Navbar + Footer, all public pages |
| Dashboard | `(private)/dashboard/layout.tsx` | Complete | Sidebar + Header + CommandPalette + AtlasLauncher |
| Admin | `(admin)/admin/layout.tsx` | Complete | AdminShell, requires role admin/manager |
| Auth | `(auth)/layout.tsx` | Minimal | Auth pages |
| Studio | `(private)/studio/layout.tsx` | Minimal | StudioLayoutClient |
| Trends | `(private)/dashboard/trends/layout.tsx` | Complete | Tab navigation |

---

## Root Pages

| Route | File | Access | Status | Data | i18n |
|-------|------|--------|--------|------|------|
| `/` | `(marketing)/page.tsx` | public | Complete | static | partial (7/25 components) |
| `/sitemap.xml` | `sitemap.ts` | public | Complete | static | no |

## Marketing Pages (public)

| Route | Fichier | Statut | Data | i18n |
|-------|---------|--------|------|------|
| `/pricing` | `(marketing)/pricing/page.tsx` | Complete | static | no |
| `/saas` | `(marketing)/saas/page.tsx` | Complete | static | no |
| `/demo` | `(marketing)/demo/page.tsx` | Complete | static | no |
| `/commissions` | `(marketing)/commissions/page.tsx` | Complete | static | no |
| `/contrat-type` | `(marketing)/contrat-type/page.tsx` | Partial (PDF pending) | static | no |
| `/security` | `(marketing)/security/page.tsx` | Complete | static | no |
| `/manifeste` | `(marketing)/manifeste/page.tsx` | Complete | static | no |
| `/outils` | `(marketing)/outils/page.tsx` | Complete | static | no |
| `/talents` | `(marketing)/talents/page.tsx` | **Placeholder** | static | no |
| `/blog` | `(marketing)/blog/page.tsx` | Complete | static | no |
| `/blog/[slug]` | `(marketing)/blog/[slug]/page.tsx` | Complete | static mock | no |
| `/guides` | `(marketing)/guides/page.tsx` | Complete | static | no |
| `/glossaire` | `(marketing)/glossaire/page.tsx` | Complete | static | no |
| `/departements` | `(marketing)/departements/page.tsx` | Complete | static | no |
| `/departements/[slug]` | `(marketing)/departements/[slug]/page.tsx` | Complete | static | no |
| `/departments` | `(marketing)/departments/page.tsx` | **Placeholder** | static | no |
| `/lex` | `(marketing)/lex/page.tsx` | Complete | **Supabase** | no |
| `/lex/changements` | `(marketing)/lex/changements/page.tsx` | Complete | **Supabase** | no |
| `/lex/[slug]` | `(marketing)/lex/[slug]/page.tsx` | Complete | **Supabase** | no |
| `/lex/requests/[id]` | `(marketing)/lex/requests/[id]/page.tsx` | Complete | API-route | no |
| `/lex-ai` | `(marketing)/lex-ai/page.tsx` | Complete | static | no |
| `/atlas` | `(marketing)/atlas/page.tsx` | Complete | static | no |
| `/atlas/pricing` | `(marketing)/atlas/pricing/page.tsx` | Complete | static | no |
| `/atlas/fonctionnalites` | `(marketing)/atlas/fonctionnalites/page.tsx` | Complete | static | no |
| `/atlas/conformite` | `(marketing)/atlas/conformite/page.tsx` | Complete | static | no |
| `/atlas/testimonials` | `(marketing)/atlas/testimonials/page.tsx` | **Partial (empty data)** | static | no |
| `/protection` | `(marketing)/protection/page.tsx` | Complete | **Supabase** | no |
| `/protection/guide` | `(marketing)/protection/guide/page.tsx` | Complete | static | no |
| `/protection/onlyfans` | `(marketing)/protection/onlyfans/page.tsx` | Complete | static | no |
| `/protection/fansly` | `(marketing)/protection/fansly/page.tsx` | Complete | static | no |
| `/protection/mym` | `(marketing)/protection/mym/page.tsx` | Complete | static | no |
| `/protection/instagram` | `(marketing)/protection/instagram/page.tsx` | Complete | static | no |
| `/protection/tiktok` | `(marketing)/protection/tiktok/page.tsx` | **Placeholder** | static | no |
| `/protection/x` | `(marketing)/protection/x/page.tsx` | **Placeholder** | static | no |
| `/protection/youtube` | `(marketing)/protection/youtube/page.tsx` | **Placeholder** | static | no |

## Dashboard Client (private)

| Route | Fichier | Statut | Data | i18n |
|-------|---------|--------|------|------|
| `/dashboard` | `(private)/dashboard/page.tsx` | Complete | **mock** | no |
| `/dashboard/analytics` | `(private)/dashboard/analytics/page.tsx` | Partial | mock/static | no |
| `/dashboard/ai` | `(private)/dashboard/ai/page.tsx` | Complete | API-route | no |
| `/dashboard/ai-generation` | `(private)/dashboard/ai-generation/page.tsx` | **Placeholder** | static | no |
| `/dashboard/agents` | `(private)/dashboard/agents/page.tsx` | Complete | mock | no |
| `/dashboard/agents/[agentName]` | `(private)/dashboard/agents/[agentName]/page.tsx` | Complete | mock+API | no |
| `/dashboard/calendar` | `(private)/dashboard/calendar/page.tsx` | Complete | mock | no |
| `/dashboard/community` | `(private)/dashboard/community/page.tsx` | Complete | mock | no |
| `/dashboard/composer` | `(private)/dashboard/composer/page.tsx` | **Placeholder** | static | no |
| `/dashboard/contracts` | `(private)/dashboard/contracts/page.tsx` | Partial | mock | no |
| `/dashboard/drafts` | `(private)/dashboard/drafts/page.tsx` | **Placeholder** | static | no |
| `/dashboard/goals` | `(private)/dashboard/goals/page.tsx` | Complete | mock | no |
| `/dashboard/insights` | `(private)/dashboard/insights/page.tsx` | **Placeholder** | static | no |
| `/dashboard/knowledge-base` | `(private)/dashboard/knowledge-base/page.tsx` | **Placeholder** | static | no |
| `/dashboard/learn` | `(private)/dashboard/learn/page.tsx` | Complete | mock | no |
| `/dashboard/library` | `(private)/dashboard/library/page.tsx` | Complete | mock | no |
| `/dashboard/manager` | `(private)/dashboard/manager/page.tsx` | **Placeholder** | static | no |
| `/dashboard/messages` | `(private)/dashboard/messages/page.tsx` | Partial | static | no |
| `/dashboard/notifications` | `(private)/dashboard/notifications/page.tsx` | Complete | mock | no |
| `/dashboard/platforms` | `(private)/dashboard/platforms/page.tsx` | Partial | mock | no |
| `/dashboard/preferences` | `(private)/dashboard/preferences/page.tsx` | **Placeholder** | static | no |
| `/dashboard/profile` | `(private)/dashboard/profile/page.tsx` | **Placeholder** | static | no |
| `/dashboard/revenues` | `(private)/dashboard/revenues/page.tsx` | Partial | mock | no |
| `/dashboard/upgrade` | `(private)/dashboard/upgrade/page.tsx` | Complete | static | no |
| `/dashboard/wellness` | `(private)/dashboard/wellness/page.tsx` | Complete | **Supabase** | no |
| `/dashboard/settings` | `(private)/dashboard/settings/page.tsx` | Partial | static | no |
| `/dashboard/settings/integrations` | `(private)/dashboard/settings/integrations/page.tsx` | **Placeholder** | static | no |
| `/dashboard/settings/co-management` | `(private)/dashboard/settings/co-management/page.tsx` | **Placeholder** | static | no |

## CHATEENG (private)

| Route | Fichier | Statut | Data |
|-------|---------|--------|------|
| `/dashboard/chat-ai` | `(private)/dashboard/chat-ai/page.tsx` | Complete | **API-route** |
| `/dashboard/chat-ai/dev-test` | `(private)/dashboard/chat-ai/dev-test/page.tsx` | Complete | API-route |
| `/dashboard/chat-ai/fans` | `(private)/dashboard/chat-ai/fans/page.tsx` | Complete | API-route |
| `/dashboard/chat-ai/inbox/[id]` | `(private)/dashboard/chat-ai/inbox/[id]/page.tsx` | Complete | API-route |

## Atlas (private, dans Dashboard)

| Route | Fichier | Statut | Data |
|-------|---------|--------|------|
| `/dashboard/atlas` | `(private)/dashboard/atlas/page.tsx` | Complete | API-route |
| `/dashboard/atlas/analytics` | `(private)/dashboard/atlas/analytics/page.tsx` | Complete | API-route |
| `/dashboard/atlas/campaigns/new` | `(private)/dashboard/atlas/campaigns/new/page.tsx` | Complete | API-route |
| `/dashboard/atlas/campaigns/[id]` | `...campaigns/[id]/page.tsx` | Complete | API-route |
| `/dashboard/atlas/campaigns/email` | `...campaigns/email/page.tsx` | Complete | API-route |
| `/dashboard/atlas/campaigns/push` | `...campaigns/push/page.tsx` | Complete | API-route |
| `/dashboard/atlas/campaigns/sms` | `...campaigns/sms/page.tsx` | Complete | API-route |
| `/dashboard/atlas/chat-analytics` | `...chat-analytics/page.tsx` | Complete | **mock** |
| `/dashboard/atlas/comments` | `...comments/page.tsx` | Complete | API-route |
| `/dashboard/atlas/comments/rules` | `...comments/rules/page.tsx` | Complete | API-route |
| `/dashboard/atlas/compliance` | `...compliance/page.tsx` | Complete | **Supabase** |
| `/dashboard/atlas/fans` | `...fans/page.tsx` | Complete | **mock** |
| `/dashboard/atlas/fans/[fanId]` | `...fans/[fanId]/page.tsx` | Complete | API-route |
| `/dashboard/atlas/fans/segments` | `...fans/segments/page.tsx` | Complete | API-route |
| `/dashboard/atlas/funnels` | `...funnels/page.tsx` | Complete | API-route |
| `/dashboard/atlas/funnels/[id]` | `...funnels/[id]/page.tsx` | Complete | API-route |
| `/dashboard/atlas/funnels/lead-capture` | `...funnels/lead-capture/page.tsx` | Complete | API-route |
| `/dashboard/atlas/funnels/lead-capture/[id]` | `...lead-capture/[id]/page.tsx` | Complete | API-route |
| `/dashboard/atlas/inbox` | `...inbox/page.tsx` | Complete | API-route |
| `/dashboard/atlas/inbox/drafts` | `...inbox/drafts/page.tsx` | Complete | API-route |
| `/dashboard/atlas/legal` | `...legal/page.tsx` | Complete | **Supabase** |
| `/dashboard/atlas/onboarding` | `...onboarding/page.tsx` | Complete | static |
| `/dashboard/atlas/ppv-pricing` | `...ppv-pricing/page.tsx` | Complete | API-route |
| `/dashboard/atlas/revenue-inbox` | `...revenue-inbox/page.tsx` | Complete | API-route |
| `/dashboard/atlas/revenue-radar` | `...revenue-radar/page.tsx` | Complete | API-route |
| `/dashboard/atlas/rules` | `...rules/page.tsx` | Complete | API-route |
| `/dashboard/atlas/settings` | `...settings/page.tsx` | Complete | static |
| `/dashboard/atlas/settings/compliance` | `...settings/compliance/page.tsx` | Complete | API-route |

## Sovereign Chat (private)

| Route | Fichier | Statut | Data |
|-------|---------|--------|------|
| `/dashboard/sovereign-chat/at-risk` | `...at-risk/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/copilot` | `...copilot/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/ppv` | `...ppv/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/predictions` | `...predictions/page.tsx` | **Placeholder** | static |
| `/dashboard/sovereign-chat/segments` | `...segments/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/segments/new` | `...segments/new/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/segments/[id]` | `...segments/[id]/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/segments/[id]/edit` | `...segments/[id]/edit/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/settings/compliance` | `...settings/compliance/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/smart-messages` | `...smart-messages/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/smart-messages/new` | `...smart-messages/new/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/smart-messages/[campaignId]/validate` | `...validate/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/smart-messages/[campaignId]/results` | `...results/page.tsx` | Complete | API-route |
| `/dashboard/sovereign-chat/vault` | `...vault/page.tsx` | Complete | API-route |

## Trends (private)

| Route | Fichier | Statut | Data |
|-------|---------|--------|------|
| `/dashboard/trends` | `...trends/page.tsx` | Complete | API-route |
| `/dashboard/trends/google` | `...trends/google/page.tsx` | Complete | API-route |
| `/dashboard/trends/tiktok` | `...trends/tiktok/page.tsx` | Complete | API-route |
| `/dashboard/trends/youtube` | `...trends/youtube/page.tsx` | Complete | API-route |
| `/dashboard/trends/watchlist` | `...trends/watchlist/page.tsx` | Complete | API-route |
| `/dashboard/trends/alerts` | `...trends/alerts/page.tsx` | Complete | API-route |

## Studio (private)

| Route | Fichier | Statut | Data |
|-------|---------|--------|------|
| `/studio` | `(private)/studio/page.tsx` | Complete | API-route |
| `/studio/composer` | `...composer/page.tsx` | Complete | API-route |
| `/studio/generate/image` | `...generate/image/page.tsx` | Complete | API-route |
| `/studio/generate/video` | `...generate/video/page.tsx` | Complete | API-route |
| `/studio/generate/audio` | `...generate/audio/page.tsx` | Complete | API-route |
| `/studio/generate/text` | `...generate/text/page.tsx` | Complete | API-route |
| `/studio/generate/avatar` | `...generate/avatar/page.tsx` | **Placeholder** | static |
| `/studio/edit/photo` | `...edit/photo/page.tsx` | **Placeholder** | static |
| `/studio/edit/video` | `...edit/video/page.tsx` | **Placeholder** | static |
| `/studio/edit/audio` | `...edit/audio/page.tsx` | **Placeholder** | static |
| `/studio/publish` | `...publish/page.tsx` | **Placeholder** | static |
| `/studio/scheduled` | `...scheduled/page.tsx` | **Placeholder** | static |
| `/studio/history` | `...history/page.tsx` | Complete | API-route |
| `/studio/insights` | `...insights/page.tsx` | Complete | API-route |
| `/studio/vault` | `...vault/page.tsx` | Complete | API-route |
| `/studio/templates` | `...templates/page.tsx` | Complete | API-route |
| `/studio/credits` | `...credits/page.tsx` | Complete | API-route |
| `/studio/api-keys` | `...api-keys/page.tsx` | Complete | API-route |

## Admin (admin role required)

| Route | Fichier | Statut | Data |
|-------|---------|--------|------|
| `/admin` | `(admin)/admin/page.tsx` | Complete | **Supabase** |
| `/admin/analytics` | `...analytics/page.tsx` | Complete | **Supabase** |
| `/admin/applications` | `...applications/page.tsx` | Complete | **Supabase** |
| `/admin/atlas/monitoring` | `...atlas/monitoring/page.tsx` | Complete | **Supabase** |
| `/admin/benchmarking` | `...benchmarking/page.tsx` | Complete | API-route |
| `/admin/calendar` | `...calendar/page.tsx` | Complete | **Supabase** |
| `/admin/command-center` | `...command-center/page.tsx` | Complete | API-route |
| `/admin/commissions` | `...commissions/page.tsx` | Complete | **Supabase** |
| `/admin/content-calendar` | `...content-calendar/page.tsx` | Complete | **Supabase** |
| `/admin/contracts` | `...contracts/page.tsx` | **Placeholder** | static |
| `/admin/creators` | `...creators/page.tsx` | Complete | **Supabase** |
| `/admin/creators/[id]` | `...creators/[id]/page.tsx` | Complete | **Supabase** |
| `/admin/creators/performance` | `...creators/performance/page.tsx` | **Placeholder** | static |
| `/admin/credits` | `...credits/page.tsx` | Complete | **Supabase** |
| `/admin/docs` | `...docs/page.tsx` | Complete | static |
| `/admin/legal/analyses` | `...legal/analyses/page.tsx` | Complete | **Supabase** |
| `/admin/legal/clauses` | `...legal/clauses/page.tsx` | Complete | **Supabase** |
| `/admin/legal/knowledge` | `...legal/knowledge/page.tsx` | Complete | **Supabase** |
| `/admin/legal/updates` | `...legal/updates/page.tsx` | Complete | **Supabase** |
| `/admin/lex/letter-queue` | `...lex/letter-queue/page.tsx` | Complete | **Supabase** |
| `/admin/lex/requests` | `...lex/requests/page.tsx` | Complete | **Supabase** |
| `/admin/library` | `...library/page.tsx` | Complete | **Supabase** |
| `/admin/messages` | `...messages/page.tsx` | **Placeholder** | static |
| `/admin/monitoring` | `...monitoring/page.tsx` | Complete | **Supabase** |
| `/admin/payouts` | `...payouts/page.tsx` | Complete | **Supabase** |
| `/admin/pipeline` | `...pipeline/page.tsx` | **Placeholder** | static |
| `/admin/revenue` | `...revenue/page.tsx` | Complete | **Supabase** |
| `/admin/settings/api` | `...settings/api/page.tsx` | **Placeholder** | static |
| `/admin/settings/integrations` | `...settings/integrations/page.tsx` | **Placeholder** | static |
| `/admin/settings/logs` | `...settings/logs/page.tsx` | Complete | **Supabase** |
| `/admin/settings/permissions` | `...settings/permissions/page.tsx` | Complete | **Supabase** |
| `/admin/settings/system` | `...settings/system/page.tsx` | Complete | **Supabase** |
| `/admin/settings/team` | `...settings/team/page.tsx` | Complete | **Supabase** |
| `/admin/site` | `...site/page.tsx` | Complete | **Supabase** |
| `/admin/site/blog` | `...site/blog/page.tsx` | Complete | **Supabase** |
| `/admin/site/manifesto` | `...site/manifesto/page.tsx` | Complete | **Supabase** |
| `/admin/site/pages` | `...site/pages/page.tsx` | Complete | **Supabase** |
| `/admin/site/roster` | `...site/roster/page.tsx` | Complete | **Supabase** |
| `/admin/social/accounts` | `...social/accounts/page.tsx` | **Placeholder** | static |
| `/admin/social/insights` | `...social/insights/page.tsx` | **Placeholder** | static |
| `/admin/social/scheduler` | `...social/scheduler/page.tsx` | **Placeholder** | static |
| `/admin/stripe` | `...stripe/page.tsx` | **Placeholder** | static |
| `/admin/team` | `...team/page.tsx` | Complete | **Supabase** |
| `/admin/team/[memberId]` | `...team/[memberId]/page.tsx` | Complete | **Supabase** |

## Auth & Special

| Route | Fichier | Accès | Statut | Data |
|-------|---------|-------|--------|------|
| `/login` | `(auth)/login/page.tsx` | public | Complete | **Supabase** |
| `/signup` | `(auth)/signup/page.tsx` | public | **Placeholder** | static |
| `/thanks` | `thanks/page.tsx` | public | Complete | static |
| `/[slug]` | `[slug]/page.tsx` | public | Complete | **Supabase** (lead capture) |

## API Routes — Summary

| Category | Count | Key endpoints |
|----------|-------|---------------|
| admin | 26 | analytics, applications, benchmarking, legal, team |
| ai | 1 | `/api/ai/chat` |
| atlas | 28 | analytics, compliance, comments, funnels, rules |
| chat-ai | 8 | audit, compliance-scan, conversations, draft, fans, ppv |
| chat-copilot | 5 | fan-brain, suggestions, tone-guard |
| cron | 11 | daily-digest, legal-scan, refresh-tokens |
| dashboard | 34 | campaigns, comments, fans, funnels, inbox, rules |
| legal | 9 | analyses, change-events, clauses, generate-letter |
| lex | 7 | chat, escalation, generate-document, session |
| sovereign-chat | 17 | draft, ppv, predict, segments, smart-messages, vault |
| studio | 22 | generate/*, credits, history, insights, templates |
| trends | 5 | google, tiktok, youtube |

## Summary

| Category | Pages | Complete | Placeholder | Partial | Mock Data |
|----------|-------|----------|-------------|---------|-----------|
| Root | 1 | 1 | 0 | 0 | 0 |
| Marketing | 35 | 28 | 5 | 2 | 0 |
| Auth | 3 | 1 | 1 | 0 | 0 |
| Dashboard Core | 28 | 13 | 7 | 5 | ~20 |
| CHATEENG | 4 | 4 | 0 | 0 | 0 |
| Atlas | 28 | 28 | 0 | 0 | ~5 |
| Sovereign Chat | 14 | 13 | 1 | 0 | 0 |
| Trends | 6 | 6 | 0 | 0 | 0 |
| Studio | 18 | 12 | 6 | 0 | ~3 |
| Admin | 42 | 32 | 9 | 0 | ~2 |
| **Total** | **~193** | **~138** | **~28** | **~7** | **~30** |
