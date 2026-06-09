# API Atlas — Webhooks et intégrations

Atlas expose une API de webhooks pour l'intégration avec les plateformes sociales, les services de paiement (Stripe) et tout système tiers. Les webhooks permettent de recevoir des événements en temps réel et de déclencher des règles d'automatisation.

---

## Table des matières

1. [Webhooks entrants](#webhooks-entrants)
2. [Authentification](#authentification)
3. [Webhooks sortants](#webhooks-sortants)
4. [Format des événements](#format-des-événements)
5. [Limites de taux (Rate Limiting)](#limites-de-taux-rate-limiting)
6. [Gestion des erreurs](#gestion-des-erreurs)

---

## Webhooks entrants

Les webhooks entrants permettent à des services externes d'envoyer des événements à Atlas.

### Endpoint

```
POST /api/atlas/webhooks/[apiKey]/[hookName]
```

### Paramètres

| Paramètre  | Type   | Description                                               |
|------------|--------|-----------------------------------------------------------|
| `apiKey`   | string | Clé d'API unique générée dans **Paramètres &gt; Intégrations** |
| `hookName` | string | Identifiant du webhook (ex. `stripe`, `tiktok`, `custom`)  |

### Corps de la requête

Le corps doit être au format JSON. La structure minimale attendue est :

```json
{
  "event": "nom.de.evenement",
  "data": {
    "fan_id": "string (optionnel)",
    "plateforme": "string (optionnel)",
    ...
  },
  "timestamp": "2026-06-09T12:00:00.000Z"
}
```

### Exemple avec Stripe

```bash
curl -X POST https://votre-domaine.com/api/atlas/webhooks/cle_api_123/stripe \
  -H "Content-Type: application/json" \
  -d '{
    "event": "charge.succeeded",
    "data": {
      "fan_id": "fan_abc123",
      "montant": 29.99,
      "devise": "usd",
      "produit": "abonnement_mensuel"
    },
    "timestamp": "2026-06-09T12:00:00.000Z"
  }'
```

### Webhooks supportés nativement

| HookName     | Services compatibles              |
|-------------|-----------------------------------|
| `stripe`    | Stripe (charges, abonnements)     |
| `tiktok`    | TikTok (commentaires, messages)   |
| `instagram` | Instagram / Facebook (commentaires, DMs) |
| `youtube`   | YouTube (commentaires, abonnements) |
| `onlyfans`  | OnlyFans (abonnements, messages)  |
| `custom`    | Tout service tiers                |

---

## Authentification

### Clés d'API

Chaque webhook est sécurisé par une clé d'API unique. Les clés sont générées dans **Paramètres &gt; Intégrations &gt; Clés API**.

| Type de clé | Usage                           |
|-------------|---------------------------------|
| Clé publique | Identification du webhook dans l'URL (visible) |
| Clé secrète  | Signature HMAC des payloads (confidentielle)   |

### Signature HMAC

Atlas vérifie la signature HMAC-SHA256 de chaque requête entrante.

**En-tête attendu :**
```
X-Atlas-Signature: sha256=<signature>
```

**Algorithme de vérification :**
```
signature = HMAC-SHA256(cle_secrete, corps_de_la_requete)
```

### Validation des adresses IP

Atlas accepte uniquement les requêtes provenant d'adresses IP autorisées. Configurez la liste blanche dans **Paramètres &gt; Intégrations &gt; IP autorisées**.

---

## Webhooks sortants

Atlas peut envoyer des événements vers vos propres endpoints lorsque des actions se produisent.

### Configuration

1. Allez dans **Paramètres &gt; Intégrations &gt; Webhooks sortants**.
2. Cliquez sur **Ajouter un endpoint**.
3. Renseignez l'URL de destination et les événements à écouter.

### Paramètres de configuration

| Paramètre         | Description                                      |
|-------------------|--------------------------------------------------|
| URL de destination| L'URL qui recevra les événements (HTTPS requis) |
| Événements        | Liste des événements à transmettre               |
| Secret partagé    | Clé secrète pour signer les payloads             |
| Format            | JSON (par défaut)                                |

### Événements disponibles

| Événement                        | Déclencheur                                     |
|----------------------------------|-------------------------------------------------|
| `fan.created`                    | Nouveau fan importé ou connecté                 |
| `fan.updated`                    | Modification du profil fan                      |
| `fan.deleted`                    | Suppression d'un fan (RGPD)                     |
| `fan.tag.added`                  | Ajout d'un tag à un fan                         |
| `fan.tag.removed`                | Retrait d'un tag d'un fan                       |
| `fan.purchase.completed`         | Achat confirmé                                  |
| `campaign.sent`                  | Campagne envoyée                                |
| `campaign.opened`                | Email ouvert                                    |
| `campaign.clicked`               | Lien cliqué dans une campagne                   |
| `campaign.unsubscribed`          | Fan désabonné                                   |
| `rule.triggered`                 | Règle d'automatisation déclenchée               |
| `rule.executed`                  | Action de règle exécutée                        |

### Exemple de payload sortant

```json
{
  "id": "evt_9f8e7d6c5b4a",
  "event": "fan.purchase.completed",
  "data": {
    "fan": {
      "id": "fan_abc123",
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "tags": ["vip", "abonne"]
    },
    "purchase": {
      "montant": 49.99,
      "devise": "eur",
      "produit": "abonnement_premium"
    }
  },
  "timestamp": "2026-06-09T12:00:00.000Z",
  "signature": "sha256=..."
}
```

---

## Format des événements

Tous les événements (entrants et sortants) suivent un format standardisé.

### Structure générale

```json
{
  "id": "evt_<identifiant_unique_24_caracteres>",
  "event": "<categorie>.<action>",
  "data": {
    ...
  },
  "timestamp": "<ISO 8601>",
  "signature": "sha256=<signature_hmac>"
}
```

| Champ       | Type   | Description                                    |
|-------------|--------|------------------------------------------------|
| `id`        | string | Identifiant unique de l'événement              |
| `event`     | string | Nom de l'événement (ex. `fan.created`)         |
| `data`      | object | Payload spécifique à l'événement               |
| `timestamp` | string | Date et heure au format ISO 8601 (UTC)         |
| `signature` | string | Signature HMAC-SHA256 (webhooks sortants seulement) |

---

## Limites de taux (Rate Limiting)

### Webhooks entrants

| Limite                    | Valeur                  |
|---------------------------|-------------------------|
| Requêtes par seconde      | 10 req/s par clé API    |
| Requêtes par minute       | 600 req/min par clé API |
| Taille maximale du corps  | 256 KB                  |

En cas de dépassement, Atlas répond avec le statut HTTP `429 Too Many Requests`.

### Webhooks sortants

| Limite                          | Valeur                    |
|---------------------------------|---------------------------|
| Tentatives d'envoi par événement| 3 tentatives max          |
| Délai entre les tentatives      | exponentiel (5s, 30s, 5min) |
| Timeout par requête             | 10 secondes               |

### En-têtes de rate limiting

Atlas retourne les en-têtes suivants pour chaque requête :

```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 599
X-RateLimit-Reset: 1623234567
Retry-After: 45
```

---

## Gestion des erreurs

### Codes HTTP

| Code | Signification                    | Action recommandée                            |
|------|----------------------------------|-----------------------------------------------|
| 200  | Succès                           | —                                             |
| 400  | Requête malformée                | Vérifiez le format JSON et les champs requis  |
| 401  | Non authentifié                  | Vérifiez la clé API et la signature HMAC      |
| 403  | Non autorisé                     | Vérifiez les permissions de la clé API        |
| 404  | Webhook introuvable              | Vérifiez le nom du webhook                    |
| 409  | Conflit (événement dupliqué)     | L'événement a déjà été traité                 |
| 429  | Trop de requêtes                 | Attendez et réessayez (voir en-tête Retry-After) |
| 500  | Erreur interne                   | Contactez le support                          |

### Format d'erreur

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "La clé API fournie est invalide ou a expiré.",
    "details": {
      "key": "cle_api_xxx",
      "reason": "expired"
    },
    "requestId": "req_abc123"
  }
}
```

### Réessai automatique

En cas d'échec de livraison d'un webhook sortant :

1. **Première tentative** : immédiate.
2. **Deuxième tentative** : après 5 secondes.
3. **Troisième tentative** : après 30 secondes.
4. **Dernière tentative** : après 5 minutes.

Si toutes les tentatives échouent, l'événement est marqué comme `failed` et consultable dans le journal des webhooks.
