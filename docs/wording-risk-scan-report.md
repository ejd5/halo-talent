# Rapport — Wording Risk Scan

**Prompt :** 38 — Scanner tout le contenu public pour détecter les claims risqués
**Date :** 2026-06-13

---

## Méthodologie

Scan exhaustif de tous les fichiers marketing (composants, pages, data files, lib) pour les patterns de langage à risque juridique ou marketing. Chaque occurrence a été vérifiée dans son contexte pour distinguer un vrai risque d'une formulation prudente (négation, disclaimer, conditionnel).

## Patterns recherchés

| Pattern | Risque |
|---------|--------|
| `revenu garanti`, `résultats garantis`, `garanti` | Promesse de résultat financier |
| `zéro ban`, `aucun ban`, `jamais banni` | Promesse impossible sur des plateformes tierces |
| `100% conforme`, `conformité totale` | Garantie juridique absolue |
| `protection totale`, `sécurité totale` | Garantie de résultat |
| `aucun risque`, `zéro risque` | Assertion trompeuse |
| `remplace avocat`, `remplace juriste` | Exercice illégal du droit |
| `le meilleur`, `le seul`, `n°1`, `leader` | Claim comparatif non vérifiable |
| `devenir riche`, `revenu passif` | Promesse financière |
| `auto-send`, `envoi automatique` | Promesse technique risquée |
| `garantie` (hors disclaimer) | Engagement contractuel implicite |

## Corrections effectuées (2)

| Fichier | Ligne | Avant | Après | Raison |
|---------|-------|-------|-------|--------|
| `components/home/CoutureHero.tsx` | 24 | `protection totale` | `protection proactive` | "Totale" implique une garantie de résultat juridique impossible |
| `app/(marketing)/contrat-type/ContratTypeClient.tsx` | 319 | `Export de données garanti` | `Export de données inclus` | "Garanti" engage une obligation de résultat technique |

## Faux positifs confirmés (tous safe)

Toutes les autres occurrences de `garanti`, `protection`, `conforme`, `risque`, etc. apparaissent dans des contextes prudents :

- **Formes négatives** : "ne garantit pas", "ne constitue pas", "aucune garantie"
- **Disclaimers** : "ne remplace pas un avocat", "ne constitue pas un conseil juridique", "ne saurait engager la responsabilité"
- **Labels de navigation** : "Bouclier Légal", "Protection" (noms de produits, pas des promesses)
- **Conditionnel** : "peut aider", "vise à", "a pour objectif de"
- **Citations de texte légal** : contenu des CGU, mentions légales, etc.

## Pages scannées

| Page/Composant | Fichier(s) | Statut |
|----------------|------------|--------|
| Homepage (tous composants Couture) | 12 composants dans `components/home/Couture*.tsx` | 1 corrigé |
| CGU | `app/(marketing)/cgu/CGUClient.tsx` | Safe |
| Confidentialité | `app/(marketing)/confidentialite/ConfidentialiteClient.tsx` | Safe |
| Mentions légales | `app/(marketing)/mentions-legales/MentionsLegalesClient.tsx` | Safe |
| Contrat type | `app/(marketing)/contrat-type/ContratTypeClient.tsx` | 1 corrigé |
| Comparaisons | `app/(marketing)/comparaisons/ComparaisonsClient.tsx` | Safe |
| FAQ | `app/(marketing)/faq/FAQClient.tsx` | Safe |
| Commissions | `app/(marketing)/commissions/CommissionsClient.tsx` | Safe |
| Données marketing | `lib/marketing/*.ts` | Safe |
| Blog | `lib/blog/data.ts`, `components/blog/` | Safe |
| Pages département | `app/(marketing)/departements/`, `app/(marketing)/departments/` | Safe |
| Lex | `app/(marketing)/lex/` | Safe |
| Protection | `app/(marketing)/protection/` | Safe |
| Atlas | `app/(marketing)/atlas/` | Safe |
| Chat AI | `app/(marketing)/chat-ai/` | Safe |

## Vérification post-correction

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` | 0 erreur, 0 warning |
| `npm run build` | OK |

## Conclusion

**2 corrections sur l'ensemble du contenu public.** Le wording du site est globalement prudent et bien formulé — les disclaimers juridiques sont en place, les formulations conditionnelles sont utilisées, et aucune promesse de résultat n'est faite sans nuance. Les 2 termes corrigés étaient des formulations trop absolues dans un contexte où la prudence s'impose.

---

*Rapport généré le 2026-06-13. Prochain prompt : 39.*
