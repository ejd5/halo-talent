# Dashboard Tools Audit — Halo Talent

**Date**: 2026-06-11
**Scope**: Analysis of every dashboard route — what works, what's missing, data source, and priority for filling content.

---

## 1. Dashboard Architecture

```
/dashboard
├── /                    ← Welcome/Overview
├── /chat-ai/            ← Halo Sovereign Chat AI
│   ├── /                ← Overview + Revenue Inbox
│   ├── /inbox/[id]      ← Conversation detail + draft composer
│   └── /fans            ← Fan Brain list + profiles
├── /atlas/              ← Atlas Bouclier Légal
│   ├── /                ← Atlas dashboard
│   ├── /inbox           ← Legal inbox
│   ├── /calendar        ← Legal calendar
│   ├── /tasks           ← Legal tasks
│   ├── /collab          ← Collaboration
│   ├── /analytics       ← Analytics
│   └── /crm             ← CRM
├── /studio/             ← Studio (content management)
│   ├── /                ← Studio dashboard
│   ├── /vault           ← Content vault
│   ├── /schedule        ← Publishing schedule
│   ├── /analytics       ← Content analytics
│   ├── /collaborations  ← Collaborator management
│   ├── /messages        ← Internal messages
│   ├── /assets          ← Asset library
│   └── /settings        ← Studio settings
├── /trends              ← Trends dashboard
├── /sovereign-chat      ← Sovereign Chat (Phase 2C)
└── /settings            ← Account settings
```

---

## 2. Per-Route Analysis

### 2.1 `/dashboard` — Welcome/Overview

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | PARTIAL | Welcome card + quick links |
| Real data | NO | Hardcoded welcome message |
| Functional CTAs | NO | Links point to placeholder pages |
| i18n coverage | 0% | All hardcoded French |
| Loading state | N/A | Static content |
| Empty state | N/A | Always shows content |
| Mobile responsive | YES | Basic flex layout |
| Priority | P1 | Needs personalized onboarding flow |

**Missing**: User-specific metrics, onboarding checklist, recent activity, quick actions tied to real data.

---

### 2.2 `/dashboard/chat-ai` — Chat AI Overview

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | YES | Full implementation (Phase 2A) |
| Real data | YES | `GET /api/chat-ai/conversations`, `/fans`, `/audit` |
| Functional CTAs | YES | Pause button, conversation click-through |
| i18n coverage | 100% | 149 keys in `lib/i18n/chat-ai.ts` |
| Loading state | YES | Skeleton placeholders |
| Empty state | YES | EmptyState component with seed action |
| Mobile responsive | YES | Flexbox wrap layout |
| Priority | DONE | Approved for Phase 2B |

**Missing**: Real-time updates, revenue tracking ("—" placeholder), pending drafts/compliance alerts aggregation.

---

### 2.3 `/dashboard/chat-ai/inbox/[id]` — Conversation Detail

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | YES | Full implementation (Phase 2A) |
| Real data | YES | Conversations + fans + drafts + audit + compliance |
| Functional CTAs | YES | Generate, approve, copy drafts |
| i18n coverage | 100% | Full translation coverage |
| Loading state | YES | Skeleton bubbles + spinner |
| Empty state | YES | "Aucun message", "Aucune analyse" |
| Mobile responsive | YES | Flexbox wrap |
| Priority | DONE | Approved for Phase 2B |

**Missing**: Dedicated conversation endpoint (loads all 100+ conversations to find one), copy API not yet implemented, no real AI generation (demo mode).

---

### 2.4 `/dashboard/chat-ai/fans` — Fan Brain List

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | YES | Full implementation (Phase 2A) |
| Real data | YES | `GET /api/chat-ai/fans` with filters |
| Functional CTAs | YES | Search, filter, sort, drawer open |
| i18n coverage | 100% | Full translation coverage |
| Loading state | YES | 10 skeleton rows |
| Empty state | YES | "Aucun fan trouvé" with filter description |
| Mobile responsive | YES | `overflowX: auto` + `minWidth: 640px` |
| Priority | DONE | Approved for Phase 2B |

---

### 2.5 `/dashboard/atlas` — Atlas Dashboard

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | YES | Dashboard with KPIs, inbox, calendar, tasks |
| Real data | NO | 100% mock data (`lib/mock/atlas.ts`, `components/dashboard/data.ts`) |
| Functional CTAs | NO | Buttons don't trigger real actions |
| i18n coverage | 0% | All hardcoded French |
| Loading state | MINIMAL | Basic loading indicator |
| Empty state | NO | Always shows mock data |
| Mobile responsive | PARTIAL | Basic layout, some overflow issues |
| Priority | P0 | Replace all mock data with Supabase queries |

**Missing**: Every data point is fake. Revenue numbers, messages, calendar events, tasks, AI suggestions, activity feed — all hardcoded. This is the most misleading dashboard on the site.

---

### 2.6 `/dashboard/atlas/inbox` — Atlas Legal Inbox

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | MINIMAL | Basic message list |
| Real data | NO | Mock messages |
| Functional CTAs | NO | Read/unread toggle only |
| i18n coverage | 0% | Hardcoded French |
| Priority | P1 | Connect to real messaging |

---

### 2.7 `/dashboard/atlas/calendar` — Atlas Calendar

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Real data | NO | N/A |
| Functional CTAs | NO | N/A |
| Priority | P1 | Full placeholder — build or hide |

---

### 2.8 `/dashboard/atlas/tasks` — Atlas Tasks

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P1 | Full placeholder |

---

### 2.9 `/dashboard/atlas/collab` — Atlas Collaboration

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P1 | Full placeholder |

---

### 2.10 `/dashboard/atlas/analytics` — Atlas Analytics

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P2 | Analytics may not be core for Atlas |

---

### 2.11 `/dashboard/atlas/crm` — Atlas CRM

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P2 | CRM may be out of scope for V1 |

---

### 2.12 `/dashboard/studio` — Studio Dashboard

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | YES | Dashboard with metrics, charts |
| Real data | NO | 100% mock data (`lib/mock/studio.ts`) |
| Functional CTAs | PARTIAL | Some navigation works |
| i18n coverage | 0% | Hardcoded French |
| Priority | P0 | Replace mock data with real analytics |

**Missing**: Content metrics, PPV sales data, asset counts, schedule status — all fake numbers.

---

### 2.13 `/dashboard/studio/vault` — Content Vault

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P1 | Core feature for OFM creators |

---

### 2.14 `/dashboard/studio/schedule` — Publishing Schedule

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P1 | Content calendar is essential |

---

### 2.15 `/dashboard/studio/analytics` — Content Analytics

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | HIGH | Analytics are a key selling point |

---

### 2.16 `/dashboard/studio/collaborations` — Collaborators

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P2 | Agency/team feature |

---

### 2.17 `/dashboard/studio/messages` — Internal Messages

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P2 | Internal comms |

---

### 2.18 `/dashboard/studio/assets` — Asset Library

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P1 | Asset management |

---

### 2.19 `/dashboard/studio/settings` — Studio Settings

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P2 | Settings page |

---

### 2.20 `/dashboard/trends` — Trends

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | HIGH | Main navigation item is empty |

---

### 2.21 `/dashboard/sovereign-chat` — Sovereign Chat

| Criteria | Status | Details |
|----------|--------|---------|
| Content present | NO | "Bientôt disponible" placeholder |
| Priority | P1 | Planned for Phase 2C |

---

## 3. Summary Matrix

| Dashboard | Content | Real Data | i18n | CTAs | Priority |
|-----------|---------|-----------|------|------|----------|
| `/dashboard` | PARTIAL | NO | 0% | NO | P1 |
| `/dashboard/chat-ai` | **DONE** | **YES** | **100%** | **YES** | — |
| `/dashboard/chat-ai/inbox/[id]` | **DONE** | **YES** | **100%** | **YES** | — |
| `/dashboard/chat-ai/fans` | **DONE** | **YES** | **100%** | **YES** | — |
| `/dashboard/atlas` | YES | **NO (mock)** | 0% | NO | P0 |
| `/dashboard/atlas/*` (6 subpages) | NO | NO | 0% | NO | P1-P2 |
| `/dashboard/studio` | YES | **NO (mock)** | 0% | PARTIAL | P0 |
| `/dashboard/studio/*` (7 subpages) | NO | NO | 0% | NO | P1-P2 |
| `/dashboard/trends` | NO | NO | 0% | NO | P0 |
| `/dashboard/sovereign-chat` | NO | NO | 0% | NO | P1 |

## 4. Priority Action Plan

### P0 — Critical (blocks launch)
1. **Atlas Dashboard** — Replace all mock data with Supabase queries. Remove fake revenue/metrics.
2. **Studio Dashboard** — Replace mock analytics with real data pipeline.
3. **Trends** — Build or remove from navigation.
4. **Atlas Calendar** — Build or remove from navigation.

### P1 — High (visible to users)
1. **Studio Vault** — Build content vault with real asset management.
2. **Studio Schedule** — Build publishing calendar.
3. **Studio Analytics** — Connect to real analytics.
4. **Atlas Inbox** — Connect to real messaging system.
5. **Welcome Dashboard** — Personalized onboarding flow.
6. **Sovereign Chat** — Phase 2C implementation.

### P2 — Medium (nice to have)
1. **Atlas Collab** — Collaboration features.
2. **Atlas CRM** — CRM integration.
3. **Studio Collaborations** — Agency features.
4. **Studio Messages** — Internal messaging.
5. **Studio Assets** — Asset library.
6. **Studio Settings** — Settings page.

### Complete (no action needed)
1. **Chat AI Overview** — Phase 2A complete.
2. **Chat AI Inbox Detail** — Phase 2A complete.
3. **Chat AI Fans** — Phase 2A complete.
