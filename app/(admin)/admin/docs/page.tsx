"use client";

import { useState } from "react";
import {
  Book,
  ChevronDown,
  Search,
  Command,
  Keyboard,
  Upload,
  Database,
  Globe,
  Users,
  Shield,
  Settings,
  FileText,
  LayoutDashboard,
} from "lucide-react";

type DocSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string[];
};

const SECTIONS: DocSection[] = [
  {
    id: "overview",
    title: "Vue d'ensemble",
    icon: LayoutDashboard,
    content: [
      "Halo Talent est une plateforme de management créatif. Ce panneau d'administration vous permet de gérer l'ensemble de vos opérations : candidatures, créateurs, finances, contenu, et paramètres système.",
      "L'interface est organisée en sections thématiques accessibles depuis la barre latérale gauche. Chaque section regroupe les fonctionnalités liées à un domaine métier.",
      "Conseil : utilisez ⌘K pour ouvrir la palette de commandes et accéder rapidement à n'importe quelle page.",
    ],
  },
  {
    id: "navigation",
    title: "Navigation & Raccourcis",
    icon: Command,
    content: [
      "Palette de commandes : ⌘K (ou Ctrl+K) — recherchez une page ou une action instantanément.",
      "Raccourcis clavier : appuyez sur ? pour afficher la liste complète des raccourcis disponibles.",
      "Navigation sidebar : cliquez sur une section pour développer son contenu. Utilisez les flèches du clavier dans la palette de commandes pour naviguer.",
      "Retour rapide : le logo Halo en haut de la sidebar vous ramène à la vue d'ensemble depuis n'importe quelle page.",
    ],
  },
  {
    id: "creators",
    title: "Gestion des Créateurs",
    icon: Users,
    content: [
      "Roster créateurs : consultez la liste complète des talents signés. Chaque fiche détaille les informations personnelles, les plateformes, les performances et l'historique des paiements.",
      "Candidatures : le pipeline d'acquisition affiche les candidatures entrantes avec leur statut (nouvelle, en revue, entretien, acceptée, refusée). Traitez-les directement depuis l'interface.",
      "Contrats : gérez les documents contractuels de chaque créateur. Téléchargez, renouvelez ou résiliez les contrats depuis la section dédiée.",
      "Performances : tableau de bord analytique par créateur avec KPIs (reach, engagement, revenus, croissance).",
    ],
  },
  {
    id: "finance",
    title: "Finances & Commissions",
    icon: Database,
    content: [
      "Revenus : vue consolidée des revenus générés par l'ensemble des créateurs, avec filtres par période et plateforme.",
      "Commissions : échelle dégressive de 30% à 10% selon le palier de revenus du créateur. Les commissions sont calculées automatiquement.",
      "Payouts : gérez les virements vers les créateurs. Suivez le statut de chaque paiement (en attente, en traitement, effectué).",
      "Stripe : connectez votre compte Stripe pour les paiements par carte. La section Stripe permet de configurer les webhooks et de voir les transactions.",
    ],
  },
  {
    id: "content",
    title: "Gestion de Contenu",
    icon: FileText,
    content: [
      "Calendrier éditorial : planifiez et visualisez les publications sur un calendrier mensuel, hebdomadaire ou journalier. Créez des posts directement depuis le calendrier.",
      "Bibliothèque média : centralisez tous les fichiers (images, vidéos, documents). La bibliothèque permet l'upload, l'analyse IA (tags, description, humeur, couleurs), et la modération automatique.",
      "Messages : messagerie interne entre administrateurs, managers et créateurs. Les conversations sont organisées par thread.",
    ],
  },
  {
    id: "site",
    title: "Site Web & Blog",
    icon: Globe,
    content: [
      "Pages : gérez le contenu des pages publiques du site Halo Talent (accueil, équipe, contact, etc.).",
      "Blog : rédigez et publiez des articles. Éditeur Markdown avec prévisualisation en temps réel.",
      "Roster public : la section Talents affiche les créateurs signés sur le site public. Activez/désactivez la visibilité de chaque talent.",
      "Manifeste : page statique présentant les valeurs et la vision de Halo Talent.",
    ],
  },
  {
    id: "social",
    title: "Réseaux Sociaux",
    icon: Globe,
    content: [
      "Comptes connectés : liez les comptes sociaux de vos créateurs (YouTube, Instagram, TikTok, OnlyFans, Twitter) pour centraliser les insights.",
      "Planificateur : programmez les publications sur les différentes plateformes depuis une interface unifiée.",
      "Insights : métriques agrégées par plateforme — abonnés, vues, engagement, croissance.",
    ],
  },
  {
    id: "media",
    title: "Bibliothèque Média",
    icon: Upload,
    content: [
      "Upload : glissez-déposez des fichiers ou cliquez pour sélectionner. Les formats supportés incluent JPEG, PNG, GIF, WebP, MP4, MOV, PDF.",
      "Analyse IA : chaque média uploadé peut être analysé automatiquement (description, tags, couleurs dominantes, humeur, plateformes suggérées).",
      "Modération : le système vérifie le contenu et signale les problèmes potentiels (contenu explicite, violence, etc.) sans bloquer automatiquement.",
      "Recherche : filtrez par type, créateur, plateforme, humeur, tags, ou période. Recherche full-text sur le titre et la description.",
      "Favoris : marquez vos médias préférés pour y accéder rapidement.",
    ],
  },
  {
    id: "settings",
    title: "Paramètres Système",
    icon: Settings,
    content: [
      "Équipe : gérez les comptes administrateurs et managers. Invitez de nouveaux membres par email.",
      "Permissions : contrôlez les accès par rôle (admin, manager, viewer). Chaque rôle a des permissions granulaires.",
      "Intégrations : configurez les connexions aux services externes (Supabase, Stripe, Resend, Telegram).",
      "API & Webhooks : gérez les clés API, les webhooks entrants et sortants. La documentation technique est disponible dans cette section.",
      "Audit logs : consultez l'historique des actions importantes effectuées dans le panneau d'administration.",
      "Système : informations sur la version, l'état des services, et les tâches planifiées (cron).",
    ],
  },
  {
    id: "security",
    title: "Sécurité & Bonnes Pratiques",
    icon: Shield,
    content: [
      "Mots de passe : utilisez un mot de passe fort et unique. L'authentification à deux facteurs (2FA) est recommandée pour les comptes administrateurs.",
      "Sessions : les sessions expirent après 24 heures. Vous serez déconnecté automatiquement passé ce délai.",
      "Audit : toutes les actions sensibles sont journalisées dans les audit logs. Consultez régulièrement ces logs pour détecter des activités suspectes.",
      "Données : les données sont chiffrées au repos (AES-256) et en transit (TLS 1.3). Les sauvegardes sont effectuées toutes les 30 minutes.",
      "API Keys : ne partagez jamais vos clés API. Utilisez des variables d'environnement pour les secrets. Régénérez les clés compromises immédiatement.",
    ],
  },
  {
    id: "keyboard",
    title: "Raccourcis Clavier",
    icon: Keyboard,
    content: [
      "⌘K — Palette de commandes (recherche rapide de pages et actions)",
      "? — Aide / liste des raccourcis clavier",
      "N — Nouvelle ressource (selon le contexte)",
      "M — Vue mois (calendrier)",
      "W — Vue semaine (calendrier)",
      "D — Vue jour (calendrier)",
      "T — Vue liste (calendrier)",
      "⌘U — Uploader un média (bibliothèque)",
      "⌘S — Enregistrer le document en cours",
      "⌘F — Rechercher dans la page courante",
      "Escape — Fermer le modal ou panneau ouvert",
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const activeDoc = SECTIONS.find((s) => s.id === activeSection) ?? SECTIONS[0];

  const filteredSections = searchQuery.trim()
    ? SECTIONS.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.some((c) =>
            c.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : SECTIONS;

  return (
    <div className="flex gap-8 min-h-[calc(100vh-128px)]">
      {/* Sidebar navigation */}
      <aside className="w-56 shrink-0 space-y-1">
        <div className="relative mb-4">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-secondary)" }}
          />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs py-2 pl-8 pr-3 outline-none border"
            style={{
              color: "var(--text-primary)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {filteredSections.map((section) => {
          const Icon = section.icon;
          const isActive = section.id === activeSection;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs transition-colors"
              style={{
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                background: isActive
                  ? "rgba(199,91,57,0.08)"
                  : "transparent",
              }}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span>{section.title}</span>
            </button>
          );
        })}
      </aside>

      {/* Content */}
      <div className="flex-1 max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <activeDoc.icon
              size={16}
              strokeWidth={1.5}
              style={{ color: "var(--accent)" }}
            />
            <h1
              className="text-lg font-semibold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              {activeDoc.title}
            </h1>
          </div>
        </div>

        <div className="space-y-5">
          {activeDoc.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer note */}
        <div
          className="mt-12 pt-6 border-t text-[10px]"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Dernière mise à jour — Juin 2026 · Halo Talent v1.0
        </div>
      </div>
    </div>
  );
}
