"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, TrendingUp, Target, Calendar, FileText, Image,
  Bot, Lightbulb, Sparkles, Monitor, BarChart3, UserCircle,
  MessageSquare, Users, FileSignature, GraduationCap, Heart,
  User, Link2, Settings, ChevronDown, LogOut, X, Globe,
  Inbox, Mail, Phone, Bell, Megaphone, Filter, Shuffle,
  MessageCircle, Zap, Database, Package, AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { mockCreator } from "./data";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, TrendingUp, Target, Calendar, FileText, Image,
  Bot, Lightbulb, Sparkles, Monitor, BarChart3, UserCircle,
  MessageSquare, Users, FileSignature, GraduationCap, Heart,
  User, Link2, Settings, Globe, Inbox, Mail, Phone, Bell,
  Megaphone, Filter, Shuffle, MessageCircle, Zap, Database,
  Package, AlertTriangle, ShieldCheck,
};

type NavItem = { label: string; href: string; icon: string };
type NavSection = { title: string; items: NavItem[] };

const navSections: NavSection[] = [
  { title: "Pilotage", items: [
    { label: "Vue d'ensemble", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Mes revenus", href: "/dashboard/revenues", icon: "TrendingUp" },
    { label: "Mes objectifs", href: "/dashboard/goals", icon: "Target" },
  ]},
  { title: "Intelligence", items: [
    { label: "Trend Hub", href: "/dashboard/trends", icon: "Sparkles" },
    { label: "Mes 6 agents IA", href: "/dashboard/agents", icon: "Bot" },
  ]},
  { title: "Création", items: [
    { label: "Composer", href: "/dashboard/composer", icon: "Calendar" },
    { label: "Génération IA", href: "/dashboard/ai-generation", icon: "Sparkles" },
    { label: "Brouillons", href: "/dashboard/drafts", icon: "FileText" },
    { label: "Bibliothèque", href: "/dashboard/library", icon: "Image" },
  ]},
  { title: "Fans", items: [
    { label: "CRM Fans", href: "/dashboard/atlas", icon: "Globe" },
    { label: "Smart Segments", href: "/dashboard/atlas/fans/segments", icon: "Filter" },
    { label: "Inbox unifié", href: "/dashboard/atlas/inbox", icon: "Inbox" },
    { label: "Smart Messages", href: "/dashboard/atlas/inbox/drafts", icon: "MessageCircle" },
    { label: "Campagnes", href: "/dashboard/atlas/campaigns/email", icon: "Mail" },
    { label: "Funnels", href: "/dashboard/atlas/funnels", icon: "Shuffle" },
    { label: "PPV Analytics", href: "/dashboard/sovereign-chat/ppv", icon: "BarChart3" },
    { label: "Vault", href: "/dashboard/sovereign-chat/vault", icon: "Package" },
    { label: "Fans à risque", href: "/dashboard/sovereign-chat/at-risk", icon: "AlertTriangle" },
  ]},
  { title: "Insights", items: [
    { label: "LTV & Churn", href: "/dashboard/sovereign-chat/predictions", icon: "TrendingUp" },
    { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  ]},
  { title: "Relations", items: [
    { label: "Mon manager", href: "/dashboard/manager", icon: "UserCircle" },
    { label: "Messages", href: "/dashboard/messages", icon: "MessageSquare" },
    { label: "Communauté", href: "/dashboard/community", icon: "Users" },
  ]},
  { title: "Ressources", items: [
    { label: "Knowledge Base", href: "/dashboard/knowledge-base", icon: "FileText" },
    { label: "Apprentissage", href: "/dashboard/learn", icon: "GraduationCap" },
    { label: "Wellness", href: "/dashboard/wellness", icon: "Heart" },
  ]},
  { title: "Paramètres", items: [
    { label: "Profil & ADN", href: "/dashboard/profile", icon: "User" },
    { label: "Plateformes connectées", href: "/dashboard/integrations", icon: "Link2" },
    { label: "Co-management", href: "/dashboard/settings/co-management", icon: "Users" },
    { label: "Intégrations tierces", href: "/dashboard/settings/integrations", icon: "Zap" },
    { label: "Préférences", href: "/dashboard/preferences", icon: "Settings" },
  ]},
];

const atlasNavSections: NavSection[] = [
  { title: "Atlas", items: [
    { label: "Vue d'ensemble", href: "/dashboard/atlas", icon: "Globe" },
  ]},
  { title: "CRM Fans", items: [
    { label: "Tous mes fans", href: "/dashboard/atlas/fans", icon: "Users" },
    { label: "Segments", href: "/dashboard/atlas/fans/segments", icon: "Filter" },
    { label: "Whales & VIP", href: "/dashboard/atlas/fans?tier=whale", icon: "Zap" },
  ]},
  { title: "Inbox & Messages", items: [
    { label: "Inbox unifié", href: "/dashboard/atlas/inbox", icon: "Inbox" },
    { label: "Brouillons IA", href: "/dashboard/atlas/inbox/drafts", icon: "MessageCircle" },
  ]},
  { title: "Campagnes", items: [
    { label: "Email marketing", href: "/dashboard/atlas/campaigns/email", icon: "Mail" },
    { label: "SMS marketing", href: "/dashboard/atlas/campaigns/sms", icon: "Phone" },
    { label: "Push notifications", href: "/dashboard/atlas/campaigns/push", icon: "Bell" },
  ]},
  { title: "Funnels", items: [
    { label: "Mes funnels", href: "/dashboard/atlas/funnels", icon: "Shuffle" },
    { label: "Lead Capture", href: "/dashboard/atlas/funnels/lead-capture", icon: "Globe" },
  ]},
  { title: "Engagement", items: [
    { label: "Modération", href: "/dashboard/atlas/comments", icon: "MessageSquare" },
  ]},
  { title: "Automations", items: [
    { label: "Mes règles", href: "/dashboard/atlas/rules", icon: "Zap" },
  ]},
  { title: "Analytics", items: [
    { label: "Vue d'ensemble", href: "/dashboard/atlas/analytics", icon: "BarChart3" },
  ]},
  { title: "PROTECTION", items: [
    { label: "Bouclier Légal", href: "/dashboard/atlas/legal", icon: "ShieldCheck" },
  ]},
  { title: "Paramètres", items: [
    { label: "Configuration", href: "/dashboard/atlas/settings", icon: "Settings" },
  ]},
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const isAtlas = pathname.startsWith("/dashboard/atlas");

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const sections = isAtlas ? atlasNavSections : navSections;

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#1A1614" }}>
      {/* Logo */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
        <Link href="/dashboard" className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
          Halo Talent
        </Link>
      </div>

      {/* Profile card */}
      <div className="mx-3 mt-3 p-3" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center text-xs font-semibold shrink-0" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "#1A1614", color: "#F5F0EB" }}>
            {mockCreator.full_name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate" style={{ color: "#F5F0EB" }}>{mockCreator.full_name}</div>
            <div className="text-xs truncate" style={{ color: "var(--color-ink-tertiary)" }}>{mockCreator.department}</div>
          </div>
        </div>
        {/* Commission badge */}
        <div className="mt-2 flex items-center justify-between px-2 py-1.5 text-xs font-medium" style={{ backgroundColor: "#1A1614" }}>
          <span style={{ color: "var(--color-ink-tertiary)" }}>{mockCreator.commission_tier}</span>
          <span style={{ color: "#C75B39" }}>{mockCreator.commission_rate}%</span>
        </div>
        {/* Workspace badge (Atlas seulement) */}
        {isAtlas && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[9px]" style={{ color: "var(--color-ink-tertiary)" }}>Digital Creators</span>
            <span className="text-[8px] px-1 py-px" style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "#C75B39" }}>Atlas</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {sections.map((section) => {
          const isCollapsed = collapsed[section.title];
          const visibleItems = isCollapsed ? section.items.slice(0, 2) : section.items;
          const hasMore = section.items.length > 2;

          return (
            <div key={section.title} className="mb-4">
              <div
                className="flex items-center justify-between px-2 py-1.5 cursor-pointer"
                onClick={() => {
                  if (hasMore) {
                    setCollapsed(prev => ({ ...prev, [section.title]: !prev[section.title] }));
                  }
                }}
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-ink-tertiary)" }}>
                  {section.title}
                </p>
                {hasMore && (
                  <ChevronDown
                    size={10}
                    className="transition-transform"
                    style={{
                      color: "var(--color-ink-tertiary)",
                      transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  />
                )}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = iconMap[item.icon] || FileText;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-2 py-1.5 text-xs transition-all"
                      style={{
                        color: active ? "#C75B39" : "var(--color-ink-secondary)",
                        backgroundColor: active ? "rgba(199,91,57,0.08)" : "transparent",
                      }}
                    >
                      <Icon size={14} strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <div className="absolute left-0 top-0 bottom-0 w-72 overflow-y-auto" style={{ backgroundColor: "#1A1614" }}>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop */}
      <div className="hidden md:block w-56 shrink-0 h-screen sticky top-0 overflow-y-auto" style={{ backgroundColor: "#1A1614", borderRight: "1px solid rgba(245,240,235,0.04)" }}>
        {sidebarContent}
      </div>
    </>
  );
}
