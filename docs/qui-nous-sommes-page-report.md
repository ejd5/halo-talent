# Rapport — Page "Qui nous sommes"

**Prompt :** 03 — Créer la page "Qui nous sommes"
**Date :** 2026-06-12
**Route :** `/qui-sommes-nous`

---

## Fichiers créés

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `app/(marketing)/qui-sommes-nous/page.tsx` | 17 | Server component avec metadata SEO (title, description, OpenGraph) |
| `app/(marketing)/qui-sommes-nous/QuiSommesNousClient.tsx` | 460 | Client component avec 9 sections animées |

## Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `lib/i18n/common.ts` | Ajout clé `nav.qui_sommes_nous` (6 langues) |
| `components/shared/Navbar.tsx` | Ajout `/qui-sommes-nous` en première position dans NAV_ITEMS |
| `components/shared/Footer.tsx` | Ajout lien `/qui-sommes-nous` dans Navigation |

## Structure de la page

| Section | Contenu |
|---------|---------|
| 1. **Hero** | H1 "Qui nous sommes", sous-titre, emblème fleur de lys, 2 CTAs (Approche / Manifeste) |
| 2. **Le constat** | 6 cartes éditoriales (explosion du secteur, agences opportunistes, opacité, outils confisqués, contrats incompris, pression) |
| 3. **Pourquoi Halo existe** | Split section : texte origine (e-commerce, direction générale) + citation fondatrice |
| 4. **Notre conviction** | Centré ivoire : "Le créateur n'est pas un produit. Son image est son actif." |
| 5. **Ce que nous refusons** | 7 refus avec icônes (promesse richesse, manipulation, cadeaux, pression, opacité, court terme, confiscation) |
| 6. **Ce que nous construisons** | 9 constructions avec icônes (maison créative, Creator OS, dashboard, CRM, IA contrôlée, juridique, protection, commissions, relation durable) |
| 7. **Nos cinq départements** | 5 cartes détaillées (Glamour Premium, Influenceurs, YouTube/Podcast, Musique, Sport/Fitness) avec profil, besoin, accompagnement, outils, objectif |
| 8. **Notre modèle économique** | Split section : explication commissions + grille tarifaire marginale + exemple chiffré |
| 9. **Conclusion** | Citation forte + CTAs (Parler à Halo / Découvrir les départements) |

## Design System

- **Palette :** Encre (`#0C0A08`) / Crème (`#F9F6EF`) / Ivoire (`#F4EEE3`) / Or (`#D8A95B`) — alternance section foncée/claire
- **Typographie :** Fraunces (titres display-medium/large), Instrument Sans (corps), Space Grotesk (labels UI), Instrument Serif (citations)
- **Animations :** framer-motion useInView, riseItem (32px) / fadeItem (16px), easeOut 0.7-0.9s, stagger 50-80ms
- **Ornement :** CoutureEmblem (fleur de lys) en séparateur de section
- **Classes réutilisées :** `.couture-section`, `.wrap-eco`, `.display-medium`, `.display-large`, `.couture-ornament`, `.btn-eco`

## SEO

- **Meta title :** "Qui nous sommes — Halo Talent"
- **Meta description :** 160 caractères, mots-clés : maison de management créatif, histoire, convictions, vision
- **Open Graph :** title + description configurés
- **H1 :** "Qui nous sommes" — unique sur la page
- **H2 :** 7 (Le constat, Pourquoi Halo existe, Notre conviction, Ce que nous refusons, Ce que nous construisons, Nos cinq départements, Un modèle économique transparent)

## Wording Check

- Aucun mot interdit (revenu garanti, zéro ban, 100% conforme, etc.)
- Aucune fausse promesse
- Aucun faux témoignage
- Aucun faux chiffre
- Commissions : exemple "25 000€ → 3 500€" correctement qualifié d'illustratif
- Ton premium, institutionnel, humain, vouvoiement systématique

## Tests

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` (fichiers modifiés) | 0 erreur |
| `npm run build` | 390/390 pages, `/qui-sommes-nous` statique généré |

## Points d'attention

- Les 5 départements reprennent la structure existante de `/departements` pour cohérence
- La grille tarifaire est la même que `/commissions` (source unique de vérité)
- Le lien "Lire notre manifeste" dans le Hero renvoie vers `/manifeste` (cross-linking interne)
- La citation "Nous ne voulons pas gérer des créateurs comme des comptes" est reprise de la stratégie éditoriale (Prompt 02)

---

*Rapport généré le 2026-06-12. Prochain prompt : 04 — Refonte du mega-menu complet.*
