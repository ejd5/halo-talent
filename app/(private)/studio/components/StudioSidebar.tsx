"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  LayoutDashboard, PenSquare, Sparkles, Image, Video,
  Headphones, User, Sliders, Film, Music, Layout, Layers,
  ShoppingBag, Send, Clock, History, BarChart3, Lightbulb,
  Globe, Coins, KeyRound, ChevronLeft, ChevronRight,
} from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ElementType };
type NavSection = { title: string; items: NavItem[] };

const NAV: NavSection[] = [
  {
    title: "Création",
    items: [
      { label: "Vue d'ensemble", href: "/studio", icon: LayoutDashboard },
      { label: "Composer", href: "/studio/composer", icon: PenSquare },
    ],
  },
  {
    title: "Génération IA",
    items: [
      { label: "Texte & Captions", href: "/studio/generate/text", icon: Sparkles },
      { label: "Images", href: "/studio/generate/image", icon: Image },
      { label: "Vidéos", href: "/studio/generate/video", icon: Video },
      { label: "Audio & Voix", href: "/studio/generate/audio", icon: Headphones },
      { label: "Avatars parlants", href: "/studio/generate/avatar", icon: User },
    ],
  },
  {
    title: "Édition",
    items: [
      { label: "Photo Studio", href: "/studio/edit/photo", icon: Sliders },
      { label: "Video Studio", href: "/studio/edit/video", icon: Film },
      { label: "Audio Editor", href: "/studio/edit/audio", icon: Music },
    ],
  },
  {
    title: "Templates",
    items: [
      { label: "Bibliothèque", href: "/studio/templates", icon: Layout },
      { label: "Mes templates", href: "/studio/templates/mine", icon: Layers },
      { label: "Marketplace", href: "/studio/templates/market", icon: ShoppingBag },
    ],
  },
  {
    title: "Publication",
    items: [
      { label: "Multi-publish", href: "/studio/publish", icon: Send },
      { label: "Programmé", href: "/studio/scheduled", icon: Clock },
      { label: "Historique", href: "/studio/history", icon: History },
    ],
  },
  {
    title: "Data & Apprentissage",
    items: [
      { label: "Performance", href: "/studio/insights", icon: BarChart3 },
      { label: "Ce qui marche", href: "/studio/learnings", icon: Lightbulb },
    ],
  },
  {
    title: "Plateformes",
    items: [
      { label: "Comptes connectés", href: "/studio/platforms", icon: Globe },
    ],
  },
  {
    title: "Paramètres",
    items: [
      { label: "Crédits IA", href: "/studio/credits", icon: Coins },
      { label: "BYOK — Clés API", href: "/studio/api-keys", icon: KeyRound },
    ],
  },
];

export function StudioSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-30 transition-all duration-200 overflow-hidden border-r"
      style={{
        width: collapsed ? 72 : 260,
        background: "#1A1614",
        borderColor: "rgba(245,240,235,0.04)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center shrink-0"
        style={{
          padding: collapsed ? "16px 12px" : "16px 20px",
          height: 64,
          borderBottom: "1px solid rgba(245,240,235,0.04)",
        }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "#C75B39", color: "#F5F0EB" }}
        >
          H
        </div>
        {!collapsed && (
          <span
            className="text-[1.3rem] font-semibold tracking-[-0.02em] ml-3"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
          >
            Studio
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-thin">
        {NAV.map((section) => (
          <div key={section.title} className="mb-2">
            {!collapsed && (
              <p
                className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.15em] px-2 mb-2 pt-5"
                style={{ color: "var(--color-ink-tertiary)" }}
              >
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/studio" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center transition-colors relative",
                      collapsed ? "justify-center px-0 py-3" : "px-4 py-2.5",
                    )}
                    style={{
                      color: isActive ? "#F5F0EB" : "var(--color-ink-secondary)",
                      background: isActive
                        ? "rgba(199, 91, 57, 0.06)"
                        : "transparent",
                      borderLeft: isActive
                        ? "2px solid #C75B39"
                        : "2px solid transparent",
                    }}
                    title={collapsed ? item.label : undefined}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#F5F0EB";
                        e.currentTarget.style.background =
                          "rgba(245,240,235,0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color =
                          "var(--color-ink-secondary)";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      className="shrink-0"
                      style={{ marginRight: collapsed ? 0 : 12 }}
                    />
                    {!collapsed && (
                      <span className="font-sans text-[0.85rem] font-normal truncate">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center shrink-0 transition-colors"
        style={{
          height: 44,
          borderTop: "1px solid rgba(245,240,235,0.04)",
          color: "var(--color-ink-tertiary)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(245,240,235,0.04)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        aria-label={collapsed ? "Ouvrir" : "Réduire"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
