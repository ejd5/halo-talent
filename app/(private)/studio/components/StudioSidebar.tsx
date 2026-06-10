"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  LayoutDashboard, PenSquare, Sparkles, Image, Video,
  Headphones, User, Sliders, Film, Music, Layout,
  Send, Clock, History, BarChart3, Lightbulb,
  Globe, Coins, KeyRound, ChevronDown, ChevronLeft, ChevronRight,
  MessageCircle, Users, Filter, Mail, AlertTriangle,
  Shield, BookOpen, GraduationCap, Heart, UserCircle,
  Settings, MessageSquare, TrendingUp, Target,
  PanelRightClose, PanelRightOpen, FileText,
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
    title: "Accueil",
    items: [
      { label: "Vue d'ensemble", href: "/studio", icon: LayoutDashboard },
    ],
  },
  {
    title: "Créer",
    items: [
      { label: "Composer", href: "/studio/composer", icon: PenSquare },
      {
        label: "Studio IA",
        icon: Sparkles,
        submenu: [
          { label: "Texte & Captions", href: "/studio/generate/text", icon: Sparkles },
          { label: "Images", href: "/studio/generate/image", icon: Image },
          { label: "Vidéos", href: "/studio/generate/video", icon: Video },
          { label: "Audio & Voix", href: "/studio/generate/audio", icon: Headphones },
          { label: "Avatars parlants", href: "/studio/generate/avatar", icon: User },
        ],
      },
      {
        label: "Éditeurs",
        icon: Sliders,
        submenu: [
          { label: "Photo Studio", href: "/studio/edit/photo", icon: Sliders },
          { label: "Video Studio", href: "/studio/edit/video", icon: Film },
          { label: "Audio Editor", href: "/studio/edit/audio", icon: Music },
        ],
      },
      { label: "Vault & Brouillons", href: "/studio/vault", icon: Layout },
      { label: "Templates", href: "/studio/templates", icon: Layout },
      { label: "Média Kit", href: "/studio/mediakit", icon: FileText },
    ],
  },
  {
    title: "Publier",
    items: [
      { label: "Calendrier", href: "/studio/composer", icon: Clock },
      { label: "Programmer", href: "/studio/scheduled", icon: Send },
      { label: "Multi-publish", href: "/studio/publish", icon: Send },
      { label: "Historique", href: "/studio/history", icon: History },
    ],
  },
  {
    title: "Analyser",
    items: [
      { label: "Performance", href: "/studio/insights", icon: BarChart3 },
      { label: "Tendances", href: "/dashboard/trends", icon: TrendingUp },
      { label: "Ce qui marche", href: "/studio/learnings", icon: Lightbulb },
      { label: "Revenus", href: "/dashboard/revenues", icon: Target },
    ],
  },
  {
    title: "Fans",
    items: [
      {
        label: "Inbox unifiée",
        href: "/dashboard/atlas/inbox",
        icon: MessageSquare,
      },
      {
        label: "Chat Copilot",
        href: "/dashboard/atlas/revenue-inbox",
        icon: MessageCircle,
      },
      { label: "Segments", href: "/dashboard/atlas/fans/segments", icon: Filter },
      { label: "Campagnes", href: "/dashboard/atlas/campaigns/email", icon: Mail },
      {
        label: "Fans à risque",
        href: "/dashboard/sovereign-chat/at-risk",
        icon: AlertTriangle,
      },
    ],
  },
];

const BOTTOM_ITEMS: SidebarItem[] = [
  {
    label: "Paramètres",
    icon: Settings,
    submenu: [
      { label: "Profil & ADN", href: "/onboarding/dna", icon: UserCircle },
      { label: "Plateformes", href: "/studio/platforms", icon: Globe },
      { label: "Crédits IA", href: "/studio/credits", icon: Coins },
      { label: "Intégrations", href: "/dashboard/settings/integrations", icon: KeyRound },
      { label: "BYOK — Clés API", href: "/studio/api-keys", icon: KeyRound },
    ],
  },
  {
    label: "Bouclier Légal",
    href: "/protection",
    icon: Shield,
    badge: { label: "Gratuit", color: "var(--success)" },
  },
  {
    label: "Ressources",
    icon: BookOpen,
    submenu: [
      { label: "Knowledge Base", href: "/dashboard/knowledge-base", icon: BookOpen },
      { label: "Apprentissage", href: "/studio/learnings", icon: GraduationCap },
      { label: "Wellness", href: "/dashboard/wellness", icon: Heart },
    ],
  },
  { label: "Mon manager", href: "/dashboard/manager", icon: UserCircle },
];

/* ─── Active check helper ─── */

function isItemActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (href === "/studio") return pathname === "/studio";
  return pathname.startsWith(href);
}

function isSectionActive(pathname: string, item: SidebarItem): boolean {
  if (item.href && isItemActive(pathname, item.href)) return true;
  if (item.submenu) return item.submenu.some((s) => isItemActive(pathname, s.href));
  return false;
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
  level = 0,
}: {
  item: SidebarItem;
  collapsed: boolean;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  level?: number;
}) {
  const hasSubmenu = !!item.submenu && item.submenu.length > 0;
  const active = isSectionActive(pathname, item);
  const Icon = item.icon;

  // If collapsed, always show as simple icon link with tooltip
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
          {/* Tooltip */}
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-xs whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
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
        {/* Badge dot for collapsed */}
        {item.badge && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: item.badge.color }}
          />
        )}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-xs whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: "var(--text-primary)",
            color: "var(--bg-primary)",
          }}
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

      {/* Sub-menu */}
      {hasSubmenu && expanded && (
        <div className="mt-0.5 space-y-0.5 overflow-hidden animate-slide-down">
          {item.submenu!.map((sub) => (
            <SubMenuItem
              key={sub.href}
              item={sub}
              collapsed={collapsed}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */

export function StudioSidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [bottomExpanded, setBottomExpanded] = useState<Set<string>>(new Set());

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
            Studio
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-1 custom-scrollbar">
        {MAIN_SECTIONS.map((section) => (
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
          style={{
            padding: "8px 12px",
            color: "var(--text-tertiary)",
          }}
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
          aria-label="Navigation Studio"
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
