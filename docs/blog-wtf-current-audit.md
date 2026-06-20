# Blog WTF — Rapport d'Audit Initial

**Date** : 2026-06-13
**Auteur** : Claude Code (Lead Editor, QA Lead)
**Statut** : AUDIT_COMPLETED

---

## 1. Fichiers audités

| # | Fichier | Rôle |
|---|---------|------|
| 1 | `app/(marketing)/blog/page.tsx` | Route /blog — serveur, export metadata |
| 2 | `app/(marketing)/blog/BlogClient.tsx` | Composant client — rendu de la page blog (7 sections) |
| 3 | `app/(marketing)/blog/[slug]/page.tsx` | Route /blog/[slug] — serveur, generateMetadata |
| 4 | `lib/blog/types.ts` | Types : Article, ArticleSection, Category, GlossaryEntry, ToolEntry |
| 5 | `lib/blog/data.ts` | Données : 5 articles réels + glossary + tools |
| 6 | `lib/blog/priority-articles.ts` | 10 articles prioritaires (drafts avec contenu partiel) |
| 7 | `components/blog/BlogArticle.tsx` | Template article : header, TOC, sections, CTA |
| 8 | `components/blog/BlogCard.tsx` | Carte article (non utilisée sur page actuelle) |
| 9 | `components/blog/BlogList.tsx` | Liste d'articles (non utilisée) |
| 10 | `components/blog/TableOfContents.tsx` | Sommaire sticky |
| 11 | `components/shared/Navbar.tsx` | Navbar — vérifier lien "Journal" |
| 12 | `components/shared/Footer.tsx` | Footer — vérifier mentions "Journal Halo" |
| 13 | `lib/marketing/mega-menu-data.ts` | Mega menu — vérifier entrée blog |

## 2. Structure actuelle

### Route /blog
- Server page → `BlogClient` (Client component)
- 7 sections : Hero → Catégories → Articles prioritaires → Calendrier éditorial → Liens utiles → FAQ → CTA
- Utilise framer-motion pour animations
- Utilise `CoutureEmblem` comme ornement
- Fond alterné encre/creme

### Catégories existantes (7)
Image & stratégie, Protection, IA & CRM, Juridique préparatoire, Départements, Commissions, Guides plateformes

### Route /blog/[slug]
- Server page avec `generateMetadata`
- Utilise `BlogArticle` component
- Contenu structuré en `ArticleSection[]` (heading, subheading, paragraph, list, quote, tip)

### Articles existants
- 5 articles complets dans `data.ts` : agence abusive, TOS OnlyFans, commissions, outils, actualités
- 10 priority articles dans `priority-articles.ts` : contenus partiels (quelques sections)
- 30 idées d'articles listées dans `BlogClient.tsx` (sans contenu)

## 3. Problèmes détectés

| # | Problème | Sévérité |
|---|----------|----------|
| 1 | Seulement 5 articles réels — loin des 12 requis | Haute |
| 2 | Priority articles (10) partiellement implémentés (contenu tronqué) | Haute |
| 3 | BlogCard et BlogList non utilisés dans la page actuelle | Moyenne |
| 4 | Template article (BlogArticle) design générique — pas premium magazine | Haute |
| 5 | Pas de hero magazine / article couverture | Haute |
| 6 | Pas de grille asymétrique éditoriale | Haute |
| 7 | Pas de rubriques conformes à la spec (Maison, Image & Influence, etc.) | Haute |
| 8 | Pas de "Dossier du mois" | Moyenne |
| 9 | Pas de newsletter intégrée | Moyenne |
| 10 | Catégories types.ts (10) ne correspondent pas aux catégories BlogClient (7) | Moyenne |
| 11 | Couleurs d'icônes codées en dur (#BFA07A, etc.) | Basse |
| 12 | Template article pas de lettrine, pas de pullquote, pas de sommaire sticky desktop | Moyenne |
| 13 | Hero utilise framer-motion — lourd pour un hero simple | Basse |
| 14 | Pas de metadata OG image pour /blog | Basse |
| 15 | Pas de filtre par catégorie fonctionnel (liste statique) | Moyenne |
| 16 | Nom de domaine "WTF" déjà utilisé mais pas cohérent sur tout le blog | Basse |

## 4. Contenu trop pauvre

Les articles existants sont de qualité éditoriale correcte mais :
- Pas de format magazine premium (pas d'image hero, pas de chapô, pas d'encadrés "À retenir")
- Pas de FAQ par article
- Pas de CTA contextuels variés (tous identiques)
- Pas de liens internes riches
- Pas de métriques de lecture avancées

## 5. Composants à remplacer ou enrichir

| Composant | Action |
|-----------|--------|
| `BlogClient.tsx` | Remplacer complètement par page magazine |
| `BlogArticle.tsx` | Refondre en template magazine premium |
| `BlogCard.tsx` | Remplacer par cartes éditoriales asymétriques |
| `BlogList.tsx` | Remplacer ou supprimer |
| `TableOfContents.tsx` | Enrichir : sommaire sticky desktop |
| `lib/blog/types.ts` | Mettre à jour les catégories |
| `lib/blog/data.ts` | Enrichir avec 12 articles complets |
| `lib/blog/priority-articles.ts` | Fusionner dans data.ts |

## 6. Risques techniques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| framer-motion non installé ? | Bloquant si absent | Vérifier package.json (déjà présent) |
| Newsletter non trouvée | Bloquant si à créer | Scanner le projet pour composant newsletter existant |
| Rupture de liens internes | Élevé | Garder les mêmes slugs pour articles existants |
| Références "Journal Halo" dans le code | Moyen | Scanner tout le projet |
| SEO metadata à réécrire | Moyen | Mettre à jour toutes les metadata |

## 7. Plan de refonte

1. Créer `/lib/marketing/journal-wtf.ts` — configuration éditoriale
2. Mettre à jour `lib/blog/types.ts` — nouvelles catégories
3. Refondre `BlogClient.tsx` → page magazine complète
4. Refondre `BlogArticle.tsx` → template premium
5. Enrichir `lib/blog/data.ts` → 12 articles complets
6. Créer composants manquants (Hero, Grille, Newsletter, etc.)
7. Supprimer ou archiver les composants obsolètes
8. Mettre à jour SEO metadata
9. Wording scan + suppression "Journal Halo"
10. QA technique (tsc, eslint, build)
11. Rapport final

**Statut** : READY_FOR_REFACTOR
