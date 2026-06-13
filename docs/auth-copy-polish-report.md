# Rapport — Refonte des pages auth /login et /signup

**Prompt :** 31 — Refonte pages auth
**Date :** 2026-06-12

---

## Modifications

### Fichiers modifiés (2)

| Fichier | Modification |
|---------|-------------|
| `app/(auth)/login/page.tsx` | Refonte complète : couture design, microcopy, rassurance, show/hide password, erreurs stylisées |
| `app/(auth)/signup/page.tsx` | Refonte complète : formulaire fonctionnel Supabase signUp, confirmation email, couture design |

## /login

| Élément | Avant | Après |
|---------|-------|-------|
| H1 | "Connexion" | "Se connecter à Halo" |
| Sous-titre | "à votre espace créateur" | "Retrouvez votre espace, vos outils et vos décisions au même endroit." |
| Design | Legacy encre/image placeholder | Couture : split layout encre/crème, citation éditoriale, or microcopy |
| Rassurance | Aucune | Badge "Connexion sécurisée et chiffrée" + message confidentialité sous le formulaire |
| Mot de passe | Pas de toggle | Bouton show/hide password (Eye/EyeOff) |
| Erreurs | Texte brut | Bloc avec bordure couleur alert |
| CTA secondaire | "Postuler à la maison" (/apply) | Préservé, stylisé or |

## /signup

| Élément | Avant | Après |
|---------|-------|-------|
| H1 | "Inscription" (placeholder) | "Créer un accès Halo" |
| Sous-texte | "Page en construction" | "Un espace pensé pour structurer votre activité avec plus de clarté et de contrôle." |
| Fonctionnalité | Aucune | Formulaire Supabase signUp complet avec validation |
| Confirmation | Inexistante | Écran "Vérifiez votre email" après inscription réussie |
| Design | Placeholder Section | Couture : split layout encre/crème, cohérent avec /login |
| Rassurance | Aucune | Badge sécurité + message confidentialité + explication email de confirmation |
| Erreurs | Aucune | Messages contextualisés (email existant, mot de passe faible, erreur générique) |

## Éléments préservés

| Élément | Status |
|---------|--------|
| Logique Supabase auth | Strictement préservée (signInWithPassword, signUp) |
| Composants Input/Button | Réutilisés sans modification |
| Redirection post-login vers /dashboard | Préservée |
| Layout split desktop/mobile | Conservé et amélioré |

## Ajouts couture

- Split layout encre (gauche) / crème (droite)
- Citation éditoriale en italic sur le panneau gauche
- Microcopy or (badge "Accès", labels)
- CSS variables couture (--encre, --creme, --or, --ivoire, --pierre, --ligne-faible)
- Typographie Fraunces pour les titres, sans-serif pour le body
- Toggle mot de passe avec icônes Eye/EyeOff
- Messages d'erreur avec bordure alert (#C75B39)

## Wording Check

| Règle | Appliquée |
|-------|-----------|
| Pas de faux claims | "Connexion sécurisée et chiffrée" (factuel, pas "la plus sécurisée") |
| Pas de promesse | "Un espace pensé pour structurer" (pas "vous allez gagner plus") |
| Auth non cassée | Logique Supabase inchangée |
| Pas d'invention | Pas de faux logos, pas de faux labels |

## Tests

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` | 0 erreur, 0 warning |
| `npm run build` | OK |

---

*Rapport généré le 2026-06-12. Prochain prompt : 32 — Pages légales.*
