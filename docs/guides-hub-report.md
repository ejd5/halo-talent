# Rapport — Enrichissement /guides

**Prompt :** 26 — Enrichir /guides
**Date :** 2026-06-12

---

## Modifications

### Fichiers créés (1)

| Fichier | Description |
|---------|-------------|
| `app/(marketing)/guides/GuidesClient.tsx` | Composant client couture — 5 sections éditoriales, 14 guides, 7 catégories (~380 lignes) |

### Fichiers modifiés (1)

| Fichier | Modification |
|---------|-------------|
| `app/(marketing)/guides/page.tsx` | Réécrit : server component + metadata SEO + délégation à GuidesClient |

## Architecture

- `/guides` → hub de guides premium (GuidesClient)
- `GuidesPage` (composant blog legacy) → conservé pour les articles de blog existants
- Les guides existants dans `lib/blog/data.ts` sont préservés

## Structure (5 sections)

| # | Section | Contenu | Fond |
|---|---------|---------|------|
| 1 | HeroSection | "Guides pratiques pour créateurs" + baseline evergreen/experts | Encre |
| 2 | CategoriesOverviewSection | 7 catégories en grille 4 colonnes avec icônes et descriptions | Crème |
| 3 | GuidesByCategorySection | 14 guides répartis par catégorie, chaque guide avec titre, description, public cible, niveau, temps de lecture, CTA | Crème |
| 4 | FAQSection | 4 questions/réponses sur les guides | Encre |
| 5 | CTASection | "Un sujet que vous ne trouvez pas ?" → Suggérer un sujet via /contact | Crème |

## Catégories (7)

| Catégorie | Icône | Guides |
|-----------|-------|--------|
| Construire son image | Image | 2 guides |
| Protéger ses accès | Shield | 2 guides |
| Comprendre les contrats | FileText | 2 guides |
| Gérer sa communauté | Users | 2 guides |
| Organiser ses contenus | FolderOpen | 2 guides |
| Choisir une agence | Building2 | 2 guides |
| Utiliser l'IA avec contrôle | Sparkles | 2 guides |

## Guides (14 — evergreen)

| # | Guide | Catégorie | Niveau |
|---|-------|-----------|--------|
| 1 | Construire une image de marque mémorable | Image | Débutant |
| 2 | Stratégie réseaux sociaux pour créateurs indépendants | Image | Intermédiaire |
| 3 | Sécuriser vos comptes de créateur en 10 étapes | Protection | Tous |
| 4 | Protéger votre identité numérique | Protection | Tous |
| 5 | Les 10 clauses essentielles d'un contrat de management | Contrats | Intermédiaire |
| 6 | Négocier sa sortie d'agence sans conflit | Contrats | Avancé |
| 7 | Engager sa communauté sans s'épuiser | Communauté | Intermédiaire |
| 8 | Monétiser sans pression : fidéliser vos fans sur la durée | Communauté | Intermédiaire |
| 9 | Créer un calendrier éditorial efficace | Contenus | Débutant |
| 10 | Réutiliser son contenu sans se répéter | Contenus | Intermédiaire |
| 11 | Reconnaître une bonne agence en 8 signaux | Agence | Débutant |
| 12 | Les 7 signaux d'alerte d'une agence toxique | Agence | Tous |
| 13 | IA et création de contenu : le guide complet | IA | Tous |
| 14 | Deepfakes et créateurs : se protéger et réagir | IA | Tous |

## Wording Check

| Règle | Appliquée |
|-------|-----------|
| Pas de fausse promesse | Guides présentés comme informatifs, pas de résultat garanti |
| Pas de faux témoignages | Aucun témoignage, aucune citation inventée |
| Pas de conseil juridique définitif | "Guides informatifs", pas "conseil juridique" |
| Transparence | "Rédigés par l'équipe éditoriale Halo, avec relecture par des spécialistes" |

## SEO

| Élément | Valeur |
|---------|--------|
| Meta title | "Guides — Halo Talent" |
| Meta description | Axée guides evergreen, experts, 7 catégories |
| Open Graph | Configuré |

## Tests

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` | 0 erreur, 0 warning |
| `npm run build` | OK |

---

*Rapport généré le 2026-06-12. Prochain prompt : 27 — Enrichir /glossaire.*
