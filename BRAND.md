# BRAND.md — Halo Talent — Direction artistique v2

## PHILOSOPHIE DESIGN

Ce site ne doit JAMAIS ressembler à un template IA.
Chaque page doit donner l'impression d'avoir été designée
par un directeur artistique humain pour un magazine de mode.

Mots-clés : éditorial, vivant, photographique, asymétrique, cinématique.
Anti-mots-clés : template, centré, générique, doré, serif italic hero.

## PALETTE

### Couleurs principales
--color-base: #F5F0EB          /* Crème chaud (PAS noir) */
--color-base-alt: #FFFFFF       /* Blanc pur pour contrast */
--color-surface: #EDE8E1        /* Crème plus foncé pour cards */
--color-ink: #1A1614            /* Encre quasi-noir (texte) */
--color-ink-muted: #7A736B      /* Texte secondaire */

### Accent (UN SEUL — pas d'or)
--color-accent: #C75B39         /* Terracotta chaud — unique, jamais vu en AI template */
--color-accent-hover: #A84A2D
--color-accent-soft: #F0DDD4    /* Version pâle pour backgrounds subtils */

### Sections sombres (utilisées ponctuellement, pas partout)
--color-dark: #1A1614           /* Pour sections de contraste */
--color-dark-text: #F5F0EB      /* Texte sur fond sombre */
--color-dark-muted: #9A9590

### Interdits absolus
- PAS de doré (#D4AF37, #B8860B, #D4A853)
- PAS de gradient violet, bleu, ou turquoise
- PAS de noir pur (#000000) comme fond principal

## TYPOGRAPHIES (Google Fonts)

### Headlines — Syne
- Font : 'Syne', sans-serif
- Weights : 700 (Bold), 800 (ExtraBold)
- Usage : H1, H2, hero, titres de section
- Style : uppercase pour H1 hero, normal pour H2-H6
- Tracking : 0.02em pour uppercase, normal sinon
- Pourquoi Syne : géométrique, moderne, distinctive, zéro rapport avec Cormorant

### Body — Plus Jakarta Sans
- Font : 'Plus Jakarta Sans', sans-serif
- Weights : 400 (Regular), 500 (Medium), 600 (SemiBold)
- Usage : paragraphes, navigation, boutons, UI
- Leading : 1.65
- Pourquoi : lisible, chaleureuse, professionnelle sans être générique

### Accent — Instrument Serif (usage RARE)
- Font : 'Instrument Serif', serif
- Weights : 400 (Regular), 400 Italic
- Usage : UNIQUEMENT pour des citations isolées ou des pull-quotes
- JAMAIS pour les headlines hero
- JAMAIS pour la navigation
- Max 1 occurrence par page

## LAYOUT

### Principes
- ASYMÉTRIE par défaut. Ne jamais centrer un hero.
- Split-screen hero : image à gauche/droite, texte de l'autre côté
- Grids cassées : éléments qui chevauchent, débordent, créent du mouvement
- Full-bleed images : les photos prennent toute la largeur
- Sections alternées : clair → sombre → clair (pas tout sombre)
- Whitespace généreux entre les sections (120-160px)

### Interdit layout
- Pas de hero centré texte-seul sur fond uni
- Pas de 3 colonnes identiques (le "triptych générique IA")
- Pas de cards identiques empilées à l'infini

## PHOTOGRAPHIE

### Style requis
- Portraits éditoriaux (façon magazine, pas stock photo)
- Noir et blanc OU traitement warm desaturé
- Grain léger (film-like)
- Composition : off-center, crop serré, regard hors champ
- Énergie : confiance, mouvement, authenticité

### En attendant de vraies photos
- Utiliser des photos de stock PREMIUM (Unsplash collections éditoriales)
- Appliquer un traitement uniforme : desaturation -30%, warmth +10%, grain overlay
- NE JAMAIS utiliser de photos stock corporate/génériques

### Où mettre les photos
- Hero : OBLIGATOIRE (split-screen avec photo)
- Section départements : un visage par département
- Section talents/roster : grille de portraits
- Section équipe : portraits réels des fondateurs
- Background de sections : photos full-bleed avec overlay

## MOTION & ANIMATION

### Scroll-triggered (bibliothèque : framer-motion ou CSS IntersectionObserver)
- Texte hero : clip-path reveal de gauche à droite (pas fade-in)
- Photos : scale de 1.05 à 1.0 (zoom-out subtle au scroll)
- Sections : slide-in latéral alterné (gauche, droite, gauche)
- Chiffres/stats : count-up animation au scroll

### Hover
- Boutons : changement de fond instantané (pas de transition lente)
- Cards créateurs : overlay avec nom + infos qui montent
- Liens nav : underline animée custom (pas text-decoration)
- Images : léger zoom (scale 1.03) + filtre de luminosité

### Page transitions
- Pas de transition de page complexe (simple et rapide)
- Skeleton loaders pour les contenus dynamiques

### Interdits animation
- Pas de fade-in générique (le marqueur #1 du vibe coding)
- Pas de bounce, wobble, ou effets "fun"
- Pas d'animation au chargement de plus de 800ms

## COMPOSANTS

### Boutons
- Primaire : fond --color-accent, texte blanc, padding 16px 32px, radius 0px (CARRÉ, pas arrondi)
- Secondaire : border 1px --color-ink, fond transparent, texte --color-ink
- Hover : inversion instantanée (pas de transition 300ms)
- UPPERCASE, font Plus Jakarta Sans 600, tracking 0.08em, font-size 13px

### Cards
- Fond --color-surface ou --color-base-alt
- Pas de border-radius (angles droits = editorial)
- Pas de shadow. Ligne fine en bas ou à gauche si besoin.
- Photo en haut (aspect ratio 3:4 pour portraits)

### Navigation
- FIXE en haut
- Fond --color-base avec blur backdrop
- Logo à gauche (Syne Bold, pas d'icône fantaisie)
- Liens à droite : Plus Jakarta Sans 500, uppercase, tracking 0.05em, 13px
- Pas de méga-menu. Liens directs. Maximum 7 items.
- CTA "POSTULER" en bouton accent (terracotta) à droite

### Footer
- Fond --color-dark
- Layout en colonnes asymétriques (pas 4 colonnes identiques)
- Logo + tagline à gauche (grand)
- Liens au centre
- Newsletter à droite
- Copyright en bas, discret

### Sections
- Alternance : fond clair → fond sombre → fond clair
- Section sombre = --color-dark avec texte clair
- Section claire = --color-base avec texte sombre
- Transition entre sections : ligne fine --color-accent ou rien

## CE QUI REND CE SITE MÉMORABLE

1. Les VRAIES PHOTOS de créateurs (pas du texte sur fond noir)
2. Le TERRACOTTA comme accent unique (jamais vu dans l'industrie)
3. L'ASYMÉTRIE du layout (pas le template centré habituel)
4. La TYPOGRAPHIE BOLD sans-serif (pas le serif italic générique)
5. Le MOUVEMENT cinématique (clip-path, parallax, pas fade-in)
6. L'alternance CLAIR/SOMBRE (pas tout noir)
