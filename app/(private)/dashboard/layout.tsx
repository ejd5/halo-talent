"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import { AtlasLauncher } from "@/components/atlas/AtlasLauncher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen" data-theme="dark" style={{ backgroundColor: "var(--color-base)" }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Header onMenuToggle={() => setMobileOpen(true)} />
      <main className="md:pl-60 pt-16 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
      <CommandPalette />
      <KeyboardShortcuts />
      <AtlasLauncher />
    </div>
  );
}
