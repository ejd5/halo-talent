# HALO TALENT — PACK DE PROMPTS COMPLET
### Design system + toutes les pages du site, dashboard admin & dashboard créateur

Chaque prompt est autonome : collez d'abord le **Prompt 0 (Design System)** en début de session, puis le prompt de la page voulue. Fonctionne avec Claude, v0, Cursor, Lovable, Bolt, etc.

---

## PROMPT 0 — DESIGN SYSTEM MAÎTRE (à coller avant tout)

```
Tu es directeur artistique senior d'une maison de management créatif premium et internationale : Halo Talent.
Clientèle exigeante : modèles de l'univers adulte (OnlyFans/Fansly/MYM), athlètes de haut niveau, influenceurs, entrepreneurs. Le design doit évoquer une maison de luxe (Chanel, Cartier) croisée avec une plateforme tech moderne (Linear, Vercel) — jamais "agence OFM cheap".

PALETTE "ENCRE & OR" (obligatoire, utiliser ces tokens) :
- --encre: #0C0A08 (fond principal, noir chaud)
- --fumee: #15110D (surfaces secondaires)
- --surface: #1C1712 (cartes)
- --ivoire: #F4EEE3 (texte principal — jamais de blanc pur)
- --pierre: #9C9183 (texte secondaire)
- --or: #D8A95B (accent maison : eyebrows, filets, chiffres clés, hover)
- --or-clair: #EBC98A (italiques de titres)
- --cuivre: #E2702E (réservé aux CTA primaires uniquement)
- --sauge: #8FB58A (succès, hausse, validation)
- --terre: #C96A4A (alerte, baisse, clause abusive)
Règle : l'or est l'accent dominant (luxe), le cuivre est rare (action), le contraste texte/fond respecte WCAG AA.

TYPOGRAPHIE :
- Display : "Fraunces" (Google Fonts), graisses 300–500, italiques pour les mots-clés émotionnels dans les titres
- Corps : "Instrument Sans" 400/500/600
- Utilitaire/données : "Space Grotesk", majuscules, letter-spacing 0.2–0.3em pour eyebrows, labels, chiffres de tableaux

COMPOSANTS RÉCURRENTS :
- Eyebrow doré en Space Grotesk uppercase au-dessus de chaque H2
- Filets fins : 1px rgba(216,169,91,.18) — jamais de bordures épaisses
- Border-radius : 2–3px max (esprit éditorial, pas "bulle")
- Signature visuelle : le HALO — anneau de lumière en conic-gradient or/cuivre qui tourne lentement (26s) et respire, placé derrière les moments clés (hero, CTA final)
- Boutons : rectangle fin, uppercase letterspaced ; primaire = fond cuivre, secondaire = contour or

MOTION (façon Webflow/Uncovered) :
- Titres hero : lignes masquées qui montent (translateY 110% → 0, cubic-bezier(.16,1,.3,1), stagger 120ms)
- Sections : reveal au scroll via IntersectionObserver (opacity + translateY 36px)
- Compteurs animés sur les chiffres clés
- Marquee infini pour les logos plateformes
- Nav qui se masque au scroll descendant, réapparaît en remontant
- prefers-reduced-motion respecté partout

TON ÉDITORIAL :
- Voix : "la maison" — sobre, assurée, jamais racoleuse
- Promesse cœur : "Les autres agences prennent 50%. Nous, on vous donne les outils pour ne plus en avoir besoin."
- Vocabulaire : maison, roster, départements, manifeste, transparence, barème public
- 6 langues prévues (FR par défaut) : toutes les chaînes de texte doivent être externalisables (clés i18n)

CONTRAINTES TECHNIQUES :
- HTML/CSS/JS vanilla ou React+Tailwind selon demande, responsive mobile-first, focus visible au clavier, dark uniquement.
```

---

# PARTIE A — SITE VITRINE

## A1 — Page d'accueil
```
Crée la page d'accueil Halo Talent (design system Prompt 0).
Sections dans cet ordre :
1. Nav fixe fine : logo "Halo Talent" (Fraunces, "Talent" en italique or), liens La Maison / Commissions / Bouclier Légal / Départements / Blog, "Se connecter" + CTA cuivre "Commencer".
2. HERO plein écran : badge pill "Nouveau — Bouclier Légal gratuit" avec point vert pulsant ; H1 en 4 lignes animées "Les autres agences prennent 50%. / Nous, on vous donne les outils." (2 dernières lignes en italique or) ; halo animé à droite ; sous-titre sur les 7 outils remplacés ; 2 CTA ; rangée de 4 stats animées (10% commission plancher, 7 outils en 1, 30 jours de sortie, 6 langues).
3. Marquee plateformes : OnlyFans, Fansly, MYM, Instagram, TikTok, YouTube, LinkedIn, X, Threads, Bluesky.
4. "Une maison, trois étages" : 3 cartes Management / Studio / Atlas, numérotées I-II-III, listes à tirets dorés, glow doré au hover.
5. SIMULATEUR DE COMMISSION interactif : slider de revenu mensuel (1k–200k€) → calcul MARGINAL en direct (0–5k:30%, 5–20k:25%, 20–50k:20%, 50–150k:15%, 150k+:10%) affichant taux effectif, commission, "vous gardez", "économisé vs agence à 50%". Le barème s'allume tranche par tranche.
6. Comparatif 3 colonnes : Agence traditionnelle / Stack OFM / Halo Talent (colonne or "LA MAISON HALO").
7. Bandeau Bouclier Légal : mockup d'analyse de contrat avec clauses flaggées (⚠ abusive / ✓ conforme) et barre de scan animée.
8. Les 5 départements en liste éditoriale (D·01 à D·05) avec hover : Musique & Spectacle Vivant, Sport & Lifestyle, Business & Leadership, Créateurs Digitaux, Talent Premium.
9. Citation manifeste centrée.
10. CTA final avec grand halo + footer 4 colonnes (marque, navigation, légal, newsletter).
```

## A2 — Fonctionnalités
```
Crée la page Fonctionnalités (design system Prompt 0).
Hero court : "Sept outils. Une maison." + sommaire ancré.
Puis 7 blocs alternés gauche/droite, chacun avec eyebrow numéroté (F·01…F·07), titre Fraunces, paragraphe, 3 bullets, et un mockup UI stylisé (cartes sombres, données fictives) :
1. Studio création IA (texte, image, vidéo, audio, avatars) — mockup générateur multi-format
2. Atlas CRM fans (scoring, segmentation, campagnes) — mockup liste de fans avec scores dorés
3. Analytics unifiés + Trend Hub + prédictions IA — mockup graphe multi-plateformes
4. Protection juridique (Bouclier Légal, analyse de contrats, base juridique) — mockup scan
5. Gestion d'équipe & permissions — mockup rôles
6. Automatisation marketing — mockup workflow nodes reliés par fils dorés
7. Messagerie unifiée + Chat Copilot IA — mockup inbox
Terminer par bandeau "Tout est inclus dans Studio + Atlas" → CTA vers Tarifs.
```

## A3 — Tarifs (Pricing)
```
Crée la page Tarifs (design system Prompt 0). Trois sections à onglets ou empilées :

SECTION 1 — MANAGEMENT (commissions) :
Reprendre le simulateur marginal interactif de l'accueil en version étendue + tableau du barème public (30/25/20/15/10%) + encadré "Nos engagements" : sans frais d'entrée, sortie 30 jours sans pénalité ni justification, contrat public, données exportables à tout moment.

SECTION 2 — STUDIO (SaaS création IA) :
Toggle Mensuel/Annuel (-20% annuel, badge or "2 mois offerts"). 3 cartes : Essentiel / Pro (mise en avant, bordure or, badge RECOMMANDÉ) / Maison. Chaque carte : prix Fraunces grand format, crédits IA/mois, liste de features à tirets dorés, CTA. [Insérer vos prix réels — structure prête à recevoir la grille.]

SECTION 3 — ATLAS (SaaS CRM) :
Même structure 3 plans, axée nombre de fans suivis, sièges d'équipe, automatisations.

En bas : tableau comparatif complet des plans (sticky header), FAQ accordéon (8 questions : engagement, crédits, propriété des données, langues, paiement, TVA, changement de plan, Bouclier Légal gratuit), bandeau "Le Bouclier Légal reste gratuit pour tous, clients ou non."
```

## A4 — Protection (Bouclier Légal)
```
Crée la page Protection / Bouclier Légal (design system Prompt 0).
Hero : "Votre contrat d'agence cache peut-être des clauses abusives." + zone d'upload drag-and-drop stylisée (pointillés or, icône bouclier) acceptant PDF/DOCX.
Section "Ce que nous détectons" : grille de 6 cartes — exclusivité abusive, pénalités de sortie déguisées, transfert de propriété de comptes, reversements opaques, clauses de non-concurrence excessives, cession de droits à l'image illimitée. Chaque carte : icône fine, exemple de formulation type en italique, niveau de risque (pastille terre/or/sauge).
Section "Comment ça marche" en 3 étapes horizontales reliées par un fil doré : Importez → L'IA analyse → Recevez votre rapport annoté.
Mockup grand format d'un rapport d'analyse : score de risque, clauses surlignées, recommandations de renégociation.
Disclaimer discret en Space Grotesk : "Halo Talent ne fournit pas de conseil juridique. Le Bouclier Légal est un outil d'aide à la décision."
CTA final : "Analyser mon contrat gratuitement" — préciser : gratuit, sans compte requis, même si vous ne signez jamais chez nous.
```

## A5 — Manifeste
```
Crée la page Manifeste (design system Prompt 0).
Page éditoriale longue, presque sans UI : typographie Fraunces grand format sur fond encre, halo très discret en filigrane.
Structure : titre "Le Manifeste" ; 7 articles numérotés en chiffres romains, chacun = un principe avec 1 phrase forte (Fraunces 40px, mots-clés en italique or) + 1 paragraphe d'explication (Instrument Sans, colonne 60ch max) :
I. La transparence n'est pas un argument marketing, c'est un barème public.
II. Une maison retient ses talents par ce qu'elle apporte, pas par contrat.
III. Vos comptes, vos fans, vos données vous appartiennent. Toujours.
IV. Plus vous gagnez, moins on prend.
V. La sortie se fait en 30 jours, sans pénalité, sans justification.
VI. Les outils ne remplacent pas l'humain ; ils le libèrent.
VII. Chaque univers mérite sa propre maison — du stade à la scène, du studio au boudoir.
Reveal au scroll article par article, fil doré vertical reliant les numéros. Signature finale + CTA "Rejoindre la maison".
```

## A6 — Départements (hub)
```
Crée la page Départements (design system Prompt 0).
Hero : "Cinq départements. Une exigence."
Grille éditoriale de 5 grands blocs cliquables (pleine largeur, alternance), chacun : index D·01…D·05, titre Fraunces 48px, description, 3 plateformes clés, mini-stat fictive ("+340% de revenus moyens la 1re année" etc.), photo/dégradé d'ambiance propre au département (teinte dérivée de la palette), flèche animée au hover.
1. Musique & Spectacle Vivant — 2. Sport & Lifestyle — 3. Business & Leadership — 4. Créateurs Digitaux — 5. Talent Premium.
Pour Talent Premium : ton particulièrement sobre et premium, insister sur discrétion, sécurité, protection juridique.
```

## A7 — Page Département individuelle (template ×5)
```
Crée le template d'une page Département (design system Prompt 0) — exemple avec "Sport & Lifestyle", réutilisable pour les 5.
Sections : hero avec index D·02 + titre + phrase d'accroche spécifique ; "Ce que la maison fait pour vous" (4 cartes : représentation, création IA adaptée au vertical, CRM fans, juridique) ; cas d'usage concrets du vertical (3 scénarios narratifs) ; plateformes couvertes ; barème de commission rappelé ; mini-FAQ du vertical ; CTA "Candidater au département".
Variable d'ambiance : chaque département a une teinte secondaire dérivée (Sport : sauge ; Musique : or-clair ; Business : pierre ; Digital : cuivre ; Premium : or profond) appliquée aux eyebrows et filets uniquement.
```

## A8 — Talents (roster public)
```
Crée la page Talents (design system Prompt 0).
Hero : "Le roster de la maison." + filtres par département (pills fines).
Grille de cartes talents (portraits sombres avec voile encre, nom en Fraunces, département en eyebrow, plateformes en icônes fines, stat clé dorée). Hover : la carte s'éclaire d'un halo.
Note : prévoir un état "anonymisé" pour les talents Premium qui le souhaitent (silhouette + pseudonyme).
Bandeau final : "Votre place est peut-être ici" → candidature.
```

## A9 — Blog
```
Crée la page Blog (design system Prompt 0).
Hero éditorial : article à la une pleine largeur (image, catégorie en eyebrow, titre Fraunces 44px, extrait, temps de lecture).
Filtres par catégorie : Juridique / Croissance / Plateformes / IA & Création / Coulisses de la maison.
Grille 3 colonnes d'articles, pagination fine. Sidebar ou bandeau newsletter intégré.
Crée aussi le template d'article : colonne de lecture 68ch, Fraunces pour les H2, encadrés "À retenir" à filet or, sommaire sticky, bloc auteur, articles liés, CTA Bouclier Légal contextuel en fin d'article.
```

## A10 — Commissions (page dédiée)
```
Crée la page Commissions (design system Prompt 0).
Objectif : transformer le barème en arme de conversion.
1. Hero : "Le seul barème d'agence publié sur internet."
2. Le barème complet en grand tableau éditorial.
3. Simulateur étendu : slider + graphique en aires montrant la part Halo vs la part créateur de 0 à 200k€, courbe du taux effectif qui descend.
4. Explication pédagogique du calcul marginal avec un exemple chiffré déroulé pas à pas (12 000 € → tranche par tranche).
5. Comparateur : champ "commission actuelle de votre agence (%)" → économies sur 12 mois en grand chiffre Fraunces doré.
6. Les 4 engagements contractuels + lien vers le contrat type public.
```

## A11 — SaaS (Studio + Atlas vitrine)
```
Crée la page SaaS (design system Prompt 0) présentant Studio et Atlas comme produits autonomes (utilisables sans le management).
Hero scindé en deux moitiés interactives (Studio | Atlas) qui s'élargissent au hover.
Pour chaque produit : 4 features majeures avec mockups, intégrations plateformes, sécurité des données (export CSV/JSON/PDF, RGPD), prix d'appel → lien Tarifs.
Bandeau central : "Et si vous voulez la maison entière, le management s'ajoute par-dessus."
```

## A12 — Authentification (Login / Signup / Mot de passe)
```
Crée les écrans d'authentification (design system Prompt 0).
Layout scindé : moitié gauche = formulaire sur fond encre (logo, champs fins soulignés d'un filet or au focus, CTA cuivre, lien magique par email en option) ; moitié droite = halo animé plein cadre avec citation du manifeste en rotation.
Écrans : connexion, inscription (avec choix "Je suis créateur / Je suis une équipe"), mot de passe oublié, vérification email, 2FA.
Sélecteur de langue discret (FR/EN/ES/DE/PT-BR/IT) en pied de formulaire.
```

## A13 — Pages légales
```
Crée le template des pages légales (design system Prompt 0) : Mentions légales, Politique de confidentialité, CGU, Contrat type.
Lecture maximale : colonne 70ch, sommaire sticky à gauche avec progression dorée, H2 Fraunces, ancres, date de mise à jour en Space Grotesk.
Spécial "Contrat type" : le contrat de management publié intégralement, avec annotations en marge expliquant chaque clause en langage humain (encadrés or "Pourquoi cette clause"). C'est une page de conversion déguisée en page légale.
```

---

# PARTIE B — DASHBOARD ADMINISTRATEUR

## B0 — Shell du dashboard admin
```
Crée le layout global du dashboard admin Halo Talent (design system Prompt 0, version "produit" : surfaces #15110D, cartes #1C1712, données en Space Grotesk).
Sidebar fixe gauche, groupes : PILOTAGE (Command Center, Analytics, Benchmark marché) / CRÉATEURS (Roster, Performances, Candidatures [badge compteur], Pipeline, Contrats, Calendrier multi-créateurs) / FINANCES (Revenus, Commissions, Payouts) / Juridique & Protection (Base juridique, Clauses abusives, Analyses contrats, Journal mises à jour) / Équipe & Permissions / Paramètres / Documentation.
Item actif : fond cuivre translucide + filet or à gauche. Topbar : recherche ⌘K, sélecteur de période (7J/30J/90J/12M/Custom), notifications, messages, avatar admin.
Badge "Démo · Données simulées" si mode démo. Tout en composants réutilisables.
```

## B1 — Command Center
```
Crée la page Command Center (shell B0).
1. Rangée de 5 KPI cards avec sparklines : Revenu brut (€), Commissions (€), Créateurs actifs (18/24), Conversion app (%), Churn (%) — variation vs période précédente (sauge si bon, terre si mauvais).
2. "Actions rapides" : 5 cartes cliquables avec compteurs — Candidatures à revoir, Contrats à signer, Payouts bloqués, Créateurs en baisse, Chat Copilot.
3. Graphique Revenus 12 mois (aires brut/net/commission, légende, onglets Vue d'ensemble / Par plateforme / Par région / Par créateur).
4. Colonne Activité récente : flux d'événements horodatés (nouveau talent, palier de revenu, contrat signé, message urgent, pic de revenu) avec icônes par type.
Toutes les valeurs en français, format € espace insécable.
```

## B2 — Analytics
```
Crée la page Analytics (shell B0).
Filtres croisés : période × plateforme × département × créateur.
Blocs : courbes revenus/abonnés/engagement superposables ; heatmap des meilleurs horaires de publication ; entonnoir de conversion (visiteur → follower → fan payant → VIP) ; top contenus (tableau triable) ; répartition géographique (carte ou barres par pays) ; encart "Prédictions IA" (revenu projeté 30j avec intervalle de confiance, en pointillés dorés).
```

## B3 — Benchmark marché
```
Crée la page Benchmark marché (shell B0).
Comparaison des créateurs du roster vs percentiles du marché par vertical : position en percentile (jauge), prix moyens pratiqués par plateforme, taux d'engagement de référence, tendances de niches (Trend Hub : tags montants/descendants avec variation %).
Tableau "Opportunités détectées" généré par IA : créateur, opportunité, impact estimé, action suggérée.
```

## B4 — Roster
```
Crée la page Roster (shell B0).
Vue tableau + vue cartes commutables. Colonnes : créateur (avatar, nom, département), plateformes, revenu 30j, évolution %, score de santé (anneau doré 0–100), manager assigné, statut (actif/pause/onboarding/sortie).
Filtres par département et statut, recherche, tri. Actions par ligne : voir profil, message, planifier.
Fiche créateur en panneau latéral : KPIs, contrats, derniers contenus, notes d'équipe.
```

## B5 — Performances
```
Crée la page Performances (shell B0).
Classement des créateurs par période : tableau dense avec mini-sparklines, badges "🔥 momentum" / "⚠ en baisse".
Vue comparative : sélectionner 2–4 créateurs → courbes superposées.
Objectifs : barres de progression vers les objectifs mensuels fixés, alertes si <70% à mi-mois.
```

## B6 — Candidatures
```
Crée la page Candidatures (shell B0).
Inbox de candidatures : liste à gauche (avatar, nom, département visé, plateformes, revenu déclaré, date), détail à droite (profil complet, liens, audience, motivation, score de fit IA avec justification).
Actions : Accepter → bascule dans Pipeline / Refuser avec motif / Demander des infos.
Filtres par département, statut, score. Badge compteur synchronisé avec la sidebar.
```

## B7 — Pipeline
```
Crée la page Pipeline (shell B0).
Kanban : Candidature reçue → Entretien → Due diligence → Proposition envoyée → Contrat signé → Onboarding.
Cartes draggables (nom, département, revenu potentiel, jours dans l'étape — terre si >7j), totaux de valeur potentielle par colonne en Space Grotesk doré.
```

## B8 — Contrats
```
Crée la page Contrats (shell B0).
Tableau : créateur, type de contrat, taux négocié, date de signature, échéance, statut (brouillon/envoyé/signé/à renouveler/résilié).
Alertes : contrats arrivant à échéance sous 30j en bandeau.
Visionneuse de contrat avec versions et signature électronique (mockup), journal d'audit.
```

## B9 — Calendrier multi-créateurs
```
Crée la page Calendrier multi-créateurs (shell B0).
Vue semaine/mois, une ligne par créateur (swimlanes), événements colorés par plateforme, drag-and-drop.
Panneau de création d'événement : créateur, plateforme, type de contenu, brouillon généré par Studio (bouton "Générer avec l'IA"), heure optimale suggérée (issue de la heatmap Analytics).
Détection de conflits et de trous de publication (zones hachurées).
```

## B10 — Revenus / B11 — Commissions / B12 — Payouts
```
Crée les 3 pages Finances (shell B0).
REVENUS : revenu brut consolidé par plateforme et par créateur, rapprochement des versements plateformes, courbes empilées, export CSV/JSON/PDF.
COMMISSIONS : application du barème marginal par créateur — tableau montrant tranche par tranche le calcul, taux effectif, total maison ; simulateur de renégociation.
PAYOUTS : file des paiements sortants vers les créateurs : à préparer / en cours / payé / bloqué (avec motif et action de résolution), méthode (SEPA/virement/autre), justificatifs, historique. KPI : délai moyen de paiement.
```

## B13 — Juridique & Protection (4 sous-pages)
```
Crée la section Juridique (shell B0), 4 sous-pages :
BASE JURIDIQUE : bibliothèque d'articles et modèles par pays (FR/EN/ES/DE/PT-BR/IT), recherche, tags.
CLAUSES ABUSIVES : référentiel des clauses détectables par le Bouclier Légal — nom, formulation type, niveau de risque, contre-proposition recommandée ; éditable par l'équipe juridique.
ANALYSES CONTRATS : historique des analyses Bouclier Légal (internes + leads entrants), score de risque, statut de suivi commercial des leads.
JOURNAL MISES À JOUR : changelog réglementaire horodaté avec impact estimé par département.
```

## B14 — Équipe & Permissions / B15 — Paramètres / B16 — Documentation
```
Crée les 3 pages d'administration (shell B0).
ÉQUIPE : membres (rôle : admin/manager/juridique/finance/support), créateurs assignés, dernière activité ; matrice de permissions par module (lecture/écriture/aucun) ; invitations ; journal d'audit.
PARAMÈTRES : profil maison, marque, langues actives, intégrations plateformes (statut de connexion par API), barème de commission (verrouillé, modification = double validation), notifications, facturation, sécurité (2FA obligatoire pour finance).
DOCUMENTATION : centre d'aide interne avec recherche, guides par module, raccourcis clavier, contact support.
```

---

# PARTIE C — DASHBOARD CRÉATEUR (CLIENT)

## C0 — Shell créateur
```
Crée le layout du dashboard créateur (design system Prompt 0, version produit).
Plus chaleureux que l'admin : accueil personnalisé "Bonsoir, {prénom}" en Fraunces, halo discret derrière le header.
Sidebar : Vue d'ensemble / Studio (Créer) / Atlas (Mes fans) / Messagerie / Calendrier / Revenus & Paiements / Mon contrat / Bouclier Légal / Académie / Paramètres.
Topbar : sélecteur de plateforme, période, notifications, "Contacter mon manager" toujours visible (bouton or).
```

## C1 — Vue d'ensemble créateur
```
Crée la Vue d'ensemble créateur (shell C0).
1. Bandeau hero personnel : revenu du mois en grand Fraunces, objectif avec barre de progression dorée, taux de commission actuel + "encore X € avant la tranche à Y%" (gamification de la dégressivité — fonctionnalité signature).
2. KPIs : abonnés, engagement, messages en attente, contenus planifiés.
3. "À faire aujourd'hui" : tâches suggérées par l'IA (répondre à 3 VIP, publier le contenu planifié, valider le brouillon Studio).
4. Graphe revenus 30j multi-plateformes.
5. Flux d'activité : nouveaux fans VIP, paliers atteints, messages du manager.
```

## C2 — Studio (création)
```
Crée la page Studio créateur (shell C0).
Interface de génération : onglets Texte / Image / Vidéo / Audio / Avatar.
Zone de prompt avec presets par plateforme ("caption Instagram", "script TikTok 30s", "message de masse Fansly"...), aperçu en direct, compteur de crédits IA restants (jauge dorée), historique des générations, bouton "Décliner pour toutes mes plateformes".
Bibliothèque de contenus avec statuts : brouillon / validé / planifié / publié.
```

## C3 — Atlas (CRM fans)
```
Crée la page Atlas créateur (shell C0).
Liste de fans avec score (anneau 0–100), segment (Nouveau/Régulier/VIP/Dormant/À risque), dépense totale, dernière interaction.
Segments en cartes cliquables avec compteurs. Création de campagne : choisir segment → message (généré par Studio en option) → planifier.
Automatisations : règles simples "Si un fan passe VIP → message de bienvenue personnalisé" (builder visuel à fils dorés).
```

## C4 — Messagerie unifiée
```
Crée la Messagerie créateur (shell C0).
Inbox unifiée toutes plateformes : liste de conversations (badge plateforme, score du fan, valeur), fil de discussion au centre, panneau fan à droite (historique d'achat, notes, suggestions Chat Copilot).
Chat Copilot : 3 suggestions de réponse dans le ton du créateur, à valider/éditer avant envoi — JAMAIS d'envoi automatique sans validation. File de priorité : VIP d'abord.
```

## C5 — Revenus & Paiements créateur
```
Crée la page Revenus créateur (shell C0).
Transparence totale : revenu brut par plateforme → commission Halo détaillée TRANCHE PAR TRANCHE (le calcul marginal affiché en clair, c'est l'argument de la maison) → net à recevoir.
Calendrier des payouts avec statuts, historique téléchargeable (PDF/CSV), graphe d'évolution du taux effectif dans le temps (il baisse = motivation).
```

## C6 — Mon contrat + Bouclier Légal créateur
```
Crée les pages Contrat et Bouclier (shell C0).
MON CONTRAT : le contrat en lecture avec annotations pédagogiques en marge, taux actuel, date d'anniversaire, bouton "Demander une sortie" visible et sans friction (preuve d'engagement de la maison) avec process 30 jours expliqué.
BOUCLIER LÉGAL : analyser tout autre contrat reçu (marques, collabs, autres agences) — upload, rapport, historique de mes analyses.
```

## C7 — Académie + Paramètres créateur
```
Crée les pages Académie et Paramètres (shell C0).
ACADÉMIE : parcours de formation par niveau (cartes avec progression), masterclass par département, replays, certification interne "Creator Pro".
PARAMÈTRES : profil public roster (avec option anonymisation pour Talent Premium), connexions plateformes, langue (6), notifications, confidentialité et export RGPD de toutes mes données en 1 clic, sécurité 2FA.
```

---

## CONSEILS D'UTILISATION DU PACK
1. Toujours coller le Prompt 0 d'abord, puis 1 seul prompt de page à la fois.
2. Pour itérer : "Garde tout, mais [modifie X]" — ne jamais redemander la page entière.
3. Pour les 6 langues : demander "externalise toutes les chaînes dans un objet i18n" dès la première génération.
4. Pour la cohérence : réutiliser les composants générés (KPI card, tableau, slider) en les nommant dans vos prompts suivants.
