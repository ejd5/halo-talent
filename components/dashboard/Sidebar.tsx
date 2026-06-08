"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, TrendingUp, Target, Calendar, FileText, Image,
  Bot, Lightbulb, Sparkles, Monitor, BarChart3, UserCircle,
  MessageSquare, Users, FileSignature, GraduationCap, Heart,
  User, Link2, Settings, ChevronDown, LogOut, X,
} from "lucide-react";
import { mockCreator } from "./data";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, TrendingUp, Target, Calendar, FileText, Image,
  Bot, Lightbulb, Sparkles, Monitor, BarChart3, UserCircle,
  MessageSquare, Users, FileSignature, GraduationCap, Heart,
  User, Link2, Settings,
};

type NavItem = { label: string; href: string; icon: string };
type NavSection = { title: string; items: NavItem[] };

const navSections: NavSection[] = [
  { title: "Pilotage", items: [
    { label: "Vue d'ensemble", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Mes revenus", href: "/dashboard/revenues", icon: "TrendingUp" },
    { label: "Mes objectifs", href: "/dashboard/goals", icon: "Target" },
  ]},
  { title: "Contenu", items: [
    { label: "Calendrier", href: "/dashboard/calendar", icon: "Calendar" },
    { label: "Brouillons", href: "/dashboard/drafts", icon: "FileText" },
    { label: "Bibliothèque", href: "/dashboard/library", icon: "Image" },
  ]},
  { title: "Intelligence", items: [
    { label: "Mes agents IA", href: "/dashboard/agents", icon: "Bot" },
    { label: "Insights", href: "/dashboard/insights", icon: "Lightbulb" },
    { label: "Tendances", href: "/dashboard/trends", icon: "Sparkles" },
  ]},
  { title: "Plateformes", items: [
    { label: "Mes comptes", href: "/dashboard/platforms", icon: "Monitor" },
    { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  ]},
  { title: "Relations", items: [
    { label: "Mon manager", href: "/dashboard/manager", icon: "UserCircle" },
    { label: "Mes messages", href: "/dashboard/messages", icon: "MessageSquare" },
    { label: "Communauté", href: "/dashboard/community", icon: "Users" },
  ]},
  { title: "Ressources", items: [
    { label: "Mes contrats", href: "/dashboard/contracts", icon: "FileSignature" },
    { label: "Apprentissage", href: "/dashboard/learn", icon: "GraduationCap" },
    { label: "Wellness", href: "/dashboard/wellness", icon: "Heart" },
  ]},
  { title: "Paramètres", items: [
    { label: "Profil", href: "/dashboard/profile", icon: "User" },
    { label: "Plateformes connectées", href: "/dashboard/integrations", icon: "Link2" },
    { label: "Préférences", href: "/dashboard/preferences", icon: "Settings" },
  ]},
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <Link href="/dashboard" className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Halo Talent
        </Link>
      </div>

      {/* Profile card */}
      <div className="mx-3 mt-3 p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: "var(--color-base)" }}>
            {mockCreator.full_name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate">{mockCreator.full_name}</div>
            <div className="text-[10px] opacity-40 truncate">{mockCreator.department}</div>
          </div>
        </div>
        {/* Commission badge */}
        <div className="mt-2 flex items-center justify-between px-2 py-1 text-[9px] font-medium" style={{ backgroundColor: "var(--color-base)" }}>
          <span className="opacity-60">{mockCreator.commission_tier}</span>
          <span style={{ color: "var(--color-accent)" }}>{mockCreator.commission_rate}%</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
        {navSections.map((section) => {
          const key = section.title;
          const isCollapsed = collapsed[key];
          return (
            <div key={key}>
              <button
                onClick={() => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))}
                className="flex items-center justify-between w-full px-1 mb-1"
              >
                <span className="text-[9px] font-semibold uppercase tracking-widest opacity-30">{section.title}</span>
                <ChevronDown size={10} className={`opacity-20 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = iconMap[item.icon];
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                          active
                            ? "text-[var(--color-accent)] border-l-2 border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                            : "opacity-50 hover:opacity-100 border-l-2 border-transparent"
                        }`}
                      >
                        {Icon && <Icon size={14} />}
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-[var(--color-border)] p-3">
        <button className="flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium opacity-30 hover:opacity-100 transition-opacity w-full">
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col border-r border-[var(--color-border)] z-30" style={{ backgroundColor: "var(--color-base)" }}>
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col border-r border-[var(--color-border)] z-10" style={{ backgroundColor: "var(--color-base)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Menu</span>
              <button onClick={onClose} className="p-1 hover:bg-[var(--color-card)]"><X size={16} /></button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
