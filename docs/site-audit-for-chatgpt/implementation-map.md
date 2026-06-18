# Implementation Map — Halo Talent

**Date**: 2026-06-11
**Scope**: Actionable correction map organized by route/component, with estimated complexity, priority, and dependencies.

---

## 1. How to Use This Map

Each row is one actionable correction. Complexity is estimated in developer-hours:
- **XS** (<2h): Text change, remove element, redirect
- **S** (2-4h): Replace content, add i18n keys, wire simple API
- **M** (1-2 days): Build new component, connect Supabase query, create i18n namespace
- **L** (3-5 days): Build full page, integrate real data pipeline
- **XL** (1-2 weeks): Build new feature, full dashboard

---

## 2. P0 — Critical Corrections (Must Fix Before Launch)

### 2.1 Risky Claims Removal

| ID | Action | File(s) | Complexity | Hours |
|----|--------|---------|------------|-------|
| RC-1 | Replace "Zero ban garanti" (3 occurrences) | `components/landing/PricingSection.tsx` | XS | 0.5 |
| RC-2 | Replace "Zero ban guarantee" | `components/landing/WhyUsSection.tsx` | XS | 0.5 |
| RC-3 | Replace "Garanti sans risque" | `app/(marketing)/conformite/page.tsx` | XS | 0.5 |
| RC-4 | Replace "100% conforme aux règles 2026" | `app/(marketing)/atlas/fonctionnalites/page.tsx` | XS | 0.5 |
| RC-5 | Replace "Conformité totale ... garantie" | `app/(marketing)/atlas/fonctionnalites/page.tsx` | XS | 0.5 |
| RC-6 | Replace "Conformité multi-juridiction garantie" | `app/(marketing)/atlas/fonctionnalites/page.tsx` | XS | 0.5 |
| RC-7 | Replace "Détecte 100% des risques" | `app/(marketing)/atlas/fonctionnalites/page.tsx` | XS | 0.5 |
| RC-8 | Replace "100% Souveraineté garantie" | `app/(marketing)/atlas/page.tsx` | XS | 0.5 |
| RC-9 | Replace "Crédits illimités" + add fair use | `components/landing/PricingSection.tsx` | XS | 1 |
| RC-10 | Replace "IA la plus avancée" | `components/landing/HeroSection.tsx` | XS | 0.5 |
| RC-11 | Replace "Jamais banni" (all variations) | Multiple marketing files | S | 2 |
| RC-12 | Replace "Protection juridique complète" | `app/(marketing)/atlas/page.tsx` | XS | 0.5 |

**Subtotal RC: 8 hours (1 day)**

### 2.2 Broken Conversion Paths

| ID | Action | File(s) | Complexity | Hours |
|----|--------|---------|------------|-------|
| CP-1 | Build `/demo` page — demo request form | `app/(marketing)/demo/page.tsx` | M | 12 |
| CP-2 | Wire `/contact` form to email/CRM backend | `app/(marketing)/contact/page.tsx` + API | M | 8 |
| CP-3 | Build `/lex` landing page | `app/(marketing)/lex/page.tsx` | L | 16 |
| CP-4 | Complete pricing table, remove "Bientôt disponible" | `components/landing/PricingSection.tsx` | S | 4 |

**Subtotal CP: 40 hours (5 days)**

### 2.3 Mock Data Removal — Atlas Dashboard

| ID | Action | File(s) | Complexity | Hours |
|----|--------|---------|------------|-------|
| AT-1 | Replace mock KPIs with Supabase queries | `app/(private)/dashboard/atlas/page.tsx` | M | 12 |
| AT-2 | Replace mock messages with real messaging | `app/(private)/dashboard/atlas/inbox/page.tsx` | L | 16 |
| AT-3 | Replace mock calendar with real events | `app/(private)/dashboard/atlas/calendar/page.tsx` | L | 16 |
| AT-4 | Replace mock tasks with real task system | `app/(private)/dashboard/atlas/tasks/page.tsx` | L | 16 |
| AT-5 | Replace mock AI suggestions | `components/atlas/AISuggestions.tsx` | M | 8 |
| AT-6 | Create `atlas` i18n namespace + translate | New `lib/i18n/atlas.ts` | S | 4 |

**Subtotal AT: 72 hours (9 days)**

### 2.4 Mock Data Removal — Studio Dashboard

| ID | Action | File(s) | Complexity | Hours |
|----|--------|---------|------------|-------|
| ST-1 | Replace mock analytics with real pipeline | `app/(private)/dashboard/studio/page.tsx` | L | 20 |
| ST-2 | Replace mock charts with real data | Studio chart components | M | 12 |
| ST-3 | Create `studio` i18n namespace + translate | New `lib/i18n/studio.ts` | S | 4 |

**Subtotal ST: 36 hours (4.5 days)**

---

## 3. P1 — High Priority (Should Fix for Beta)

### 3.1 Build Placeholder Dashboard Pages

| ID | Action | File(s) | Complexity | Hours |
|----|--------|---------|------------|-------|
| DP-1 | Build Atlas Calendar page | `app/(private)/dashboard/atlas/calendar/page.tsx` | L | 16 |
| DP-2 | Build Atlas Tasks page | `app/(private)/dashboard/atlas/tasks/page.tsx` | M | 12 |
| DP-3 | Build Atlas Collab page | `app/(private)/dashboard/atlas/collab/page.tsx` | M | 12 |
| DP-4 | Build Studio Vault page | `app/(private)/dashboard/studio/vault/page.tsx` | L | 20 |
| DP-5 | Build Studio Schedule page | `app/(private)/dashboard/studio/schedule/page.tsx` | L | 16 |
| DP-6 | Build Studio Analytics page | `app/(private)/dashboard/studio/analytics/page.tsx` | L | 20 |
| DP-7 | Build Trends dashboard | `app/(private)/dashboard/trends/page.tsx` | L | 20 |
| DP-8 | Build Sovereign Chat (Phase 2C) | `app/(private)/dashboard/sovereign-chat/page.tsx` | XL | 40 |

**Subtotal DP: 156 hours (19.5 days)**

### 3.2 Home Page Content Fixes

| ID | Action | File(s) | Complexity | Hours |
|----|--------|---------|------------|-------|
| HP-1 | Replace fake testimonials with real ones | `components/landing/TestimonialsSection.tsx` | S | 3 |
| HP-2 | Rewrite FAQ with real user questions | `components/landing/FAQSection.tsx` | S | 3 |
| HP-3 | Internationalize home page (18 components) | All `components/landing/*` | M | 12 |
| HP-4 | Add `landing` i18n namespace | New `lib/i18n/landing.ts` | S | 4 |

**Subtotal HP: 22 hours (2.75 days)**

### 3.3 Dashboard Quality Improvements

| ID | Action | File(s) | Complexity | Hours |
|----|--------|---------|------------|-------|
| DQ-1 | Personalize welcome dashboard | `app/(private)/dashboard/page.tsx` | M | 8 |
| DQ-2 | Internationalize UI primitives (EmptyState, ErrorState, etc.) | `components/ui/*` | S | 4 |
| DQ-3 | Internationalize dashboard chrome (CommandPalette, KeyboardShortcuts, AtlasLauncher) | `components/dashboard/*` | S | 3 |
| DQ-4 | Add real-time polling for CHATEENG audit feed | `components/chat-ai/AuditMiniFeed.tsx` | S | 3 |
| DQ-5 | Add pending drafts/compliance alerts aggregation | CHATEENG overview + API | S | 4 |

**Subtotal DQ: 22 hours (2.75 days)**

---

## 4. P2 — Medium Priority (Nice to Have)

| ID | Action | File(s) | Complexity | Hours |
|----|--------|---------|------------|-------|
| NP-1 | Build blog listing + article pages | `app/(marketing)/blog/**` | L | 20 |
| NP-2 | Add real team content to À propos | `app/(marketing)/a-propos/page.tsx` | S | 3 |
| NP-3 | Build Studio Collaborations | `app/(private)/dashboard/studio/collaborations/page.tsx` | M | 12 |
| NP-4 | Build Studio Messages | `app/(private)/dashboard/studio/messages/page.tsx` | M | 12 |
| NP-5 | Build Studio Assets | `app/(private)/dashboard/studio/assets/page.tsx` | M | 12 |
| NP-6 | Build Studio Settings | `app/(private)/dashboard/studio/settings/page.tsx` | S | 4 |
| NP-7 | Build Atlas Analytics | `app/(private)/dashboard/atlas/analytics/page.tsx` | M | 12 |
| NP-8 | Build Atlas CRM | `app/(private)/dashboard/atlas/crm/page.tsx` | M | 12 |
| NP-9 | Polish auth page UI | `app/(auth)/**` | S | 4 |
| NP-10 | Build or remove Mobile page | `app/(marketing)/mobile/page.tsx` | S | 2 |

**Subtotal P2: 93 hours (11.6 days)**

---

## 5. Summary — Total Implementation Effort

| Priority | Tasks | Est. Hours | Est. Days |
|----------|-------|------------|-----------|
| P0 — Risky Claims | 12 | 8 | 1 |
| P0 — Conversion Paths | 4 | 40 | 5 |
| P0 — Atlas Mock Removal | 6 | 72 | 9 |
| P0 — Studio Mock Removal | 3 | 36 | 4.5 |
| **P0 Subtotal** | **25** | **156** | **19.5** |
| P1 — Dashboard Builds | 8 | 156 | 19.5 |
| P1 — Home Page Fixes | 4 | 22 | 2.75 |
| P1 — Dashboard Quality | 5 | 22 | 2.75 |
| **P1 Subtotal** | **17** | **200** | **25** |
| P2 — Nice to Have | 10 | 93 | 11.6 |
| **P2 Subtotal** | **10** | **93** | **11.6** |
| **GRAND TOTAL** | **52** | **449** | **~56 days** |

---

## 6. Dependency Graph

```
RC (Risky Claims) ──────────────────────┐
                                         ├──► Can launch MVP (marketing safe)
CP-3 (Lex page) ───► Depends on Phase 2  │
CP-1 (Demo page) ────────────────────────┘

AT-1..5 (Atlas real data) ──► Depends on Supabase schema for messaging/tasks/calendar
ST-1..2 (Studio real data) ─► Depends on analytics pipeline

DP-1..8 (Dashboard builds) ─► Can start after AT/ST mock removal
HP-1..4 (Home page fixes) ──► Independent, can parallelize
DQ-1..5 (Quality) ───────────► Independent, can parallelize

Phase 2B (PPV Copilot) ─────► Blocked by Phase 2A QA (DONE)
Phase 2C (Sovereign Chat) ──► Blocks DP-8
```

---

## 7. Recommended Execution Order

### Week 1-2: Foundation & Safety
1. All risky claims removal (RC-1..12) — **1 day**
2. Home page content fixes (HP-1..4) — **3 days**
3. Build Demo page (CP-1) — **1.5 days**
4. Wire Contact form (CP-2) — **1 day**
5. Dashboard quality improvements (DQ-1..5) — **3 days**

### Week 3-5: Real Data Integration
6. Atlas mock data replacement (AT-1..6) — **9 days**
7. Studio mock data replacement (ST-1..3) — **4.5 days**

### Week 6-9: Placeholder Fills
8. Priority dashboard builds (DP-1..7) — **16 days**
9. Build Lex landing page (CP-3) — **2 days**

### Week 10-12: Polish
10. P2 nice-to-have items (NP-1..10) — **12 days**
11. Sovereign Chat Phase 2C (DP-8) — **5 days** (overlaps with other work)

---

## 8. Notes

- **All estimates assume 1 developer.** Can be parallelized with 2-3 developers.
- **P0 tasks are independent** of each other and can all be parallelized.
- **P1 dashboard builds** depend on the mock data removal being done first (schema established).
- **Phase 2B (PPV Copilot)** is a separate workstream, not included in this audit's scope.
- **No Atlas/Studio/Admin redesign** per user instructions. Only content/replacement fixes.
