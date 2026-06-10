# Audit Technique Halo Talent — 10 Juin 2026

## Vue d'ensemble

| Domaine | Note estimée | Criticité moyenne |
|---|---|---|
| Performance | ~45/100 | Critique |
| Accessibilité | ~50/100 | Élevée |
| SEO | ~35/100 | Critique |
| Sécurité | ~30/100 | Critique |
| i18n | ~40/100 | Élevée |
| Monitoring | ~10/100 | Critique |

---

## 1. PERFORMANCE

### 1.1 Images — CRITIQUE

**Problème :** Zéro usage de `next/image`. 23 balises `<img>` natives dans le code source.

**Fichiers impactés :**
- `app/(private)/studio/composer/components/ContentTab.tsx:97`
- `app/(private)/studio/composer/components/PreviewPanel.tsx:125`
- `app/(private)/studio/edit/video/components/EditorTimeline.tsx:286`
- `app/(private)/studio/generate/image/page.tsx:78, 111`
- `app/(private)/studio/generate/video/page.tsx:396`
- `app/(private)/studio/history/page.tsx:85, 154`
- `app/(private)/studio/templates/page.tsx:207, 259`
- `app/(private)/studio/templates/market/page.tsx:130`
- `app/(private)/studio/templates/mine/page.tsx:109`
- `app/(private)/studio/manual-publish/[id]/page.tsx:177`
- `app/(private)/dashboard/library/components/UploadModal.tsx:199`
- `app/(private)/dashboard/library/components/MediaPreview.tsx:72`
- `app/(private)/dashboard/trends/youtube/page.tsx:385`
- `app/(private)/dashboard/trends/tiktok/components/SongCard.tsx:75`
- `app/(private)/dashboard/trends/tiktok/components/TopAdsTab.tsx:104`
- `app/(private)/dashboard/atlas/funnels/lead-capture/[id]/page.tsx:410, 517`
- `app/[slug]/page.tsx:80`
- `app/(admin)/admin/components/Topbar.tsx:177`

**Images héros non optimisées dans `public/images/` :**
- 7 fichiers PNG, 14 MB au total
- Aucun format WebP/AVIF
- Aucun srcset responsive
- Aucune référence dans le code — possiblement morts

**Recommandations :**
1. Migrer toutes les images vers `next/image`
2. Configurer `remotePatterns` dans `next.config.ts`
3. Convertir les héros en WebP (économie ~70%)
4. Ajouter `loading="lazy"` sur toutes les images below the fold (actuellement 3/23 seulement)

### 1.2 Dynamic Imports — CRITIQUE

**Problème :** Zéro usage de `next/dynamic` ou `React.lazy`. Tous les composants sont chargés eager.

**Candidats pour dynamic import :**
- `recharts` (8.5 MB) — tous les composants de graphiques
- `framer-motion` (5.6 MB) — animations
- `wavesurfer.js` (1.5 MB) — lecteur audio
- Tous les modaux (UploadModal, PermissionEditModal, etc.)

### 1.3 "use client" — ÉLEVÉ

**Problème :** 474 directives `"use client"`. ~79% des pages sont des Client Components.

**Impact :** Perte des bénéfices RSC, HTML payload plus lourd, plus de JS envoyé au navigateur.

**Recommandation :** Extraire les "client islands" des shells de page. Les pages qui ne font que du data fetching peuvent être des Server Components.

### 1.4 Data Fetching Client-Side — MOYEN

**Problème :** 17 patterns `useEffect` + fetch qui devraient être déplacés côté serveur.

**Exemples :**
- `studio/platforms/page.tsx:39` — `fetchConnections()`
- `dashboard/atlas/comments/page.tsx:47` — `fetchComments()`
- `admin/command-center/page.tsx:532` — `fetchData()`

### 1.5 Bundle et Config — MOYEN

- `next.config.ts` est vide — pas d'optimisation image, pas de `experimental.optimizePackageImports`
- `lucide-react` (39 MB disque) — vérifier le tree-shaking
- `twilio` (19 MB) et `@anthropic-ai/sdk` (8.9 MB) — s'assurer qu'ils ne sont jamais importés côté client
- Pas d'outil d'analyse de bundle (`@next/bundle-analyzer` manquant)

---

## 2. ACCESSIBILITÉ

### 2.1 Skip-to-Content — CRITIQUE

**Problème :** Aucun lien "Skip to content" n'existe sur aucune page (WCAG 2.4.1).

**Recommandation :** Ajouter un skip link comme premier élément focusable dans `app/layout.tsx`.

### 2.2 Focus Management — CRITIQUE

**Problème :** Aucun modal ne trappe le focus. 4 composants impactés :
- `components/ui/Modal.tsx` — pas de `role="dialog"`, pas de focus trap
- `components/ui/CommandPalette.tsx` — pas de `role="dialog"`, pas de focus trap
- `components/atlas/AtlasLauncher.tsx` — pas de `role="dialog"`, pas de focus trap
- `app/(admin)/admin/components/CommandPalette.tsx` — idem

**Aucun modal ne restaure le focus à la fermeture.**

### 2.3 `<div onClick>` sans support clavier — ÉLEVÉ

**25+ éléments `<div>`** avec `onClick` mais sans `role`, `tabIndex`, ou `onKeyDown` :

| Fichier | Ligne | Description |
|---|---|---|
| `components/dashboard/Sidebar.tsx` | 188-194 | Headers de section collapse |
| `components/shared/Navbar.tsx` | 133 | Backdrop du sélecteur de langue |
| `components/atlas/AtlasLauncher.tsx` | 100 | Backdrop modal |
| `components/atlas/FanProfileDrawer.tsx` | 48 | Backdrop drawer |
| `components/vault/ContentAssetDrawer.tsx` | 67 | Backdrop drawer |
| `studio/edit/video/components/EffectsPicker.tsx` | 34 | Backdrop modal |
| `studio/edit/video/page.tsx` | 523 | Backdrop export modal |
| `studio/templates/page.tsx` | 254 | Backdrop preview |
| `dashboard/sovereign-chat/vault/page.tsx` | 170 | Backdrop modal |
| `admin/command-center/page.tsx` | 113, 313 | Backdrops modaux |
| `admin/commissions/components/AdjustmentModal.tsx` | 55 | Backdrop |
| `admin/settings/team/components/PermissionEditModal.tsx` | 93 | Backdrop |
| `admin/creators/[id]/components/CreatorDetailPage.tsx` | 99 | Backdrop dropdown |
| Et ~12 autres fichiers |

### 2.4 Contraste Couleur — ÉLEVÉ

**Échecs WCAG AA identifiés :**

| Token | Valeur | Fond | Ratio | Statut |
|---|---|---|---|---|
| `--text-secondary` (light) | `#78716C` | `#FAFAF8` | ~4.3:1 | **FAIL** (normal text) |
| `--text-tertiary` (light) | `#A8A29E` | `#FAFAF8` | ~2.3:1 | **FAIL** |
| `--text-tertiary` (dark) | `#6E6A64` | `#111110` | ~3.7:1 | **FAIL** |
| `--accent` (light) | `#F97316` | `#FAFAF8` | ~2.7:1 | **FAIL** |
| `--accent-text` | `#FFFFFF` | `#F97316` | ~2.7:1 | **FAIL** (boutons) |

### 2.5 ARIA Manquants — MOYEN

- `aria-expanded` : zéro utilisation (navbar mobile, language switcher, ThemeToggle)
- `aria-current` : zéro (navigation links actifs)
- `aria-controls` : zéro
- `aria-selected` : zéro (tab navigation)
- `aria-live` : zéro (contenu dynamique non annoncé)
- `aria-describedby` : zéro
- `sr-only` / `.sr-only` : zéro

### 2.6 Labels de Formulaires — MOYEN

- Newsletter Footer (`components/shared/Footer.tsx:123-138`) : input email sans `<label>`
- Plusieurs `<label>` sans `htmlFor` (CaptionTab, ConfigTab, etc.)

---

## 3. SEO

### 3.1 Meta Tags par Page — CRITIQUE

**16+ pages marketing sans métadonnées uniques :**
- Accueil, Blog, Article, Pricing, Commissions, Contrat-type, Manifeste, Security, SaaS, Glossaire, Guides, Outils, Protection, Atlas, Départements, Talents, Demo

Toutes héritent du titre par défaut `"Halo Talent -- Maison de management créatif"` et de la même description.

### 3.2 Open Graph — CRITIQUE

- Pas d'image OG → pas de preview sur Facebook/LinkedIn/Discord
- Pas de `twitter:` card → pas de rich card sur Twitter/X
- Pas d'`opengraph-image.tsx` (convention Next.js)
- Pas de `metadataBase` défini

### 3.3 Schema.org / JSON-LD — CRITIQUE

**Zero** structured data sur l'ensemble du site :
- Pas d'`Organization`
- Pas de `WebSite`
- Pas de `BreadcrumbList`
- Pas d'`Article` / `BlogPosting` pour le blog
- Pas de `FAQPage` (même si la home a une section FAQ)
- Pas de `SoftwareApplication` (pourtant Halo est un SaaS)

### 3.4 Sitemap — ÉLEVÉ

Le sitemap (`app/sitemap.ts`) ne contient que **6 URLs** :
- `/`, `/login`, `/dashboard`, `/dashboard/library`, `/dashboard/community`, `/admin`

**Manquent :** les 16+ pages marketing, tous les articles de blog, toutes les sous-pages admin.

### 3.5 Canonical URLs — ÉLEVÉ

Aucune canonical URL n'est définie nulle part. Pas de `metadataBase` non plus.

### 3.6 Heading Hierarchy — MOYEN

4 pages ont des `<h1>` en double :
- `studio/generate/audio/page.tsx` : **4** `<h1>`
- `dashboard/notifications/page.tsx` : **2** `<h1>`
- `dashboard/agents/[agentName]/page.tsx` : **2** `<h1>`
- `dashboard/sovereign-chat/segments/new/page.tsx` : **2** `<h1>`

### 3.7 PWA — MOYEN

- Pas de `manifest.json`
- Pas d'`apple-touch-icon.png`
- Pas de `theme-color` dans viewport metadata

---

## 4. SÉCURITÉ

### 4.1 Content Security Policy — CRITIQUE

**Aucun en-tête de sécurité :**
- Pas de CSP
- Pas de HSTS
- Pas de X-Frame-Options
- Pas de X-Content-Type-Options
- Pas de Referrer-Policy
- `next.config.ts` vide — pas de fonction `headers()`

### 4.2 Validation des Entrées API — CRITIQUE

**Sur 181 routes API, une seule utilise Zod pour la validation :**
- `app/api/apply/route.ts` — utilise `applySchema.safeParse()`

Les 180 autres routes lisent `request.json()` sans validation de schéma, sans sanitization, sans filtrage XSS.

### 4.3 Rate Limiting — CRITIQUE

**Absent sur toutes les routes.** Aucune protection contre :
- Brute force sur les endpoints d'auth
- Abuse des endpoints de génération AI (coûteux)
- Spam via lead-capture et webhooks

### 4.4 Vérification Webhooks — ÉLEVÉ

- **Stripe** (`app/api/studio/credits/webhook/route.ts`) : lit l'en-tête `stripe-signature` mais **ne vérifie pas** la signature → un attaquant peut forger des événements pour créditer gratuitement
- **Twilio** (`app/api/atlas/sms/webhook/route.ts`) : accepte des données sans vérification de signature Twilio

### 4.5 RGPD / Cookie Consent — ÉLEVÉ

**Absent.** Pas de bannière de consentement cookies, pas de politique de confidentialité, pas de mécanisme de droit à l'oubli. Pourtant l'application :
- Cible les créateurs français
- Collecte des emails via lead-capture
- Stocke les adresses IP
- Utilise Supabase Auth (cookies de session)

### 4.6 Endpoints Dev — MOYEN

5 routes `/api/dev/*` exposées : `diag`, `fix-profile`, `seed`, `setup-storage`, `test-credits`

### 4.7 Points Positifs

- AES-256-GCM pour le chiffrement des tokens OAuth (`lib/crypto.ts`)
- Pas de `dangerouslySetInnerHTML`
- Pas de `eval()` / `new Function()`
- `strict: true` dans tsconfig.json

---

## 5. INTERNATIONALISATION

### 5.1 Architecture i18n — ÉLEVÉ

**Problème :** `next-intl` (^4.13.0) est installé dans package.json mais **totalement inutilisé**. L'application utilise un système custom :
- `lib/i18n/common.ts` (270 KB) — translations monolithiques
- `lib/i18n/legal.ts` — translations Bouclier Légal
- `lib/i18n/use-locale.ts` — hook client-side basé sur le pathname

**Limitations du système custom :**
- Aucun support de namespace (flat, va croître sans limite)
- Pas d'interpolation type-safe
- Pas de format ICU (pluriels, sélecteurs)
- État mutable module-scoped (`currentLocale`) — dangereux en Server Components
- 270 KB+ dans un seul fichier

### 5.2 Lang Attribute — MOYEN

`<html lang="fr">` est **hardcodé** — ne change pas selon la langue affichée. L'OpenGraph locale est aussi hardcodée à `fr_FR`.

### 5.3 Incohérence des Locales — BAS

- `common.ts` : utilise `"pt-BR"`
- `legal.ts` : utilise `"pt"`
- Navbar a un `norm()` qui map `"pt" → "pt-BR"` — signe d'un patch ad-hoc

### 5.4 Détection de Langue — BAS

- Pas de détection `navigator.language`
- Pas d'en-tête `Accept-Language`
- Pas de cookie de préférence de langue
- Le switch de langue dans la Navbar provoque un `window.location.href` (reload complet)

### 5.5 RTL — NON (acceptable)

Pas de support RTL actuellement. Les langues supportées sont toutes LTR. À prévoir si expansion vers l'arabe.

### 5.6 Hreflang — BAS

Absent du sitemap et des layouts. Les moteurs ne découvrent pas les versions localisées.

---

## 6. MONITORING

### 6.1 Error Tracking — CRITIQUE

**Absent.** Aucune configuration Sentry :
- Pas de `@sentry/nextjs` dans package.json
- Pas de `sentry.client.config.ts`
- Pas de `sentry.server.config.ts`
- Pas de `sentry.edge.config.ts`

### 6.2 Analytics — MOYEN

**Absent.** Aucune solution d'analytics identifiée dans le code :
- Pas de Plausible, Umami, Fathom, ou Google Analytics
- Aucun script d'analytics dans `app/layout.tsx`
- Aucun événement personnalisé

### 6.3 Uptime Monitoring — MOYEN

**Absent.** Aucune configuration d'uptime monitoring dans le code.

### 6.4 Alerting — MOYEN

**Absent du code.** Aucune alerte automatique configurée.

### 6.5 Santé Applicative — BAS

Un endpoint `GET /api/health` existe mais son implementation n'a pas été audité.

---

## Plan d'Action Priorisé

### P0 — Immédiat (sécurité + SEO critique)

| # | Action | Effort | Impact |
|---|---|---|---|
| 1 | Ajouter CSP + en-têtes sécurité dans `next.config.ts` | 1 jour | Sécurité XSS/clickjacking |
| 2 | Valider entrées API avec Zod sur routes critiques (auth, webhooks, lead-capture) | 3 jours | Prévention injections |
| 3 | Vérifier signatures Stripe + Twilio webhooks | 0.5 jour | Prévention fraude |
| 4 | Ajouter rate limiting sur routes API exposées | 1 jour | Anti brute-force/abuse |
| 5 | Ajouter meta tags uniques sur 16+ pages marketing | 1 jour | SEO fondamental |
| 6 | Ajouter image OG + Twitter cards dans le layout racine | 0.5 jour | Social preview |
| 7 | Ajouter JSON-LD (Organization, WebSite, SoftwareApplication) | 0.5 jour | Rich results |
| 8 | Compléter le sitemap avec toutes les pages marketing et blog | 0.5 jour | Découverte moteur |
| 9 | Ajouter canonical URLs + metadataBase | 0.5 jour | SEO dupl. content |
| 10 | Ajouter Sentry pour l'error tracking | 1 jour | Monitoring crashes |

### P1 — Court terme (accessibilité + performance)

| # | Action | Effort | Impact |
|---|---|---|---|
| 11 | Ajouter skip-to-content link dans root layout | 0.5 jour | Accessibilité clavier |
| 12 | Ajouter focus trapping dans tous les modaux | 1 jour | Accessibilité clavier |
| 13 | Ajouter `role`, `tabIndex`, `onKeyDown` aux 25+ `<div onClick>` | 1 jour | Accessibilité clavier |
| 14 | Ajouter classe `.sr-only` dans globals.css | 0.5 jour | Support lecteurs écran |
| 15 | Ajouter `aria-expanded`, `aria-current`, `aria-live` | 1 jour | ARIA |
| 16 | Corriger contrastes couleurs (text-tertiary, accent light mode) | 1 jour | WCAG AA |
| 17 | Migrer 23 `<img>` vers `next/image` | 2 jours | Performance images |
| 18 | Ajouter `next/dynamic` pour recharts, modaux, audio player | 1 jour | Bundle size |
| 19 | Remplacer hero PNG par WebP + srcset | 0.5 jour | LCP, bande passante |
| 20 | Ajouter bannière consentement cookies RGPD | 1 jour | Conformité légale |

### P2 — Moyen terme

| # | Action | Effort | Impact |
|---|---|---|---|
| 21 | Extraire "client islands" des pages Server Components | 3 jours | Performance RSC |
| 22 | Déplacer 17 data fetching `useEffect` côté serveur | 2 jours | Perf, UX |
| 23 | Ajouter `loading="lazy"` sur les 20 images restantes | 0.5 jour | Perf |
| 24 | Corriger 4 pages avec `<h1>` en double | 0.5 jour | SEO |
| 25 | Remplacer `lang="fr"` hardcodé par la langue active | 0.5 jour | SEO i18n |
| 26 | Ajouter hreflang dans le layout et le sitemap | 0.5 jour | SEO i18n |
| 27 | Normaliser pt-BR vs pt dans les fichiers i18n | 0.5 jour | i18n |
| 28 | Ajouter PWA manifest + apple-touch-icon | 0.5 jour | Mobile |
| 29 | Ajouter Plausible/Umami analytics | 0.5 jour | Analytics |
| 30 | Ajouter `@next/bundle-analyzer` + script analyze | 0.5 jour | Tooling |

### P3 — Long terme

| # | Action | Effort | Impact |
|---|---|---|---|
| 31 | Refactor i18n custom → next-intl routing | 3 jours | Scalabilité i18n |
| 32 | Ajouter détection `navigator.language` + cookie de préférence | 1 jour | UX i18n |
| 33 | Protéger endpoints `/api/dev/*` en production | 0.5 jour | Sécurité |
| 34 | Configurer uptime monitoring (Better Uptime, Pingdom) | 0.5 jour | Monitoring |
| 35 | Ajouter 404/500 custom pages si pas déjà fait | 0.5 jour | UX |
| 36 | Auditer dépendances lourdes pour tree-shaking | 1 jour | Bundle |

---

## Fichiers Clés à Modifier

```
next.config.ts                    — CSP, headers, images, optimizePackageImports
app/layout.tsx                    — skip link, OG image, metadataBase, canonical, viewport
app/globals.css                   — sr-only, contrast fixes
app/sitemap.ts                    — all marketing pages + hreflang
app/(marketing)/*/page.tsx        — 16+ pages metadata
app/api/*/route.ts                — input validation (180 routes)
app/api/studio/credits/webhook/route.ts — Stripe signature verification
components/ui/Modal.tsx           — focus trap, ARIA roles
components/ui/CommandPalette.tsx  — focus trap, ARIA
components/ui/Input.tsx           — existing good pattern to replicate
components/shared/Footer.tsx      — newsletter label
components/shared/Navbar.tsx      — aria-expanded, aria-current
components/theme/ThemeToggle.tsx  — aria-expanded
```
