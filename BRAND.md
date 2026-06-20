# BRAND.md — Where Talent Forms — Direction artistique Couture v3

## PHILOSOPHIE DESIGN

Ce site ne doit JAMAIS ressembler à un template SaaS/IA.
Chaque page doit donner l'impression d'avoir été conçue
par un directeur artistique pour une maison de couture parisienne.

Mots-clés : couture, éditorial, cinématique, or et encre, maison de création.
Anti-mots-clés : template, corporate, néon, gradient tech, centré générique.

## NOM DE MARQUE

- Nom complet : **Where Talent Forms**
- Abréviation : **WTF**
- Tagline : *Maison de création*
- Positionnement : Agence de talents premium pour créateurs ambitieux
- Villes : Paris · New York · Milan · Tokyo

## PALETTE — COUTURE (ENCRE & OR)

### Couleurs fondamentales
```
--encre:       #0C0A08    /* Noir chaud — fond principal */
--fumee:       #15110D    /* Surface légèrement plus claire */
--surface:     #1C1712    /* Cards et éléments surélevés */
--ivoire:      #F4EEE3    /* Texte principal — blanc chaud */
--creme:       #F9F6EF    /* Fond clair pour sections alternées */
--pierre:      #9C9183    /* Texte secondaire — gris chaud */
```

### Accent principal — Or / Champagne
```
--or:          #D8A95B    /* Accent principal — or champagne */
--or-clair:    #EBC98A    /* Accent hover — or pâle */
--cuivre:      #E2702E    /* Accent secondaire — cuivre chaud */
```

### Accents sémantiques
```
--sauge:       #8FB58A    /* Succès / validé */
--terre:       #C96A4A    /* Warning / attention */
--danger:      #E8634A    /* Erreur / danger */
```

### Bordures & Lignes
```
--ligne:       rgba(216, 169, 91, 0.18)    /* Bordure visible */
--ligne-faible: rgba(244, 238, 227, 0.08)  /* Bordure subtile */
```

### Identité chromatique
- L'or champagne (`#D8A95B`) est la couleur signature — présente sur les eyebrows, les CTA, les accents
- Le noir chaud encre (`#0C0A08`) crée la profondeur et le luxe
- L'ivoire (`#F4EEE3`) assure la lisibilité avec chaleur
- Les sections alternent entre encre (dark) et crème (light) pour le rythme

### Interdits absolus
- PAS de bleu tech (#0066FF, #3B82F6)
- PAS de violet IA (#7C3AED, #8B5CF6)
- PAS de gradient arc-en-ciel ou néon
- PAS de noir pur (#000000) — toujours utiliser --encre (#0C0A08)

## TYPOGRAPHIES (Google Fonts — 9 polices chargées)

### Titres Hero — Playfair Display (`--font-couture`)
- Font : 'Playfair Display', Georgia, serif
- Weights : 400–900
- Usage : H1 hero, titres de section principaux
- Style : Bold à Extra Bold, lettres serrées (-0.02em à -0.04em)
- Le choix du serif display apporte l'élégance couture

### Titres de section — Fraunces (`--font-display-alt`)
- Font : 'Fraunces', Georgia, serif
- Weights : 300–600 (Regular + Italic)
- Usage : H2, H3, sous-titres éditoriaux, display-large/medium/small
- Style : Light (300) pour les grands titres, 400 pour le texte

### Body / UI — Instrument Sans (`--font-body`)
- Font : 'Instrument Sans', Inter, sans-serif
- Weights : 400–600
- Usage : Paragraphes, navigation, interface

### Display Legacy — Plus Jakarta Sans (`--font-display`)
- Font : 'Plus Jakarta Sans', Inter, sans-serif
- Weights : 400–700
- Usage : Dashboard, headings d'interface, mega-menu

### Utilitaire / Mono — Space Grotesk (`--font-util`)
- Font : 'Space Grotesk', JetBrains Mono, monospace
- Weights : 400–500
- Usage : Eyebrows, labels uppercase, badges, boutons CTA
- Style : TOUJOURS uppercase, tracking 0.18–0.38em, taille 9–11px

### Accent Serif — Instrument Serif (`--font-accent`)
- Font : 'Instrument Serif', Georgia, serif
- Weight : 400 (Regular + Italic)
- Usage : Citations, blockquotes, accents éditoriaux
- RARE — max 1–2 occurrences par page

### Code — JetBrains Mono (`--font-mono`)
- Font : 'JetBrains Mono', Fira Code, monospace
- Usage : KPIs, valeurs numériques, code

### Sans-Serif — Inter (`--font-sans`)
- Font : 'Inter', system-ui, sans-serif
- Usage : Fallback body, texte secondaire

### Display Legacy — Syne (`--font-display-legacy`)
- Font : 'Syne', system-ui, sans-serif
- Usage : Hérité, certains composants legacy

## LAYOUT

### Principes
- **Full-height hero** : slider vidéo immersif occupant 100vh
- **Split-screen** : texte d'un côté, vidéo de l'autre, alternance gauche/droite
- **Asymétrie** : les éléments ne sont jamais centrés par défaut
- **Sections alternées** : encre (dark) → crème (light) → encre pour le rythme
- **Whitespace couture** : 120–130px entre les sections (sec-eco padding)
- **Max-width contrôlé** : 1240px (wrap-eco)

### Navigation
- Pill flottante centrée avec mega-menu (style Chargeflow)
- Logo à gauche (grande taille, 160px height)
- CTA capsule "Essayer" dorée à droite
- Sélecteur de langue avec drapeaux
- Backdrop blur quand mega-menu ouvert

### Footer
- Fond fumée avec halo ambiant
- Logo rond centré + wordmark Fraunces
- Grille de liens : Navigation / Ressources / Légal / Newsletter
- Marquee signal strip
- Copyright + villes en bas

## COMPOSANTS SIGNATURE

### Eyebrow (surtitre)
- Font : Space Grotesk
- Taille : 9–11px
- Tracking : 0.28–0.38em
- Transform : uppercase
- Couleur : --or

### Boutons (btn-eco)
- Outline : bordure --ligne, texte --ivoire, fond transparent
- Fill : fond --or, texte --encre, bordure --or
- Gold : bordure --or, texte --or, hover → fond --or
- Font : Space Grotesk, 11px, tracking 0.22em, uppercase
- Padding : 14px 26px
- Border-radius : 2px (quasi-carré, pas arrondi)

### Cards
- Fond : --surface ou transparent
- Bordure : 1px solid --ligne-faible
- Accent line : gradient or en haut (2px)
- Hover : translateY(-2px) + border-color accent
- Pas de border-radius (angles droits = éditorial)

### Halo Ring (signature visuelle)
- Anneau conic-gradient avec or/cuivre
- Rotation infinie (26s)
- Glow radial qui respire (7s)
- Utilisé en arrière-plan des sections clés

### Marquee Strip
- Bordure haut/bas --ligne-faible
- Font : Space Grotesk, 12–13px, tracking 0.3em, uppercase
- Défilement infini (32–36s)
- Séparateurs ◆ en or

## MOTION & ANIMATION

### Scroll-triggered (classe .rv)
- Révélation : translateY(36px) → 0, opacity 0 → 1
- Durée : 0.9s cubic-bezier(0.16, 1, 0.3, 1)
- Délais staggerés : .rv-d1 (0.1s), .rv-d2 (0.2s), .rv-d3 (0.3s)

### Hero
- Slider bidirectionnel avec fondu croisé (1400ms)
- Barre de progression vidéo en bas
- Dots de navigation minimalistes (lignes 24/40px)
- Text reveal : translateY(110%) avec clip-path

### Hover
- Cards : translateY(-2px) + border-color transition (0.35s)
- Boutons : changement instantané fond/texte
- Liens : opacity transition, couleur --ivoire → --or

### Ambient
- Halo ring : spin 26s linear infinite
- Halo glow : breathe 7s ease-in-out infinite
- Marquee : scroll 32s linear infinite

### Accessibilité
- @media (prefers-reduced-motion: reduce) désactive TOUTES les animations
- .rv → opacity 1, transform none
- .marquee-track → animation none
- .halo-ring, .halo-glow → animation none

## CE QUI REND CE SITE MÉMORABLE

1. L'univers **ENCRE & OR** — unique, jamais vu dans l'industrie OFM
2. Le **slider vidéo Hero** cinématique en plein écran
3. La **typographie couture** (Playfair Display + Fraunces + Space Grotesk)
4. Les **animations ambiantes** (halo ring, glow, marquee)
5. L'**asymétrie** du layout (alternance gauche/droite, split-screen)
6. Le **rythme dark/light** entre les sections
7. Les **micro-détails** : eyebrows, dots, rails latéraux, floating cards
