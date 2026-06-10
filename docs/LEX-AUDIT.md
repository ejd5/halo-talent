# LEX Audit — Cartographie complète

> Date : 2026-06-11
> Objet : Audit du module juridique Halo Talent (Bouclier Légal / LEX)
> Périmètre : architecture, UI, API, base de connaissances, migrations, crons

---

## 1. Charte graphique (BRAND.md + brand.json)

### Palette

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-base` | `#F5F0EB` | Fond principal crème chaud |
| `--color-base-alt` | `#FFFFFF` | Blanc pour contrastes |
| `--color-surface` | `#EDE8E1` | Crème foncé pour cards |
| `--color-ink` | `#1A1614` | Texte principal quasi-noir |
| `--color-ink-muted` | `#7A736B` | Texte secondaire |
| `--color-accent` | `#C75B39` | Terracotta — accent unique |
| `--color-accent-hover` | `#A84A2D` | Hover terracotta |
| `--color-accent-soft` | `#F0DDD4` | Fond accent pâle |
| `--color-dark` | `#1A1614` | Fond sections sombres |
| `--color-dark-text` | `#F5F0EB` | Texte sur fond sombre |
| `--color-dark-muted` | `#9A9590` | Texte secondaire sombre |
| `--color-success` | `#7A9A65` | Vert pour états OK |
| `--color-alert` | `#C44536` | Rouge pour alertes |

### Typographie

| Usage | Police | Poids |
|-------|--------|-------|
| Display (H1, H2) | Syne | 700–800 |
| Body / UI | Plus Jakarta Sans | 400–600 |
| Accent (citations) | Instrument Serif | 400 italic |
| Mono (code) | JetBrains Mono | — |

### Interdits
- Pas de doré (#D4AF37, etc.)
- Pas de gradient violet/bleu/turquoise
- Pas de noir pur (#000000) comme fond principal
- Pas de border-radius arrondi (angles droits = éditorial)
- Pas de shadow — lignes fines uniquement

### Écart critique — LEX utilise du vert émeraude (#10B981)
Le wizard Bouclier Légal (`components/bouclier-legal/*`) utilise **#10B981** (emerald) comme couleur d'accent, ce qui **viole** la charte BRAND.md :
- `page.tsx` protection : `--bl-accent: #10B981` et `--bl-accent-soft: rgba(16,185,129,0.12)` en dur
- Tous les composants (StepAccueil, StepPlateformes, StepClauses, StepResultat) utilisent `var(--success)` au lieu de `var(--accent)`
- `StepResultat.tsx` utilise un gradient `rgba(16,185,129,0.1)` → `rgba(16,185,129,0.03)`

**Le dashboard Atlas Legal** (`dashboard/atlas/legal/page.tsx`) utilise correctement `var(--accent)` (terracotta #C75B39) — incohérence entre les deux faces.

---

## 2. Contenu réel du module LEX

### 2.1 `components/bouclier-legal/` — Wizard public (5 composants)

| Fichier | Rôle | Lignes |
|---------|------|--------|
| `StepAccueil.tsx` | Page d'accueil du wizard (CTA, disclaimer, stat "73%") | ~77 |
| `StepPlateformes.tsx` | Sélection des plateformes (OF, Fansly, MYM, IG, YT, Other) | ~109 |
| `StepClauses.tsx` | Checklist des clauses abusives (6 catégories, 25 clauses) | ~263 |
| `StepResultat.tsx` | Résultat : jauge SVG, diagnostic, clauses, lettres, download | ~444 |
| `RiskGauge.tsx` | Composant SVG circulaire (score de risque) | ~95 |

**Moteur en `lib/bouclier-legal/` :**

| Fichier | Rôle |
|---------|------|
| `types.ts` | Types : ClauseDef, ClauseGroup, RiskLevel, AnalysisReport, WizardStep, PLATFORMS |
| `clauses-data.ts` | 25 clauses abusives dans 6 catégories, avec arguments juridiques et reformulations |
| `scoring.ts` | Moteur de scoring : `calculateRisk()` → score %, niveau, diagnostic |

**Fonctionnement :** 100% client-side. Pas d'appel API pour l'analyse des clauses. Le scoring additionne les sévérités des clauses cochées, normalise sur 30, et retourne un niveau (low/moderate/high/critical). Les lettres sont générées côté client par template string.

### 2.2 `app/api/legal/` — API routes (7 endpoints)

| Endpoint | Méthode | Auth | Rôle |
|----------|---------|------|------|
| `/api/legal/analyze` | POST | — | Analyse des clauses via Anthropic (Claude), enregistre dans `contract_analyses` |
| `/api/legal/analyses` | GET | Utilisateur | Liste les analyses du user connecté (avec détails clauses + lettres) |
| `/api/legal/clauses` | GET | — | Liste toutes les clauses abusives actives, groupées par catégorie |
| `/api/legal/knowledge` | GET | — | Base de connaissances juridiques (filtres : platform, jurisdiction, category, search) |
| `/api/legal/generate-letter` | POST | Utilisateur | Génère lettre via Claude, sauvegarde dans `generated_letters` |
| `/api/legal/stats` | GET | — | Statistiques globales (total analyses, avg score, top clauses, platform breakdown) |
| `/api/legal/updates` | GET/POST | GET: none / POST: user | Journal des mises à jour + suggestion de clause |

### 2.3 `knowledge/` — Base de connaissances fichiers (~28 fichiers)

```
knowledge/
├── README.md                    ← Index du knowledge graph
├── contracts/
│   ├── clauses-abusives-catalogue.md
│   ├── comparaison-contrats-agences.md
│   └── contrat-type-halo-talent.md
├── industry/
│   ├── agency-practices-report.md
│   ├── creator-rights-guide.md
│   └── commission-rates-benchmark.md
├── jurisprudence/
│   ├── class-action-onlyfans-2024.md
│   ├── chatters-lawsuits-2026.md
│   └── unruly-agency-buzzfeed-2021.md
├── laws/
│   ├── eu/digital-services-act.md
│   ├── eu/rgpd-extraits.md
│   ├── france/code-civil-contrats.md
│   ├── france/code-consommation.md
│   ├── france/code-propriete-intellectuelle.md
│   ├── uk/online-safety-bill.md
│   └── us/take-it-down-act-2026.md
└── platforms/
    ├── fansly/terms-of-service.md
    ├── instagram/terms-of-service.md
    ├── mym/terms-of-service.md
    └── onlyfans/
        ├── acceptable-use-policy.md
        ├── ai-content-policy-2026.md
        ├── creator-guidelines.md
        └── terms-of-service-2026.md
```

### 2.4 Pages frontend

| Page | Route | Rôle |
|------|-------|------|
| Protection publique | `/(marketing)/protection/page.tsx` | Wizard Bouclier Légal complet (~173 lignes) |
| Dashboard LEX | `/(private)/dashboard/atlas/legal/page.tsx` | 3 tabs : Mon contrat, Base juridique, Alertes (~776 lignes) |
| Protection sub-pages | `/protection/guide/`, `/protection/onlyfans/`, `/protection/fansly/` | **Dossiers vides** (à implémenter) |

### 2.5 `supabase/migrations/` — 33 migrations

La migration clé : **`030_legal_shield.sql`** qui crée 5 tables :

| Table | Rôle |
|-------|------|
| `legal_knowledge` | Base de connaissances (catégorie, plateforme, juridiction, contenu, tags, auto_generated) |
| `abusive_clauses` | Catalogue clauses abusives (label, catégorie, argumentaire juridique, CGU refs, sévérité) |
| `contract_analyses` | Analyses effectuées (user, plateforme, clauses cochées, score, diagnostic IA) |
| `generated_letters` | Lettres générées (type, contenu, langue, envoyé) |
| `legal_updates_log` | Journal d'activité (action, source, détails, reviewed_by_admin) |

RLS : lecture publique sur `legal_knowledge` et `abusive_clauses`, utilisateur sur ses propres analyses/lettres, admin sur tout.

Seed data : 13 clauses abusives + 6 entrées knowledge (CGU OnlyFans + lois françaises).

### 2.6 `vercel.json`

```json
{
  "crons": [
    { "path": "/api/cron/legal-scan", "schedule": "0 6 * * *" }
  ]
}
```

Un seul cron : scan juridique quotidien à 6h00. Le handler (`app/api/cron/legal-scan/route.ts`, ~410 lignes) exécute 2 tâches :
1. **Pattern detection** : analyse les clauses "autres" signalées par les utilisateurs, détecte les patterns fréquents (>3 occurrences/7 jours)
2. **CGU scan** : scrappe OnlyFans et Fansly, compare avec IA (Claude), met à jour `legal_knowledge`

---

## 3. Stack technique

### UI Library
- **Pas de shadcn/ui** — composants 100% Tailwind custom
- **Lucide React** pour les icônes
- **Tailwind CSS** via PostCSS
- **CSS Variables** pour le theming (pas de Tailwind `theme.extend`)
- **Framer Motion** non utilisé sur les pages LEX (animations CSS natives)

### Supabase
- Pattern `@supabase/ssr` :
  - `lib/supabase/client.ts` — `createBrowserClient()` pour le navigateur
  - `lib/supabase/server.ts` — `createServerClient()` avec cookies + `createAdminClient()` avec service_role
- Toutes les routes API LEX utilisent `createClient()` (sauf cron qui utilise `createAdminClient()` + CRON_SECRET)

### Pattern API
- Next.js App Router — `route.ts` dans `app/api/`
- `export const dynamic = "force-dynamic"` sur chaque route
- Retour `NextResponse.json()` avec try/catch
- Pas de middleware de rate limiting
- Pas de validation de schéma (Zod, etc.)

### i18n
- `lib/i18n/legal.ts` — traductions LEX pour 6 langues (fr, en, es, pt, de, it)
- `lib/i18n/common.ts` — ~2016 lignes, traductions partagées
- `lib/i18n/use-locale.ts` — hook de détection de locale par route

---

## 4. Écarts entre existant et architecture cible

### 4.1 Incohérence UI — deux thèmes LEX différents

| Élément | Protection (wizard) | Dashboard Atlas Legal |
|---------|-------------------|---------------------|
| Accent couleur | `#10B981` (emerald) | `#C75B39` (terracotta) |
| Style | Sombre (dark mode) | Clair (atlas theme) |
| Composants | 5 composants dédiés | Monolithique (776 lignes) |

**Action :** uniformiser avec terracotta `#C75B39` pour respecter BRAND.md.

### 4.2 Pages de détail plateforme vides

Les routes `/protection/onlyfans/`, `/protection/fansly/`, `/protection/guide/` existent dans l'arborescence mais sont **vides** (pas de `page.tsx`). Impossible pour un créateur de :
- Consulter les CGU propres à sa plateforme
- Voir un guide juridique spécifique

**Action :** créer des pages de détail plateforme avec CGU + droits spécifiques.

### 4.3 Base de connaissances incomplète

| Plateforme | CGU dans knowledge/ | Dans Supabase | API alimentée |
|-----------|-------------------|---------------|---------------|
| OnlyFans | ✅ 4 fichiers | ✅ Seed data | ✅ Cron scan |
| Fansly | ✅ 1 fichier | ❌ | ✅ Cron scan |
| MYM | ✅ 1 fichier | ❌ | ❌ |
| Instagram | ✅ 1 fichier | ❌ | ❌ |
| TikTok | ❌ | ❌ | ❌ |
| YouTube | ❌ | ❌ | ❌ |
| X/Twitter | ❌ | ❌ | ❌ |
| Twitch | ❌ | ❌ | ❌ |

Le cron scan (`legal-scan`) ne couvre que OnlyFans et Fansly. **Manquent MYM, Instagram, TikTok, YouTube**, sans parler des CGU plateformes secondaires.

### 4.4 Pas d'auto-alimentation API

Le cron `legal-scan` existant est un bon début (pattern detection + CGU scan IA), mais :
- Pas de surveillance automatique des changements de CGU pour Instagram/TikTok/YouTube
- Pas d'API SERP/News pour détecter les évolutions juridiques
- Pas de scraping des CGU pour MYM, Instagram, TikTok
- Pas d'intégration avec des APIs juridiques (Legifrance, etc.)

### 4.5 Pas de page "/securite" ni "/lex" dédiées

Le prompt utilisateur mentionnait les routes `/securite` et `/lex` comme cibles, mais :
- `/security` existe (Trust Center, 9 sections) mais n'est pas lié au juridique
- `/protection` est le wizard Bouclier Légal
- Pas de page "LEX" dédiée comme hub juridique complet

### 4.6 Analyse client-side uniquement

Le wizard Bouclier Légal (`protection/page.tsx`) utilise `calculateRisk()` 100% client-side (`lib/bouclier-legal/scoring.ts`). L'API `/api/legal/analyze` existe mais n'est pas utilisée par le frontend. Les utilisateurs anonymes n'ont pas accès au diagnostic IA (Claude).

**Action :** connecter le wizard à l'API pour les utilisateurs connectés, garder le scoring local pour les anonymes.

### 4.7 Pas de validation de schéma API

Aucune route API n'utilise Zod ou équivalent pour valider les entrées. Les body sont utilisés directement avec des `if (!x)` checks basiques.

### 4.8 Pas de tests automatisés

Aucun test pour :
- Le moteur de scoring (`scoring.ts`)
- Les composants du wizard
- Les routes API
- Le cron legal-scan

### 4.9 Protection juridique insuffisante

- Pas de page "Mentions légales" dédiée à l'outil LEX
- Le disclaimer actuel (`StepAccueil.tsx`) est minimal : "ne remplace pas l'avis d'un avocat"
- Pas de limites explicites sur l'usage (pas de conseil juridique, information à titre indicatif)
- Pas de source system (chaque donnée affichée devrait montrer sa source)

### 4.10 Gap d'obsolescence des CGU seed

Les CGU en seed (`030_legal_shield.sql`) datent de "2026" sans date de vérification précise. Le cron `legal-scan` vérifie les changements mais ne couvre que 2 plateformes sur 8.

---

## 5. Résumé des actions recommandées

| Priorité | Action | Impact |
|----------|--------|--------|
| P0 | Uniformiser la charte LEX (terracotta au lieu d'emerald) | Cohérence marque |
| P0 | Créer pages /protection/onlyfans, /fansly, /guide | Contenu manquant |
| P1 | Connecter wizard → API /api/legal/analyze pour membres | Diagnostic IA |
| P1 | Ajouter MYM, Instagram, TikTok, YouTube au cron legal-scan | Base complète |
| P1 | Ajouter Zod validation sur toutes les routes API | Sécurité |
| P1 | Ajouter tests unitaires (scoring, composants, API) | Qualité |
| P2 | Créer page /lex hub juridique complet + /securite | Navigation |
| P2 | Ajouter SERP/News API pour auto-alimentation légale | Fraîcheur données |
| P2 | Améliorer protection juridique (disclaimers, sources) | Conformité |
| P3 | Décomposer dashboard/atlas/legal (776 lignes → composants) | Maintenabilité |
| P3 | Ajouter cache headers sur routes GET publiques | Performance |
