# Empty Pages Audit — Halo Talent

**Date**: 2026-06-11
**Scope**: All routes with empty, placeholder, "bientôt disponible", "coming soon", "en construction", or mock-only content.

---

## 1. Completely Empty Pages (21 pages)

These pages render only layout chrome (header, sidebar) with no functional content. They are shells with either an EmptyState, "Bientôt disponible", or a blank `<div>`.

### 1.1 Public/Marketing Pages (7)

| # | Route | File | Content | Severity |
|---|-------|------|---------|----------|
| 1 | `/lex` | `app/(marketing)/lex/page.tsx` | "Bientôt disponible" placeholder | HIGH — premium feature teased |
| 2 | `/lex/requests` | `app/(marketing)/lex/requests/page.tsx` | Empty page shell | HIGH — linked from lex page |
| 3 | `/blog` | `app/(marketing)/blog/page.tsx` | Empty blog listing | MEDIUM |
| 4 | `/blog/[slug]` | `app/(marketing)/blog/[slug]/page.tsx` | No articles rendered | MEDIUM |
| 5 | `/tarifs` | `app/(marketing)/tarifs/page.tsx` | Pricing page exists but routes to partial | LOW — duplicate of /#pricing |
| 6 | `/contact` | `app/(marketing)/contact/page.tsx` | Contact form shell, no backend | MEDIUM |
| 7 | `/demo` | `app/(marketing)/demo/page.tsx` | "En construction" | HIGH — primary CTA target |

### 1.2 Dashboard Pages (6)

| # | Route | File | Content | Severity |
|---|-------|------|---------|----------|
| 8 | `/dashboard/atlas/inbox` | `app/(private)/dashboard/atlas/inbox/page.tsx` | Partial — has mock data only | MEDIUM |
| 9 | `/dashboard/atlas/calendar` | `app/(private)/dashboard/atlas/calendar/page.tsx` | Empty placeholder | HIGH — navigation link |
| 10 | `/dashboard/atlas/tasks` | `app/(private)/dashboard/atlas/tasks/page.tsx` | Empty placeholder | MEDIUM |
| 11 | `/dashboard/atlas/collab` | `app/(private)/dashboard/atlas/collab/page.tsx` | Empty placeholder | MEDIUM |
| 12 | `/dashboard/studio/assets` | `app/(private)/dashboard/studio/assets/page.tsx` | Empty placeholder | MEDIUM |
| 13 | `/dashboard/trends` | `app/(private)/dashboard/trends/page.tsx` | Empty placeholder | HIGH — main nav item |

### 1.3 Studio Pages (6)

| # | Route | File | Content | Severity |
|---|-------|------|---------|----------|
| 14 | `/dashboard/studio/vault` | `app/(private)/dashboard/studio/vault/page.tsx` | Empty placeholder | MEDIUM |
| 15 | `/dashboard/studio/schedule` | `app/(private)/dashboard/studio/schedule/page.tsx` | Empty placeholder | MEDIUM |
| 16 | `/dashboard/studio/analytics` | `app/(private)/dashboard/studio/analytics/page.tsx` | Empty placeholder | HIGH |
| 17 | `/dashboard/studio/collaborations` | `app/(private)/dashboard/studio/collaborations/page.tsx` | Empty placeholder | MEDIUM |
| 18 | `/dashboard/studio/messages` | `app/(private)/dashboard/studio/messages/page.tsx` | Empty placeholder | MEDIUM |
| 19 | `/dashboard/studio/settings` | `app/(private)/dashboard/studio/settings/page.tsx` | Empty placeholder | LOW |

### 1.4 Admin Pages (1)

| # | Route | File | Content | Severity |
|---|-------|------|---------|----------|
| 20 | `/admin/legal/knowledge` | Partially functional | Admin CRUD but no ingestion UI | LOW |

### 1.5 Mobile Page (1)

| # | Route | File | Content | Severity |
|---|-------|------|---------|----------|
| 21 | `/mobile` | `app/(marketing)/mobile/page.tsx` | Mobile app teasing page, empty | LOW |

---

## 2. Sections with Placeholder Content (12 medium severity)

These pages have SOME real content but contain sections that are empty or placeholder.

| # | Route | Section | Issue |
|---|-------|---------|-------|
| 1 | `/` (Home) | Testimonials section | Hardcoded mock testimonials, no real user data |
| 2 | `/` (Home) | Pricing table | "Bientôt disponible" tiers, incomplete plan comparison |
| 3 | `/` (Home) | FAQ section | Generic placeholder questions |
| 4 | `/dashboard` | Welcome/Getting Started | Generic welcome card, no personalized onboarding |
| 5 | `/dashboard/chat-ai` | Revenue metric card | Shows "— Tracking bientôt" — revenue tracking not implemented |
| 6 | `/dashboard/chat-ai` | Pending drafts count | Always shows 0 (no aggregation from DB) |
| 7 | `/dashboard/chat-ai` | Compliance alerts count | Always shows 0 (no aggregation from DB) |
| 8 | `/atlas` | Feature comparison table | Hardcoded, no dynamic data |
| 9 | `/atlas/fonctionnalites` | Feature list | Static, no real product integration |
| 10 | `/conformite` | Regulation badges | Static decorative elements, no verification |
| 11 | `/a-propos` | Team section | Generic, no real team photos/bios |
| 12 | `/dashboard/sovereign-chat` | All content | "Bientôt disponible" until Phase 2C |

---

## 3. Mock-Data-Dependent Features (~30 pages/components)

These pages appear functional but rely entirely on `lib/mock/*` or hardcoded data arrays. They will break when mock data is removed.

### 3.1 Pages Using `lib/mock/*` Directly

| # | Page/Component | Mock Source | Risk |
|---|---------------|-------------|------|
| 1 | Atlas Dashboard (`/dashboard/atlas`) | `components/dashboard/data.ts` | HIGH — all KPIs are fake numbers |
| 2 | Atlas Inbox (`/dashboard/atlas/inbox`) | `components/dashboard/data.ts` | HIGH — messages are entirely fake |
| 3 | Atlas Calendar | `components/dashboard/data.ts` | MEDIUM |
| 4 | Atlas Tasks | `components/dashboard/data.ts` | MEDIUM |
| 5 | Studio Dashboard (`/dashboard/studio`) | `lib/mock/studio.ts` | HIGH — fake metrics |
| 6 | Studio Analytics | `lib/mock/studio.ts` | HIGH — fake charts |
| 7 | Revenue Dashboard sections | Mock revenue data | HIGH — fake financial data |
| 8 | Fan activity charts | Hardcoded data | MEDIUM |
| 9 | Notification bell/badge count | Hardcoded to 0 or fixed number | LOW |
| 10 | Atlas score/suggestions | AI-like but hardcoded | MEDIUM |

### 3.2 Hardcoded "Zero" Counts

These show "0" or "Aucun(e)" with no backend:

| # | Location | What Shows Zero | Fix Needed |
|---|----------|-----------------|------------|
| 1 | Dashboard notification badge | Always 3 (hardcoded) | Connect to real notifications |
| 2 | Chat AI pending drafts | Always 0 | Aggregate from `chat_ai_drafts` |
| 3 | Chat AI compliance alerts | Always 0 | Aggregate from compliance events |
| 4 | Atlas messages unread | Always 0 | Connect to real messaging |
| 5 | Studio analytics | All zeros | Connect to real analytics pipeline |

---

## 4. Summary

| Category | Count |
|----------|-------|
| Completely empty pages | 21 |
| Partially empty sections | 12 |
| Mock-dependent pages/components | 10+ |
| Hardcoded zero counts | 5 |
| **Total pages requiring content** | **~48** |

### P0 — Must fix before public launch
- `/lex` — premium feature landing page is "Bientôt disponible"
- `/demo` — primary conversion CTA is "En construction"
- `/dashboard/trends` — main nav item is empty
- `/dashboard/atlas/calendar` — main nav item is empty
- All Atlas mock data — shows fake revenue/metrics

### P1 — Should fix before beta
- 14 remaining empty pages
- Testimonials on home page
- Pricing table completion

### P2 — Nice to have
- Blog infrastructure
- Mobile page
- Admin ingestion UI
