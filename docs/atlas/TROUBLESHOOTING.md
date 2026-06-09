# Dépannage Atlas

Ce document liste les problèmes courants rencontrés dans Atlas et leurs solutions.

---

## Table des matières

1. [Les campagnes ne s'envoient pas](#les-campagnes-ne-senvoient-pas)
2. [Les règles ne se déclenchent pas](#les-règles-ne-se-déclenchent-pas)
3. [Le webhook retourne une erreur 401](#le-webhook-retourne-une-erreur-401)
4. [Les analytics n'affichent aucune donnée](#les-analytics-naffichent-aucune-donnée)
5. [Le score de conformité est bas](#le-score-de-conformité-est-bas)
6. [Autres problèmes courants](#autres-problèmes-courants)
7. [Contact support](#contact-support)

---

## Les campagnes ne s'envoient pas

### Symptôme

Vous créez une campagne, la planifiez, mais elle n'est jamais envoyée ou reste bloquée à l'état "Brouillon" / "En attente".

### Causes possibles et solutions

#### 1. Problème DKIM / SPF (emails)

Le fournisseur d'email rejette les envois car les enregistrements DNS ne sont pas configurés.

- **Solution** : Vérifiez que les enregistrements DKIM, SPF et DMARC sont correctement configurés pour votre domaine d'envoi.
- **Comment vérifier** : Utilisez un outil comme MXToolbox pour tester vos enregistrements DNS.
- **Dans Atlas** : Allez dans **Paramètres &gt; Configuration email &gt; Diagnostics DNS** pour exécuter un test automatisé.

#### 2. Limites de taux atteintes (rate limiting)

Le fan destinataire a déjà reçu le nombre maximum de communications autorisé pour la période.

- **Solution** : Les campagnes seront automatiquement envoyées dès que la fenêtre de rate limiting sera réinitialisée (généralement 24 h).
- **Solution alternative** : Augmentez les limites dans **Paramètres &gt; Conformité &gt; Limites de taux** (attention aux implications légales — voir [COMPLIANCE.md](./COMPLIANCE.md)).

#### 3. Crédits insuffisants

Votre abonnement Atlas n'inclut pas assez de crédits pour le canal utilisé.

- **Solution** : Vérifiez votre solde de crédits dans **Paramètres &gt; Abonnement &gt; Crédits**.
- **Solution alternative** : Passez à un forfait supérieur ou achetez un pack de crédits supplémentaire.

#### 4. Campagne en mode brouillon

La campagne n'a pas été validée avant la date d'envoi.

- **Solution** : Vérifiez le statut de la campagne dans **Campagnes &gt; Toutes les campagnes**. Si le statut est "Brouillon", passez-le en "Actif" ou "Planifié".

#### 5. Échec de validation de conformité

La campagne contient du contenu ou des paramètres qui violent les règles de conformité.

- **Solution** : Consultez le **Centre de conformité** qui liste les problèmes détectés. Corrigez chaque point et relancez la validation.

---

## Les règles ne se déclenchent pas

### Symptôme

Vous avez configuré une règle d'automatisation mais elle ne semble jamais s'exécuter.

### Causes possibles et solutions

#### 1. La règle n'est pas active

- **Solution** : Vérifiez que l'interrupteur de la règle est en position "Actif" (vert) dans **Règles &gt; Liste des règles**.

#### 2. Les conditions ne sont pas remplies

- **Solution** : Vérifiez les conditions définies dans la règle :
  - Les tags correspondent-ils à ceux du fan ?
  - Le montant minimum est-il atteint ?
  - La plateforme est-elle correctement spécifiée ?
- **Astuce** : Utilisez l'outil de simulation dans **Règles &gt; Tester** pour vérifier si un fan spécifique déclencherait la règle.

#### 3. Limite de taux atteinte pour cette règle

Chaque règle peut avoir une limite d'exécution (ex. : max 1 fois par fan).

- **Solution** : Consultez l'historique de la règle dans **Règles &gt; Historique d'exécution**. Si la règle apparaît comme "Limitée", la limite a été atteinte.
- **Solution alternative** : Augmentez ou supprimez la limite dans les paramètres de la règle.

#### 4. Le déclencheur nécessite un webhook entrant

Si la règle utilise un webhook (ex. Stripe, TikTok) et que le webhook n'est pas configuré, la règle ne se déclenchera jamais.

- **Solution** : Vérifiez dans **Paramètres &gt; Intégrations** que le webhook concerné est bien configuré et actif.
- **Test** : Envoyez un événement de test depuis le service tiers ou utilisez l'outil de test intégré dans Atlas.

#### 5. Incohérence de fuseau horaire

Les règles planifiées (ex. "si inactif depuis 30 jours") utilisent le fuseau horaire UTC par défaut.

- **Solution** : Vérifiez le fuseau horaire configuré dans **Paramètres &gt; Général &gt; Fuseau horaire**.

---

## Le webhook retourne une erreur 401

### Symptôme

Vous recevez une erreur HTTP 401 lorsque vous tentez d'appeler un endpoint webhook Atlas.

### Causes possibles et solutions

#### 1. Clé API invalide

- **Solution** : Vérifiez que la clé API dans l'URL est correcte.
- **Où trouver la clé** : **Paramètres &gt; Intégrations &gt; Clés API**.
- **Attention** : Les clés API sont sensibles à la casse.

#### 2. Clé API expirée

- **Solution** : Les clés API peuvent avoir une date d'expiration. Générez une nouvelle clé si nécessaire.
- **Vérification** : La liste des clés API affiche leur date d'expiration.

#### 3. Signature HMAC manquante ou incorrecte

- **Solution** : Vérifiez que l'en-tête `X-Atlas-Signature` est présent et correctement généré.
- **Re-génération** : Utilisez la clé secrète pour recalculer la signature HMAC-SHA256 du corps de la requête.

#### 4. Adresse IP non autorisée

- **Solution** : Ajoutez l'adresse IP de votre service à la liste blanche dans **Paramètres &gt; Intégrations &gt; IP autorisées**.

---

## Les analytics n'affichent aucune donnée

### Symptôme

Les tableaux de bord Analytics (évolution de l'audience, engagement, etc.) sont vides ou affichent "Aucune donnée".

### Causes possibles et solutions

#### 1. Pas assez de données historiques

Atlas nécessite un minimum de 24 heures de données pour commencer à afficher des analytics significatifs.

- **Solution** : Attendez au moins 24 heures après la première connexion de vos plateformes ou l'import de vos fans.
- **Note** : Pour des tendances fiables, un minimum de 7 jours de données est recommandé.

#### 2. Aucune plateforme connectée

Les analytics se basent sur les données importées depuis vos plateformes connectées.

- **Solution** : Vérifiez que vos plateformes (OnlyFans, TikTok, etc.) sont bien connectées dans **Paramètres &gt; Intégrations**.

#### 3. Filtres trop restrictifs

Les filtres appliqués au tableau de bord peuvent exclure toutes les données.

- **Solution** : Réinitialisez les filtres en cliquant sur **Réinitialiser** en haut du tableau de bord.

#### 4. Période sélectionnée sans données

- **Solution** : Étendez la période d'affichage (ex. "30 derniers jours" au lieu de "Aujourd'hui").

#### 5. Données non encore traitées

Les données des plateformes sont importées périodiquement (toutes les 15 à 60 minutes selon la plateforme).

- **Solution** : Attendez le prochain cycle d'importation (généralement sous 15 minutes).

---

## Le score de conformité est bas

### Symptôme

Le **Centre de conformité** affiche un score faible (en dessous de 70 %).

### Causes possibles et solutions

Le score de conformité est calculé à partir de plusieurs sections. Vérifiez chacune d'elles :

| Section                     | Cause du score bas                          | Solution                                         |
|-----------------------------|---------------------------------------------|--------------------------------------------------|
| Consentement                | Absence de preuve de consentement           | Activez le recueil explicite de consentement    |
| Désabonnement               | Lien de désabonnement manquant              | Vérifiez que les templates incluent le lien auto |
| DKIM / SPF                  | Enregistrements DNS non configurés          | Configurez DKIM, SPF et DMARC                   |
| Rétention données           | Pas de politique de nettoyage configurée    | Configurez la purge automatique à 25 mois       |
| Limites de taux             | Limites trop élevées                        | Réduisez les limites dans les paramètres        |
| Contenu des campagnes       | Mots-clés ou liens suspects détectés        | Modifiez le contenu des campagnes               |
| DPA                         | DPA non signé (RGPD)                        | Signez le DPA dans Paramètres &gt; Conformité   |

### Procédure recommandée

1. Ouvrez le **Centre de conformité** depuis le menu latéral.
2. Examinez chaque section marquée en rouge ou orange.
3. Cliquez sur chaque section pour voir le détail des problèmes.
4. Suivez les instructions correctives fournies.
5. Revalidez le score après chaque correction (le score se met à jour sous 5 minutes).

---

## Autres problèmes courants

### L'import CSV échoue

- **Cause** : Format de fichier incorrect ou colonnes manquantes.
- **Solution** : Téléchargez le template CSV depuis **Fans &gt; Importer &gt; Télécharger le template**. Assurez-vous que votre fichier respecte exactement ce format.

### Les tags ne s'appliquent pas

- **Cause** : La règle qui applique le tag n'est pas active, ou une condition n'est pas remplie.
- **Solution** : Utilisez l'outil de simulation dans **Règles &gt; Tester**.

### Impossible de connecter une plateforme

- **Cause** : Token d'accès expiré ou permissions insuffisantes.
- **Solution** : Déconnectez et reconnectez la plateforme dans **Paramètres &gt; Intégrations**. Assurez-vous d'autoriser toutes les permissions demandées.

### Les notifications ne s'affichent pas

- **Cause** : Les notifications sont désactivées dans le navigateur ou dans Atlas.
- **Solution** : Vérifiez les paramètres de notification dans **Paramètres &gt; Préférences &gt; Notifications** et autorisez les notifications dans votre navigateur.

---

## Contact support

Si votre problème persiste après avoir suivi les étapes ci-dessus :

| Canal       | Détails                                      |
|-------------|----------------------------------------------|
| Email       | support@halotalent.com                       |
| Centre d'aide | https://aide.halotalent.com                 |
| Chat in-app | Disponible depuis le menu **Aide &gt; Chat** |
| Temps de réponse moyen | 2 heures ouvrées                     |

**Avant de contacter le support, munissez-vous de :**

1. Votre identifiant de compte Halo Talent.
2. Une description claire du problème.
3. Les étapes déjà suivies pour le résoudre.
4. Une capture d'écran ou le message d'erreur exact (si applicable).
