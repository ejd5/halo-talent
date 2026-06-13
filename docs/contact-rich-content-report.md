# Rapport — Enrichissement /contact

**Prompt :** 25 — Enrichir /contact
**Date :** 2026-06-12

---

## Modifications

### Fichiers créés (1)

| Fichier | Description |
|---------|-------------|
| `app/(marketing)/contact/ContactClient.tsx` | Composant client couture — 7 sections éditoriales (~315 lignes) |

### Fichiers modifiés (1)

| Fichier | Modification |
|---------|-------------|
| `app/(marketing)/contact/page.tsx` | Réécrit : server component + metadata SEO + délégation à ContactClient |

## Architecture

- `/contact` → page marketing riche (ContactClient) avec formulaire intégré
- `/apply/form` → formulaire de candidature préservé
- `/api/contact` → endpoint préservé
- `ContactForm` → composant existant préservé et réutilisé

## Structure (7 sections)

| # | Section | Contenu | Fond |
|---|---------|---------|------|
| 1 | HeroSection | "Parlez-nous de votre projet." + baseline | Encre |
| 2 | ChoisirSujetSection | 6 sujets : Candidature, Partenariat, Presse, Support, Juridique préparatoire, Démo Atlas | Crème |
| 3 | CeQuilFautPreparerSection | 5 items numérotés pour préparer sa demande | Encre |
| 4 | FormulaireSection | ContactForm existant + lien vers /apply | Crème |
| 5 | DelaisSection | Tableau 6 lignes avec délais par sujet | Encre |
| 6 | RassuranceSection | 4 engagements confidentialité avec Shield + Check | Crème |
| 7 | FAQSection | 5 questions/réponses | Crème |

## Wording Check

| Règle | Appliquée |
|-------|-----------|
| Pas d'adresse non vérifiée | Aucune adresse physique |
| Pas de téléphone inventé | Explication : "Nous privilégions l'écrit" |
| Pas d'équipe inventée | Aucun nom, aucune photo |
| Pas de promesse de résultat | Délais réalistes, pas de garantie de solution |
| Confidentialité | "Nous ne partageons jamais vos informations avec des tiers" |
| Consentement | "Vous ne serez pas inscrit à une newsletter sans votre consentement explicite" |

## SEO

| Élément | Valeur |
|---------|--------|
| Meta title | "Contact — Halo Talent" |
| Meta description | Axée projet, réponse 24-48h ouvrées, confidentialité |
| Open Graph | Configuré |

## Tests

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` | 0 erreur, 0 warning |
| `npm run build` | OK, toutes les routes compilées |

---

*Rapport généré le 2026-06-12. Prochain prompt : 26 — Enrichir /guides.*
