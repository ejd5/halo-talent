# Rapport — Enrichissement /apply

**Prompt :** 22 — Enrichir /apply
**Date :** 2026-06-12

---

## Modifications

### Fichiers créés (2)

| Fichier | Description |
|---------|-------------|
| `app/(marketing)/apply/ApplyClient.tsx` | Composant client couture — 7 sections éditoriales (~290 lignes) |
| `app/(marketing)/apply/page.tsx` | Server component + metadata SEO + délégation à ApplyClient |

### Fichiers modifiés (1)

| Fichier | Modification |
|---------|-------------|
| `app/(auth)/apply/form/page.tsx` | Déplacé depuis `app/(auth)/apply/page.tsx` → `/apply/form` ; départements mis à jour (nouveaux slugs) ; lien header vers /apply |

## Structure (7 sections)

| # | Section | Contenu | Fond |
|---|---------|---------|------|
| 1 | HeroSection | "Candidater chez Halo" + baseline + CTA "Commencer la candidature" | Encre |
| 2 | CeQueNousAnalysonsSection | 8 critères en grille 2×4 : identité, catégorie, plateformes, audience, objectifs, difficultés, autonomie, besoin principal | Crème |
| 3 | AvantDeCandidaterSection | 5 recommandations numérotées 01-05 avant de remplir le formulaire | Encre |
| 4 | ChampsRecommandesSection | 8 champs avec description + badge Obligatoire/Optionnel | Crème |
| 5 | RassuranceSection | 6 garanties avec icônes check vertes : confidentialité, pas de partage, analyse humaine, gratuité, réponse 7j, suppression données | Crème |
| 6 | FAQSection | 6 questions/réponses | Crème |
| 7 | CTASection | "Prêt à candidater ?" → /apply/form | Encre |

## Architecture

- `/apply` → page marketing riche (ApplyClient) 
- `/apply/form` → formulaire 5 étapes existant (déplacé depuis `/apply`)
- `/api/apply` → endpoint préservé

Le formulaire a été mis à jour :
- Départements : anciens slugs (music, sport, business, digital, premium) → nouveaux slugs (glamour-premium, influenceurs, youtube-podcast, musique, sport-fitness)
- Labels français : "Glamour Premium", "Influenceurs", "YouTube / Podcast", "Musique", "Sport / Fitness"
- Header : lien "← Candidature" vers /apply

## Wording Check

| Règle | Appliquée |
|-------|-----------|
| Pas de promesses | "Pas de promesse" explicite dans Hero |
| RGPD prudent | "Nous nous limitons aux informations nécessaires", "suppression sous 30 jours" |
| Pas de données excessives | "Pas de données excessives, pas de questions intrusives" |
| Pas de langage intrusif | Champs optionnels clairement indiqués |
| Confidentialité | "strictement confidentielle", "analyse humaine, pas un algorithme" |

## SEO

| Élément | Valeur |
|---------|--------|
| Meta title | "Candidater — Halo Talent" |
| Meta description | Axée processus, gratuité, confidentialité |
| Open Graph | Configuré |

## Tests

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` (nouveaux fichiers) | 0 erreur, 0 warning |
| `npm run build` | 391/391 pages |

---

*Rapport généré le 2026-06-12. Prochain prompt : 23 — Enrichir /manifeste.*
