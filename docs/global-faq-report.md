# Rapport — FAQ globale Halo Talent

**Prompt :** 34 — Créer les FAQ globales
**Date :** 2026-06-13

---

## Modifications

### Fichiers créés (3)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `lib/marketing/faq.ts` | ~420 | Data file : 10 catégories, 83 questions-réponses, types exportés |
| `app/(marketing)/faq/FAQClient.tsx` | ~310 | Page couture : recherche, filtres par catégorie, accordéon |
| `app/(marketing)/faq/page.tsx` | ~20 | Server component + Metadata SEO |

## 10 catégories

| # | Catégorie | Questions | Description |
|---|-----------|-----------|-------------|
| 1 | Général | 10 | Mission, fonctionnement, qui, combien, différenciation |
| 2 | Commissions | 9 | Taux, transparence, comparaison, simulateur |
| 3 | Atlas | 8 | CRM, données, export, Fan Brain, sécurité |
| 4 | Chat AI | 8 | Assistant, modèle IA, confidentialité, disponibilité |
| 5 | Lex | 8 | Contrats, analyse, limites, avocats partenaires |
| 6 | Protection | 8 | Bouclier Légal, conformité, CGU plateformes |
| 7 | Départements | 8 | Structure, activation, évolution |
| 8 | Candidature | 8 | Comment postuler, critères, délais, refus |
| 9 | Juridique | 8 | Responsabilité, droits, RGPD, opposabilité |
| 10 | Sécurité | 8 | Chiffrement, stockage, suppression, 2FA |

**Total : 83 questions-réponses.**

## Fonctionnalités de la page

| Fonctionnalité | Implémentation |
|----------------|----------------|
| Recherche plein texte | Filtre questions + réponses, mise à jour en temps réel |
| Filtres par catégorie | Boutons toggle, une seule catégorie à la fois |
| Accordéon | Ouverture/fermeture par question avec animation + |
| Compteur dynamique | Nombre total de questions affiché dans le Hero |
| État vide | Message "Aucun résultat" si la recherche ne donne rien |
| Responsive | Accordéon pleine largeur sur mobile |

## Design couture

| Élément | Implémentation |
|---------|----------------|
| Hero | Fond encre, badge "FAQ", compteur dynamique |
| Search | Barre de recherche avec icône Search, bordure --ligne |
| Catégories | Pills toggle encre/crème, actif = fond encre |
| Accordéon | Questions en encre, réponses en encre 0.65 opacity, séparateur --ligne-faible |
| CTA | Fond encre, bouton or "Nous contacter" |

## Wording Check

| Règle | Appliquée |
|-------|-----------|
| Réponses claires | Oui, langage accessible |
| Ton premium | Vocabulaire soigné, pas familier |
| Pas de promesse | Aucune garantie de résultat |
| Juridiquement prudent | "Ne remplace pas un avocat", "à titre informatif", "nous vous recommandons de valider" |
| Pas de faux chiffres | Aucun chiffre inventé |

## Tests

| Test | Résultat |
|------|----------|
| `npx tsc --noEmit` | 0 erreur |
| `npx eslint` | 0 erreur, 0 warning |
| `npm run build` | OK (/faq statique) |

---

*Rapport généré le 2026-06-13. Prochain prompt : 35 — SEO metadata global.*
