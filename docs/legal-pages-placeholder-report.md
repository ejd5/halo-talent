# Rapport — Pages légales : structure couture, placeholders préservés

**Prompt :** 32 — Nettoyer /cgu, /confidentialite, /mentions-legales
**Date :** 2026-06-13

---

## Modifications

### Fichiers créés (3)

| Fichier | Description |
|---------|-------------|
| `app/(marketing)/cgu/CGUClient.tsx` | Composant client couture — 16 sections CGU, ~230 lignes |
| `app/(marketing)/confidentialite/ConfidentialiteClient.tsx` | Composant client couture — 9 sections confidentialité, ~280 lignes |
| `app/(marketing)/mentions-legales/MentionsLegalesClient.tsx` | Composant client couture — 7 sections mentions légales, ~190 lignes |

### Fichiers modifiés (3)

| Fichier | Modification |
|---------|-------------|
| `app/(marketing)/cgu/page.tsx` | Réécrit : server component + Metadata + délégation à CGUClient |
| `app/(marketing)/confidentialite/page.tsx` | Réécrit : server component + Metadata + délégation à ConfidentialiteClient |
| `app/(marketing)/mentions-legales/page.tsx` | Réécrit : server component + Metadata + délégation à MentionsLegalesClient |

## Design couture appliqué

| Élément | Avant | Après |
|---------|-------|-------|
| Fond principal | `#1A1614` (noir legacy) | `var(--creme)` (#F9F6EF) |
| Fond surface | `var(--color-dark-surface)` | `var(--creme)` |
| Hero | Fond noir + bruit SVG | Encre + radial gradient or + badge or |
| Titres | Uppercase display | Fraunces, couleur encre |
| Corps texte | Blanc 0.7 opacity | Encre 0.7 opacity, sans-serif |
| Liens | `var(--color-accent)` | `var(--or)` avec hover transition |
| Notes légales | Blanc 0.35-0.4 opacity | `var(--pierre)` |
| Badges review | Fond #C75B39 opaque | Fond #C75B39 0.06, bordure 0.15 |

## Placeholders identifiés

### /cgu — 1 placeholder

| Section | Champ | Valeur |
|---------|-------|--------|
| 1. Objet | Raison sociale | [À compléter — raison sociale] |

### /confidentialite — 1 placeholder

| Section | Champ | Valeur |
|---------|-------|--------|
| 6. Vos droits / 9. Contact | Email DPO | [À compléter — email DPO ou privacy] |

### /mentions-legales — 8 placeholders

| Section | Champ | Valeur |
|---------|-------|--------|
| 1. Éditeur | Raison sociale | [À compléter — nom de la société] |
| 1. Éditeur | Forme juridique | [À compléter — SARL, SAS, EI, etc.] |
| 1. Éditeur | Capital social | [À compléter] |
| 1. Éditeur | Adresse siège | [À compléter — adresse complète] |
| 1. Éditeur | SIRET | [À compléter] |
| 1. Éditeur | TVA | [À compléter] |
| 2. Directeur | Nom | [À compléter — nom du directeur de publication] |
| 4. Propriété intell. | Propriétaire | [À compléter] (×2 occurrences) |
| 7. Contact | Adresse postale | [À compléter — adresse postale] |

**Total : 10 placeholders [À compléter] sur les 3 pages**

## Notes internes

### Informations manquantes critiques (bloquantes avant production)

- **Raison sociale et forme juridique** : nécessaires pour /cgu et /mentions-legales
- **SIRET et TVA** : obligatoires pour /mentions-legales (art. 6 Loi n° 2004-575)
- **Directeur de publication** : obligatoire pour /mentions-legales
- **Capital social** : obligatoire si société commerciale
- **Email DPO** : requis par RGPD si désignation d'un DPO
- **Adresse postale** : obligatoire pour /mentions-legales si activité commerciale

### Notes juridiques à valider

- `/cgu §15` : juridiction compétente à faire valider par avocat
- `/confidentialite` : toutes les bases légales (consentement, exécution contrat, intérêt légitime) à faire valider
- `/confidentialite §4` : durées de conservation à ajuster selon obligations légales
- `/confidentialite §5` : DPA avec Vercel, Supabase, Anthropic à vérifier
- `/confidentialite §8` : bannière cookies à mettre en place si cookies non-essentiels

## Contenu préservé intégralement

| Élément | Status |
|---------|--------|
| 16 sections CGU | Contenu texte inchangé |
| 9 sections Confidentialité | Contenu texte inchangé |
| 7 sections Mentions légales | Contenu texte inchangé |
| Tous les [À compléter] | Préservés exactement |
| Tous les avertissements juridiques | Préservés |
| Tous les liens internes (/contact, /confidentialite) | Fonctionnels |

## Wording Check

| Règle | Appliquée |
|-------|-----------|
| Pas d'invention d'info juridique | Aucun placeholder comblé |
| Pas de fausse société | Aucun nom inventé |
| Ton professionnel | Conservé et renforcé |
| Notes internes ajoutées | Oui, dans ce rapport |

## Tests

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` | 0 erreur, 0 warning |
| `npm run build` | OK (/cgu, /confidentialite, /mentions-legales statiques) |

---

*Rapport généré le 2026-06-13. Prochain prompt : 33 — Tableaux comparatifs.*
