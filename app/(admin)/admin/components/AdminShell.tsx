"use client";

import { type ReactNode, useState, useEffect, useCallback } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";

type Props = {
  children: ReactNode;
  userName: string;
  userRole: string;
  userAvatar: string | null;
};

export function AdminShell({
  children,
  userName,
  userRole,
  userAvatar,
}: Props) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cmd+K / Ctrl+K global shortcut
  const toggleCommand = useCallback(() => setCommandOpen((o) => !o), []);

  // Global keyboard shortcut listener
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommand();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleCommand]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Topbar + Main */}
      <div
        className="flex flex-col min-h-screen ml-0 lg:ml-[240px]"
      >
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-3 left-3 z-20 min-touch rounded-md"
          style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)" }}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <Topbar
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
          onCommandOpen={() => setCommandOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-10">
          {children}
        </main>
      </div>

      {/* Command palette modal */}
      {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} />}
      <KeyboardShortcuts />
    </div>
  );
}
