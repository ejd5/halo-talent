"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Search,
  LayoutDashboard,
  Users,
  Calendar,
  Library,
  MessageSquare,
  Target,
  Settings,
  BarChart3,
  FileText,
  Command,
  Globe,
  Inbox,
  Zap,
  UserPlus,
} from "lucide-react";

type Action = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: typeof Search;
  keywords: string[];
};

const ACTIONS: Action[] = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    description: "Vue d'ensemble",
    href: "/dashboard",
    icon: LayoutDashboard,
    keywords: ["dashboard", "accueil", "home", "overview"],
  },
  {
    id: "creators",
    label: "Créateurs",
    description: "Gérer les créateurs",
    href: "/dashboard/creators",
    icon: Users,
    keywords: ["creators", "createurs", "talents", "profiles"],
  },
  {
    id: "calendar",
    label: "Calendrier",
    description: "Planning éditorial",
    href: "/dashboard/calendar",
    icon: Calendar,
    keywords: ["calendar", "calendrier", "planning", "schedule"],
  },
  {
    id: "library",
    label: "Bibliothèque média",
    description: "Médias et fichiers",
    href: "/dashboard/library",
    icon: Library,
    keywords: ["library", "bibliotheque", "media", "files", "images"],
  },
  {
    id: "community",
    label: "Communauté",
    description: "Forum et discussions",
    href: "/dashboard/community",
    icon: MessageSquare,
    keywords: ["community", "communaute", "forum", "discussions"],
  },
  {
    id: "goals",
    label: "Objectifs",
    description: "Suivi des objectifs",
    href: "/dashboard/goals",
    icon: Target,
    keywords: ["goals", "objectifs", "targets", "kpi"],
  },
  {
    id: "analytics",
    label: "Analytiques",
    description: "Statistiques et rapports",
    href: "/dashboard/analytics",
    icon: BarChart3,
    keywords: ["analytics", "analytiques", "stats", "statistiques"],
  },
  {
    id: "reports",
    label: "Rapports",
    description: "Rapports d'activité",
    href: "/dashboard/reports",
    icon: FileText,
    keywords: ["reports", "rapports", "activity"],
  },
  {
    id: "settings",
    label: "Paramètres",
    description: "Configuration du compte",
    href: "/dashboard/settings",
    icon: Settings,
    keywords: ["settings", "parametres", "config", "profile"],
  },
  // Atlas actions
  {
    id: "atlas",
    label: "Atlas CRM",
    description: "Vue d'ensemble du CRM",
    href: "/dashboard/atlas",
    icon: Globe,
    keywords: ["atlas", "crm", "overview", "accueil"],
  },
  {
    id: "atlas-inbox",
    label: "Inbox Atlas",
    description: "Messages unifiés",
    href: "/dashboard/atlas/inbox",
    icon: Inbox,
    keywords: ["inbox", "messages", "dm", "boite"],
  },
  {
    id: "atlas-fans",
    label: "Fans Atlas",
    description: "Tous mes fans",
    href: "/dashboard/atlas/fans",
    icon: Users,
    keywords: ["fans", "whales", "vip", "contacts"],
  },
  {
    id: "atlas-rules",
    label: "Règles Atlas",
    description: "Automatisations et règles",
    href: "/dashboard/atlas/rules",
    icon: Zap,
    keywords: ["rules", "regles", "automation", "workflow", "zapier"],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? ACTIONS.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()) ||
          a.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())),
      )
    : ACTIONS;

  const handleSelect = useCallback(
    (action: Action) => {
      setOpen(false);
      setQuery("");
      router.push(action.href);
    },
    [router],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filtered.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    }
    if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div
        className="fixed left-1/2 top-[15%] -translate-x-1/2 z-[61] w-full max-w-lg border shadow-2xl animate-fade-in-no-slide"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-2 px-4 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Search size={16} style={{ color: "var(--color-ink-muted)" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une page, une action…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none py-3 text-sm placeholder:text-[var(--color-ink-muted)]"
            style={{ color: "var(--color-ink)" }}
          />
          <kbd
            className="hidden sm:inline-flex text-[9px] uppercase tracking-wider px-1.5 py-0.5 border opacity-40"
            style={{ borderColor: "var(--color-border)" }}
          >
            <Command size={10} className="mr-0.5" />K
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs" style={{ color: "var(--color-ink-muted)" }}>
              Aucun résultat pour "{query}"
            </div>
          ) : (
            filtered.map((action, index) => (
              <button
                key={action.id}
                onClick={() => handleSelect(action)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "flex items-center gap-3 w-full text-left px-3 py-2 text-sm transition-colors",
                  index === selectedIndex && "border-l-2",
                )}
                style={{
                  color: "var(--color-ink)",
                  backgroundColor:
                    index === selectedIndex ? "var(--color-accent-soft)" : "transparent",
                  borderLeftColor:
                    index === selectedIndex ? "var(--color-accent)" : "transparent",
                }}
              >
                <action.icon size={16} style={{ color: "var(--color-ink-muted)" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{action.label}</div>
                  <div className="text-[10px] truncate" style={{ color: "var(--color-ink-muted)" }}>
                    {action.description}
                  </div>
                </div>
                <span className="text-[9px] uppercase opacity-30">{action.href.replace("/dashboard/", "/")}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
