# Rapport — Enrichissement /talents

**Prompt :** 21 — Enrichir /talents
**Date :** 2026-06-12

---

## Modifications

### Fichiers créés (1)

| Fichier | Description |
|---------|-------------|
| `app/(marketing)/talents/TalentsClient.tsx` | Composant client couture — 8 sections éditoriales (~340 lignes) |

### Fichiers modifiés (1)

| Fichier | Modification |
|---------|-------------|
| `app/(marketing)/talents/page.tsx` | Réécrit : server component + metadata SEO + délégation à TalentsClient (remplace placeholder) |

## Structure (8 sections)

| # | Section | Contenu | Fond |
|---|---------|---------|------|
| 1 | HeroSection | "Pour les créateurs qui veulent construire plus qu'une audience." + CTA Candidater | Encre |
| 2 | AQuiSection | 4 piliers (vous créez déjà, vous voulez plus de contrôle, vous pensez long terme, vous acceptez la discipline) en grille 2×2 | Crème |
| 3 | ProfilsSection | 4 catégories (Image & Esthétique, Contenu & Influence, Musique & Audio, Sport & Performance) avec 5 profils chacune en tags | Encre |
| 4 | CeQueNousRegardonsSection | 6 critères avec icônes : qualité de l'image, discipline, potentiel, cohérence, ambition, volonté long terme | Crème |
| 5 | CeQueNousNeCherchonsPasSection | 4 refus : buzz court terme, contenu dégradant, promesse irréaliste, absence de projet | Encre |
| 6 | ParcoursSection | 5 étapes numérotées (01-05) avec timeline verticale, durée estimée : Candidater → Analyser → Échanger → Proposer → Décider | Crème |
| 7 | RassuranceSection | 5 engagements : confidentialité, analyse humaine, gratuité, honnêteté, suppression des données | Crème |
| 8 | FAQSection + CTASection | 6 questions/réponses + CTA "Candidater" | Crème / Encre |

## Contenu clé

### Critères de sélection (Ce que nous regardons)
- Qualité de l'image (pas le nombre de followers)
- Discipline (régularité, constance)
- Potentiel de développement (trajectoire, pas position actuelle)
- Cohérence (entre valeurs et contenu)
- Ambition (volonté de réaliser)
- Volonté long terme (marathon, pas sprint)

### Ce que nous ne cherchons pas
- Buzz court terme
- Contenu dégradant
- Promesse irréaliste
- Absence de projet

### Parcours de candidature (5 étapes)
1. Vous candidatez (~10 min)
2. Nous analysons (3-5 jours ouvrés)
3. Nous échangeons (30-45 min)
4. Nous proposons (2-3 jours après)
5. Vous décidez (à votre rythme)

### Rassurance
- Confidentialité absolue
- Analyse humaine, pas algorithmique
- Aucun frais de candidature
- Pas de promesse, honnêteté sur ce qu'on peut apporter
- Suppression des données sous 30 jours si non retenu

## Wording Check

| Règle | Appliquée |
|-------|-----------|
| Pas de faux témoignages | Aucun témoignage |
| Pas de promesses de célébrité | "Nous ne travaillons pas avec des créateurs dont la seule ambition est un pic de viralité" |
| Pas de promesses de résultats | "Pas de promesse : nous vous dirons honnêtement si nous pouvons vous aider" |
| Pas de contenu dégradant | Explicite dans CeQueNousNeCherchonsPas |
| RGPD prudent | "Suppression des données sous 30 jours en cas de non-retenue" |
| Pas de langage intrusif | "pas de données excessives" |

## SEO

| Élément | Valeur |
|---------|--------|
| Meta title | "Talents — Halo Talent" |
| Meta description | Axée créateurs, candidature, profils accompagnés |
| Open Graph | Configuré |

## Tests

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` | 0 erreur, 0 warning |
| `npm run build` | 390/390 pages |

---

*Rapport généré le 2026-06-12. Prochain prompt : 22 — Enrichir /apply.*
