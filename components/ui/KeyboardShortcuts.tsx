"use client";

import { useEffect, useState } from "react";
import { Command } from "lucide-react";

type Shortcut = {
  keys: string[];
  label: string;
};

const SECTIONS: { title: string; shortcuts: Shortcut[] }[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["⌘", "K"], label: "Palette de commandes" },
      { keys: ["⌘", "1-9"], label: "Navigation rapide sidebar" },
      { keys: ["⌘", "←"], label: "Page précédente" },
      { keys: ["⌘", "→"], label: "Page suivante" },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { keys: ["N"], label: "Nouvelle ressource (selon contexte)" },
      { keys: ["⌘", "S"], label: "Enregistrer" },
      { keys: ["⌘", "F"], label: "Rechercher" },
      { keys: ["Escape"], label: "Fermer le panneau / modal" },
    ],
  },
  {
    title: "Bibliothèque média",
    shortcuts: [
      { keys: ["⌘", "U"], label: "Uploader un média" },
      { keys: ["⌘", "A"], label: "Tout sélectionner" },
      { keys: ["Delete"], label: "Supprimer la sélection" },
    ],
  },
  {
    title: "Calendrier",
    shortcuts: [
      { keys: ["M"], label: "Vue mois" },
      { keys: ["W"], label: "Vue semaine" },
      { keys: ["D"], label: "Vue jour" },
      { keys: ["T"], label: "Vue liste" },
      { keys: ["+", "N"], label: "Nouvel événement" },
    ],
  },
  {
    title: "Communauté",
    shortcuts: [
      { keys: ["⌘", "N"], label: "Nouveau post" },
      { keys: ["/"], label: "Rechercher" },
    ],
  },
  {
    title: "Atlas CRM",
    shortcuts: [
      { keys: ["⌘", "A"], label: "Atlas Launcher" },
      { keys: ["⌘", "M"], label: "Inbox Atlas" },
      { keys: ["⌘", "F"], label: "Rechercher un fan" },
      { keys: ["⌘", "N"], label: "Nouvelle campagne" },
    ],
  },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Only trigger in input-less areas
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          setOpen((prev) => !prev);
        }
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-lg border shadow-2xl animate-fade-in-no-slide max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h2
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ color: "var(--color-ink)" }}
          >
            Raccourcis clavier
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 border opacity-40 hover:opacity-70 transition-opacity"
            style={{ borderColor: "var(--color-border)" }}
          >
            ESC
          </button>
        </div>

        {/* Sections */}
        <div className="p-5 space-y-5">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3
                className="text-[10px] uppercase tracking-widest font-semibold mb-2.5"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {section.title}
              </h3>
              <div className="space-y-1.5">
                {section.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.label}
                    className="flex items-center justify-between text-sm"
                    style={{ color: "var(--color-ink)" }}
                  >
                    <span>{shortcut.label}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd
                            className="text-[10px] font-mono font-medium px-1.5 py-0.5 border"
                            style={{
                              borderColor: "var(--color-border)",
                              backgroundColor: "var(--color-base)",
                            }}
                          >
                            {key === "⌘" ? (
                              <Command size={10} className="inline" />
                            ) : (
                              key
                            )}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="mx-0.5 text-[10px]" style={{ color: "var(--color-ink-muted)" }}>
                              +
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div
          className="px-5 py-3 border-t text-[10px] text-center"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-ink-muted)",
          }}
        >
          Appuyez sur <kbd className="font-mono font-medium px-1 border" style={{ borderColor: "var(--color-border)" }}>?</kbd> pour ouvrir ce panneau à tout moment
        </div>
      </div>
    </>
  );
}
