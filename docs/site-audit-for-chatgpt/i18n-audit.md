# i18n Audit — Halo Talent

**Date**: 2026-06-11
**Scope**: Complete internationalization coverage analysis — namespaces, hardcoded text, missing translations, structural issues.

---

## 1. i18n Architecture

```
lib/i18n/
├── config.ts         — Supported locales, default locale (fr)
├── common.ts         — Shared UI strings (439 keys)
├── chat-ai.ts        — CHATEENG namespace (149 keys)
├── index.ts          — t() function, useLocale() hook
└── types.ts          — TypeScript types for i18n

Supported languages: fr, en, es, de, pt-BR, it (6 languages)
Default: fr
Pattern: Nested key objects → t("namespace.section.key")
```

---

## 2. Namespace Coverage

### 2.1 `common` Namespace (439 keys)

| Section | Keys | Coverage | Notes |
|---------|------|----------|-------|
| Navigation | ~30 | 100% | All nav labels translated |
| Dashboard | ~60 | 100% | Dashboard chrome fully translated |
| Auth | ~25 | 100% | Login/register/reset flow |
| Settings | ~40 | 100% | Account settings translated |
| Errors | ~20 | 100% | Error messages |
| Actions | ~30 | 100% | Button labels, actions |
| Status | ~20 | 100% | Status badges, labels |
| Forms | ~35 | 100% | Form labels, placeholders, validation |
| Studio | ~50 | 100% | Studio labels translated |
| Atlas | ~60 | 100% | Atlas labels translated |
| Marketing | ~40 | 100% | Some marketing strings |
| Misc/Other | ~29 | 100% | Remaining keys |
| **Total** | **439** | **100%** | All 6 languages complete |

### 2.2 `chat-ai` Namespace (149 keys)

| Section | Keys | Coverage | Notes |
|---------|------|----------|-------|
| Page titles | 6 | 100% | All 6 languages |
| Filters | 12 | 100% | Filter labels/dropdowns |
| Sort options | 4 | 100% | Sort labels |
| Composer | 20 | 100% | Draft composer full coverage |
| Objectives | 5 | 100% | Objective chips |
| Tones | 4 | 100% | Tone selector |
| Compliance | 8 | 100% | Compliance panel |
| Thread | 6 | 100% | Message thread labels |
| Fan labels | 6 | 100% | Fan profile labels |
| Table headers | 8 | 100% | Fan table columns |
| Scores | 4 | 100% | Score labels |
| Empty states | 8 | 100% | Empty state messages |
| Navigation | 1 | 100% | Back button |
| Pause | 5 | 100% | Pause dialog |
| Activity | 3 | 100% | Activity feed |
| Audit | 8 | 100% | Audit labels |
| Metrics | 8 | 100% | Metric card labels |
| Revenue Inbox | 6 | 100% | Inbox labels |
| Fan Brain | 4 | 100% | Fan Brain section |
| Other | 23 | 100% | Misc labels |
| **Total** | **149** | **100%** | All 6 languages complete |

### 2.3 Missing Namespaces (0 keys)

| Namespace | Should Exist For | Priority |
|-----------|------------------|----------|
| `atlas` | Atlas dashboard pages | P0 |
| `studio` | Studio dashboard pages | P0 |
| `trends` | Trends dashboard | P1 |
| `landing` | All marketing pages | P0 |
| `lex` | Halo Lex page | P1 |
| `admin` | Admin pages | P2 |
| `sovereign-chat` | Sovereign Chat | P1 |

---

## 3. Hardcoded French Text — Component Analysis

### 3.1 Home Page Components (18/25 are hardcoded)

| Component | i18n | Status |
|-----------|------|--------|
| HeroSection | NO | Hardcoded French |
| WhyUsSection | NO | Hardcoded French |
| FeaturesSection | NO | Hardcoded French |
| PricingSection | NO | Hardcoded French |
| TestimonialsSection | NO | Hardcoded French |
| FAQSection | NO | Hardcoded French |
| CTASection | NO | Hardcoded French |
| Navbar | PARTIAL | Some keys, some hardcoded |
| Footer | NO | Hardcoded French |
| TrustBadges | NO | Hardcoded French |
| StatsSection | NO | Hardcoded French |
| ComparisonTable | NO | Hardcoded French |
| HowItWorks | NO | Hardcoded French |
| SocialProof | NO | Hardcoded French |
| TrustedBy | NO | Hardcoded French |
| SecurityBadges | NO | Hardcoded French |
| FinalCTA | NO | Hardcoded French |
| AnimatedStats | NO | Hardcoded French |
| GlowEffect | N/A | Visual only |
| ParticlesBackground | N/A | Visual only |
| MagneticButton | N/A | Visual only |
| ScrollReveal | N/A | Visual only |
| TypewriterText | NO | Hardcoded French text |
| BentoGrid | NO | Hardcoded French |
| MarqueeLogos | N/A | Visual |

**Home page i18n coverage: 28% (7/25 components use i18n)**

### 3.2 Dashboard Components (hardcoded)

| Component | i18n | Scope |
|-----------|------|-------|
| Atlas dashboard page | NO | All text hardcoded French |
| Atlas subpages (6) | N/A | Empty placeholders |
| Studio dashboard page | NO | All text hardcoded French |
| Studio subpages (7) | N/A | Empty placeholders |
| Trends page | N/A | Empty placeholder |
| Sovereign Chat page | N/A | Empty placeholder |
| Welcome dashboard | NO | Hardcoded French welcome card |
| Sidebar navigation | YES | Uses `t("common.nav.*")` |
| Header | YES | Uses `t("common.header.*")` |
| CommandPalette | NO | All hardcoded French |
| KeyboardShortcuts | NO | All hardcoded French |
| AtlasLauncher | NO | Hardcoded French |
| EmptyState (generic) | NO | Hardcoded French |
| ErrorState (generic) | NO | Hardcoded French |

### 3.3 Marketing Pages (hardcoded)

| Page | i18n | Notes |
|------|------|-------|
| `/atlas` landing | NO | All hardcoded French |
| `/atlas/fonctionnalites` | NO | All hardcoded French |
| `/conformite` | NO | All hardcoded French |
| `/a-propos` | NO | All hardcoded French |
| `/lex` | N/A | Empty placeholder |
| `/blog` | N/A | Empty |
| `/tarifs` | N/A | Redirect |
| `/contact` | NO | Hardcoded French |
| `/demo` | N/A | Empty placeholder |
| `/mobile` | N/A | Empty placeholder |

### 3.4 Fully i18n-Covered Pages

| Page/Feature | Namespace |
|--------------|-----------|
| CHATEENG Overview | `chat-ai` (149 keys) |
| CHATEENG Inbox Detail | `chat-ai` |
| CHATEENG Fans | `chat-ai` |
| Auth pages (login/register/reset) | `common.auth` |
| Account settings | `common.settings` |
| Dashboard sidebar/header chrome | `common.nav`, `common.header` |

---

## 4. Hardcoded Text Patterns

### 4.1 Pattern: Direct French strings in JSX

```tsx
// BAD — Found in 18 home components + all marketing pages
<h1>La solution tout-en-un pour créateurs de contenu</h1>
<p>Protégez votre activité, boostez vos revenus</p>

// GOOD — Only in CHATEENG + auth + settings
<h1>{t("chatAI.page.overview")}</h1>
<p>{t("chatAI.page.overviewDesc")}</p>
```

### 4.2 Pattern: Hardcoded UI primitives

```tsx
// components/ui/EmptyState.tsx — Hardcoded French
<h3>Aucun résultat</h3>
<p>Aucune donnée à afficher pour le moment.</p>

// components/ui/ErrorState.tsx — Hardcoded French
<h3>Une erreur est survenue</h3>
<p>Veuillez réessayer plus tard.</p>

// components/dashboard/CommandPalette.tsx — Hardcoded French
placeholder="Rechercher une page, une action..."
```

### 4.3 Pattern: Mixed i18n + hardcoded in same component

```tsx
// Navbar — PARTIAL i18n
<span>{t("common.nav.dashboard")}</span>          // translated
<span>Tableau de bord</span>                       // hardcoded French
```

---

## 5. i18n Coverage Summary

| Area | Keys | Coverage | Hardcoded |
|------|------|----------|-----------|
| CHATEENG (3 pages) | 149 | **100%** | 0 strings |
| Common (auth/settings/nav) | 439 | **100%** | 0 strings in covered areas |
| Home page | 0 | **28%** | ~150 hardcoded strings |
| Atlas dashboard | 0 | **0%** | ~80 hardcoded strings |
| Studio dashboard | 0 | **0%** | ~60 hardcoded strings |
| Marketing pages | 0 | **0%** | ~120 hardcoded strings |
| UI primitives | 0 | **0%** | ~20 hardcoded strings |
| Dashboard chrome | 0 | **0%** | ~15 hardcoded strings |
| **TOTAL** | **588** | **~45%** | **~445 hardcoded strings** |

---

## 6. Structural Issues

### Issue 1: No marketing namespace
All 6 marketing pages, 25 home components, and the entire landing experience has zero i18n keys. A `landing` namespace with sections for each page/component is needed.

### Issue 2: No dashboard namespaces
Atlas and Studio dashboards use hardcoded French. Need `atlas` and `studio` namespaces.

### Issue 3: UI primitives not internationalized
`EmptyState`, `ErrorState`, `CommandPalette`, `KeyboardShortcuts`, `AtlasLauncher` all hardcoded. These should use `common.ui.*` keys.

### Issue 4: Duplicate translation patterns
Multiple components define the same hardcoded labels ("Charger plus", "Fermer", "Enregistrer", etc.) instead of using centralized `common.actions.*` keys.

### Issue 5: No locale detection on landing pages
Marketing pages don't use `useLocale()` hook. They have no mechanism to switch languages even if translations existed.

---

## 7. Priority Action Plan

### P0 — Blocking (0% i18n on public-facing pages)
1. Create `landing` namespace — all home page sections, all marketing pages
2. Translate home page (Hero, WhyUs, Features, Pricing, Testimonials, FAQ, CTA)
3. Translate `/atlas` landing and `/atlas/fonctionnalites`
4. Translate `/conformite`, `/a-propos`, `/contact`
5. Add `useLocale()` to all marketing pages

### P1 — High (visible to users)
1. Create `atlas` namespace — Atlas dashboard
2. Create `studio` namespace — Studio dashboard
3. Internationalize UI primitives (EmptyState, ErrorState, etc.)
4. Internationalize dashboard chrome (CommandPalette, KeyboardShortcuts, AtlasLauncher)

### P2 — Future features
1. Create `lex` namespace — when Lex page is built
2. Create `trends` namespace — when Trends is built
3. Create `sovereign-chat` namespace — Phase 2C

### Complete
1. `chat-ai` namespace — 149 keys, 6 languages, 100% coverage
2. `common` namespace — 439 keys, 6 languages, 100% coverage
