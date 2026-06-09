"use client";

import { type ReactNode, useState, useEffect, useCallback } from "react";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate sidebar state from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved === "true") setSidebarCollapsed(true);
  }, []);

  // Persist sidebar state
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("admin_sidebar_collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed, mounted]);

  // Cmd+K / Ctrl+K global shortcut
  const toggleCommand = useCallback(() => setCommandOpen((o) => !o), []);

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

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#4D2D17", color: "#F5F0EB" }}
    >
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        width={sidebarWidth}
      />

      {/* Topbar + Main */}
      <div
        className="flex flex-col min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
          onCommandOpen={() => setCommandOpen(true)}
        />

        <main className="flex-1" style={{ padding: "40px" }}>
          {children}
        </main>
      </div>

      {/* Command palette modal */}
      {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} />}
      <KeyboardShortcuts />
    </div>
  );
}
