"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { StudioSidebar } from "./components/StudioSidebar";
import { StudioTopbar } from "./components/StudioTopbar";

export function StudioLayoutClient({
  children,
  userName,
}: {
  children: ReactNode;
  userName: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <StudioSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-col min-h-screen ml-0 lg:ml-[240px]">
        <StudioTopbar />
        {/* Spacer for fixed topbar */}
        <div className="shrink-0" style={{ height: 56 }} />
        {/* Mobile hamburger, overlaid on topbar */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-3 left-3 z-20 min-touch rounded-md"
          style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)" }}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        {/* Content fills remaining space */}
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
