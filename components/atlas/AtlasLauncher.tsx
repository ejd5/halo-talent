"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Command, UserPlus, Send, MessageCircle, Search,
  ArrowRight, Sparkles, X, Zap, Globe, BarChart3,
} from "lucide-react";

type QuickAction = {
  id: string;
  label: string;
  desc: string;
  href: string;
  icon: any;
};

const ACTIONS: QuickAction[] = [
  { id: "fan", label: "Ajouter un fan", desc: "Nouveau contact CRM", href: "/dashboard/atlas/fans", icon: UserPlus },
  { id: "campaign", label: "Nouvelle campagne", desc: "Email, SMS ou Push", href: "/dashboard/atlas/campaigns/email", icon: Send },
  { id: "drafts", label: "Brouillons en attente", desc: "Valider les drafts IA", href: "/dashboard/atlas/inbox/drafts", icon: MessageCircle },
  { id: "search", label: "Rechercher un fan", desc: "Trouver dans le CRM", href: "/dashboard/atlas/fans", icon: Search },
  { id: "rules", label: "Mes règles", desc: "Automatisations actives", href: "/dashboard/atlas/rules", icon: Zap },
  { id: "analytics", label: "Analytics", desc: "ROI et performances", href: "/dashboard/atlas/analytics", icon: BarChart3 },
  { id: "onboarding", label: "Guide Atlas", desc: "Découvrir les fonctionnalités", href: "/dashboard/atlas/onboarding", icon: Sparkles },
];

export function AtlasLauncher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? ACTIONS.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.desc.toLowerCase().includes(query.toLowerCase()),
      )
    : ACTIONS;

  const handleSelect = (action: QuickAction) => {
    setOpen(false);
    setQuery("");
    router.push(action.href);
  };

  // Cmd+K to open (in Atlas context, but always available)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((i) => (i + 1) % filtered.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected((i) => (i - 1 + filtered.length) % filtered.length); }
    if (e.key === "Enter" && filtered[selected]) { e.preventDefault(); handleSelect(filtered[selected]); }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 text-sm font-medium shadow-xl transition-all hover:opacity-90"
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-display)",
        }}
      >
        <Zap size={16} />
        <span className="hidden sm:inline">Atlas Quick Action</span>
        <kbd className="text-[9px] uppercase tracking-wider px-1 py-0.5 opacity-60 border border-white/20">
          <Command size={10} className="inline mr-0.5" />A
        </kbd>
      </button>

      {/* Modal */}
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setOpen(false)} />
          <div
            className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-md border shadow-2xl animate-fade-in-no-slide"
            style={{
              backgroundColor: "#1A1614",
              borderColor: "rgba(245,240,235,0.1)",
            }}
          >
            {/* Search */}
            <div className="flex items-center gap-2 px-4 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
              <Zap size={16} style={{ color: "var(--accent)" }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Action rapide Atlas…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none py-3 text-sm"
                style={{ color: "var(--text-primary)" }}
              />
              <kbd className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 opacity-40 border" style={{ borderColor: "rgba(245,240,235,0.1)" }}>
                <Command size={10} className="inline mr-0.5" />A
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs" style={{ color: "rgba(245,240,235,0.2)" }}>
                  Aucune action pour &quot;{query}&quot;
                </div>
              ) : (
                filtered.map((action, i) => (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(action)}
                    onMouseEnter={() => setSelected(i)}
                    className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm transition-all"
                    style={{
                      color: "var(--text-primary)",
                      backgroundColor: i === selected ? "rgba(199,91,57,0.1)" : "transparent",
                      borderLeft: i === selected ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
                      <action.icon size={14} style={{ color: "var(--accent)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ fontFamily: "var(--font-display)" }}>
                        {action.label}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: "rgba(245,240,235,0.3)" }}>
                        {action.desc}
                      </div>
                    </div>
                    <ArrowRight size={12} style={{ color: "rgba(245,240,235,0.2)" }} />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t flex items-center gap-3" style={{ borderColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.2)" }}>
              <span className="text-[10px]"><kbd className="font-mono px-1 border" style={{ borderColor: "rgba(245,240,235,0.1)" }}>↑↓</kbd> Naviguer</span>
              <span className="text-[10px]"><kbd className="font-mono px-1 border" style={{ borderColor: "rgba(245,240,235,0.1)" }}>↵</kbd> Ouvrir</span>
              <span className="text-[10px] ml-auto"><kbd className="font-mono px-1 border" style={{ borderColor: "rgba(245,240,235,0.1)" }}>Esc</kbd> Fermer</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
