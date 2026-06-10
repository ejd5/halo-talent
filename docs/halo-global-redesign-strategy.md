# Halo Talent — Stratégie de Refonte Globale

> Audit & stratégie réalisés le 10 juin 2026.
> Sources : benchmark concurrentiel public, audit complet du site actuel.
> Aucune donnée privée, aucun login contourné, aucun design copié.

---

## A. Résumé Exécutif

### Ce qui marche déjà

| Atout | Détail |
|-------|--------|
| **Calculateur de commissions** | Transparent, dégressif, mathématiquement honnête. Différenciateur n°1. Aucun concurrent ne le fait. |
| **Bouclier Légal** | Outil gratuit, interactif, fonctionnel. Lead magnet puissant et positionnement éthique crédible. |
| **ADN Créatif (DNA)** | Questionnaire 8 sections unique sur le marché. Personnalise TOUS les agents IA. Barrière concurrentielle haute. |
| **Formulaire Apply** | 5 étapes, validation Zod, sauvegarde localStorage, consentement RGPD. Modèle UX pour le reste du site. |
| **Design system** | Palette terracotta/crème/noir distincte. Typos Syne + Jakarta Sans élégantes. Identité visuelle mémorable. |
| **Dashboards Studio** | Architecture composants propre, KPI rows, grilles responsives, squelette prêt pour les données réelles. |
| **Positionnement éthique** | "Les autres prennent 50%. Nous, on vous demande de grandir." — différenciateur narratif fort. |

### Ce qui nuit à la crédibilité

| Problème | Sévérité | Impact |
|----------|----------|--------|
| **Logos médias fabriqués** (VOGUE, GQ, Le Monde...) | 🔴 Critique | Légalement dangereux, détruit la confiance si découvert |
| **Témoignages fictifs** (Atlas testimonials, SocialProofSection) | 🔴 Critique | Même risque — noms, photos, citations inventés |
| **6 pages placeholder sur 17** (/manifeste, /talents, /commissions, /blog, /contrat-type, /saas) | 🔴 Critique | Dead ends pour les visiteurs curieux |
| **Photos stock Unsplash** pour une agence de talents | 🟠 Élevé | Inauthenticité flagrante — une agence de créateurs sans photos de créateurs |
| **Stats hardcodées invérifiables** (150K+ fans, 2.4M campagnes, 15K+ créateurs) | 🟠 Élevé | Si elles ne sont pas vraies, elles seront découvertes |
| **Page login sans image, sans social login, sans "mot de passe oublié"** | 🟡 Moyen | Friction inutile, look incomplet |
| **"Zéro ban garanti" répété 3 fois** sur la page Atlas | 🟡 Moyen | Dilue l'impact, sonne comme une assurance tous-risques invérifiable |
| **"Remplissage express" visible en production** | 🟡 Moyen | Outil développeur exposé aux utilisateurs |
| **alert() pour les erreurs** dans le DNA onboarding | 🟡 Moyen | UX amateur sur un flux critique |

### Ce qui doit être supprimé (P0 — immédiat)

1. **Logos médias fabriqués** dans `SocialProofSection.tsx` — remplacer par "Partenaires" réels ou supprimer la section
2. **Témoignages fictifs** dans `/atlas/testimonials` — remplacer par "À venir" ou témoignages internes vérifiables
3. **"Zéro ban garanti"** — reformuler en "Protection anti-ban" sans garantie absolue invérifiable
4. **Stats invérifiables** — remplacer par des métriques dynamiques ou par "Lancement prochain"
5. **Bouton "Remplissage express"** — cacher derrière un flag ou supprimer de la production

### Ce qui doit être construit en priorité (P0-P1)

1. **Page `/creators`** avec cas clients réels (même anonymisés)
2. **Page `/pricing`** unifiée (commissions + Studio + Atlas sur une page)
3. **Page `/manifeste`** complète (texte fondateur, valeurs, vision)
4. **Blog** avec 5-10 articles SEO (creator economy, protection juridique, commissions)
5. **Photos/vidéos réelles** de l'équipe, des bureaux, du produit
6. **Page `/security`** (confiance, RGPD, données, encryption)
7. **Page `/talents`** avec roster (même en "coming soon" avec noms réels)

### Ce qui différenciera vraiment Halo

> **"Agence + SaaS + Éthique + Transparence" — personne d'autre ne combine ces quatre piliers.**

- Les agences (TDM, Aruna) font du management humain mais pas de SaaS
- Les CRM (Supercreator, Infloww) font du logiciel mais pas d'accompagnement
- Personne ne publie ses commissions, personne n'a d'ADN IA personnalisé, personne n'a d'outil juridique gratuit
- Personne ne couvre le marché francophone avec un produit premium

---

## B. Benchmark Synthétisé

### Ce que les agences pures font bien

| Pattern | Exemple | Application Halo |
|---------|---------|-----------------|
| Metric stacking en hero | Aruna: "$10M+, 100+ personnes, 60+ lancements" | Afficher des métriques RÉELLES (nb créateurs, revenus générés, contenu produit) |
| FAQ qui préempte chaque objection | Aruna: "Will anyone know?", "Is this a scam?", "Do I need to show my face?" | Créer FAQ avec les vraies peurs des créateurs francophones |
| Formulaire progressif 3 étapes | Aruna: identité → objectifs → photo (optionnel) | Déjà fait dans Apply — étendre le pattern à d'autres flux |
| Garantie conditionnelle | Aruna: "Si pas $20K semaine 1, séparation sans frais" | "Si pas satisfait sous 30 jours, vous partez sans frais et gardez toutes vos données" |
| "Zero identity leaks" comme KPI | Aruna | Suivre et afficher publiquement ce KPI |
| Live dashboard en discovery call | Aruna | Proposer une démo produit en visio, pas juste un slide deck |
| Bureau physique + équipe dédiée | TDM: UK office, open door policy | Photos/vidéos réelles de l'équipe (quand elle existera) |

### Ce que les CRM SaaS font bien

| Pattern | Exemple | Application Halo |
|---------|---------|-----------------|
| Free tier permanent sans CB | Supercreator (10 comptes), Velvetly (50 crédits/mois) | Studio Free avec crédits limités + Atlas Free (déjà fait) |
| Flat pricing transparent | BuddyX: $39/mois, pas de variable cachée | Pricing fixe, pas de % des revenus |
| AI en voix du créateur | Velvetly "Vivian" | ADN → voix clonée dans tous les agents IA |
| Auto-classification des fans | Velvetly: Whale/Loyal/Regular/New/At-Risk | Atlas segmentation automatique (déjà prévu) |
| Revenue attribution (DM → vente) | CreatorHero | Tracking des DM qui convertissent en ventes |
| PPV pricing dynamique | Supercreator | Ajustement prix par fan selon propension à acheter |
| Multi-plateforme | Infloww: OF + Fansly + Fanvue | Déjà fait (10 plateformes) |
| Extension navigateur | BuddyX Chrome extension | Companion browser pour création rapide |
| Approval workflow | CreatorHero: humain valide chaque message IA | "L'IA propose, vous décidez" — déjà le positionnement |

### Ce que Halo peut combiner (position vide sur le marché)

```
Agence Traditionnelle          SaaS CRM              Halo Talent
(TDM, Aruna)                  (Supercreator,         (Position unique)
|                              Infloww)              |
|-- Management humain          |-- Outils CRM         |-- Management humain
|-- Chat équipe dédiée         |-- Segmentation       |-- SaaS CRM + IA
|-- Stratégie éditoriale       |-- PPV automation     |-- ADN personnalisé
|-- Protection DMCA            |-- Analytics          |-- Bouclier Légal gratuit
|-- Contrats/négociation       |-- Multi-comptes      |-- Commissions transparentes
                               |                      |-- BYOK
                               |                      |-- 10 plateformes
                               |                      |-- Français natif + i18n
```

### Ce que Halo ne doit SURTOUT PAS copier

| À éviter | Pourquoi |
|----------|----------|
| Captures d'écran de dashboards avec des chiffres énormes | Crie "faux" si pas vérifiable en visio |
| "World's #1" / "Best in the world" auto-proclamé | Détruit la crédibilité sans tierce validation |
| Fausse rareté ("Only 3 spots left") | Les créateurs voient le pattern à des kilomètres |
| Témoignages avec juste des initiales | "Marine L." = zéro crédibilité |
| Pricing caché "Contact us" | La transparence est NOTRE avantage, ne pas la sacrifier |
| Promesses de revenus ("Tu gagneras X en Y mois") | Légalement dangereux + éthiquement incompatible |
| Chat 100% IA sans validation humaine | TDM a raison sur ce point : l'IA seule est "horrifically bad" |
| Contrats avec clause de lock-in | Contredit le positionnement "vous gardez le contrôle" |
| Photos stock de gens qui travaillent dans un open space | Inauthenticité immédiate |

---

## C. Positionnement Final Recommandé

### Tagline globale (anglais — international)

> **"Create. Keep Everything. Earn More."**

Simple, mémorisable, promesse claire. 5 mots.

### Tagline française

> **"Créez. Gardez tout. Gagnez plus."**

Variation du tagline actuel ("VOUS CRÉEZ. NOUS PROTÉGEONS. VOUS GARDEZ.") avec l'ajout explicite de la croissance.

### Pitch en 1 phrase

> **"Halo Talent est la première maison de management qui combine agence humaine, IA personnalisée et transparence totale des commissions."**

### Pitch en 5 secondes

> **"On vous donne les outils, l'équipe et la protection d'une grande agence — sans prendre 50% de vos revenus. Nos commissions commencent à 30% et descendent jusqu'à 10%."**

### Pitch en 30 secondes

> **"Halo Talent, c'est trois choses : un Studio IA qui crée du contenu à votre image grâce à votre ADN créatif unique, un CRM Atlas qui automatise vos relations fans et vos revenus, et une équipe humaine qui vous accompagne sans vous enfermer. Pas de contrat engageant. Pas de frais cachés. Vous gardez 100% de vos droits et de vos clés API. On publie tout : nos tarifs, nos commissions, notre contrat type. Comparez."**

### Pitch investisseur

> **"Le marché du creator management est cassé : les agences traditionnelles prennent 50-70% des revenus des créateurs sans transparence, et les CRM SaaS ne couvrent qu'une partie du workflow. Halo Talent est la première plateforme verticalement intégrée qui combine agence humaine, IA personnalisée par ADN créatif, CRM fan, et outils juridiques gratuits — avec une commission dégressive publique de 30% à 10%. Nous ciblons le marché francophone des créateurs premium (5 départements, 10 plateformes), avec une expansion internationale prévue en 6 langues."**

### Pitch créateur solo

> **"Tu veux créer, pas passer tes journées dans les DMs, les analytics et la paperasse. Halo te donne un Studio IA qui connaît ton style et ta voix, un CRM qui gère tes fans automatiquement, et une équipe qui te protège juridiquement. Tu gardes tes droits, tes données, et tes clés API. Et si un jour tu veux partir, tu prends tout avec toi. 30 jours, sans frais."**

### Pitch créateur premium/adulte

> **"Tu gères un business sensible où la discrétion, la sécurité et la conformité sont non-négociables. Halo a construit son infrastructure pour ça : zéro fuite d'identité, protection DMCA automatisée, CRM conforme RGPD, et une équipe qui comprend les enjeux spécifiques des plateformes premium. Tout est audité, documenté, et sous ton contrôle."**

### Pitch agence/équipe (co-management)

> **"Vous gérez déjà des créateurs et vous voulez scaler sans perdre en qualité. Halo s'intègre à votre workflow existant : nos outils CRM et IA viennent amplifier votre équipe, pas la remplacer. BYOK, API ouverte, dashboards partagés, rapports en marque blanche. Vous gardez votre relation créateur, on apporte la technologie."**

---

## D. Architecture Produit

### D.1 Studio IA

```
Studio
├── Vue d'ensemble (dashboard KPI + quick start + inspiration + crédits)
├── Composer (multi-plateforme, multi-format, assisté IA)
├── Génération IA
│   ├── Texte & Captions (avec ADN voix)
│   ├── Images (DALL-E 3 + modèles Replicate)
│   ├── Vidéos (6 modèles : Runway, Kling, Luma, Pika, Sora, Veo)
│   ├── Audio & Voix (ElevenLabs, musique IA)
│   └── Avatars parlants
├── Édition
│   ├── Photo Studio
│   ├── Video Studio (Remotion)
│   └── Audio Editor (WaveSurfer)
├── Templates (bibliothèque + mes templates + marketplace)
├── Publication (multi-publish, programmé, historique)
├── Data & Apprentissage (insights, learnings, A/B testing)
└── Plateformes (comptes connectés 10 plateformes)
```

**État actuel :** Structure construite, composants en place, APIs squelette, données mock.
**Priorité P1 :** Remplacer données mock par données réelles, finaliser compositeur, brancher APIs IA.
**Priorité P3 :** Marketplace templates, A/B testing avancé, analytics prédictifs.

### D.2 Atlas CRM

```
Atlas
├── Inbox unifiée (tous les DMs plateformes + email + SMS dans une vue)
├── Fans (liste, segmentation auto, scoring, historique)
├── Campagnes (email, SMS, push, DMs massifs)
├── Funnels (welcome, lead capture, vente, réengagement)
├── Règles "Si-Alors" (automation no-code)
├── Comments (modération + règles automatiques)
├── PPV (pay-per-view messaging, pricing dynamique, unlock tracking)
├── Vault (fans à risque, recommandations produits, prédictions churn/LTV)
├── Smart Messages (IA audience-ciblée, validation A/B)
├── Analytics (overview, canaux, revenus, ROI, cohortes, attribution)
├── Conformité (RGPD, anti-spam, TOS platforms, audits)
└── Intégrations (co-management, pro-mode, API, webhooks)
```

**État actuel :** Landing page + pricing + features pages construites. Dashboard squelette. APIs partielles.
**Priorité P2 :** Finaliser inbox unifiée, segmentation auto, campagnes email/SMS.
**Priorité P3 :** Règles Si-Alors, PPV dynamique, Smart Messages AI, Vault prédictions.

### D.3 Management Humain

```
Management
├── Talents (roster public + profils privés)
├── Contrats (signature, suivi, renouvellement)
├── Revenus (tracking multi-plateforme, versements, facturation)
├── Commissions (calcul automatique, historique, simulation)
├── Calendrier (éditorial, campagnes, échéances)
├── Messages internes (créateur ↔ manager)
├── Contrats types (téléchargeables, annotés)
├── Protection DMCA (monitoring 500+ sites, takedown automatique)
└── Apply (candidature 5 étapes — déjà construit)
```

**État actuel :** Calculateur de commissions public + Apply form. Tout le reste est placeholder ou squelette.
**Priorité P2 :** Contrats, revenus tracking, calculateur live, DMCA basics.
**Priorité P4 :** Calendrier éditorial, messages internes, portail créateur.

### D.4 Bouclier Légal (Protection)

```
Protection
├── Analyse de contrat (formulaire interactif — déjà construit)
├── Base de connaissances (clauses abusives, jurisprudences, lois)
├── Génération de lettres (mise en demeure, signalement)
├── Check-list interactive (6 catégories)
├── Score de risque (0-25, 4 niveaux)
├── Dashboard analytics (stats temps réel — déjà prévu)
└── Veille juridique (mises à jour automatiques)
```

**État actuel :** L'outil est construit et fonctionnel. APIs existent.
**Priorité P1 :** Ajouter analytics réels, dashboard de stats, partage de résultats.
**Priorité P4 :** Veille juridique automatisée, alertes nouvelles jurisprudences.

### D.5 ADN Créatif

```
ADN
├── Questionnaire 8 sections (déjà construit)
├── Finalisation IA (Claude → Voice/Style/Audience profiles)
├── Embeddings (OpenAI text-embedding-3-small)
├── Injection dans prompts agents (injectDNAIntoPrompt)
├── Historique versions (creator_dna_versions)
├── Dashboard ADN (visualisation des 3 profils)
└── Export/Partage (rapport PDF, lien partageable)
```

**État actuel :** Construit et fonctionnel de bout en bout. UX à polir (alert() → notifications, "Remplissage express" → retirer).
**Priorité P1 :** Polir UX, remplacer alert(), ajouter dashboard ADN, retirer dev shortcuts.
**Priorité P3 :** Export PDF du profil ADN, comparaison avant/après.

### D.6 Trust Center (nouveau)

```
Trust Center (/trust)
├── Sécurité (encryption, infrastructure, audits)
├── Privacy (RGPD, données collectées, droit à l'oubli)
├── Conformité (DPA, mentions légales, CGU/CGV)
├── Contrat type (téléchargeable, annoté en langage clair)
├── Commissions (tableau public, calculateur, historique)
├── Changelog (mises à jour produit publiques)
├── Status (uptime, incidents — page status publique)
└── Bug Bounty / Responsible Disclosure
```

**État actuel :** N'existe pas. Rien de centralisé.
**Priorité P1 :** Créer la page, rassembler les documents légaux existants, contrat type.
**Priorité P3 :** Changelog public, page status, bug bounty.

---

## E. Roadmap d'Exécution

### P0 — Crédibilité & Conformité (10-15 jours)

**Objectif :** Supprimer tout ce qui peut détruire la confiance. Ajouter les fondations de crédibilité.

| Action | Fichiers | Effort |
|--------|----------|--------|
| Supprimer les logos médias fabriqués de `SocialProofSection` | `components/home/SocialProofSection.tsx` | 1h |
| Supprimer les témoignages fictifs d'Atlas | `app/(marketing)/atlas/testimonials/page.tsx` | 30min |
| Remplacer "Zéro ban garanti" par "Protection anti-ban" sans garantie absolue | Atlas page.tsx, pricing, conformite | 2h |
| Remplacer stats invérifiables par "Lancement 2026" ou métriques dynamiques | Atlas page.tsx, referrers | 2h |
| Cacher "Remplissage express" derrière `NODE_ENV !== "production"` | `app/(private)/onboarding/dna/page.tsx` | 30min |
| Remplacer tous les `alert()` par des toasts/notifications | `app/(private)/onboarding/dna/page.tsx` | 3h |
| Ajouter "Mot de passe oublié" + lien sur la page login | `app/(auth)/login/page.tsx` | 1h |
| Créer `/trust` (Trust Center) avec privacy, sécurité, contrat type | Nouvelle route | 5h |
| Vérifier que TOUS les textes légaux obligatoires sont présents (mentions légales, CGU, privacy) | Site entier | 2h |

### P1 — Landing Page & Pricing & Onboarding (15-20 jours)

**Objectif :** Une homepage qui convertit. Des prix publics. Un onboarding crédible.

| Action | Fichiers | Effort |
|--------|----------|--------|
| **Nouvelle homepage** selon l'architecture recommandée (Hero → Problème → Solution → Preuve → Tarifs → FAQ → CTA) | `app/(marketing)/page.tsx` + composants | 20h |
| **Page `/pricing` unifiée** : commissions + Studio (Free→Icon) + Atlas (Free→Enterprise) + calculateur interactif + FAQ | Nouvelle route `app/(marketing)/pricing/page.tsx` | 12h |
| **Page `/manifeste`** complète : vision, valeurs, pourquoi le marché est cassé, ce qu'on fait différemment | `app/(marketing)/manifeste/page.tsx` | 6h |
| **Page `/creators`** : 3 cas clients documentés (anonymisés si nécessaire) avec situation initiale, actions, résultats | Nouvelle route `app/(marketing)/creators/page.tsx` | 8h |
| Remplacer toutes les photos Unsplash par des visuels de marque ou des illustrations sur-mesure | DepartmentsSection, [slug]/page.tsx | 6h |
| Ajouter image éditoriale réelle sur la page login (colonne gauche) | `app/(auth)/login/page.tsx` | 2h |
| Corriger le typo "garantee" → "garantie" dans WhyUsSection | `components/home/WhyUsSection.tsx` | 5min |
| Ajouter social login (Google) sur la page login | `app/(auth)/login/page.tsx` | 3h |
| Créer page `/departements` listing (index) | Nouvelle route `app/(marketing)/departements/page.tsx` | 3h |
| Corriger les liens morts : `/contrat-type`, `/saas`, `/departements` | Site entier | 2h |
| Finir l'onboarding DNA UX (retirer dev shortcuts, polir états d'erreur) | `app/(private)/onboarding/dna/page.tsx` | 4h |

### P2 — Dashboards avec Données Réelles (15-20 jours)

**Objectif :** Les dashboards Studio et Dashboard affichent des données réelles, plus de mock data.

| Action | Effort |
|--------|--------|
| Brancher Dashboard KPI sur Supabase (remplacer `mockKpi`, `mockBrief`, `mockActivities`) | 8h |
| Brancher Studio KPI sur Supabase (crédits réels, tendances réelles via Apify) | 6h |
| Finaliser le compositeur Studio (multi-plateforme, validation, preview) | 10h |
| Finaliser Inbox unifiée Atlas (tous les DMs dans une vue) | 8h |
| Créer segmentation automatique des fans (Scoring, Whale/Loyal/Regular/At-Risk) | 8h |
| Brancher Campagnes email (Resend) sur données réelles | 6h |
| Créer dashboard Analytics Atlas (overview avec données réelles) | 8h |
| Ajouter Revenue Attribution (DM → vente) dans Atlas | 6h |
| Ajouter photo réelle de l'équipe sur le dashboard admin | 1h |

### P3 — Atlas CRM Avancé (20-25 jours)

**Objectif :** Fonctionnalités CRM avancées qui différencient Halo des concurrents.

| Action | Effort |
|--------|--------|
| Règles "Si-Alors" — moteur d'automation no-code (Zapier-like pour créateurs) | 15h |
| PPV Dynamic Pricing — ajustement prix par fan selon scoring + comportement | 10h |
| Smart Messages AI — génération de messages ciblés par segment avec validation A/B | 10h |
| Vault — prédictions churn/LTV, recommandations produits, fans à risque | 12h |
| A/B Testing Framework — tests sur campagnes, messages, pricing PPV | 10h |
| Export PDF du profil ADN + rapport de performance créateur | 6h |
| Changelog public + page status | 4h |

### P4 — Internationalisation Complète (15-20 jours)

**Objectif :** Site et produit disponibles en 6 langues.

| Action | Effort |
|--------|--------|
| Mettre en place next-intl sur TOUTES les pages (actuellement seules Protection et LegalShieldSection l'utilisent) | 12h |
| Traductions FR (source) → EN, ES, DE, PT, IT (priorité marché) | 30h |
| Adapter le contenu par marché (exemples de créateurs locaux, plateformes locales) | 8h |
| SEO multilingue (hreflang, sitemaps, meta par langue) | 6h |
| Détection automatique de langue + sélecteur dans la nav | 4h |
| Adapter les formats de date, devise, nombre par locale | 3h |

### P5 — Preuves, Cas Clients & Lancement (10-15 jours)

**Objectif :** Matériel de crédibilité pour le lancement public.

| Action | Effort |
|--------|--------|
| Produire 3 études de cas documentées (vidéo 2min + page web + chiffres) | 15h |
| Tourner une démo vidéo du produit (3-5 min, parcours complet) | 10h |
| Photos professionnelles de l'équipe et des bureaux | 4h |
| Page `/talents` avec roster réel (photos, noms, départements, plateformes) | 6h |
| Blog : 10 articles SEO (creator economy, protection juridique, commissions, guides) | 20h |
| Page `/compare` — Halo vs agences traditionnelles, Halo vs CRM concurrents | 6h |
| Press kit (logos, screenshots, brand guidelines, boilerplate) | 3h |
| Landing page `/partners` — programme partenaires/affiliés | 4h |
| Audit de sécurité externe + badge sur le Trust Center | TBD externe |

---

## F. Recommandations Techniques Transversales

### G.1 SEO International

```
Structure d'URL recommandée :
halo-talent.com/                    → Landing FR
halo-talent.com/en/                 → Landing EN
halo-talent.com/es/                 → Landing ES
halo-talent.com/fr/creators/...     → Pages FR
halo-talent.com/en/creators/...     → Pages EN

Sitemaps :
/sitemap.xml                        → Sitemap index
/sitemap-fr.xml                     → Pages françaises
/sitemap-en.xml                     → Pages anglaises
```

- Balises hreflang sur toutes les pages
- Meta titles/descriptions optimisées par marché
- Blog comme moteur SEO principal (création de contenu régulier)
- Pages "compare" pour capturer le trafic de recherche concurrentiel
- Bouclier Légal comme aimant à backlinks (outil gratuit, référencement naturel)

### G.2 Conformité

- **RGPD** : Consentement explicite, droit à l'oubli automatisé, DPA public, registre des traitements
- **ePrivacy** : Cookie consent (déjà présent), transparence tracking
- **Mentions légales** : Page dédiée avec toutes les informations obligatoires (SIRET, directeur publication, hébergeur)
- **CGU/CGV** : Conditions d'utilisation claires, en français simple, pas de jargon juridique
- **Contrat type** : Téléchargeable, annoté, expliqué en langage clair
- **DPA** (Data Processing Agreement) : Pour les créateurs qui veulent vérifier le traitement de leurs données

### G.3 Accessibilité

- Tous les boutons ont des labels aria
- Navigation au clavier fonctionnelle
- Contrastes de couleurs validés (le terracotta sur crème passe, le terracotta sur noir est limite)
- Formulaires avec labels explicites et messages d'erreur clairs
- Support screen reader sur les flux critiques (Apply, DNA)

### G.4 Performance

- Next.js 16 avec Turbopack (déjà en place)
- Images optimisées (next/image avec tailles responsives)
- Code splitting automatique (App Router)
- Streaming SSR pour les pages lourdes (dashboard)
- Edge caching pour les pages marketing statiques

---

## G. Synthèse des Décisions Stratégiques

| Décision | Recommandation | Raison |
|----------|---------------|--------|
| **Publiciser les commissions ?** | OUI — intégralement | Différenciateur n°1. Aucun concurrent ne le fait. |
| **Afficher des prix SaaS publics ?** | OUI — page /pricing unifiée | La transparence est la promesse centrale. Ne pas la briser. |
| **Séparer site agence / site SaaS ?** | NON — unifié | La combinaison agence+SaaS est le positionnement unique. |
| **Cibler d'abord US ou EU ?** | EU d'abord (FR, BE, CH, puis DE, ES, IT) | Marché francophone mal servi, conformité EU comme avantage |
| **Lever des fonds ou bootstrap ?** | Bootstrap jusqu'à 10 créateurs, puis seed | Proof of concept d'abord, traction ensuite |
| **Offrir un free tier permanent ?** | OUI — Studio Free + Atlas Free | Barrière à l'entrée zéro, conversion par la valeur |
| **Permettre le BYOK dès le free tier ?** | OUI | Signal fort de souveraineté. Coût marginal nul pour Halo. |
| **Afficher un roster public ?** | OUI — avec accord des créateurs | Crédibilité. Même 3 noms valent mieux qu'une page vide. |
| **Garantir des résultats financiers ?** | NON — jamais | Légalement dangereux, éthiquement incompatible. |
| **Automatiser les DMs sans validation ?** | NON — "L'IA propose, vous décidez" | Contrôle humain obligatoire sur les communications sensibles. |

---

*Document rédigé le 10 juin 2026 — stratégie vivante, à réviser tous les trimestres.*
