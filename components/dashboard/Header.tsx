"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronRight, Menu } from "lucide-react";
import { NotifBell } from "@/components/notifications/NotifPanel";
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
  "/dashboard/atlas": "Atlas — Vue d'ensemble",
  "/dashboard/atlas/fans": "Atlas — Fans CRM",
  "/dashboard/atlas/fans/segments": "Atlas — Segments",
  "/dashboard/atlas/inbox": "Atlas — Inbox",
  "/dashboard/atlas/inbox/drafts": "Atlas — Brouillons IA",
  "/dashboard/atlas/campaigns/email": "Atlas — Email",
  "/dashboard/atlas/campaigns/sms": "Atlas — SMS",
  "/dashboard/atlas/campaigns/push": "Atlas — Push",
  "/dashboard/atlas/funnels": "Atlas — Funnels",
  "/dashboard/atlas/comments": "Atlas — Modération",
  "/dashboard/atlas/rules": "Atlas — Automations",
  "/dashboard/atlas/analytics": "Atlas — Analytics",
  "/dashboard/atlas/settings": "Atlas — Paramètres",
};

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);

  const pageTitle = breadcrumbMap[pathname] || (pathname.startsWith("/dashboard/atlas") ? "Atlas" : "Dashboard");
  const isRoot = pathname === "/dashboard";

  return (
    <header className="fixed top-0 left-0 md:left-56 right-0 h-16 border-b border-[var(--color-border)] z-20 flex items-center justify-between px-4 md:px-8" style={{ backgroundColor: "var(--color-base-alt)" }}>
      {/* Mobile menu toggle */}
      <button onClick={onMenuToggle} className="md:hidden min-touch mr-2 -ml-2 hover:bg-[var(--color-card)]">
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs">
          <Link href="/dashboard" className="transition-colors" style={{ color: "var(--text-primary)" }}>
            Accueil
          </Link>
          {!isRoot && (
            <>
              <ChevronRight size={12} style={{ color: "var(--text-primary)" }} />
              <span className="font-medium">{pageTitle}</span>
            </>
          )}
        </div>
        {isRoot && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-primary)" }}>
            Bienvenue dans votre espace créateur
          </p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:block">
        <div className="relative">
          <Search size={13} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: "var(--text-primary)" }} />
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
        <NotifBell />
        <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-[10px] font-semibold" style={{ backgroundColor: "var(--color-card)" }}>
          {mockCreator.full_name.split(" ").map((n) => n[0]).join("")}
        </div>
      </div>
    </header>
  );
}
