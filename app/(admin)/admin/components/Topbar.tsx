"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, MessageSquare, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Period = "today" | "7d" | "30d" | "quarter" | "year";

const periods: { value: Period; label: string }[] = [
  { value: "today", label: "Aujourd'hui" },
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "quarter", label: "Trimestre" },
  { value: "year", label: "Année" },
];

type Props = {
  userName: string;
  userRole: string;
  userAvatar: string | null;
  onCommandOpen: () => void;
};

export function Topbar({ userName, userRole, userAvatar, onCommandOpen }: Props) {
  const [period, setPeriod] = useState<Period>("30d");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (periodRef.current && !periodRef.current.contains(e.target as Node))
        setPeriodOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node))
        setAvatarOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between shrink-0"
      style={{
        height: 64,
        padding: "0 24px",
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      {/* Left: Search */}
      <button
        onClick={onCommandOpen}
        className="hidden sm:flex items-center gap-3 text-sm font-sans transition-colors"
        style={{
          padding: "8px 16px",
          color: "var(--text-secondary)",
          border: "1px solid var(--border-default)",
          minWidth: 280,
        }}
      >
        <Search size={16} strokeWidth={1.5} />
        <span>Rechercher...</span>
        <kbd
          className="ml-auto text-[10px] font-sans px-1.5 py-0.5 rounded"
          style={{
            color: "var(--text-tertiary)",
            border: "1px solid var(--border-default)",
          }}
        >
          ⌘K
        </kbd>
      </button>
      {/* Mobile search icon-only */}
      <button
        onClick={onCommandOpen}
        className="flex sm:hidden min-touch rounded-md"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Rechercher"
      >
        <Search size={18} strokeWidth={1.5} />
      </button>

      {/* Right: Period + Notifications + Avatar */}
      <div className="flex items-center gap-2">
        {/* Period selector */}
        <div ref={periodRef} className="relative">
          <button
            onClick={() => setPeriodOpen(!periodOpen)}
            className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.08em] transition-colors hover:bg-white/5"
            style={{
              padding: "8px 12px",
              color: "var(--text-primary)",
            }}
          >
            {periods.find((p) => p.value === period)?.label}
            <ChevronDown size={14} strokeWidth={1.5} />
          </button>
          {periodOpen && (
            <div
              className="absolute right-0 top-full mt-1 min-w-[160px] py-1 z-50"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-default)",
              }}
            >
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setPeriod(p.value);
                    setPeriodOpen(false);
                  }}
                  className="block w-full text-left text-xs font-sans px-4 py-2 transition-colors hover:bg-white/5"
                  style={{
                    color: period === p.value ? "var(--accent)" : "var(--text-primary)",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <button
          className="relative min-touch transition-colors hover:bg-white/5"
          style={{ color: "var(--text-primary)" }}
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={1.5} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--danger)" }}
          />
        </button>

        {/* Messages icon */}
        <button
          className="relative min-touch transition-colors hover:bg-white/5"
          style={{ color: "var(--text-primary)" }}
          aria-label="Messages internes"
        >
          <MessageSquare size={18} strokeWidth={1.5} />
          <span
            className="absolute -top-0.5 -right-0.5 text-[9px] font-sans font-semibold px-1 py-0.5"
            style={{
              background: "var(--accent)",
              color: "var(--text-primary)",
              minWidth: 16,
              textAlign: "center",
            }}
          >
            3
          </span>
        </button>

        {/* Avatar dropdown */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex items-center gap-2 ml-2 transition-colors hover:bg-white/5"
            style={{ padding: "6px 8px" }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center text-xs font-sans font-semibold"
              style={{
                background: userAvatar ? "transparent" : "rgba(199,91,57,0.2)",
                color: "var(--accent)",
              }}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt=""
                  className="w-8 h-8 object-cover"
                />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-sans font-medium truncate max-w-[120px]" style={{ color: "var(--text-primary)" }}>
                {userName}
              </p>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-tertiary)" }}>
                {userRole === "admin" ? "Administrateur" : "Manager"}
              </p>
            </div>
            <ChevronDown size={14} strokeWidth={1.5} style={{ color: "var(--text-tertiary)" }} />
          </button>

          {avatarOpen && (
            <div
              className="absolute right-0 top-full mt-1 min-w-[180px] py-1 z-50"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-default)",
              }}
            >
              <Link
                href="/admin/settings/team"
                onClick={() => setAvatarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-xs font-sans transition-colors hover:bg-white/5"
                style={{ color: "var(--text-primary)" }}
              >
                <User size={14} strokeWidth={1.5} />
                Mon profil
              </Link>
              <Link
                href="/admin/settings/system"
                onClick={() => setAvatarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-xs font-sans transition-colors hover:bg-white/5"
                style={{ color: "var(--text-primary)" }}
              >
                <Settings size={14} strokeWidth={1.5} />
                Paramètres
              </Link>
              <hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-sans transition-colors hover:bg-white/5"
                style={{ color: "var(--danger)" }}
              >
                <LogOut size={14} strokeWidth={1.5} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
