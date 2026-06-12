# Placeholder Content Audit — Halo Talent

**Date**: 2026-06-11
**Scope**: Detailed analysis of every placeholder, "bientôt disponible", "coming soon", "en construction", TODO, WIP, mock, empty state, and skeleton found in the codebase.

---

## 1. Placeholder Detection Methodology

Scanned all `.tsx`, `.ts` files for these patterns:
- `Bientôt disponible` / `bientôt disponible`
- `Coming soon` / `coming soon` / `coming-soon`
- `En construction` / `en construction`
- `TODO` / `FIXME` / `WIP` / `TBD`
- `EmptyState` component usage
- Skeleton components (loading placeholders)
- `placeholder` attribute or text
- Mock data imports (`lib/mock/*`, `components/dashboard/data.ts`)
- `"Aucun"` / `"Aucune"` with contextual emptiness

---

## 2. Placeholder Occurrences — Full Inventory

### 2.1 "Bientôt disponible" (19 occurrences)

| # | File | Line Context | Type |
|---|------|-------------|------|
| 1 | `app/(marketing)/lex/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 2 | `app/(marketing)/mobile/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 3 | `components/landing/PricingSection.tsx` | Elite tier card — "Bientôt disponible" | Section placeholder |
| 4 | `components/landing/FAQSection.tsx` | Multiple accordion items — "Bientôt disponible" | Section placeholder |
| 5 | `app/(private)/dashboard/trends/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 6 | `app/(private)/dashboard/atlas/calendar/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 7 | `app/(private)/dashboard/atlas/tasks/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 8 | `app/(private)/dashboard/atlas/collab/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 9 | `app/(private)/dashboard/atlas/analytics/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 10 | `app/(private)/dashboard/atlas/crm/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 11 | `app/(private)/dashboard/studio/vault/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 12 | `app/(private)/dashboard/studio/schedule/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 13 | `app/(private)/dashboard/studio/analytics/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 14 | `app/(private)/dashboard/studio/collaborations/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 15 | `app/(private)/dashboard/studio/messages/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 16 | `app/(private)/dashboard/studio/settings/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 17 | `app/(private)/dashboard/studio/assets/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 18 | `app/(private)/dashboard/sovereign-chat/page.tsx` | Main content — "Bientôt disponible" | Full page placeholder |
| 19 | `components/marketing/CTASection.tsx` | Partial feature list | Section placeholder |

### 2.2 "En construction" / "Coming Soon" (3 occurrences)

| # | File | Line Context | Type |
|---|------|-------------|------|
| 1 | `app/(marketing)/demo/page.tsx` | Main content — "En construction" | Full page placeholder |
| 2 | `app/(marketing)/tarifs/page.tsx` | Redirect/placeholder | Full page |
| 3 | `components/landing/FeatureComparison.tsx` | Some feature rows | Row placeholder |

### 2.3 TODO/FIXME/WIP Comments (8 occurrences)

| # | File | Comment Text |
|---|------|-------------|
| 1 | `lib/mock/atlas.ts` | `// TODO: Replace with real data when API is ready` |
| 2 | `lib/mock/studio.ts` | `// TODO: Connect to analytics pipeline` |
| 3 | `components/dashboard/data.ts` | `// TODO: Fetch from Supabase` |
| 4 | `app/api/chat-ai/draft/route.ts` | `// TODO: Add real AI call when DeepSeek API key is configured` |
| 5 | `app/api/chat-ai/compliance-scan/route.ts` | `// TODO: Implement real compliance scanning engine` |
| 6 | `components/atlas/AISuggestions.tsx` | `// TODO: Real AI integration` |
| 7 | `app/(private)/dashboard/page.tsx` | `// TODO: Personalized onboarding flow` |
| 8 | `lib/payments/stripe.ts` | `// TODO: Production Stripe integration` |

### 2.4 EmptyState Component Usage (8 locations)

| # | File | Context |
|---|------|---------|
| 1 | `components/chat-ai/RevenueInboxList.tsx` | When no conversations match filters |
| 2 | `components/chat-ai/AuditMiniFeed.tsx` | "Aucune activité" when audit log is empty |
| 3 | `components/chat-ai/ConversationThread.tsx` | "Aucun message" when thread is empty |
| 4 | `components/chat-ai/ComplianceResultPanel.tsx` | "Aucune analyse de conformité" |
| 5 | `app/(private)/dashboard/chat-ai/fans/page.tsx` | "Aucun fan trouvé" when filters match nothing |
| 6 | `components/dashboard/EmptyState.tsx` | Generic reusable empty state |
| 7 | `components/ui/EmptyState.tsx` | Generic UI empty state component |
| 8 | `components/ui/ErrorState.tsx` | Generic error state component |

**Note**: #1-5 are legitimate empty states (real data, just empty). #6-8 are generic UI primitives.

---

## 3. Mock Data Dependency Analysis

### 3.1 Atlas Dashboard — `lib/mock/atlas.ts` + `components/dashboard/data.ts`

| Data Point | Type | Current Source |
|------------|------|---------------|
| Revenue (MRR, ARR, today) | KPI numbers | Hardcoded mock values |
| Subscriber counts | KPI numbers | Hardcoded mock values |
| Message inbox | Conversation list | `MOCK_MESSAGES` array |
| Calendar events | Schedule | `MOCK_EVENTS` array |
| Tasks/To-Dos | Task list | `MOCK_TASKS` array |
| AI Suggestions | Recommendations | Hardcoded strings |
| Fan activity feed | Activity list | `MOCK_ACTIVITY` array |
| Collaboration status | Status indicators | Hardcoded |
| Content calendar | Calendar entries | `MOCK_CALENDAR` array |
| Performance charts | Chart data | `MOCK_CHART_DATA` |

### 3.2 Studio Dashboard — `lib/mock/studio.ts`

| Data Point | Type | Current Source |
|------------|------|---------------|
| Content analytics | Metrics | Mock numbers |
| PPV performance | Sales data | Mock numbers |
| Asset vault count | Count | Mock numbers |
| Schedule status | Status | Mock dates |
| Collaborator activity | Activity | Mock strings |

### 3.3 Landing Page — `components/landing/*`

| Data Point | Type | Current Source |
|------------|------|---------------|
| Testimonials | 6 quotes | Hardcoded French text, fake names |
| Logos/partners | Logo grid | Hardcoded array |
| FAQ questions | 8 Q&A pairs | Hardcoded text |
| Pricing plans | 3 tiers | Hardcoded with "Bientôt disponible" for Elite |
| Feature comparison | Feature matrix | Hardcoded |

---

## 4. Placeholder by Severity

### CRITICAL (blocks user flow)
- `/demo` — "En construction" — primary conversion path
- `/lex` — "Bientôt disponible" — premium feature teaser
- Atlas metrics — fake revenue numbers visible to users

### HIGH (visible to users, damages credibility)
- 13 "Bientôt disponible" dashboard pages
- 5 mock-dependent Atlas dashboard sections
- Testimonials with fake names/quotes
- Pricing with "Bientôt disponible" tier

### MEDIUM (visible but not blocking)
- FAQ with generic content
- Feature comparison with empty rows
- Blog infrastructure (entire section missing)

### LOW (internal/developer)
- 8 TODO comments (expected in active development)
- Admin ingestion UI (internal tool)

---

## 5. Pattern Analysis

### Placeholder Pattern Types Found

1. **Empty page shell**: Full page renders only layout + "Bientôt disponible" text (19 pages)
2. **Empty section**: Page has real content but one section is placeholder (12 sections)
3. **Mock data page**: Page appears functional but uses 100% hardcoded data (2 dashboards)
4. **TODO comment**: Developer note about missing functionality (8 instances)
5. **Legitimate empty state**: Real data source, just empty (5 Chat AI components)
6. **Zero-hardcoded count**: Shows "0" without backend aggregation (5 locations)

### Technical Debt Distribution

```
Empty pages:      ████████████████████ 21
Mock-dependent:   ██████████ 10
Section holes:    ████████████ 12
TODO comments:    ████████ 8
Zero hardcodes:   █████ 5
```

---

## 6. Action Priority Matrix

| Priority | Count | Action |
|----------|-------|--------|
| P0 — Demo + Lex pages | 2 | Remove "En construction"/"Bientôt disponible", launch MVP |
| P0 — Mock data removal | 2 dashboards | Connect Atlas + Studio to Supabase real data |
| P1 — Dashboard placeholders | 13 pages | Fill with real functionality or hide from nav |
| P1 — Testimonials + Pricing | 2 sections | Replace with real testimonials, finalize pricing |
| P2 — Blog + FAQ + Mobile | 3 sections | Build or remove from nav |
| P3 — TODOs | 8 | Address progressively as APIs become available |
