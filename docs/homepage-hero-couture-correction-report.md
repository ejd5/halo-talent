# Hero Couture Editorial — Rapport de correction

## Contexte

Correction du hero Halo Talent pour aligner avec la direction "éditorial magazine luxe + haute couture parisienne" validée par l'utilisateur.

**Référence** : l'utilisateur a comparé le hero actuel (fond noir + badges flottants SaaS) avec une référence éditoriale magazine (fond ivoire, portrait modèle N&B à droite, typo serif luxe, mise en page verticale).

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `components/home/CoutureHero.tsx` | Réécriture complète — editorial magazine layout |
| `components/brand/HaloCoutureLogo.tsx` | Création — logo style n°4 (HALO serif + Talent script) |
| `components/shared/Navbar.tsx` | Logo couture + CTA champagne/noir |
| `lib/marketing/couture-homepage.ts` | Ajout `HERO_EDITORIAL_STEPS` |
| `public/images/halo/` | Dossier créé pour image modèle éditorial |

---

## Éléments supprimés

- **6 badges flottants** (Management, Studio IA, Atlas CRM, CHATEENG, Halo Lex, Commissions) — donnaient un effet "SaaS dashboard / orbital UI"
- **Effets ambient** (halo-glow, halo-ring) — trop futuristes/tech
- **Fond noir** du hero — remplacé par ivoire/crème
- **CTA orange cuivre** dans la navbar — remplacé par champagne/noir
- **Layout centré** — remplacé par split text-left / image-right

## Nouvelle structure hero

```
┌──────────────────────────────────────────┐
│ Navbar (noir couture, logo style n°4)     │
├────┬──────────────────────────────────────┤
│Rail│  Left (texte)     │  Right (image)   │
│noir│  Badge             │                  │
│    │  H1 4 lignes       │  /images/       │
│PARI│  Sous-titre        │  heropic.png    │
│S · │  Micro-copy        │  grayscale      │
│NEW │  CTAs (noir/or)   │  object-cover   │
│YOR│  Reassurance        │                  │
│K · │                    │                  │
│MILA│                    │                  │
│N · │                    │                  │
│TOKY│                    │                  │
│O   │                    │                  │
├────┴──────────────────────────────────────┤
│ 01 Management — 02 Image —                │
│ 03 Croissance — 04 Contrôle               │
└──────────────────────────────────────────┘
```

## Couleurs appliquées

| Rôle | Valeur |
|------|--------|
| Fond hero | `var(--creme, #F9F6EF)` (ivoire/crème) |
| Side rail | `var(--encre, #0C0A08)` (noir couture) |
| Texte H1 | `var(--encre, #0C0A08)` |
| Texte secondaire | `var(--pierre, #9C9183)` |
| Accents | `var(--or, #D8A95B)` (champagne) |
| CTA principal | Noir couture, texte ivoire |
| CTA secondaire | Outline noir couture |
| Image droite | Grayscale + contrast 1.08 + brightness 0.95 |

## Typographie logo style n°4

- **"HALO"** : Fraunces (var(--font-display-alt)), uppercase, letter-spacing 0.06em
- **"Talent"** : Instrument Serif italic (var(--font-accent)), en-dessous
- **Couleur** : Ivoire sur navbar noire, champagne en accent

## Animations

- **H1** : 4 lignes reveal clip-path (translateY 110% → 0), stagger 120ms
- **Texte** : fadeUp (opacity + translateY), stagger progressif
- **Image droite** : clip-path reveal (inset right → full)
- **Supprimé** : badges flottants, halo-glow orbital, halo-ring

## Mobile

- Side rail masqué (< lg)
- Image modèle masquée, remplacée par texture subtile en fond
- Editorial bottom line masquée (< md)
- H1 lisible (clamp 38px → 76px)
- CTAs en flex-wrap
- Navbar mobile avec logo couture

## Visuel modèle

- **Source** : `/images/heropic.png` (image existante dans le projet)
- **Traitement** : `grayscale(100%) contrast(1.08) brightness(0.95)`
- **Overlay** : gradient left pour fondre avec le fond ivoire
- **Slot alternatif** : `/public/images/halo/` prêt pour `editorial-model.jpg`

## Wording scan

- 0 claim interdit trouvé
- Messages rassurants préservés : "Pas une agence opaque", "Pas un outil isolé", etc.
- Disclaimer carousel préservé
- Disclaimer legal préservé

## Résultats techniques

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` (fichiers modifiés) | 0 erreur, 0 warning |
| `npm run build` | Succès |
| Wording scan | 0 claim interdit |

## Statut final

**APPROVED_FOR_VISUAL_REVIEW** — Tous les critères d'acceptation remplis. Prêt pour déploiement Vercel et revue visuelle.
