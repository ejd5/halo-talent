// ─── Compliance Center Mock Data ───

export type SensitiveCategory = "spam" | "sexual" | "violence" | "hate" | "custom";

export interface SensitiveWord {
  id: string;
  word: string;
  category: SensitiveCategory;
  severity: 1 | 2 | 3 | 4 | 5;
  blocked: boolean;
  blockCount: number;
  createdAt: string;
}

export type ReviewType = "campaign" | "message" | "automation";
export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewQueueItem {
  id: string;
  type: ReviewType;
  status: ReviewStatus;
  content: string;
  createdBy: string;
  createdAt: string;
  riskScore: number;
  riskReason: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type ConsentChannel = "email" | "sms" | "push" | "dm";

export interface ConsentSummary {
  channel: ConsentChannel;
  total: number;
  granted: number;
  missing: number;
}

export type PlatformName = "OF" | "Fansly" | "IG" | "TT";

export interface PlatformRule {
  id: string;
  labelKey: string;
  enabled: boolean;
  severity: "low" | "medium" | "high";
}

export interface PlatformRules {
  platform: PlatformName;
  riskLevel: "low" | "medium" | "high";
  rules: PlatformRule[];
}

export type SeverityLevel = "info" | "warning" | "critical";

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityType: string;
  user: string;
  timestamp: string;
  details: string;
  severity: SeverityLevel;
}

export type PolicyAction = "block" | "flag" | "log";

export interface RiskPolicy {
  id: string;
  nameKey: string;
  descriptionKey: string;
  enabled: boolean;
  threshold: number;
  action: PolicyAction;
}

export type DataRequestType = "access" | "deletion" | "portability";
export type DataRequestStatus = "pending" | "processing" | "completed" | "rejected";

export interface DataRequest {
  id: string;
  type: DataRequestType;
  fanName: string;
  fanEmail: string;
  status: DataRequestStatus;
  createdAt: string;
  expiresAt: string;
}

// ─── Sensitive Words ───

export const SENSITIVE_WORDS: SensitiveWord[] = [
  { id: "sw1", word: "gratuit", category: "spam", severity: 3, blocked: true, blockCount: 47, createdAt: "2026-01-10" },
  { id: "sw2", word: "cliquez ici", category: "spam", severity: 2, blocked: true, blockCount: 32, createdAt: "2026-01-10" },
  { id: "sw3", word: "offre limitée", category: "spam", severity: 3, blocked: true, blockCount: 28, createdAt: "2026-01-10" },
  { id: "sw4", word: "argent facile", category: "spam", severity: 4, blocked: true, blockCount: 19, createdAt: "2026-01-15" },
  { id: "sw5", word: "gagnez maintenant", category: "spam", severity: 3, blocked: true, blockCount: 15, createdAt: "2026-01-15" },
  { id: "sw6", word: "viagra", category: "spam", severity: 5, blocked: true, blockCount: 8, createdAt: "2026-02-01" },
  { id: "sw7", word: "contenu interdit", category: "sexual", severity: 4, blocked: true, blockCount: 12, createdAt: "2026-02-05" },
  { id: "sw8", word: "mineur", category: "sexual", severity: 5, blocked: true, blockCount: 3, createdAt: "2026-02-05" },
  { id: "sw9", word: "meurs", category: "violence", severity: 5, blocked: true, blockCount: 6, createdAt: "2026-01-20" },
  { id: "sw10", word: "tuer", category: "violence", severity: 5, blocked: true, blockCount: 4, createdAt: "2026-01-20" },
  { id: "sw11", word: "race de", category: "hate", severity: 5, blocked: true, blockCount: 9, createdAt: "2026-01-25" },
  { id: "sw12", word: "dégage", category: "hate", severity: 3, blocked: false, blockCount: 0, createdAt: "2026-01-25" },
  { id: "sw13", word: "remboursez", category: "spam", severity: 2, blocked: false, blockCount: 0, createdAt: "2026-03-01" },
  { id: "sw14", word: "arnaque", category: "custom", severity: 3, blocked: false, blockCount: 0, createdAt: "2026-03-10" },
  { id: "sw15", word: "contact direct", category: "custom", severity: 2, blocked: false, blockCount: 0, createdAt: "2026-03-15" },
];

export const SENSITIVE_CATEGORY_LABELS: Record<SensitiveCategory, string> = {
  spam: "Spam",
  sexual: "Contenu sexuel",
  violence: "Violence",
  hate: "Discours haineux",
  custom: "Personnalisé",
};

export const SENSITIVE_CATEGORY_COLORS: Record<SensitiveCategory, string> = {
  spam: "#F59E0B",
  sexual: "#EC4899",
  violence: "#E5484D",
  hate: "#8B5CF6",
  custom: "#3B82F6",
};

// ─── Review Queue ───

export const REVIEW_QUEUE: ReviewQueueItem[] = [
  { id: "rq1", type: "campaign", status: "pending", content: "Email promotionnel été : 'Offre exclusive pour nos abonnés VIP - profitez de -50% sur votre abonnement mensuel'", createdBy: "Julie R.", createdAt: "2026-06-09T14:30:00", riskScore: 72, riskReason: "Présence de mots spam détectés (offre, exclusif, -50%)" },
  { id: "rq2", type: "message", status: "pending", content: "DM personnalisé : 'Salut, j'ai vu ton profil. Tu devrais essayer OF, les mecs paient bien pour des nudes.'", createdBy: "Sophie M.", createdAt: "2026-06-09T16:45:00", riskScore: 88, riskReason: "Référence explicite à OnlyFans + sollicitation monétaire" },
  { id: "rq3", type: "automation", status: "pending", content: "Séquence de bienvenue automatique - 5 emails sur 3 jours avec liens d'inscription", createdBy: "Thomas L.", createdAt: "2026-06-09T10:00:00", riskScore: 45, riskReason: "Fréquence élevée (5 messages en 3 jours)" },
  { id: "rq4", type: "campaign", status: "pending", content: "Campagne SMS relance abonnement expiré : 'Votre accès premium expire demain. Renouvelez maintenant !'", createdBy: "Alexandre P.", createdAt: "2026-06-08T09:15:00", riskScore: 65, riskReason: "Urgence artificielle + appel à l'action immédiat" },
  { id: "rq5", type: "automation", status: "pending", content: "Règle automatique : envoyer DM promotionnel à tout nouveau follower dans l'heure", createdBy: "Julie R.", createdAt: "2026-06-08T11:30:00", riskScore: 91, riskReason: "DM non sollicité à des inconnus - risque élevé de signalement spam" },
  { id: "rq6", type: "message", status: "pending", content: "Réponse automatique fan VIP : contenu personnalisé avec lien paiement externe", createdBy: "Sophie M.", createdAt: "2026-06-07T15:00:00", riskScore: 55, riskReason: "Lien externe dans un message automatique" },
  { id: "rq7", type: "campaign", status: "pending", content: "Campagne push notification : 'Nouveau contenu chaud disponible ! Seulement aujourd'hui'", createdBy: "Thomas L.", createdAt: "2026-06-07T08:20:00", riskScore: 78, riskReason: "Langage suggestif + urgence temporelle" },
  { id: "rq8", type: "message", status: "pending", content: "DM de remerciement après achat PPV avec lien vers contenu exclusif", createdBy: "Alexandre P.", createdAt: "2026-06-06T18:00:00", riskScore: 35, riskReason: "Risque faible - message transactionnel standard" },
  { id: "rq9", type: "campaign", status: "approved", content: "Newsletter hebdomadaire - résumé contenu récent", createdBy: "Sophie M.", createdAt: "2026-06-05T10:00:00", riskScore: 12, riskReason: "Contenu informatif standard", reviewedBy: "Admin", reviewedAt: "2026-06-05T14:00:00" },
  { id: "rq10", type: "automation", status: "approved", content: "Règle : engagement post - remercier les commentaires positifs", createdBy: "Julie R.", createdAt: "2026-06-04T09:00:00", riskScore: 8, riskReason: "Interaction authentique", reviewedBy: "Admin", reviewedAt: "2026-06-04T11:00:00" },
  { id: "rq11", type: "campaign", status: "approved", content: "Campagne anniversaire fan - 1 email avec code promo 10%", createdBy: "Thomas L.", createdAt: "2026-06-03T15:00:00", riskScore: 5, riskReason: "Contenu ciblé et personnalisé", reviewedBy: "Admin", reviewedAt: "2026-06-03T16:30:00" },
  { id: "rq12", type: "message", status: "rejected", content: "DM masse : 'Salut tout le monde ! Nouveau contenu dispo, cliquez ici'", createdBy: "Alexandre P.", createdAt: "2026-06-02T11:00:00", riskScore: 82, riskReason: "Message non personnalisé envoyé en masse + lien non vérifié", reviewedBy: "Admin", reviewedAt: "2026-06-02T13:00:00" },
  { id: "rq13", type: "campaign", status: "rejected", content: "Campagne email agressive : 10 emails en 24h avec multiples offres limitées", createdBy: "Julie R.", createdAt: "2026-06-01T09:00:00", riskScore: 95, riskReason: "Fréquence extrême + multiples déclencheurs spam", reviewedBy: "Admin", reviewedAt: "2026-06-01T10:30:00" },
];

// ─── Consent Summary ───

export const CONSENT_SUMMARIES: ConsentSummary[] = [
  { channel: "email", total: 1250, granted: 1120, missing: 130 },
  { channel: "sms", total: 890, granted: 680, missing: 210 },
  { channel: "push", total: 1050, granted: 920, missing: 130 },
  { channel: "dm", total: 780, granted: 540, missing: 240 },
];

export const CONSENT_CHANNEL_LABELS: Record<ConsentChannel, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
  dm: "DM",
};

// ─── Platform Rules ───

export const PLATFORM_RULES: PlatformRules[] = [
  {
    platform: "OF",
    riskLevel: "medium",
    rules: [
      { id: "of1", labelKey: "compliance.rules.dm_limit", enabled: true, severity: "high" },
      { id: "of2", labelKey: "compliance.rules.post_limit", enabled: true, severity: "medium" },
      { id: "of3", labelKey: "compliance.rules.blocked_words", enabled: true, severity: "high" },
      { id: "of4", labelKey: "compliance.rules.quiet_hours", enabled: false, severity: "low" },
      { id: "of5", labelKey: "compliance.rules.ai_disclosure", enabled: true, severity: "medium" },
    ],
  },
  {
    platform: "Fansly",
    riskLevel: "low",
    rules: [
      { id: "fl1", labelKey: "compliance.rules.dm_limit", enabled: true, severity: "medium" },
      { id: "fl2", labelKey: "compliance.rules.post_limit", enabled: true, severity: "low" },
      { id: "fl3", labelKey: "compliance.rules.blocked_words", enabled: true, severity: "medium" },
      { id: "fl4", labelKey: "compliance.rules.quiet_hours", enabled: false, severity: "low" },
      { id: "fl5", labelKey: "compliance.rules.ai_disclosure", enabled: false, severity: "low" },
    ],
  },
  {
    platform: "IG",
    riskLevel: "high",
    rules: [
      { id: "ig1", labelKey: "compliance.rules.dm_limit", enabled: true, severity: "high" },
      { id: "ig2", labelKey: "compliance.rules.post_limit", enabled: true, severity: "high" },
      { id: "ig3", labelKey: "compliance.rules.blocked_words", enabled: true, severity: "high" },
      { id: "ig4", labelKey: "compliance.rules.quiet_hours", enabled: true, severity: "medium" },
      { id: "ig5", labelKey: "compliance.rules.ai_disclosure", enabled: true, severity: "high" },
    ],
  },
  {
    platform: "TT",
    riskLevel: "high",
    rules: [
      { id: "tt1", labelKey: "compliance.rules.dm_limit", enabled: true, severity: "high" },
      { id: "tt2", labelKey: "compliance.rules.post_limit", enabled: true, severity: "high" },
      { id: "tt3", labelKey: "compliance.rules.blocked_words", enabled: true, severity: "high" },
      { id: "tt4", labelKey: "compliance.rules.quiet_hours", enabled: true, severity: "medium" },
      { id: "tt5", labelKey: "compliance.rules.ai_disclosure", enabled: true, severity: "high" },
    ],
  },
];

export const PLATFORM_COLORS: Record<PlatformName, string> = {
  OF: "var(--or, #D8A95B)",
  Fansly: "#8B5CF6",
  IG: "#EC4899",
  TT: "#3B82F6",
};

// ─── Audit Logs ───

function ago(days: number, hours = 0): string {
  const d = new Date("2026-06-10T12:00:00");
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "al1", action: "Campagne approuvée", entity: "Newsletter été #42", entityType: "campaign", user: "Sophie M.", timestamp: ago(0, 1), details: "Contenu vérifié, score risque 12%", severity: "info" },
  { id: "al2", action: "Message bloqué", entity: "DM promotionnel #18", entityType: "message", user: "Système", timestamp: ago(0, 3), details: "Mot sensible détecté : 'gratuit'", severity: "warning" },
  { id: "al3", action: "Mot sensible ajouté", entity: "contact direct", entityType: "word", user: "Admin", timestamp: ago(0, 5), details: "Catégorie : personnalisé, sévérité 2", severity: "info" },
  { id: "al4", action: "Règle automatique rejetée", entity: "Auto-DM nouveaux followers", entityType: "rule", user: "Admin", timestamp: ago(0, 8), details: "Score risque 91% - DM non sollicité", severity: "critical" },
  { id: "al5", action: "Consentement retiré", entity: "Marie L. (email)", entityType: "consent", user: "Système", timestamp: ago(1, 0), details: "Fan a retiré son consentement email", severity: "warning" },
  { id: "al6", action: "Campagne rejetée", entity: "Campagne SMS urgente #7", entityType: "campaign", user: "Thomas L.", timestamp: ago(1, 2), details: "Urgence artificielle détectée", severity: "warning" },
  { id: "al7", action: "Export RGPD", entity: "Demande #42 - Juan P.", entityType: "data_request", user: "Système", timestamp: ago(1, 5), details: "Export données fan complété (Art.15)", severity: "info" },
  { id: "al8", action: "Mot désactivé", entity: "dégage", entityType: "word", user: "Admin", timestamp: ago(2, 0), details: "Désactivé - faux positif potentiel", severity: "info" },
  { id: "al9", action: "Règle de fréquence modifiée", entity: "Max DM/jour", entityType: "policy", user: "Admin", timestamp: ago(2, 3), details: "Seuil passé de 5 à 3 par jour", severity: "info" },
  { id: "al10", action: "Anonymisation fan", entity: "Anonymisation #12", entityType: "data_request", user: "Système", timestamp: ago(2, 6), details: "Fan anonymisé (Art.17) - ID #7842", severity: "critical" },
  { id: "al11", action: "Message approuvé", entity: "DM remerciement PPV", entityType: "message", user: "Sophie M.", timestamp: ago(3, 0), details: "Risque faible 35% - approuvé", severity: "info" },
  { id: "al12", action: "Tentative connexion suspecte", entity: "Compte Admin", entityType: "access", user: "Système", timestamp: ago(3, 4), details: "Nouvelle IP détectée - Brésil", severity: "critical" },
  { id: "al13", action: "Plateforme déconnectée", entity: "TT - @halo_talent", entityType: "platform", user: "Admin", timestamp: ago(3, 8), details: "Token API expiré - reconnexion requise", severity: "warning" },
  { id: "al14", action: "Campagne programmée", entity: "Campagne push #23", entityType: "campaign", user: "Julie R.", timestamp: ago(4, 0), details: "Programmée pour le 12/06 - approuvée", severity: "info" },
  { id: "al15", action: "Modification règle", entity: "Règle engagement post", entityType: "rule", user: "Thomas L.", timestamp: ago(4, 2), details: "Seuil de déclenchement modifié", severity: "info" },
  { id: "al16", action: "Rapport conformité exporté", entity: "Rapport mensuel mai", entityType: "report", user: "Admin", timestamp: ago(5, 0), details: "Exporté au format CSV", severity: "info" },
  { id: "al17", action: "Suppression fan refusée", entity: "Demande #38", entityType: "data_request", user: "Admin", timestamp: ago(5, 3), details: "Refusée - identité non confirmée", severity: "warning" },
  { id: "al18", action: "Changement politique risque", entity: "Politique spam score", entityType: "policy", user: "Admin", timestamp: ago(6, 0), details: "Seuil passé de 70 à 60", severity: "info" },
  { id: "al19", action: "Erreur API campaign", entity: "Campagne email #39", entityType: "system", user: "Système", timestamp: ago(6, 4), details: "Timeout envoi - file d'attente saturée", severity: "warning" },
  { id: "al20", action: "Bouclier Légal analyse", entity: "Contrat #15", entityType: "legal", user: "Sophie M.", timestamp: ago(7, 0), details: "Nouvelle analyse - 12 clauses abusives", severity: "info" },
];

export const AUDIT_ENTITY_TYPES = Array.from(new Set(AUDIT_LOGS.map((l) => l.entityType)));

// ─── Risk Policies ───

export const RISK_POLICIES: RiskPolicy[] = [
  { id: "rp1", nameKey: "compliance.policies.spam_score.name", descriptionKey: "compliance.policies.spam_score.desc", enabled: true, threshold: 60, action: "block" },
  { id: "rp2", nameKey: "compliance.policies.sensitive_severity.name", descriptionKey: "compliance.policies.sensitive_severity.desc", enabled: true, threshold: 4, action: "block" },
  { id: "rp3", nameKey: "compliance.policies.max_daily_messages.name", descriptionKey: "compliance.policies.max_daily_messages.desc", enabled: true, threshold: 5, action: "flag" },
  { id: "rp4", nameKey: "compliance.policies.max_daily_campaigns.name", descriptionKey: "compliance.policies.max_daily_campaigns.desc", enabled: false, threshold: 3, action: "flag" },
];

export const POLICY_ACTION_LABELS: Record<PolicyAction, string> = {
  block: "Bloquer",
  flag: "Signaler",
  log: "Journaliser",
};

// ─── Data Requests ───

export const DATA_REQUESTS: DataRequest[] = [
  { id: "dr1", type: "access", fanName: "Marie L.", fanEmail: "marie.l@email.com", status: "pending", createdAt: "2026-06-08", expiresAt: "2026-07-08" },
  { id: "dr2", type: "deletion", fanName: "Juan P.", fanEmail: "juan.p@email.com", status: "pending", createdAt: "2026-06-07", expiresAt: "2026-07-07" },
  { id: "dr3", type: "portability", fanName: "Anna K.", fanEmail: "anna.k@email.com", status: "processing", createdAt: "2026-06-05", expiresAt: "2026-07-05" },
  { id: "dr4", type: "access", fanName: "Sofia R.", fanEmail: "sofia.r@email.com", status: "completed", createdAt: "2026-06-01", expiresAt: "2026-07-01" },
  { id: "dr5", type: "deletion", fanName: "James W.", fanEmail: "james.w@email.com", status: "completed", createdAt: "2026-05-28", expiresAt: "2026-06-28" },
  { id: "dr6", type: "access", fanName: "Olivia F.", fanEmail: "olivia.f@email.com", status: "rejected", createdAt: "2026-05-20", expiresAt: "2026-06-20" },
];

export const DATA_REQUEST_TYPE_LABELS: Record<DataRequestType, string> = {
  access: "Accès (Art.15)",
  deletion: "Suppression (Art.17)",
  portability: "Portabilité (Art.20)",
};

export const DATA_REQUEST_TYPE_COLORS: Record<DataRequestType, string> = {
  access: "#3B82F6",
  deletion: "#E5484D",
  portability: "#8B5CF6",
};

// ─── Compliance Score ───

export const COMPLIANCE_SCORE = 74;
export const COMPLIANCE_ALERTS = [
  { id: "ca1", level: "critical" as const, messageKey: "compliance.alert.critical.consent_dm" },
  { id: "ca2", level: "warning" as const, messageKey: "compliance.alert.warning.ig_rules" },
  { id: "ca3", level: "warning" as const, messageKey: "compliance.alert.warning.sms_consent" },
];
