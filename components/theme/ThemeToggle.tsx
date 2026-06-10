"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme, type ThemeMode } from "./ThemeProvider";
import { Sun, Moon, Monitor, Clock } from "lucide-react";

const MODE_OPTIONS: { mode: ThemeMode; label: string; icon: React.ElementType }[] = [
  { mode: "light", label: "Jour", icon: Sun },
  { mode: "dark", label: "Nuit", icon: Moon },
  { mode: "auto-system", label: "Auto (système)", icon: Monitor },
  { mode: "auto-clock", label: "Auto (horloge)", icon: Clock },
];

export function ThemeToggle() {
  const { theme, mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentIcon = MODE_OPTIONS.find((o) => o.mode === mode)?.icon || Sun;
  const Icon = theme === "dark" ? Moon : theme === "light" && mode === "light" ? Sun : currentIcon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-8 h-8 rounded-md transition-all"
        style={{
          backgroundColor: open ? "var(--bg-hover)" : "transparent",
          color: "var(--text-secondary)",
        }}
        aria-label="Changer le thème"
      >
        {theme === "dark" ? (
          <Moon size={16} strokeWidth={1.5} />
        ) : (
          <Sun size={16} strokeWidth={1.5} />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 py-1 rounded-lg z-50 animate-scale-in origin-top-right"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-dropdown)",
          }}
        >
          {MODE_OPTIONS.map((opt) => {
            const isActive = mode === opt.mode;
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setMode(opt.mode);
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs transition-all"
                style={{
                  backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                <OptIcon size={14} strokeWidth={1.5} />
                <span>{opt.label}</span>
                {isActive && (
                  <span className="ml-auto" style={{ color: "var(--accent)" }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
