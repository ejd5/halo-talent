// ─── WTF Lex, Letter Templates (12 types) ────────────────
// Templates pré-prêts pour la rédaction de lettres juridiques.
// Chaque template sert à pré-remplir le prompt Claude dans l'admin.

export interface LetterTemplate {
  id: string;
  label: string;
  type: string;
  targetPlatform?: string;
  complexity: "standard" | "complex";
  description: string;
  legalBases: string[];
  structure: string[];
  variables: string[];
  politenessFormulas: string[];
  recommendedAttachments: string[];
  promptContext: string;
}

const templates: LetterTemplate[] = [
  {
    id: "appeal_suspension_of",
    label: "Appel suspension OnlyFans",
    type: "appel_suspension",
    targetPlatform: "OnlyFans",
    complexity: "standard",
    description: "Lettre d'appel contre une suspension de compte OnlyFans",
    legalBases: [
      "CGU OnlyFans, Section 8 (Suspension et résiliation)",
      "DSA, Règlement UE 2022/2065, Articles 20 et 21",
      "RGPD, Règlement UE 2016/679",
      "Code civil, Article 1103 (force obligatoire des contrats)",
    ],
    structure: [
      "En-tête : coordonnées expéditeur + destinataire + date",
      "Objet : 'Appel contre la suspension du compte [USERNAME], Identifiant [ID]'",
      "Rappel des faits et de la notification reçue",
      "Motifs de l'appel : contester la décision, fournir des preuves",
      "Bases légales invoquées (CGU + DSA + RGPD)",
      "Demande de réactivation dans un délai de 15 jours",
      "Menace de saisine du médiateur DSA ou de la CNIL",
      "Formule de politesse et signature",
    ],
    variables: ["NOM_COMPLET", "USERNAME", "ID_COMPTE", "EMAIL", "DATE_SUSPENSION", "MOTIF_SUSPENSION", "DATE_LIMITE", "NUMERO_REF"],
    politenessFormulas: [
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
      "Dans l'attente d'une réponse favorable, je vous adresse mes sincères salutations.",
    ],
    recommendedAttachments: [
      "Pièce d'identité (copie)",
      "Capture d'écran de la notification de suspension",
      "Preuve de vérification d'identité (selfie + papier)",
      "Justificatifs de conformité aux CGU",
    ],
    promptContext: `Tu es un expert en rédaction de documents juridiques pour créateurs de contenu.

Contexte :
[Cette lettre est un appel contre une suspension de compte OnlyFans.

Faits :
- Le compte de [NOM_COMPLET] (username: [USERNAME], ID: [ID_COMPTE]) a été suspendu le [DATE_SUSPENSION].
- Raison invoquée : [MOTIF_SUSPENSION].
- Le créateur conteste cette décision et souhaite obtenir la réactivation.]

Type de document à rédiger : Appel suspension de compte
Complexité : Standard
Langue : FR
Ton : Ferme et juridique

Génère un document professionnel structuré qui :
1. Cite précisément : CGU OnlyFans Section 8, DSA Articles 20-21, RGPD
2. Articule clairement les demandes (réactivation, suppression des traces)
3. Mentionne les délais légaux (15 jours pour réponse)
4. Anticipe les contre-arguments potentiels (violation CGU présumée)
5. Se termine par une formule de politesse appropriée

Format : structure formelle avec en-tête, objet, corps structuré, conclusion, signature.
Longueur : 3-5 pages`,
  },

  {
    id: "appeal_suspension_fansly",
    label: "Appel suspension Fansly",
    type: "appel_suspension",
    targetPlatform: "Fansly",
    complexity: "standard",
    description: "Lettre d'appel contre une suspension de compte Fansly",
    legalBases: [
      "CGU Fansly, Section 7 (Termination and Suspension)",
      "DSA, Règlement UE 2022/2065, Articles 20 et 21",
      "RGPD, Règlement UE 2016/679, Article 17 (droit à l'effacement)",
    ],
    structure: [
      "En-tête : coordonnées + destinataire + date",
      "Objet : 'Appel contre la suspension du compte [USERNAME]'",
      "Exposé des faits : date de suspension, motif allégué",
      "Contestation : absence de violation démontrée, procédure non conforme",
      "Bases légales : CGU Section 7, DSA 20-21, RGPD 17",
      "Demande de réactivation sous 30 jours",
      "Réserve de saisir le médiateur DSA",
      "Signature",
    ],
    variables: ["NOM_COMPLET", "USERNAME", "EMAIL", "DATE_SUSPENSION", "MOTIF_SUSPENSION", "DATE_LIMITE"],
    politenessFormulas: [
      "Veuillez agréer, Madame, Monsieur, l'expression de mes salutations respectueuses.",
      "Dans l'attente d'un retour favorable, je vous prie de croire en l'assurance de mes salutations distinguées.",
    ],
    recommendedAttachments: [
      "Pièce d'identité",
      "Notification de suspension (capture d'écran)",
      "Preuve de vérification d'identité",
    ],
    promptContext: `Tu es un expert en rédaction de documents juridiques pour créateurs de contenu.

Contexte :
[Lettre d'appel contre une suspension de compte Fansly.

Faits :
- Compte de [NOM_COMPLET] (username: [USERNAME]) suspendu le [DATE_SUSPENSION].
- Raison : [MOTIF_SUSPENSION].
- Le créateur conteste et demande réactivation.]

Type : Appel suspension Fansly
Langue : FR
Ton : Ferme et juridique

Génère un document professionnel qui cite : CGU Fansly Section 7, DSA 20-21, RGPD 17.
Format formel avec en-tête, objet, corps, conclusion, signature. 3-5 pages.`,
  },

  {
    id: "appeal_suspension_mym",
    label: "Appel suspension MYM",
    type: "appel_suspension",
    targetPlatform: "MYM",
    complexity: "standard",
    description: "Lettre d'appel contre une suspension de compte MYM",
    legalBases: [
      "CGU MYM, Suspension et résiliation",
      "DSA, Règlement UE 2022/2065, Articles 20 et 21",
      "Code civil, Article 1103",
    ],
    structure: [
      "En-tête + objet : 'Appel suspension compte MYM [USERNAME]'",
      "Exposé des faits",
      "Moyens de contestation",
      "Bases légales",
      "Demande de réactivation",
      "Signature",
    ],
    variables: ["NOM_COMPLET", "USERNAME", "EMAIL", "DATE_SUSPENSION", "MOTIF_SUSPENSION"],
    politenessFormulas: ["Veuillez recevoir, Madame, Monsieur, mes salutations distinguées."],
    recommendedAttachments: ["Pièce d'identité", "Notification de suspension"],
    promptContext: `Lettre d'appel suspension MYM pour [NOM_COMPLET]. Ton ferme. Citant CGU MYM + DSA 20-21. 3-4 pages.`,
  },

  {
    id: "appeal_suspension_instagram",
    label: "Appel suspension Instagram",
    type: "appel_suspension",
    targetPlatform: "Instagram",
    complexity: "complex",
    description: "Lettre d'appel contre une suspension de compte Instagram/Meta",
    legalBases: [
      "Conditions d'utilisation Meta, Suspension de compte",
      "DSA, Règlement UE 2022/2065, Articles 17, 20, 21",
      "RGPD, Règlement UE 2016/679, Articles 5, 6, 22",
      "Charte des droits fondamentaux de l'UE, Article 11 (liberté d'expression)",
    ],
    structure: [
      "En-tête formel + objet détaillé",
      "Exposé des faits avec chronologie",
      "Analyse juridique : proportionnalité de la sanction, droit à l'information",
      "Moyens : absence de violation, défaut de motivation, non-respect du DSA",
      "Demande de réactivation + dommages-intérêts éventuels",
      "Signature + pièces jointes listées",
    ],
    variables: ["NOM_COMPLET", "USERNAME", "EMAIL", "DATE_SUSPENSION", "MOTIF_SUSPENSION", "PERTES_ESTIMEES"],
    politenessFormulas: [
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
    ],
    recommendedAttachments: [
      "Pièce d'identité",
      "Notification Meta (captures)",
      "Justificatifs de conformité",
      "Estimation des pertes (si applicable)",
    ],
    promptContext: `Lettre d'appel suspension Instagram/Meta. Cas complexe. Citant conditions Meta + DSA 17, 20, 21 + RGPD 5, 6, 22 + liberté d'expression. Ton ferme et juridique. 5-8 pages.`,
  },

  {
    id: "appeal_demonetization_youtube",
    label: "Appel démonétisation YouTube",
    type: "appel_suspension",
    targetPlatform: "YouTube",
    complexity: "complex",
    description: "Lettre d'appel contre une démonétisation ou désactivation de compte YouTube",
    legalBases: [
      "CGU YouTube, Règles de monétisation",
      "DSA, Règlement UE 2022/2065, Articles 20, 21",
      "Code de la propriété intellectuelle, Article L111-1",
      "Charte des droits fondamentaux UE, Article 16 (liberté d'entreprise)",
    ],
    structure: [
      "En-tête + objet détaillé",
      "Présentation de la chaîne et du créateur",
      "Exposé de la décision de démonétisation",
      "Contestation : non-respect des CGU par YouTube, défaut de motivation",
      "Bases légales : DSA 20-21, CPI L111-1",
      "Demande de réexamen + réactivation de la monétisation",
      "Signature",
    ],
    variables: ["NOM_COMPLET", "CHAINE", "URL_CHAINE", "EMAIL", "DATE_DEMONETISATION", "MOTIF", "PERTES_REVENUS"],
    politenessFormulas: ["Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    recommendedAttachments: [
      "Capture décision démonétisation",
      "Justificatifs de conformité",
      "Historique des revenus (6 mois)",
    ],
    promptContext: `Lettre d'appel démonétisation YouTube pour la chaîne [CHAINE] de [NOM_COMPLET]. Ton ferme. Citant CGU YouTube, DSA 20-21, CPI L111-1. 5-8 pages.`,
  },

  {
    id: "mise_en_demeure_agence_paiement",
    label: "Mise en demeure agence (paiements)",
    type: "mise_en_demeure",
    targetPlatform: undefined,
    complexity: "complex",
    description: "Mise en demeure d'une agence de reverser des paiements impayés",
    legalBases: [
      "Code civil, Article 1344 (mise en demeure)",
      "Code civil, Article 1103 (force obligatoire des contrats)",
      "Code civil, Article 1231-1 (dommages-intérêts)",
      "Code de commerce, Article L441-10 (délais de paiement)",
    ],
    structure: [
      "En-tête : LRAR avec coordonnées",
      "Objet : 'Mise en demeure de reverser les sommes dues'",
      "Rappel du contrat et des obligations",
      "Détail des sommes impayées (période, montants)",
      "Mise en demeure de payer sous 8 jours",
      "Mention des intérêts moratoires",
      "Menace de saisine du tribunal compétent",
      "Signature + pièces jointes",
    ],
    variables: ["NOM_COMPLET", "AGENCE", "DATE_CONTRAT", "MONTANT_IMPASSE", "PERIODE", "DATE_LIMITE", "TRIBUNAL_COMPETENT"],
    politenessFormulas: [
      "Veuillez agréer, Madame, Monsieur, l'expression de mes sentiments distingués.",
    ],
    recommendedAttachments: [
      "Copie du contrat signé",
      "Relevé des paiements manquants",
      "Preuve de relances antérieures",
      "Calcul des intérêts moratoires",
    ],
    promptContext: `Mise en demeure d'agence pour impayés. Montant : [MONTANT_IMPASSE]€. Contrat signé le [DATE_CONTRAT] avec [AGENCE]. Citant CC 1344, 1103, 1231-1, C.com L441-10. Ton très ferme. 4-6 pages.`,
  },

  {
    id: "mise_en_demeure_agence_clauses",
    label: "Mise en demeure agence (clauses abusives)",
    type: "mise_en_demeure",
    targetPlatform: undefined,
    complexity: "complex",
    description: "Mise en demeure contre des clauses abusives dans un contrat d'agence",
    legalBases: [
      "Code de la consommation, Articles L212-1, L132-1 (clauses abusives)",
      "Code civil, Article 1171 (déséquilibre significatif)",
      "Code de commerce, Article L442-1 (pratiques restrictives)",
      "Loi du 31 décembre 1971, Exercice du droit",
    ],
    structure: [
      "En-tête LRAR",
      "Objet : 'Mise en demeure de supprimer les clauses abusives du contrat'",
      "Identification des clauses contestées (tableau)",
      "Analyse juridique de chaque clause",
      "Déséquilibre significatif démontré",
      "Mise en demeure de modifier sous 15 jours",
      "Menace de saisine du tribunal + dommages-intérêts",
      "Signature",
    ],
    variables: ["NOM_COMPLET", "AGENCE", "DATE_CONTRAT", "CLAUSES_CONTESTEES", "DATE_LIMITE"],
    politenessFormulas: [
      "Veuillez recevoir, Madame, Monsieur, l'expression de mes salutations distinguées.",
    ],
    recommendedAttachments: [
      "Copie du contrat complet",
      "Tableau des clauses contestées",
      "Jurisprudence pertinente",
    ],
    promptContext: `Mise en demeure de supprimer des clauses abusives dans le contrat [DATE_CONTRAT] avec [AGENCE]. Clauses contestées : [CLAUSES_CONTESTEES]. Citant C.conso L212-1, L132-1, CC 1171, C.com L442-1. Ton ferme et technique. 6-10 pages.`,
  },

  {
    id: "mise_en_demeure_droit_image",
    label: "Mise en demeure droit à l'image",
    type: "mise_en_demeure",
    targetPlatform: undefined,
    complexity: "standard",
    description: "Mise en demeure pour utilisation non consentie de l'image",
    legalBases: [
      "Code civil, Article 9 (droit au respect de la vie privée)",
      "Code civil, Article 1240 (responsabilité extracontractuelle)",
      "CPI, Article L111-1 (droit moral de l'auteur)",
      "RGPD, Article 6 (licéité du traitement), Article 7 (consentement)",
      "Loi du 17 juillet 1978, Droit à l'image",
    ],
    structure: [
      "En-tête LRAR",
      "Objet : 'Mise en demeure de cesser l'utilisation non autorisée de mon image'",
      "Constat : utilisation sans consentement (support, date, diffusion)",
      "Bases légales : CC 9, 1240, CPI L111-1, RGPD 6-7",
      "Demande de retrait sous 48h",
      "Demande de suppression des copies",
      "Réserve de dommages-intérêts",
      "Signature",
    ],
    variables: ["NOM_COMPLET", "UTILISATEUR_IMAGE", "SUPPORT_UTILISATION", "DATE_CONSTAT", "URL_CONCERNEE"],
    politenessFormulas: [
      "Je vous prie de bien vouloir, Madame, Monsieur, agréer mes salutations respectueuses.",
    ],
    recommendedAttachments: [
      "Preuve photographique de l'utilisation",
      "Capture d'écran avec date",
      "Lien URL",
      "Justificatif d'identité",
    ],
    promptContext: `Mise en demeure pour utilisation non consentie de l'image de [NOM_COMPLET]. Image utilisée sur [SUPPORT_UTILISATION] (URL: [URL_CONCERNEE]). Citant CC 9, 1240, CPI L111-1, RGPD 6-7. Ton ferme. 3-5 pages.`,
  },

  {
    id: "dmca_takedown",
    label: "DMCA Takedown notice",
    type: "dmca_takedown",
    targetPlatform: undefined,
    complexity: "standard",
    description: "Notification DMCA pour retrait de contenu volé",
    legalBases: [
      "DMCA, 17 U.S.C. § 512 (Safe Harbor)",
      "Copyright Act, 17 U.S.C. § 106 (droits exclusifs)",
      "DSA, Règlement UE 2022/2065, Article 16 (notice and action)",
    ],
    structure: [
      "En-tête : coordonnées complètes du plaignant",
      "Objet : 'DMCA Takedown Notice, Notification of Infringement'",
      "Identification de l'œuvre protégée (titre, date, URL originale)",
      "Identification du contenu contrefaisant (URL précise)",
      "Déclaration de bonne foi",
      "Déclaration sous peine de parjure",
      "Signature physique ou électronique",
    ],
    variables: ["NOM_COMPLET", "EMAIL", "ADRESSE", "TITRE_OEUVRE", "URL_ORIGINALE", "URL_CONTREFAISANTE", "PLATEFORME"],
    politenessFormulas: [
      "Respectfully yours,",
      "Sincerely,",
    ],
    recommendedAttachments: [
      "Preuve de création originale (fichier horodaté)",
      "Capture d'écran du contenu original",
      "Capture d'écran du contenu contrefaisant",
      "Justificatif d'identité",
    ],
    promptContext: `You are a legal document specialist for content creators.

DMCA Takedown Notice for [NOM_COMPLET].

Original work: [TITRE_OEUVRE] at [URL_ORIGINALE].
Infringing content at: [URL_CONTREFAISANTE] on [PLATEFORME].

Cite: DMCA 17 U.S.C. § 512, Copyright Act 17 U.S.C. § 106, DSA Article 16.

Format: formal DMCA notice with all required elements. English. 2-3 pages.`,
  },

  {
    id: "reclamation_rgpd",
    label: "Réclamation RGPD (CNIL)",
    type: "reclamation_rgpd",
    targetPlatform: undefined,
    complexity: "complex",
    description: "Réclamation auprès de la CNIL pour violation du RGPD",
    legalBases: [
      "RGPD, Règlement UE 2016/679, Articles 5, 6, 7, 17, 77",
      "Loi Informatique et Libertés, Loi n°78-17 du 6 janvier 1978",
      "Charte des droits fondamentaux UE, Article 8",
      "DSA, Règlement UE 2022/2065, Articles 14, 15",
    ],
    structure: [
      "En-tête : coordonnées + destinataire (CNIL)",
      "Objet : 'Réclamation pour violation du RGPD'",
      "Exposé des faits : traitement illicite, absence de consentement",
      "Droits violés : droit à l'information, droit d'accès, droit d'opposition",
      "Bases légales détaillées",
      "Demande : enquête, sanction, injonction",
      "Signature + pièces",
    ],
    variables: ["NOM_COMPLET", "ORGANISME_CONCERNE", "TYPE_VIOLATION", "DATES", "DONNEES_CONCERNEES"],
    politenessFormulas: [
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations respectueuses.",
    ],
    recommendedAttachments: [
      "Preuve de la violation (captures)",
      "Demande préalable ignorée (si applicable)",
      "Correspondance avec l'organisme",
      "Justificatif d'identité",
    ],
    promptContext: `Réclamation CNIL pour violation RGPD. Organisme : [ORGANISME_CONCERNE]. Type : [TYPE_VIOLATION]. Citant RGPD 5, 6, 7, 17, 77 + Loi Informatique et Libertés. Ton technique et ferme. 5-8 pages.`,
  },

  {
    id: "signalement_dsa",
    label: "Signalement DSA",
    type: "signalement_dsa",
    targetPlatform: undefined,
    complexity: "standard",
    description: "Signalement formel d'un manquement d'une plateforme au DSA",
    legalBases: [
      "DSA, Règlement UE 2022/2065, Articles 14 (transparence), 15 (rapports), 20 (suspension abusive), 21 (droit de recours)",
      "RGPD, Règlement UE 2016/679",
      "Charte des droits fondamentaux UE, Article 11",
    ],
    structure: [
      "En-tête coordonnées",
      "Objet : 'Signalement DSA, Manquement aux obligations de transparence'",
      "Identification de la plateforme concernée",
      "Description du manquement",
      "Bases légales du DSA invoquées",
      "Demande de mise en conformité sous 30 jours",
      "Copie au coordinateur DSA compétent",
      "Signature",
    ],
    variables: ["NOM_COMPLET", "PLATEFORME", "DESCRIPTION_MANQUEMENT", "ARTICLES_DSA", "DATES"],
    politenessFormulas: [
      "Je vous prie de croire, Madame, Monsieur, à l'assurance de mes salutations distinguées.",
    ],
    recommendedAttachments: [
      "Preuves du manquement (captures, logs)",
      "Correspondance avec la plateforme",
      "Rapport d'impact (si applicable)",
    ],
    promptContext: `Signalement DSA contre [PLATEFORME]. Manquement : [DESCRIPTION_MANQUEMENT]. Citant DSA 14, 15, 20, 21 + RGPD. Ton ferme et technique. 4-6 pages.`,
  },

  {
    id: "reponse_mise_en_demeure",
    label: "Réponse à mise en demeure reçue",
    type: "reponse",
    targetPlatform: undefined,
    complexity: "complex",
    description: "Réponse formelle à une mise en demeure reçue par le créateur",
    legalBases: [
      "Code civil, Article 1344 (mise en demeure)",
      "Code civil, Article 1103 (force obligatoire des contrats)",
      "Code civil, Article 1240 (responsabilité)",
      "Bases légales spécifiques selon l'objet de la mise en demeure",
    ],
    structure: [
      "En-tête : LRAR",
      "Objet : 'Réponse à votre mise en demeure du [DATE], Réf [REF]'",
      "Accusé de réception",
      "Réponse point par point aux griefs",
      "Contestation ou reconnaissance des faits",
      "Propositions ou défense",
      "Réserve de droits",
      "Signature",
    ],
    variables: ["NOM_COMPLET", "EXPEDITEUR_MED", "DATE_MED", "REF_MED", "GRIEFS", "REPONSE_POINTS"],
    politenessFormulas: [
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes sentiments distingués.",
    ],
    recommendedAttachments: [
      "Copie de la mise en demeure reçue",
      "Justificatifs de la position du créateur",
      "Preuves au soutien de la réponse",
    ],
    promptContext: `Réponse à mise en demeure reçue de [EXPEDITEUR_MED] le [DATE_MED] (Réf: [REF_MED]). Griefs : [GRIEFS]. Ton : [TON]. Citant CC 1344, 1103, 1240. 4-8 pages selon complexité.`,
  },
];

export function getTemplateById(id: string): LetterTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByType(type: string): LetterTemplate[] {
  return templates.filter((t) => t.type === type);
}

export function getAllTemplates(): LetterTemplate[] {
  return [...templates];
}

export function getTemplatesByPlatform(platform: string): LetterTemplate[] {
  return templates.filter(
    (t) => t.targetPlatform?.toLowerCase() === platform.toLowerCase()
  );
}
