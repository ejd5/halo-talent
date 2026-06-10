# Problème / Solution Section — Implementation Plan

## Context

Add two new sections to the landing page between the Hero and the StatsBar:
1. **ProblemSection** — "Le quotidien d'un créateur en 2026" (3-column pain points)
2. **SolutionSection** — "Halo remplace tout" (before/after convergence diagram)

The existing `PainPointsSection.tsx` has different content and is NOT imported in `page.tsx`. No conflict with existing components. The existing `home.pain.*` i18n keys are also unused — I'll add fresh keys.

## Files to create

| File | Content |
|------|---------|
| `components/home/ProblemSection.tsx` | 3-column pain point layout with scroll animation |
| `components/home/SolutionSection.tsx` | Before/after convergence diagram with 7→1 visual |

## Files to modify

| File | Change |
|------|--------|
| `lib/i18n/common.ts` | Add `home.problem.*` and `home.solution.*` i18n keys |
| `app/(marketing)/page.tsx` | Import and render ProblemSection + SolutionSection after Hero |

## Component designs

### ProblemSection
- **Section title**: "Le quotidien d'un créateur en 2026" (centered, h2, font-display)
- **3 columns** in `grid-cols-1 md:grid-cols-3` layout
- **Column 1**: Puzzle icon + "7 outils différents" + descriptive text listing tools + cost stat "800€+/mois" in accent color
- **Column 2**: Percent icon + "50% de commission" + text about agency commissions + market stat "40-50%" in accent
- **Column 3**: Shield-off icon + "Zéro protection" + text about unfair contracts + stat "73% des créateurs..." in accent
- **Transition phrase**: centered below columns, lighter weight, italic or serif
- **Animations**: IntersectionObserver → fade-in + slide-up staggered per column
- **Style**: Light/neutral background (`var(--bg-surface)`), cards with border + subtle shadow

### SolutionSection
- **Section title**: "Halo remplace tout"
- **Before/After layout**: 2-column grid
- **Left (Before)**: Floating tool icons (Puzzle, Camera, MessageCircle, BarChart3, Shield, CreditCard, FileText) with labels, connected by messy dashed lines, label "7 abonnements · 7 logins · 0 vue d'ensemble"
- **Center**: Animated arrow (→) between the two sides
- **Right (After)**: Central Halo logo/icon with 7 feature pills orbiting: Création IA, CRM Fans, Analytics, Chatting, Juridique, Publication, Management
- **Label**: "1 plateforme · 1 login · Vue complète" in accent/green color
- **Animations**: Scroll-triggered, tools float in from left, Halo features fade-in from right

## i18n keys

```
home.problem.title — "Le quotidien d'un créateur en 2026"
home.problem.col1_title — "7 outils différents"
home.problem.col1_desc — "Canva pour les visuels. CapCut pour la vidéo..."
home.problem.col1_stat — "800€+/mois en outils"
home.problem.col2_title — "50% de commission"
home.problem.col2_desc — "Les agences traditionnelles prennent entre 30% et 70%..."
home.problem.col2_stat — "La moyenne du marché : 40-50%"
home.problem.col3_title — "Zéro protection"
home.problem.col3_desc — "Contrats léonins, clauses de non-concurrence abusives..."
home.problem.col3_stat — "73% des créateurs ne lisent pas leurs contrats"
home.problem.transition — "Et si un seul outil faisait tout ça..."
home.solution.title — "Halo remplace tout"
home.solution.before_label — "7 abonnements · 7 logins · 0 vue d'ensemble"
home.solution.after_label — "1 plateforme · 1 login · Vue complète"
# feature pills (hardcoded in component, no i18n needed for this visual):
# Création IA, CRM Fans, Analytics, Chatting, Juridique, Publication, Management
```

## Verification

1. `npx tsc --noEmit` → 0 errors
2. `npx next build` → clean build, landing page loads both new sections
3. Scroll-triggered animations work (IntersectionObserver)
4. Responsive: 3 columns stack on mobile, before/after stacks vertically
5. Numbers and stats stand out visually in accent color
