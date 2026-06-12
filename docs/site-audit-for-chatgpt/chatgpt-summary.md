# ChatGPT Summary — Halo Talent Site Audit

**Date**: 2026-06-11
**For**: ChatGPT — Use this summary to generate correction prompts for Halo Talent.

---

## Quick Facts

- **Total routes**: ~193 pages + ~200 API routes
- **Completely empty pages**: 21 ("Bientôt disponible" / "En construction")
- **Pages with placeholder sections**: 12
- **Mock-data-dependent pages**: ~10 (Atlas and Studio dashboards)
- **Risky legal claims**: 14 (3 CRITICAL, 4 HIGH)
- **i18n coverage**: 45% overall (588 translation keys, ~445 hardcoded strings)
- **Broken conversion paths**: 3/7 CTAs dead
- **Content quality**: Marketing avg 2.16/5, Dashboard avg 2.87/5
- **Chat AI Phase 2A**: Only fully complete feature — 5.0/5.0 gold standard

---

## What Needs Correction (by Category)

### 1. Remove These Risky Claims Immediately (P0)

The following claims create legal liability. Replace them.

| Find in file | Current text | Replace with |
|-------------|-------------|--------------|
| `PricingSection.tsx` | "Zero ban garanti" (×3) | "Protection anti-ban proactive" |
| `WhyUsSection.tsx` | "Zero ban guarantee" | "Proactive ban protection" |
| `conformite/page.tsx` | "Garanti sans risque" | "Risque minimisé" |
| `atlas/fonctionnalites/page.tsx` | "100% conforme aux règles 2026" | "Conçu pour respecter les règles actuelles" |
| `atlas/fonctionnalites/page.tsx` | "Conformité totale ... garantie" | "Surveillance continue de la conformité" |
| `atlas/fonctionnalites/page.tsx` | "Conformité multi-juridiction garantie" | "Outils de conformité multi-juridiction" |
| `atlas/fonctionnalites/page.tsx` | "Détecte 100% des risques" | "Détection proactive des risques majeurs" |
| `atlas/page.tsx` | "100% Souveraineté garantie" | "Souveraineté numérique avancée" |
| `PricingSection.tsx` | "Crédits illimités" | "Crédits généreux" + fair use |
| `HeroSection.tsx` | "IA la plus avancée du marché" | "Propulsé par DeepSeek V4" |

### 2. Build These Broken Pages (P0-P1)

| Page | Current state | Priority |
|------|-------------|----------|
| `/demo` | "En construction" — primary CTA target from home | P0 |
| `/lex` | "Bientôt disponible" — premium product has no page | P0 |
| `/dashboard/atlas` | Shows fake KPIs, mock messages, mock calendar | P0 |
| `/dashboard/studio` | Shows fake analytics, mock charts | P0 |
| `/dashboard/trends` | "Bientôt disponible" — main nav item | P1 |
| `/dashboard/atlas/calendar` | "Bientôt disponible" — main nav item | P1 |
| `/dashboard/studio/vault` | "Bientôt disponible" — core feature | P1 |
| `/dashboard/studio/analytics` | "Bientôt disponible" — key selling point | P1 |
| `/dashboard/sovereign-chat` | "Bientôt disponible" — planned Phase 2C | P1 |
| `/contact` | Form exists but submission goes nowhere | P1 |

### 3. Fix Home Page Content (P1)

- **Testimonials**: All 6 are fake (invented names, invented quotes). Replace with real ones.
- **Pricing**: "Bientôt disponible" on Elite tier. Complete the table.
- **FAQ**: Generic placeholder questions. Use real user inquiries.
- **i18n**: Only 28% of home components use i18n. The rest are hardcoded French.

### 4. Internationalize Everything (P1-P2)

Currently only Chat AI (149 keys, 6 languages) and auth/common (439 keys) are internationalized.

Zero i18n coverage on:
- All marketing pages (home, atlas, conformité, à propos, contact)
- Atlas dashboard
- Studio dashboard
- UI primitives (EmptyState, ErrorState, CommandPalette, KeyboardShortcuts)

### 5. Total Placeholder Count

19 pages say "Bientôt disponible", 1 says "En construction", 1 is empty (blog). These are distributed as:
- 7 marketing pages
- 6 Atlas subpages  
- 7 Studio subpages
- 1 welcome dashboard

---

## What's Already Good (Gold Standard)

The Chat AI Phase 2A implementation (`/dashboard/chat-ai/*`) is the quality benchmark:

- 100% real Supabase data (no mocks)
- 100% i18n coverage (149 keys, 6 languages)
- Full state coverage: loading (skeletons), empty (EmptyState + seed action), error (red banners), success
- Compliance gate with clear blocking reasons and alternatives
- Mobile responsive (flexbox wrap)
- 0 TypeScript errors, 0 ESLint warnings
- "npm run build" passes cleanly

**Use Chat AI pages as the template for all corrections.**

---

## Implementation Effort Estimate

| Priority | Hours | Days |
|----------|-------|------|
| P0 — Safety + Broken Paths | 156 | 19.5 |
| P1 — Content + Quality | 200 | 25 |
| P2 — Polish | 93 | 11.6 |
| **Total** | **449** | **~56** |

Estimates assume 1 developer. Can be reduced ~40% with 2 developers working in parallel.

---

## Key Files to Target

### Highest-impact corrections (start here):

```
components/landing/PricingSection.tsx       — 3 risky claims + incomplete pricing
components/landing/WhyUsSection.tsx         — 1 risky claim
components/landing/TestimonialsSection.tsx  — all fake content
components/landing/HeroSection.tsx          — 1 risky claim
components/landing/FAQSection.tsx           — generic content
app/(marketing)/atlas/fonctionnalites/page.tsx  — 4 risky claims
app/(marketing)/atlas/page.tsx              — 2 risky claims
app/(marketing)/conformite/page.tsx         — 1 risky claim
app/(marketing)/demo/page.tsx               — empty "En construction"
app/(marketing)/lex/page.tsx                — empty "Bientôt disponible"
app/(private)/dashboard/atlas/page.tsx      — 100% mock data
app/(private)/dashboard/studio/page.tsx     — 100% mock data
```

---

## How to Generate Correction Prompts for ChatGPT

When asking ChatGPT to generate correction prompts, specify:

1. **Which file** to modify (exact path)
2. **What to change** (specific text, component, data source)
3. **What to replace it with** (exact new text or approach)
4. **Constraints** (no redesign, no touching Admin/Studio/Atlas dashboards redesign, Chat AI is gold standard)
5. **Tech stack**: Next.js 16 App Router, TypeScript, Supabase, React 18, CSS-in-JS (inline styles), lucide-react icons, i18n with `t()` function

### Example prompt for ChatGPT:

```
Fix the risky claims in components/landing/PricingSection.tsx. 
Replace all 3 occurrences of "Zero ban garanti" with "Protection anti-ban proactive".
Replace "Crédits illimités" with "Crédits généreux" and add a small "(fair use policy applies)" note.
Do not change layout, styling, or any other text.
Use the Chat AI pages as the quality standard for i18n patterns.
```

---

## Files in This Audit Pack

| File | Content |
|------|---------|
| `route-inventory.md` | Complete route inventory (~193 pages + ~200 API routes) |
| `empty-pages-audit.md` | All empty/placeholder pages with severity |
| `placeholder-content-audit.md` | Detailed placeholder analysis per file |
| `dashboard-tools-audit.md` | Dashboard route analysis with priority matrix |
| `landing-pages-audit.md` | Marketing page analysis with conversion paths |
| `i18n-audit.md` | Translation coverage and hardcoded text audit |
| `risky-claims-audit.md` | 14 risky formulations with reformulation proposals |
| `content-quality-audit.md` | Quality scores and credibility analysis |
| `implementation-map.md` | Actionable correction map with complexity estimates |
| `screenshots-index.md` | Screenshot instructions and checklist (37 shots) |
| `chatgpt-summary.md` | This file — compact summary for ChatGPT use |
