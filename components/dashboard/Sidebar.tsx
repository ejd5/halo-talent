"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Monitor,
  Calendar,
  Bot,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/dashboard" },
  { icon: TrendingUp, label: "Revenus & analytics", href: "/dashboard/analytics" },
  { icon: Monitor, label: "Mes plateformes", href: "/dashboard/platforms" },
  { icon: Calendar, label: "Calendrier", href: "/dashboard/calendar" },
  { icon: Bot, label: "Assistant IA", href: "/dashboard/ai" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: FileText, label: "Mes contrats", href: "/dashboard/contracts" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-brand-espresso border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <Link
          href="/dashboard"
          className="font-display text-xl italic tracking-wide text-brand-ivory hover:text-brand-gold transition-colors"
        >
          Halo Talent
        </Link>
      </div>

      {/* Profil */}
      <div className="px-6 pb-6 border-b border-white/5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
            <span className="font-display text-sm text-brand-gold">JD</span>
          </div>
          <div>
            <p className="text-sm text-brand-ivory font-medium">Jean Dupont</p>
            <p className="text-xs text-brand-taupe">Digital Creators</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-all",
                isActive
                  ? "bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold"
                  : "text-brand-taupe hover:text-brand-ivory hover:bg-white/[0.02] border-l-2 border-transparent"
              )}
            >
              <item.icon size={16} strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 pt-4 border-t border-white/5 space-y-1">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-taupe hover:text-brand-ivory transition-colors rounded-sm"
        >
          <HelpCircle size={16} strokeWidth={1.5} />
          <span>Support</span>
        </Link>
        <button
          onClick={() => {/* TODO: sign out */}}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-taupe hover:text-brand-alert transition-colors rounded-sm w-full"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
