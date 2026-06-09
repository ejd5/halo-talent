# Atlas — Gestionnaire de Relation Fans

> Atlas est le module de gestion de la relation fan (FRM) de Halo Talent. Il permet aux créateurs et à leurs équipes d'automatiser les interactions, de segmenter leur audience et de piloter des campagnes personnalisées — le tout depuis une interface unique.

---

## Table des matières

- [Qu'est-ce qu'Atlas ?](#quest-ce-quatlas-)
- [Guide de démarrage rapide](#guide-de-démarrage-rapide)
- [Architecture](#architecture)
- [Fonctionnalités clés](#fonctionnalités-clés)
- [Stack technique](#stack-technique)
- [Liens utiles](#liens-utiles)

---

## Qu'est-ce qu'Atlas ?

Atlas est un **Fan Relationship Manager (FRM)** conçu pour les créateurs de contenu sur les plateformes sociales et de monetisation (OnlyFans, TikTok, Instagram, YouTube, etc.). Il centralise l'ensemble des interactions fans dans un tableau de bord unique et propose des outils avancés de :

- **Gestion des fans** : segmentation dynamique, scoring, historique complet.
- **Campagnes multicanal** : email, SMS, DM sociaux, notifications push.
- **Automatisation par règles** : moteur de règles conditionnelles (si X, alors Y).
- **Entonnoirs de conversion (funnels)** : séquences multi-étapes pilotées par le comportement fan.
- **Analytics** : rapports temps réel sur l'engagement, la rétention et le ROI.
- **Conformité légale** : centre de conformité RGPD, CAN-SPAM, conditions des plateformes.

---

## Guide de démarrage rapide

### 1. Accéder au module Atlas

Depuis le panneau d'administration, cliquez sur **Atlas** dans la navigation latérale.

### 2. Connecter vos plateformes

Rendez-vous dans **Paramètres > Intégrations** pour connecter vos comptes OnlyFans, TikTok, Instagram, YouTube, Stripe, etc.

### 3. Importer vos fans

Atlas importe automatiquement vos abonnés et interactions via les API des plateformes connectées. Vous pouvez également importer un fichier CSV depuis **Fans > Importer**.

### 4. Créer votre première campagne

Allez dans **Campagnes > Nouvelle campagne**, choisissez un canal (email, SMS, DM), rédigez votre message et sélectionnez votre audience cible.

### 5. Configurer une règle d'automatisation

Dans **Règles > Nouvelle règle**, définissez un déclencheur (ex. : nouveau fan, achat effectué) et une ou plusieurs actions (ex. : envoyer un email, ajouter un tag).

### 6. Analyser les résultats

Le tableau de bord **Analytics** vous montre l'évolution de votre audience, les taux d'engagement et la performance de chaque campagne.

---

## Architecture

```
                    ┌─────────────────────────────────┐
                    │      Application Next.js 16      │
                    │  (App Router, Server Components) │
                    └──────────┬──────────────────────┘
                               │
                    ┌──────────▼──────────────────────┐
                    │        API Route Handlers        │
                    │   /api/atlas/*                   │
                    └──────────┬──────────────────────┘
                               │
                    ┌──────────▼──────────────────────┐
                    │          Supabase                │
                    │  • PostgreSQL (données fans)     │
                    │  • Realtime (notifications)      │
                    │  • Storage (fichiers, médias)    │
                    │  • Auth (authentification)       │
                    └─────────────────────────────────┘
```

### Flux de données

1. **Frontend** — L'interface utilisateur Next.js 16 communique avec les API Routes via fetch.
2. **API Routes** — Les handlers valident les requêtes, appliquent les règles métier et interagissent avec Supabase.
3. **Supabase** — La base de données PostgreSQL stocke toutes les données (fans, campagnes, règles, événements).
4. **Services externes** — Les webhooks entrants et sortants connectent Atlas aux plateformes sociales, Stripe, etc.

---

## Fonctionnalités clés

### CRM Fans
- Profil fan complet avec historique des interactions
- Segmentation dynamique par tags, score, activité
- Scoring automatique basé sur l'engagement et les achats
- Vue 360° : emails, SMS, DMs, achats, commentaires

### Campagnes
- Multicanal : email, SMS, DM sociaux, notifications in-app
- Templates personnalisables avec éditeur visuel
- Planification et envoi différé
- Tests A/B sur l'objet, le contenu et le canal
- Statistiques : taux d'ouverture, clic, conversion, désabonnement

### Entonnoirs (Funnels)
- Séquences multi-étapes avec conditions de passage
- Déclencheurs : inscription, achat, clic, inactivité
- Branchements conditionnels (si A, alors étape B ; sinon étape C)
- Rapports de conversion par étape

### Moteur de Règles
- Déclencheurs : fan créé, tag ajouté, achat effectué, commentaire reçu, inactivité
- Conditions : âge du fan, montant dépensé, tags, plateforme, score
- Actions : envoyer email/SMS/DM, ajter un tag, notifier le créateur, webhook
- Limites de taux configurables (rate limiting)
- Historique d'exécution complet

### Analytics
- Évolution de l'audience (nouveaux vs. perdus)
- Engagement par canal et par campagne
- Rétention et taux de churn
- Valeur vie client (LTV)
- Rapports exportables (CSV, PDF)

### Conformité
- Centre de conformité RGPD / CAN-SPAM
- Gestion du consentement (opt-in/opt-out)
- Politiques de rétention des données (25 mois max)
- Validation des campagnes avant envoi
- Journal d'audit

---

## Stack technique

| Technologie  | Usage                                      |
|-------------|--------------------------------------------|
| Next.js 16  | Framework frontend et backend (App Router) |
| Supabase    | Base de données PostgreSQL, Auth, Storage  |
| Recharts    | Visualisation de données (graphiques)      |
| Driver.js   | Visites guidées et onboarding interactif   |

---

## Liens utiles

| Document               | Description                                      |
|------------------------|--------------------------------------------------|
| [WORKFLOWS.md](./WORKFLOWS.md) | Cas d'usage courants et automatisations     |
| [COMPLIANCE.md](./COMPLIANCE.md) | Règles légales par juridiction            |
| [API.md](./API.md)             | Webhooks et intégrations techniques       |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Résolution des problèmes courants |
