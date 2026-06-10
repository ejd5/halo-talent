"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, BarChart3, TrendingUp, Users, FileText,
  GitPullRequest, FileSignature, CalendarDays, DollarSign,
  Percent, Banknote, CreditCard, Library, AtSign, Clock,
  Globe, BookOpen, UserCheck, FileCode, Shield, Puzzle,
  KeyRound, ScrollText, Settings, Book, ChevronDown,
  PanelRightClose, ArrowLeft,
} from "lucide-react";

/* ─── Types ─── */

type SubMenuItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type SidebarItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  submenu?: SubMenuItem[];
  badge?: { label: string; color: string };
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

/* ─── Nav Data ─── */

const MAIN_SECTIONS: SidebarSection[] = [
  {
    title: "Pilotage",
    items: [
      { label: "Command Center", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Benchmark marché", href: "/admin/benchmarking", icon: TrendingUp },
    ],
  },
  {
    title: "Créateurs",
    items: [
      { label: "Roster", href: "/admin/creators", icon: Users },
      { label: "Performances", href: "/admin/creators/performance", icon: TrendingUp },
      {
        label: "Candidatures",
        href: "/admin/applications",
        icon: FileText,
        badge: { label: "12", color: "var(--accent)" },
      },
      { label: "Pipeline", href: "/admin/pipeline", icon: GitPullRequest },
      { label: "Contrats", href: "/admin/contracts", icon: FileSignature },
      { label: "Calendrier multi-créateur", href: "/admin/content-calendar", icon: CalendarDays },
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
    title: "Contenu & Réseaux",
    items: [
      { label: "Calendrier éditorial", href: "/admin/calendar", icon: CalendarDays },
      { label: "Bibliothèque", href: "/admin/library", icon: Library },
      { label: "Comptes connectés", href: "/admin/social/accounts", icon: AtSign },
      { label: "Planificateur", href: "/admin/social/scheduler", icon: Clock },
      {
        label: "Site web",
        icon: Globe,
        submenu: [
          { label: "Pages", href: "/admin/site/pages", icon: Globe },
          { label: "Blog", href: "/admin/site/blog", icon: BookOpen },
          { label: "Talents", href: "/admin/site/roster", icon: UserCheck },
          { label: "Manifeste", href: "/admin/site/manifesto", icon: FileCode },
        ],
      },
    ],
  },
];

const BOTTOM_ITEMS: SidebarItem[] = [
  {
    label: "Juridique & Protection",
    icon: Shield,
    submenu: [
      { label: "Base juridique", href: "/admin/legal/knowledge", icon: BookOpen },
      { label: "Clauses abusives", href: "/admin/legal/clauses", icon: FileSignature },
      { label: "Analyses contrats", href: "/admin/legal/analyses", icon: BarChart3 },
      { label: "Journal mises à jour", href: "/admin/legal/updates", icon: Clock },
    ],
  },
  {
    label: "Équipe & Permissions",
    icon: Shield,
    submenu: [
      { label: "Équipe", href: "/admin/settings/team", icon: Users },
      { label: "Permissions", href: "/admin/settings/permissions", icon: Shield },
    ],
  },
  {
    label: "Paramètres",
    icon: Settings,
    submenu: [
      { label: "Intégrations", href: "/admin/settings/integrations", icon: Puzzle },
      { label: "API & Webhooks", href: "/admin/settings/api", icon: KeyRound },
      { label: "Audit logs", href: "/admin/settings/logs", icon: ScrollText },
      { label: "Système", href: "/admin/settings/system", icon: Settings },
    ],
  },
  { label: "Documentation", href: "/admin/docs", icon: Book },
];

/* ─── Contextual Creator Menu ─── */

const CREATOR_TOOLS: SidebarItem[] = [
  { label: "Stats", href: "/admin/creators/performance", icon: TrendingUp },
  { label: "Contrat", href: "/admin/contracts", icon: FileSignature },
  { label: "Calendrier", href: "/admin/content-calendar", icon: CalendarDays },
];

/* ─── Active check helper ─── */

function isItemActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function isSectionActive(pathname: string, item: SidebarItem): boolean {
  if (item.href && isItemActive(pathname, item.href)) return true;
  if (item.submenu) return item.submenu.some((s) => isItemActive(pathname, s.href));
  return false;
}

function isCreatorDetailRoute(pathname: string): boolean {
  return /^\/admin\/creators\/[^/]+$/.test(pathname) && pathname !== "/admin/creators";
}

/* ─── SubMenu Component ─── */

function SubMenuItem({ item, collapsed, pathname }: { item: SubMenuItem; collapsed: boolean; pathname: string }) {
  const active = isItemActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 transition-all rounded-md"
      style={{
        color: active ? "var(--accent)" : "var(--text-secondary)",
        backgroundColor: active ? "var(--accent-soft)" : "transparent",
        padding: collapsed ? "8px 0" : "6px 12px 6px 32px",
        justifyContent: collapsed ? "center" : "flex-start",
      }}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={14} strokeWidth={1.5} className="shrink-0" />
      {!collapsed && <span className="text-xs truncate">{item.label}</span>}
    </Link>
  );
}

/* ─── NavItem Component ─── */

function NavItemComponent({
  item,
  collapsed,
  pathname,
  expanded,
  onToggle,
}: {
  item: SidebarItem;
  collapsed: boolean;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasSubmenu = !!item.submenu && item.submenu.length > 0;
  const active = isSectionActive(pathname, item);
  const Icon = item.icon;

  // Collapsed mode
  if (collapsed) {
    if (hasSubmenu) {
      return (
        <div className="relative group">
          <div
            className="flex items-center justify-center py-3 cursor-pointer transition-colors rounded-md"
            style={{ color: active ? "var(--accent)" : "var(--text-secondary)" }}
            onClick={onToggle}
            title={item.label}
          >
            <Icon size={18} strokeWidth={1.5} />
          </div>
          <div
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-xs whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-primary)" }}
          >
            {item.label}
          </div>
        </div>
      );
    }

    return (
      <Link
        href={item.href!}
        className="relative group flex items-center justify-center py-3 transition-colors rounded-md"
        style={{ color: active ? "var(--accent)" : "var(--text-secondary)" }}
        title={item.label}
      >
        <Icon size={18} strokeWidth={1.5} />
        {item.badge && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: item.badge.color }}
          />
        )}
        <div
          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-xs whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-primary)" }}
        >
          {item.label}
        </div>
      </Link>
    );
  }

  // Expanded mode
  return (
    <div>
      {hasSubmenu ? (
        <button
          onClick={onToggle}
          className="flex items-center gap-3 w-full transition-all rounded-md"
          style={{
            color: active ? "var(--accent)" : "var(--text-secondary)",
            backgroundColor: active ? "var(--accent-soft)" : "transparent",
            padding: "8px 12px",
          }}
        >
          <Icon size={18} strokeWidth={1.5} className="shrink-0" />
          <span className="text-sm flex-1 text-left truncate">{item.label}</span>
          <ChevronDown
            size={14}
            className="shrink-0 transition-transform duration-150"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      ) : (
        <Link
          href={item.href!}
          className="flex items-center gap-3 transition-all rounded-md"
          style={{
            color: active ? "var(--accent)" : "var(--text-secondary)",
            backgroundColor: active ? "var(--accent-soft)" : "transparent",
            padding: "8px 12px",
          }}
        >
          <Icon size={18} strokeWidth={1.5} className="shrink-0" />
          <span className="text-sm flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${item.badge.color}20`, color: item.badge.color }}
            >
              {item.badge.label}
            </span>
          )}
        </Link>
      )}

      {hasSubmenu && expanded && (
        <div className="mt-0.5 space-y-0.5 overflow-hidden animate-slide-down">
          {item.submenu!.map((sub) => (
            <SubMenuItem key={sub.href} item={sub} collapsed={collapsed} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [bottomExpanded, setBottomExpanded] = useState<Set<string>>(new Set());

  const isCreatorContext = isCreatorDetailRoute(pathname);

  // Hydrate collapsed state from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  // Persist collapsed state
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("admin_sidebar_collapsed", String(collapsed));
  }, [collapsed, mounted]);

  // Auto-open submenu containing active page
  useEffect(() => {
    const toOpen = new Set<string>();
    for (const section of MAIN_SECTIONS) {
      for (const item of section.items) {
        if (item.submenu && item.submenu.some((s) => isItemActive(pathname, s.href))) {
          toOpen.add(item.label);
        }
      }
    }
    for (const item of BOTTOM_ITEMS) {
      if (item.submenu && item.submenu.some((s) => isItemActive(pathname, s.href))) {
        toOpen.add(item.label);
      }
    }
    if (toOpen.size > 0) {
      setExpandedMenus((prev) => new Set([...prev, ...toOpen]));
      setBottomExpanded((prev) => new Set([...prev, ...toOpen]));
    }
  }, [pathname]);

  const toggleMenu = (label: string, isBottom: boolean) => {
    if (isBottom) {
      setBottomExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        return next;
      });
    } else {
      setExpandedMenus((prev) => {
        const next = new Set(prev);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        return next;
      });
    }
  };

  const sidebarWidth = collapsed ? 64 : 240;

  const sidebarContent = (
    <div
      className="flex flex-col h-full transition-all duration-150"
      style={{
        width: sidebarWidth,
        backgroundColor: "var(--bg-surface)",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center shrink-0 gap-3 transition-all duration-150"
        style={{
          padding: collapsed ? "16px 12px" : "16px 20px",
          height: 64,
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0 rounded-lg"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
        >
          H
        </div>
        {!collapsed && (
          <span
            className="text-lg font-semibold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Admin
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-1 custom-scrollbar">
        {/* Creator Context Mode */}
        {isCreatorContext && !collapsed && (
          <div className="mb-2">
            <Link
              href="/admin/creators"
              className="flex items-center gap-2 px-2 py-2 text-xs rounded-md mb-3"
              style={{ color: "var(--accent)" }}
            >
              <ArrowLeft size={14} />
              <span>Roster</span>
            </Link>
            <p
              className="text-caption px-2 pt-1 pb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Créateur
            </p>
            <div className="space-y-0.5">
              {CREATOR_TOOLS.map((item) => (
                <NavItemComponent
                  key={item.label}
                  item={item}
                  collapsed={collapsed}
                  pathname={pathname}
                  expanded={false}
                  onToggle={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Normal mode */}
        {!isCreatorContext &&
          MAIN_SECTIONS.map((section) => (
            <div key={section.title} className="mb-1">
              {!collapsed && (
                <p
                  className="text-caption px-2 pt-4 pb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItemComponent
                    key={item.label}
                    item={item}
                    collapsed={collapsed}
                    pathname={pathname}
                    expanded={expandedMenus.has(item.label)}
                    onToggle={() => toggleMenu(item.label, false)}
                  />
                ))}
              </div>
            </div>
          ))}
      </nav>

      {/* Bottom section */}
      <div
        className="shrink-0 px-2 py-2 space-y-0.5"
        style={{ borderTop: "1px solid var(--border-default)" }}
      >
        {BOTTOM_ITEMS.map((item) => (
          <NavItemComponent
            key={item.label}
            item={item}
            collapsed={collapsed}
            pathname={pathname}
            expanded={bottomExpanded.has(item.label)}
            onToggle={() => toggleMenu(item.label, true)}
          />
        ))}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-3 w-full transition-all rounded-md mt-2"
          style={{ padding: "8px 12px", color: "var(--text-tertiary)" }}
        >
          <PanelRightClose size={18} strokeWidth={1.5} className="shrink-0" />
          {!collapsed && <span className="text-xs">Réduire</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Admin"
        >
          <div
            className="absolute inset-0 animate-fade-in-overlay"
            style={{ backgroundColor: "var(--bg-overlay)" }}
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 bottom-0 overflow-y-auto animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
