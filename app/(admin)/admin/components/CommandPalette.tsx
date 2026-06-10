"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  FileText,
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  MessageSquare,
  PlusCircle,
  CheckCircle,
} from "lucide-react";

type CommandItem = {
  label: string;
  description?: string;
  href?: string;
  action?: () => void;
  icon: React.ElementType;
  category: string;
};

type Props = {
  onClose: () => void;
};

export function CommandPalette({ onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Actions
    {
      label: "Approuver une candidature",
      description: "Voir les candidatures en attente",
      href: "/admin/applications",
      icon: CheckCircle,
      category: "Actions",
    },
    {
      label: "Créer un créateur",
      description: "Ajouter un nouveau talent au roster",
      href: "/admin/creators/new",
      icon: PlusCircle,
      category: "Actions",
    },
    {
      label: "Envoyer un message",
      description: "Messagerie interne",
      href: "/admin/messages",
      icon: MessageSquare,
      category: "Actions",
    },
    // Pages
    {
      label: "Vue d'ensemble",
      href: "/admin",
      icon: LayoutDashboard,
      category: "Pages",
    },
    {
      label: "Candidatures",
      href: "/admin/applications",
      icon: FileText,
      category: "Pages",
    },
    {
      label: "Roster créateurs",
      href: "/admin/creators",
      icon: Users,
      category: "Pages",
    },
    {
      label: "Revenus",
      href: "/admin/revenue",
      icon: DollarSign,
      category: "Pages",
    },
    {
      label: "Performances",
      href: "/admin/creators/performance",
      icon: TrendingUp,
      category: "Pages",
    },
    {
      label: "Paramètres",
      href: "/admin/settings/system",
      icon: TrendingUp,
      category: "Pages",
    },
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>(
    (acc, item) => {
      (acc[item.category] ??= []).push(item);
      return acc;
    },
    {}
  );

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const execute = useCallback(
    (item: CommandItem) => {
      onClose();
      if (item.href) router.push(item.href);
      else item.action?.();
    },
    [router, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        execute(filtered[activeIndex]);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, filtered, activeIndex, execute]);

  // Reset index on filter change
  useEffect(() => setActiveIndex(0), [query]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[580px] shadow-2xl"
        style={{
          background: "#0F0D0B",
          border: "1px solid var(--border-default)",
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Search size={16} strokeWidth={1.5} style={{ color: "var(--text-primary)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une page, une action, un créateur..."
            className="flex-1 bg-transparent text-sm font-sans py-4 outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd
            className="text-[10px] font-sans px-1.5 py-0.5"
            style={{
              color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <p
                className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] px-4 py-2"
                style={{ color: "var(--text-primary)" }}
              >
                {category}
              </p>
              {items.map((item, idx) => {
                const globalIdx = filtered.indexOf(item);
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => execute(item)}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-xs font-sans transition-colors"
                    style={{
                      background:
                        globalIdx === activeIndex
                          ? "rgba(199,91,57,0.1)"
                          : "transparent",
                      color:
                        globalIdx === activeIndex ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    <div>
                      <p
                        className="text-sm"
                        style={{
                          color:
                            globalIdx === activeIndex ? "var(--text-primary)" : "var(--text-primary)",
                        }}
                      >
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-xs" style={{ color: "var(--text-primary)" }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <p
              className="text-sm font-sans text-center py-8"
              style={{ color: "var(--text-primary)" }}
            >
              Aucun résultat pour &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
