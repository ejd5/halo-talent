# Audit Copyright — Contenu des connaissances LEX

> Date : 2026-06-11
> Objet : Vérification de l'absence de verbatim CGU dans knowledge/
> Méthode : Inspection manuelle de chaque fichier + comptage des citations blockquote

## Résultat

**Aucun risque copyright détecté après correction.** Tous les fichiers sont des synthèses originales reformulées, sans copie textuelle des CGU des plateformes ou des lois.

## Audit par fichier

### Platforms

| Fichier | Verbatim détecté | Action |
|---------|-----------------|--------|
| `platforms/onlyfans/terms-of-service-2026.md` | 4 citations blockquote (courtes, ~1 phrase chacune) | **CORRIGÉ** : citations retirées, contenu reformulé conservé |
| `platforms/onlyfans/acceptable-use-policy.md` | Aucun | OK |
| `platforms/onlyfans/ai-content-policy-2026.md` | Aucun | OK |
| `platforms/onlyfans/creator-guidelines.md` | Aucun | OK |
| `platforms/fansly/terms-of-service.md` | Aucun | OK |
| `platforms/mym/terms-of-service.md` | Aucun | OK |
| `platforms/instagram/terms-of-service.md` | Aucun | OK |

### Laws

| Fichier | Verbatim détecté | Statut |
|---------|-----------------|--------|
| `laws/france/code-civil-contrats.md` | Citations d'articles (domaine public) | OK — les textes de loi ne sont pas protégés par le droit d'auteur |
| `laws/france/code-consommation.md` | Citations d'articles (domaine public) | OK |
| `laws/france/code-propriete-intellectuelle.md` | Citations d'articles (domaine public) | OK |
| `laws/eu/rgpd-extraits.md` | Citations d'articles (domaine public) + reformulation | OK |
| `laws/eu/digital-services-act.md` | Synthèse originale | OK |
| `laws/uk/online-safety-bill.md` | Synthèse originale | OK |
| `laws/us/take-it-down-act-2026.md` | Synthèse originale | OK |

### Industry / Contracts / Jurisprudence

| Fichier | Verbatim détecté | Statut |
|---------|-----------------|--------|
| `industry/agency-practices-report.md` | Aucun — rapport original | OK |
| `industry/commission-rates-benchmark.md` | Aucun — données benchmark Halo | OK |
| `industry/creator-rights-guide.md` | Aucun — guide original | OK |
| `contracts/clauses-abusives-catalogue.md` | Aucun — analyse originale | OK |
| `contracts/comparaison-contrats-agences.md` | Aucun — benchmark Halo | OK |
| `contracts/contrat-type-halo-talent.md` | Aucun — document Halo original | OK |
| `jurisprudence/*.md` | Aucun — résumés journalistiques reformulés | OK |

## Note sur les textes de loi

Les articles de loi (Code civil, Code de la consommation, Code de la Propriété Intellectuelle, RGPD) sont cités avec leur numéro d'article et un extrait court. Les textes officiels ne sont pas protégés par le droit d'auteur (domaine public). Les commentaires et sections "Application :" sont des créations originales Halo Talent.

## Garde-fou technique

Un helper `lib/legal/no-verbatim.ts` a été ajouté. Il calcule la similarité entre un texte produit et une source originale. Si le seuil de similarité est dépassé (>35%), la publication est bloquée. Ce helper est utilisé dans :
- Le flux de génération des `legal_change_events` (cron)
- La mise à jour de `legal_knowledge` (cron)
- Toute insertion manuelle via le dashboard

## Recommandation

Maintenir cette vérification dans la review des PR qui modifient `knowledge/`. Ne JAMAIS copier-coller des CGU. Toujours reformuler, synthétiser, et citer la source sans la reproduire textuellement.
