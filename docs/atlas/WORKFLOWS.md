# Workflows Atlas — Cas d'usage courants

Ce document décrit les automatisations les plus courantes configurées dans Atlas. Chaque workflow suit le schéma **Déclencheur &rarr; Conditions &rarr; Actions**.

---

## Table des matières

1. [Accueil d'un nouveau fan](#1-accueil-dun-nouveau-fan)
2. [Fan VIP atteint 1 000 $](#2-fan-vip-atteint-1-000-)
3. [Fan inactif depuis 30 jours](#3-fan-inactif-depuis-30-jours)
4. [Achat Stripe déclenche un entonnoir](#4-achat-stripe-déclenche-un-entonnoir)
5. [Commentaire reçu envoie un DM automatique](#5-commentaire-reçu-envoie-un-dm-automatique)

---

## 1. Accueil d'un nouveau fan

**Objectif** : Envoyer une séquence de bienvenue automatique lorsqu'un nouveau fan s'abonne.

### Déclencheur
- `fan.created` — Un nouveau fan est importé ou connecté.

### Conditions
- Aucune (s'applique à tous les nouveaux fans).

### Actions

| Ordre | Action                              | Délai      |
|-------|-------------------------------------|------------|
| 1     | Envoyer un email de bienvenue       | Immédiat   |
| 2     | Ajouter le tag `nouveau_fan`        | Immédiat   |
| 3     | Envoyer un DM de bienvenue (plateforme sociale) | +1 heure  |
| 4     | Envoyer un SMS de bienvenue         | +24 heures |
| 5     | Ajouter le tag `bienvenue_terminee` | +48 heures |

### Configuration dans Atlas
1. Allez dans **Règles &gt; Nouvelle règle**.
2. Déclencheur : `fan.created`.
3. Conditions : laissez vide.
4. Actions : ajoutez les actions dans l'ordre ci-dessus.
5. Activez la règle.

---

## 2. Fan VIP atteint 1 000 $

**Objectif** : Identifier automatiquement les fans à forte valeur ajoutée et notifier le créateur.

### Déclencheur
- `fan.purchase.completed` — Un achat est confirmé.

### Conditions
- `total_depense >= 1000` (le fan a dépensé 1 000 $ ou plus au total)
- `tag_ne_contient_pas(vip)` (le fan n'est pas déjà tagué VIP)

### Actions

| Ordre | Action                              | Délai      |
|-------|-------------------------------------|------------|
| 1     | Ajouter le tag `vip`                | Immédiat   |
| 2     | Ajouter le tag `depassement_1000`   | Immédiat   |
| 3     | Envoyer une notification au créateur (email + in-app) | Immédiat |
| 4     | Envoyer un email de remerciement personnalisé | Immédiat |
| 5     | Envoyer un DM exclusif avec offre spéciale | +1 heure  |

### Configuration dans Atlas
1. Allez dans **Règles &gt; Nouvelle règle**.
2. Déclencheur : `fan.purchase.completed`.
3. Conditions : `total_depense >= 1000` et `tag_ne_contient_pas(vip)`.
4. Actions : ajoutez les actions ci-dessus.
5. Activez la règle.

---

## 3. Fan inactif depuis 30 jours

**Objectif** : Réengager automatiquement les fans qui n'ont eu aucune interaction depuis 30 jours.

### Déclencheur
- `fan.inactivity` — Vérification quotidienne des fans inactifs.

### Conditions
- `inactif_depuis >= 30 jours`
- `tag_ne_contient_pas(desabonne)`
- `opt_out_sms == false`

### Actions

| Ordre | Action                              | Délai      |
|-------|-------------------------------------|------------|
| 1     | Ajouter le tag `reengagement`       | Immédiat   |
| 2     | Envoyer un SMS de réengagement      | Immédiat   |
| 3     | Ajouter une note au profil fan      | Immédiat   |
| 4     | Si toujours inactif à J+7 : envoyer un email | +7 jours  |
| 5     | Si toujours inactif à J+14 : ajouter le tag `a_perte` | +14 jours |

### Configuration dans Atlas
1. Allez dans **Règles &gt; Nouvelle règle**.
2. Déclencheur : `fan.inactivity`.
3. Conditions : `inactif_depuis >= 30 jours`.
4. Actions : ajoutez les actions ci-dessus.
5. Activez la règle.

---

## 4. Achat Stripe déclenche un entonnoir

**Objectif** : Lancer un entonnoir de conversion multi-étapes après un achat via Stripe.

### Déclencheur
- `webhook.stripe.charge.succeeded` — Webhook entrant Stripe.

### Conditions
- `montant >= 10` (achat d'au moins 10 $)
- `produit_type == "abonnement"` ou `produit_type == "pay_per_view"`

### Actions
Démarrer l'entonnoir **`apres_achat`** avec les étapes suivantes :

| Étape | Action                              | Délai      | Condition               |
|-------|-------------------------------------|------------|-------------------------|
| 1     | Email de confirmation d'achat       | Immédiat   | —                       |
| 2     | DM de remerciement                  | +2 heures  | —                       |
| 3     | Proposition de contenu exclusif     | +24 heures | tag_contient(`abonne`)  |
| 4     | Demande d'avis / témoignage         | +72 heures | tag_contient(`vip`)     |
| 5     | Offre de renouvellement anticipé    | J-7 avant expiration | abonnement annuel |

### Configuration dans Atlas
1. Allez dans **Entonnoirs &gt; Nouvel entonnoir**.
2. Créez l'entonnoir `apres_achat` avec les étapes ci-dessus.
3. Allez dans **Règles &gt; Nouvelle règle**.
4. Déclencheur : `webhook.stripe.charge.succeeded`.
5. Action : `Démarrer un entonnoir` &rarr; sélectionnez `apres_achat`.
6. Activez la règle.

---

## 5. Commentaire reçu envoie un DM automatique

**Objectif** : Répondre automatiquement aux commentaires laissés par les fans sur les publications.

### Déclencheur
- `webhook.{plateforme}.comment.created` — Nouveau commentaire sur une publication.

### Conditions
- `commentaire_contient_mots_cles("merci", "super", "bravo", "question")` (optionnel : filtrer par mots-clés)
- `fan_actif == true`

### Actions

| Ordre | Action                              | Délai      |
|-------|-------------------------------------|------------|
| 1     | Analyser le sentiment du commentaire (positif / négatif / neutre) | Immédiat |
| 2     | Si positif : envoyer un DM de remerciement | Immédiat |
| 3     | Si question : envoyer un DM avec lien FAQ | Immédiat |
| 4     | Logger l'interaction dans l'historique fan | Immédiat |

### Configuration dans Atlas
1. Allez dans **Règles &gt; Nouvelle règle**.
2. Déclencheur : sélectionnez le webhook de la plateforme concernée.
3. Conditions : ajoutez des filtres de mots-clés si souhaité.
4. Actions : `Envoyer un DM` avec un template adapté au sentiment détecté.
5. Activez la règle.

---

## Bonnes pratiques

- **Limites de taux** : Configurez des limites pour éviter de submerger un fan (ex. : max 2 emails par jour, 1 SMS par semaine).
- **Tests** : Utilisez le mode brouillon pour tester vos règles avant activation.
- **Journal** : Consultez le journal d'exécution dans **Règles &gt; Historique** pour vérifier le bon fonctionnement.
- **Optimisation** : Analysez les taux de conversion de chaque étape dans **Analytics &gt; Entonnoirs**.
