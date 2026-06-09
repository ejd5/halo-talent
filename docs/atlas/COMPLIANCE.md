# Conformité légale — Atlas

Ce document détaille les règles de conformité applicables par juridiction et par plateforme. Le non-respect de ces règles peut entraîner des sanctions légales, la suspension des comptes plateformes ou l'exclusion du programme Halo Talent.

---

## Table des matières

1. [RGPD (Europe)](#rgpd-europe)
2. [CAN-SPAM (États-Unis)](#can-spam-états-unis)
3. [Lois anti-spam](#lois-anti-spam)
4. [Conformité aux conditions d'utilisation des plateformes](#conformité-aux-conditions-dutilisation-des-plateformes)
5. [Limites de taux par plateforme](#limites-de-taux-par-plateforme)
6. [Garantie zéro bannissement](#garantie-zéro-bannissement)

---

## RGPD (Europe)

Le Règlement Général sur la Protection des Données (RGPD) s'applique à tout traitement de données personnelles de résidents européens, indépendamment de l'emplacement du créateur.

### Consentement

- **Obligation de recueil explicite** : Vous devez obtenir le consentement explicite du fan avant tout envoi de communication marketing. Le consentement implicite (case pré-cochée) n'est pas valide.
- **Preuve de consentement** : Atlas conserve un horodatage de chaque consentement avec l'identifiant de la campagne ou du formulaire concerné.
- **Droit de retrait** : Le fan doit pouvoir retirer son consentement à tout moment via un lien de désabonnement présent dans chaque communication.

### Droit d'accès et de portabilité

- Chaque fan peut demander l'accès à l'ensemble des données détenues sur lui.
- Les données doivent être fournies dans un format lisible et portable (JSON, CSV) sous 30 jours maximum.
- Utilisez la fonction **Fans &gt; Exporter** d'Atlas pour répondre à ces demandes.

### Droit à l'effacement ("droit à l'oubli")

- Une demande de suppression doit être traitée sous 30 jours.
- Atlas supprime alors l'ensemble des données personnelles du fan (profil, historique, interactions).
- Les données anonymisées (analytics agrégés) peuvent être conservées.

### Rétention des données

| Type de donnée               | Durée maximale de conservation |
|------------------------------|-------------------------------|
| Données de profil fan        | 25 mois après dernière activité |
| Historique d'interactions    | 25 mois                       |
| Données de paiement          | Durée légale comptable (10 ans en France) |
| Logs de consentement         | 3 ans après le retrait du consentement |
| Données anonymisées          | Durée illimitée                |

### DPA (Data Processing Agreement)

- Si vous traitez des données de fans européens, vous devez signer un DPA avec Halo Talent.
- Le DPA est disponible dans **Paramètres &gt; Conformité &gt; DPA**.
- La signature électronique est acceptée.

### Notifications de violation

- Toute violation de données doit être notifiée aux autorités compétentes sous 72 heures.
- Les fans concernés doivent être informés sans délai excessif si la violation présente un risque pour leurs droits et libertés.
- Atlas envoie une notification automatique à l'équipe conformité en cas d'incident détecté.

---

## CAN-SPAM (États-Unis)

La loi CAN-SPAM s'applique à tout message électronique commercial envoyé depuis ou vers les États-Unis.

### Exigences obligatoires

| Exigence                              | Implémentation dans Atlas                          |
|---------------------------------------|---------------------------------------------------|
| Lien de désabonnement visible         | Auto-inclus dans tous les emails commerciaux      |
| Traitement du désabonnement sous 10 jours ouvrés | Traité en temps réel                       |
| Objet non trompeur                    | Validation automatique à la création de campagne  |
| En-têtes "From/To/Reply-To" non trompeurs | Bloqués à l'envoi si détection d'anomalie    |
| Adresse physique du créateur          | Champ obligatoire dans Paramètres &gt; Profil    |

### Sanctions

- Chaque infraction à CAN-SPAM peut entraîner une amende allant jusqu'à **43 792 $** (2024).
- Les violations répétées peuvent entraîner la suspension du compte Atlas.

---

## Lois anti-spam

### Rate limiting (limites de débit)

Atlas applique des limites de taux configurables pour chaque canal :

| Canal | Limite par défaut       | Maximum configurable |
|-------|------------------------|----------------------|
| Email | 5 par jour par fan     | 10 par jour          |
| SMS   | 2 par semaine par fan  | 4 par semaine        |
| DM    | 3 par jour par fan     | 6 par jour           |

### Contenu interdit

Atlas vérifie automatiquement le contenu des campagnes pour détecter :

- Mots-clés typiques du spam (gratuit, gagnant, cliquez ici, etc.)
- Utilisation excessive de majuscules
- Liens suspects ou raccourcis non autorisés
- Pièces jointes non autorisées

### Sanctions en cas de non-respect

- **1er avertissement** : désactivation temporaire des campagnes (48 h).
- **2e avertissement** : désactivation des campagnes (7 jours) + audit obligatoire.
- **3e avertissement** : suspension définitive du module Atlas.

---

## Conformité aux conditions d'utilisation des plateformes

### OnlyFans

- **Interdiction stricte** : toute automation qui imite le comportement d'un humain en temps réel (réponses instantanées, likes automatiques, etc.) est interdite par les CGU d'OnlyFans.
- **Automatisation autorisée** : envoi programmé de messages, segmentation, analytics — à condition que le créateur reste responsable de chaque action.
- Atlas ne contourne pas les limites de taux imposées par OnlyFans.
- **Recommandation** : espacez vos envois d'au moins 30 secondes entre chaque message.

### TikTok

- Limite de **200 DMs par jour** par compte (selon les CGU en vigueur).
- Interdiction d'utiliser des bots pour interagir avec les utilisateurs.
- Les messages automatisés doivent être identifiés comme tels si la plateforme l'exige.

### Meta (Instagram / Facebook)

- Limite de **250 DMs par jour** par compte (seuil de détection).
- Interdiction formelle d'automatiser les interactions (likes, commentaires, follow/unfollow).
- Les templates de messages doivent être approuvés pour l'envoi via l'API Messenger.

### YouTube

- Limite de **50 messages par jour** pour les nouveaux canaux.
- L'API YouTube ne permet pas l'envoi de messages automatisés non sollicités.
- Utilisez les notifications Community pour les communications de masse.

---

## Garantie zéro bannissement

### Conditions générales

Halo Talent propose une **garantie zéro bannissement** sous les conditions suivantes :

1. **Respect des limites de taux** : vous utilisez les limites par défaut configurées dans Atlas.
2. **Respect des CGU plateformes** : vous n'utilisez pas Atlas pour des actions interdites par les plateformes (voir sections ci-dessus).
3. **Respect des lois applicables** : vous respectez le RGPD, CAN-SPAM et les lois anti-spam de votre juridiction.
4. **Utilisation conforme** : vous n'utilisez pas Atlas pour envoyer du contenu illégal, frauduleux, haineux ou pornographique non consenti.

### Exclusions

La garantie ne s'applique pas si :

- Vous modifiez les limites de taux au-delà des recommandations d'Atlas.
- Vous utilisez des scripts ou outils tiers en parallèle d'Atlas pour automatiser des actions interdites.
- Vous enfreignez délibérément les CGU d'une plateforme après avoir été averti par l'équipe Halo Talent.
- Le bannissement est dû à une action manuelle du créateur (hors d'Atlas).

### Procédure en cas de bannissement

1. Contactez le support Halo Talent sous 48 heures via **Support &gt; Signalement**.
2. Fournissez la notification de bannissement reçue de la plateforme.
3. L'équipe conformité analyse les logs Atlas pour déterminer la cause.
4. Si l'utilisation était conforme, Halo Talent vous accompagne dans le processus d'appel auprès de la plateforme.

### Clause de non-responsabilité

Halo Talent ne peut garantir le résultat d'un appel auprès d'une plateforme. La garantie zéro bannissement couvre l'accompagnement et, le cas échéant, le remboursement des frais d'abonnement Atlas de la période concernée, dans la limite des conditions ci-dessus.
