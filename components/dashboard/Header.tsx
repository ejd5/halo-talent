"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight } from "lucide-react";
import { useState } from "react";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/analytics": "Revenus & analytics",
  "/dashboard/platforms": "Mes plateformes",
  "/dashboard/calendar": "Calendrier",
  "/dashboard/ai": "Assistant IA",
  "/dashboard/messages": "Messages",
  "/dashboard/contracts": "Mes contrats",
  "/dashboard/settings": "Paramètres",
};

export function Header() {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);

  const pageTitle = breadcrumbMap[pathname] || "Dashboard";
  const isRoot = pathname === "/dashboard";

  return (
    <header className="fixed top-0 left-60 right-0 h-20 border-b border-white/5 bg-brand-black/80 backdrop-blur-sm z-30 flex items-center justify-between px-8">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-sm text-brand-taupe">
          <Link href="/dashboard" className="hover:text-brand-ivory transition-colors">
            Maison
          </Link>
          {!isRoot && (
            <>
              <ChevronRight size={14} />
              <span className="text-brand-ivory">{pageTitle}</span>
            </>
          )}
        </div>
        {isRoot && (
          <p className="text-xs text-brand-taupe mt-0.5">
            {pageTitle}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:block">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-taupe"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="pl-6 pr-4 py-1.5 bg-transparent border-b border-white/10 text-sm text-brand-ivory placeholder:text-brand-taupe/50 focus:outline-none focus:border-brand-gold transition-colors w-64"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative text-brand-taupe hover:text-brand-ivory transition-colors">
          <Bell size={20} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-gold" />
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
          <span className="font-display text-xs text-brand-gold">JD</span>
        </div>
      </div>
    </header>
  );
}
