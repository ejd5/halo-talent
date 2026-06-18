# Screenshots Index — Halo Talent

**Date**: 2026-06-11
**Status**: Manual screenshots required — Playwright not installed.

**Instructions**: Take screenshots using the browser at `http://localhost:3001` (the project runs on port 3001). For each page, capture desktop (1440px) and mobile (375px) views.

---

## 1. Priority Screenshots (P0 Pages)

### 1.1 Home Page — `/`

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `home-desktop-hero.png` | 1440×900 | Full hero section with headline, CTA buttons |
| `home-desktop-whyus.png` | 1440×900 | WhyUsSection (contains "Zero ban guarantee") |
| `home-desktop-pricing.png` | 1440×900 | PricingSection with all 3 tiers (contains "Zero ban garanti" ×3) |
| `home-desktop-testimonials.png` | 1440×900 | Testimonials section (all fake) |
| `home-desktop-faq.png` | 1440×900 | FAQ section |
| `home-mobile-full.png` | 375×812 | Full mobile scroll showing responsive behavior |

### 1.2 Atlas Landing — `/atlas`

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `atlas-desktop-hero.png` | 1440×900 | Hero with "100% Souveraineté garantie" |
| `atlas-desktop-claims.png` | 1440×900 | Section with "Protection juridique complète" |
| `atlas-mobile.png` | 375×812 | Mobile view |

### 1.3 Atlas Fonctionnalités — `/atlas/fonctionnalites`

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `atlas-features-desktop.png` | 1440×900 | Full page — contains 4 HIGH severity risky claims |
| `atlas-features-claims-closeup.png` | 1440×900 | Close-up: "100% conforme", "Conformité totale garantie", "Conformité multi-juridiction garantie", "Détecte 100% des risques" |

### 1.4 Conformité — `/conformite`

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `conformite-desktop.png` | 1440×900 | Full page — "Garanti sans risque" claim |
| `conformite-claim-closeup.png` | 1440×900 | Close-up on the risky claim area |

### 1.5 Broken Pages

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `lex-desktop.png` | 1440×900 | Full page — "Bientôt disponible" |
| `demo-desktop.png` | 1440×900 | Full page — "En construction" |
| `blog-desktop.png` | 1440×900 | Empty blog listing |
| `mobile-desktop.png` | 1440×900 | Mobile app teasing page |

---

## 2. Dashboard Screenshots (P1)

### 2.1 CHATEENG — Gold Standard (Phase 2A)

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `chat-ai-overview-desktop.png` | 1440×900 | `/dashboard/chat-ai` — full overview with metrics, inbox, audit sidebar |
| `chat-ai-inbox-desktop.png` | 1440×900 | `/dashboard/chat-ai/inbox/[id]` — thread, composer, fan brain sidebar |
| `chat-ai-fans-desktop.png` | 1440×900 | `/dashboard/chat-ai/fans` — fan table with filters |
| `chat-ai-fans-drawer.png` | 1440×900 | FanBrainDrawer open |
| `chat-ai-compliance-block.png` | 1440×900 | Compliance block state (do_not_contact or vulnerable_fan) |
| `chat-ai-draft-generated.png` | 1440×900 | Draft preview after generation |
| `chat-ai-mobile.png` | 375×812 | Any CHATEENG Page on mobile |

### 2.2 Atlas Dashboard — Mock Data Problem

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `atlas-dashboard-desktop.png` | 1440×900 | `/dashboard/atlas` — fake KPIs, mock inbox, mock calendar |
| `atlas-dashboard-kpi-closeup.png` | 1440×900 | Close-up on fake revenue numbers |
| `atlas-inbox-desktop.png` | 1440×900 | `/dashboard/atlas/inbox` — mock messages |
| `atlas-calendar-desktop.png` | 1440×900 | `/dashboard/atlas/calendar` — "Bientôt disponible" |
| `atlas-tasks-desktop.png` | 1440×900 | `/dashboard/atlas/tasks` — "Bientôt disponible" |

### 2.3 Studio Dashboard — Mock Data Problem

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `studio-dashboard-desktop.png` | 1440×900 | `/dashboard/studio` — fake analytics, mock charts |
| `studio-vault-desktop.png` | 1440×900 | `/dashboard/studio/vault` — "Bientôt disponible" |
| `studio-analytics-desktop.png` | 1440×900 | `/dashboard/studio/analytics` — "Bientôt disponible" |

### 2.4 Other Dashboard Placeholders

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `trends-desktop.png` | 1440×900 | `/dashboard/trends` — "Bientôt disponible" |
| `sovereign-chat-desktop.png` | 1440×900 | `/dashboard/sovereign-chat` — "Bientôt disponible" |
| `dashboard-welcome-desktop.png` | 1440×900 | `/dashboard` — welcome card, hardcoded |

---

## 3. Secondary Pages (P2)

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `a-propos-desktop.png` | 1440×900 | About page — fake team |
| `contact-desktop.png` | 1440×900 | Contact form — no backend |
| `tarifs-desktop.png` | 1440×900 | Pricing page |
| `login-desktop.png` | 1440×900 | Login page |
| `register-desktop.png` | 1440×900 | Register page |

---

## 4. Evidence Shots — Navigation Issues

| Shot | Viewport | What to capture |
|------|----------|-----------------|
| `nav-sidebar-placeholders.png` | 1440×900 | Sidebar showing all nav items — highlight which lead to placeholders |
| `nav-footer-links.png` | 1440×900 | Footer with broken links (Blog, etc.) |

---

## 5. Naming Convention

```
{page-or-component}-{viewport}-{detail}.png

Examples:
- home-desktop-hero.png
- atlas-features-desktop.png
- chat-ai-overview-mobile.png
- atlas-dashboard-kpi-closeup.png
```

## 6. Total Screenshots Needed

| Priority | Count |
|----------|-------|
| P0 — Risky claims + broken pages | 14 |
| P1 — Dashboards (good + bad) | 16 |
| P2 — Secondary pages | 5 |
| Evidence — Navigation | 2 |
| **Total** | **37** |

---

## 7. Shot Checklist for Auditor

```
[ ] home-desktop-hero.png
[ ] home-desktop-whyus.png
[ ] home-desktop-pricing.png
[ ] home-desktop-testimonials.png
[ ] home-desktop-faq.png
[ ] home-mobile-full.png
[ ] atlas-desktop-hero.png
[ ] atlas-desktop-claims.png
[ ] atlas-mobile.png
[ ] atlas-features-desktop.png
[ ] atlas-features-claims-closeup.png
[ ] conformite-desktop.png
[ ] conformite-claim-closeup.png
[ ] lex-desktop.png
[ ] demo-desktop.png
[ ] blog-desktop.png
[ ] chat-ai-overview-desktop.png
[ ] chat-ai-inbox-desktop.png
[ ] chat-ai-fans-desktop.png
[ ] chat-ai-fans-drawer.png
[ ] chat-ai-compliance-block.png
[ ] chat-ai-draft-generated.png
[ ] chat-ai-mobile.png
[ ] atlas-dashboard-desktop.png
[ ] atlas-dashboard-kpi-closeup.png
[ ] atlas-inbox-desktop.png
[ ] atlas-calendar-desktop.png
[ ] atlas-tasks-desktop.png
[ ] studio-dashboard-desktop.png
[ ] studio-vault-desktop.png
[ ] studio-analytics-desktop.png
[ ] trends-desktop.png
[ ] sovereign-chat-desktop.png
[ ] dashboard-welcome-desktop.png
[ ] a-propos-desktop.png
[ ] contact-desktop.png
[ ] login-desktop.png
[ ] nav-sidebar-placeholders.png
[ ] nav-footer-links.png
```
