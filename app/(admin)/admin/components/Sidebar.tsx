"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  GitPullRequest,
  Users,
  TrendingUp,
  FileSignature,
  DollarSign,
  Percent,
  Banknote,
  CreditCard,
  CalendarDays,
  Library,
  MessageSquare,
  Globe,
  BookOpen,
  UserCheck,
  FileCode,
  AtSign,
  Clock,
  PieChart,
  Settings,
  Shield,
  Puzzle,
  KeyRound,
  ScrollText,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Book,
  Zap,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: "Pilotage",
    items: [
      { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Acquisition",
    items: [
      {
        label: "Candidatures",
        href: "/admin/applications",
        icon: FileText,
        badge: 12,
      },
      { label: "Pipeline", href: "/admin/pipeline", icon: GitPullRequest },
    ],
  },
  {
    title: "Créateurs",
    items: [
      { label: "Roster", href: "/admin/creators", icon: Users },
      {
        label: "Performances",
        href: "/admin/creators/performance",
        icon: TrendingUp,
      },
      { label: "Contrats", href: "/admin/contracts", icon: FileSignature },
      { label: "Benchmarking", href: "/admin/benchmarking", icon: BarChart3 },
      { label: "Calendrier multi-créateur", href: "/admin/content-calendar", icon: CalendarDays },
    ],
  },
  {
    title: "Équipe",
    items: [
      { label: "Membres", href: "/admin/team", icon: UserCheck },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { label: "Système", href: "/admin/monitoring", icon: Cpu },
      { label: "Audit logs", href: "/admin/settings/logs", icon: ScrollText },
    ],
  },
  {
    title: "Finances",
    items: [
      { label: "Revenus", href: "/admin/revenue", icon: DollarSign },
      { label: "Commissions", href: "/admin/commissions", icon: Percent },
      { label: "Payouts", href: "/admin/payouts", icon: Banknote },
      { label: "Stripe", href: "/admin/stripe", icon: CreditCard },
    ],
  },
  {
    title: "Contenu",
    items: [
      { label: "Calendrier", href: "/admin/calendar", icon: CalendarDays },
      { label: "Bibliothèque", href: "/admin/library", icon: Library },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    ],
  },
  {
    title: "Site web",
    items: [
      { label: "Pages", href: "/admin/site/pages", icon: Globe },
      { label: "Blog", href: "/admin/site/blog", icon: BookOpen },
      { label: "Talents", href: "/admin/site/roster", icon: UserCheck },
      { label: "Manifeste", href: "/admin/site/manifesto", icon: FileCode },
    ],
  },
  {
    title: "Réseaux sociaux",
    items: [
      {
        label: "Comptes connectés",
        href: "/admin/social/accounts",
        icon: AtSign,
      },
      {
        label: "Planificateur",
        href: "/admin/social/scheduler",
        icon: Clock,
      },
      { label: "Insights", href: "/admin/social/insights", icon: PieChart },
    ],
  },
  {
    title: "Atlas",
    items: [
      { label: "Monitoring Atlas", href: "/admin/atlas/monitoring", icon: Zap },
    ],
  },
  {
    title: "Juridique & Protection",
    items: [
      { label: "Base juridique", href: "/admin/legal/knowledge", icon: BookOpen },
      { label: "Clauses abusives", href: "/admin/legal/clauses", icon: FileSignature },
      { label: "Analyses contrats", href: "/admin/legal/analyses", icon: BarChart3 },
      { label: "Journal mises à jour", href: "/admin/legal/updates", icon: Clock },
    ],
  },
  {
    title: "Paramètres",
    items: [
      { label: "Équipe", href: "/admin/settings/team", icon: Settings },
      {
        label: "Permissions",
        href: "/admin/settings/permissions",
        icon: Shield,
      },
      {
        label: "Intégrations",
        href: "/admin/settings/integrations",
        icon: Puzzle,
      },
      { label: "API & Webhooks", href: "/admin/settings/api", icon: KeyRound },
      { label: "Audit logs", href: "/admin/settings/logs", icon: ScrollText },
      { label: "Système", href: "/admin/settings/system", icon: Cpu },
    ],
  },
  {
    title: "Ressources",
    items: [
      { label: "Documentation", href: "/admin/docs", icon: Book },
    ],
  },
];

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  width: number;
};

export function Sidebar({ collapsed, onToggle, width }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col border-r z-30 transition-all duration-200 overflow-hidden"
      style={{
        width,
        background: "#0A0908",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 shrink-0"
        style={{
          padding: collapsed ? "16px 12px" : "16px 20px",
          height: 64,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="w-7 h-7 rounded-none flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: "#C75B39", color: "#F5F0EB" }}
        >
          H
        </div>
        {!collapsed && (
          <span
            className="font-display text-base whitespace-nowrap"
            style={{ color: "#F5F0EB" }}
          >
            Halo<span style={{ color: "#C75B39" }}> · </span>Admin
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="mb-5">
            {!collapsed && (
              <p
                className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] px-2 mb-2"
                style={{ color: "#E0D8D0" }}
              >
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-none text-sm font-sans transition-colors",
                      collapsed ? "justify-center px-0 py-2" : "px-3 py-2"
                    )}
                    style={{
                      color: isActive ? "#C75B39" : "#F5F0EB",
                      background: isActive
                        ? "rgba(199,91,57,0.08)"
                        : "transparent",
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={collapsed ? 20 : 18} strokeWidth={1.5} />
                    {!collapsed && (
                      <span className="flex-1 truncate text-[13px]">
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className="text-[10px] font-sans font-semibold px-1.5 py-0.5"
                        style={{
                          background: "rgba(199,91,57,0.15)",
                          color: "#C75B39",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center shrink-0 transition-colors hover:bg-white/5"
        style={{
          height: 44,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "#E0D8D0",
        }}
        aria-label={collapsed ? "Ouvrir le menu" : "Réduire le menu"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
