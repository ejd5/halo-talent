import type { RolePermissions, Permission, Role, PermissionModule } from "./types";

// Module grouping — each module groups related actions
export const MODULES: Record<PermissionModule, { label: string; description: string; actions: string[] }> = {
  pilotage: {
    label: "Pilotage",
    description: "Vue d'ensemble, analytics, KPIs",
    actions: ["view_analytics", "export_data"],
  },
  createurs: {
    label: "Créateurs",
    description: "Gestion des profils créateurs",
    actions: ["view_creators", "edit_creators", "delete_creator", "create_creator"],
  },
  finances: {
    label: "Finances",
    description: "Revenus, commissions, paiements",
    actions: [
      "view_finances_all", "view_finances_assigned", "edit_commission_rate",
      "delete_financial_data", "approve_applications", "reject_applications",
    ],
  },
  contenu: {
    label: "Contenu",
    description: "CMS, site web, contenus",
    actions: ["edit_cms"],
  },
  juridique: {
    label: "Juridique",
    description: "Contrats et documents légaux",
    actions: ["view_contracts_all", "view_contracts_assigned", "edit_contracts"],
  },
  chat: {
    label: "Chat",
    description: "Messagerie et conversations",
    actions: ["send_messages", "view_messages_all"],
  },
  parametres: {
    label: "Paramètres",
    description: "Configuration système et équipe",
    actions: [
      "manage_team", "create_admin", "delete_admin",
      "view_audit_logs", "manage_system_settings", "manage_permissions",
    ],
  },
};

// Full permissions matrix
export const DEFAULT_PERMISSIONS: RolePermissions = {
  owner: {
    view_creators: true, edit_creators: true, delete_creator: true, create_creator: true,
    view_finances_all: true, view_finances_assigned: true, edit_commission_rate: true,
    approve_applications: true, reject_applications: true,
    send_messages: true, view_messages_all: true, edit_cms: true,
    manage_team: true, create_admin: true, delete_admin: true,
    view_audit_logs: true, view_analytics: true, export_data: true,
    delete_financial_data: true, manage_system_settings: true, manage_permissions: true,
    view_contracts_all: true, view_contracts_assigned: true, edit_contracts: true,
  },
  admin: {
    view_creators: true, edit_creators: true, delete_creator: true, create_creator: true,
    view_finances_all: true, view_finances_assigned: true, edit_commission_rate: false,
    approve_applications: true, reject_applications: true,
    send_messages: true, view_messages_all: true, edit_cms: true,
    manage_team: false, create_admin: false, delete_admin: false,
    view_audit_logs: true, view_analytics: true, export_data: true,
    delete_financial_data: false, manage_system_settings: false, manage_permissions: false,
    view_contracts_all: true, view_contracts_assigned: true, edit_contracts: true,
  },
  manager: {
    view_creators: true, edit_creators: true, delete_creator: false, create_creator: false,
    view_finances_all: false, view_finances_assigned: true, edit_commission_rate: false,
    approve_applications: false, reject_applications: false,
    send_messages: true, view_messages_all: false, edit_cms: false,
    manage_team: false, create_admin: false, delete_admin: false,
    view_audit_logs: false, view_analytics: true, export_data: false,
    delete_financial_data: false, manage_system_settings: false, manage_permissions: false,
    view_contracts_all: false, view_contracts_assigned: true, edit_contracts: true,
  },
  assistant: {
    view_creators: true, edit_creators: false, delete_creator: false, create_creator: false,
    view_finances_all: false, view_finances_assigned: false, edit_commission_rate: false,
    approve_applications: false, reject_applications: false,
    send_messages: true, view_messages_all: false, edit_cms: false,
    manage_team: false, create_admin: false, delete_admin: false,
    view_audit_logs: false, view_analytics: false, export_data: false,
    delete_financial_data: false, manage_system_settings: false, manage_permissions: false,
    view_contracts_all: false, view_contracts_assigned: false, edit_contracts: false,
  },
  chatter: {
    view_creators: true, edit_creators: false, delete_creator: false, create_creator: false,
    view_finances_all: false, view_finances_assigned: false, edit_commission_rate: false,
    approve_applications: false, reject_applications: false,
    send_messages: true, view_messages_all: false, edit_cms: false,
    manage_team: false, create_admin: false, delete_admin: false,
    view_audit_logs: false, view_analytics: false, export_data: false,
    delete_financial_data: false, manage_system_settings: false, manage_permissions: false,
    view_contracts_all: false, view_contracts_assigned: false, edit_contracts: false,
  },
  comptable: {
    view_creators: true, edit_creators: false, delete_creator: false, create_creator: false,
    view_finances_all: true, view_finances_assigned: true, edit_commission_rate: false,
    approve_applications: false, reject_applications: false,
    send_messages: false, view_messages_all: false, edit_cms: false,
    manage_team: false, create_admin: false, delete_admin: false,
    view_audit_logs: false, view_analytics: true, export_data: true,
    delete_financial_data: false, manage_system_settings: false, manage_permissions: false,
    view_contracts_all: false, view_contracts_assigned: false, edit_contracts: false,
  },
  viewer: {
    view_creators: true, edit_creators: false, delete_creator: false, create_creator: false,
    view_finances_all: false, view_finances_assigned: false, edit_commission_rate: false,
    approve_applications: false, reject_applications: false,
    send_messages: false, view_messages_all: false, edit_cms: false,
    manage_team: false, create_admin: false, delete_admin: false,
    view_audit_logs: false, view_analytics: true, export_data: false,
    delete_financial_data: false, manage_system_settings: false, manage_permissions: false,
    view_contracts_all: false, view_contracts_assigned: true, edit_contracts: false,
  },
};

export const ALL_ACTIONS: Permission[] = [
  { action: "view_creators", label: "Voir les créateurs", description: "Accès à la liste et profils" },
  { action: "edit_creators", label: "Modifier les créateurs", description: "Éditer profils et informations" },
  { action: "delete_creator", label: "Supprimer un créateur", description: "Supprimer définitivement un créateur" },
  { action: "create_creator", label: "Créer un créateur", description: "Ajouter un nouveau créateur" },
  { action: "view_finances_all", label: "Voir finances globales", description: "Accès aux données financières de tous" },
  { action: "view_finances_assigned", label: "Voir finances assignés", description: "Accès aux finances de ses créateurs" },
  { action: "edit_commission_rate", label: "Modifier commissions", description: "Changer les taux de commission" },
  { action: "approve_applications", label: "Approuver candidatures", description: "Accepter de nouveaux talents" },
  { action: "reject_applications", label: "Rejeter candidatures", description: "Refuser des candidatures" },
  { action: "send_messages", label: "Envoyer des messages", description: "Communiquer avec les créateurs" },
  { action: "view_messages_all", label: "Voir tous les messages", description: "Accès à toutes les conversations" },
  { action: "edit_cms", label: "Éditer le site web", description: "Modifier le contenu du site marketing" },
  { action: "manage_team", label: "Gérer l'équipe", description: "Ajouter/supprimer des membres" },
  { action: "create_admin", label: "Créer des admins", description: "Promouvoir des membres au rôle admin" },
  { action: "delete_admin", label: "Supprimer des admins", description: "Rétrograder/supprimer des admins" },
  { action: "view_audit_logs", label: "Voir les logs", description: "Consulter l'historique des actions" },
  { action: "view_analytics", label: "Voir les analytics", description: "Accès au dashboard analytics" },
  { action: "export_data", label: "Exporter les données", description: "Export CSV/PDF des données" },
  { action: "delete_financial_data", label: "Supprimer données financières", description: "Effacer des données de revenus" },
  { action: "manage_system_settings", label: "Paramètres système", description: "Modifier la configuration" },
  { action: "manage_permissions", label: "Gérer les permissions", description: "Modifier la matrice des rôles" },
  { action: "view_contracts_all", label: "Voir tous les contrats", description: "Accès à tous les contrats" },
  { action: "view_contracts_assigned", label: "Voir contrats assignés", description: "Contrats de ses créateurs" },
  { action: "edit_contracts", label: "Modifier les contrats", description: "Éditer et signer les contrats" },
];

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  manager: "Manager",
  assistant: "Assistant",
  chatter: "Chatter",
  comptable: "Comptable",
  viewer: "Viewer",
  custom: "Personnalisé",
};

export const ROLE_COLORS: Record<Role, string> = {
  owner: "var(--accent)",
  admin: "var(--success)",
  manager: "#4A90D9",
  assistant: "var(--text-secondary)",
  chatter: "#A855F7",
  comptable: "#F59E0B",
  viewer: "#94A3B8",
  custom: "var(--warning)",
};

// Category grouping for the UI (which roles appear in which section)
export const ROLE_CATEGORIES: { label: string; roles: Role[] }[] = [
  { label: "Direction", roles: ["owner", "admin"] },
  { label: "Gestion", roles: ["manager", "assistant"] },
  { label: "Spécialisé", roles: ["chatter", "comptable", "viewer"] },
];

// Resolve which actions a role can access in each module
export function getModuleActions(role: Role, module: PermissionModule, isAssigned: boolean, customPermissions?: Record<string, boolean>): string[] {
  const moduleActions = MODULES[module].actions;
  return moduleActions.filter((action) => canAccessResource(role, action, isAssigned, customPermissions));
}

export function canAccessResource(
  role: Role,
  action: string,
  isAssigned: boolean,
  customPermissions?: Record<string, boolean>
): boolean {
  if (customPermissions && action in customPermissions) {
    return customPermissions[action];
  }
  const rolePerms = DEFAULT_PERMISSIONS[role];
  if (!rolePerms) return false;
  const allowed = rolePerms[action];
  if (!allowed) return false;
  // For scoped roles (manager, assistant, chatter), check resource assignment
  if ((role === "manager" || role === "assistant" || role === "chatter") && !isAssigned) {
    if (action === "view_analytics" && role !== "chatter") return true;
    if (action === "send_messages") return true;
    return false;
  }
  return true;
}
