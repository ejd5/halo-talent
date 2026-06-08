"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight, Menu } from "lucide-react";
import { useState } from "react";
import { mockCreator } from "./data";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/revenues": "Mes revenus",
  "/dashboard/goals": "Mes objectifs",
  "/dashboard/calendar": "Calendrier",
  "/dashboard/drafts": "Brouillons",
  "/dashboard/library": "Bibliothèque",
  "/dashboard/agents": "Mes agents IA",
  "/dashboard/insights": "Insights",
  "/dashboard/trends": "Tendances",
  "/dashboard/platforms": "Mes comptes",
  "/dashboard/analytics": "Analytics",
  "/dashboard/manager": "Mon manager",
  "/dashboard/messages": "Mes messages",
  "/dashboard/community": "Communauté",
  "/dashboard/contracts": "Mes contrats",
  "/dashboard/learn": "Apprentissage",
  "/dashboard/wellness": "Wellness",
  "/dashboard/profile": "Profil",
  "/dashboard/integrations": "Plateformes connectées",
  "/dashboard/preferences": "Préférences",
};

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);

  const pageTitle = breadcrumbMap[pathname] || "Dashboard";
  const isRoot = pathname === "/dashboard";

  return (
    <header className="fixed top-0 left-0 md:left-60 right-0 h-16 border-b border-[var(--color-border)] backdrop-blur-sm z-20 flex items-center justify-between px-4 md:px-8" style={{ backgroundColor: "color-mix(in srgb, var(--color-base) 85%, transparent)" }}>
      {/* Mobile menu toggle */}
      <button onClick={onMenuToggle} className="md:hidden p-2 mr-2 -ml-2 hover:bg-[var(--color-card)]">
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs">
          <Link href="/dashboard" className="opacity-40 hover:opacity-100 transition-opacity">
            Accueil
          </Link>
          {!isRoot && (
            <>
              <ChevronRight size={12} className="opacity-20" />
              <span className="font-medium">{pageTitle}</span>
            </>
          )}
        </div>
        {isRoot && (
          <p className="text-[11px] opacity-30 mt-0.5">
            Bienvenue dans votre espace créateur
          </p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:block">
        <div className="relative">
          <Search size={13} className="absolute left-0 top-1/2 -translate-y-1/2 opacity-30" />
          <input
            type="text"
            placeholder="Rechercher..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="pl-6 pr-3 py-1.5 bg-transparent border-b border-[var(--color-border)] text-xs placeholder:opacity-30 focus:outline-none focus:border-[var(--color-accent)] transition-colors w-48 text-sm"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative opacity-40 hover:opacity-100 transition-opacity">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2" style={{ backgroundColor: "var(--color-accent)" }} />
        </button>
        <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-[10px] font-semibold" style={{ backgroundColor: "var(--color-card)" }}>
          {mockCreator.full_name.split(" ").map((n) => n[0]).join("")}
        </div>
      </div>
    </header>
  );
}
