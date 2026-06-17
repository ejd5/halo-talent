"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isAtlasPreview = pathname === "/dashboard/atlas-preview";
  const isAtlasInboxV2 = pathname === "/dashboard/atlas/inbox-v2";

  if (isAtlasPreview) {
    return (
      <div className="min-h-screen" data-theme="dark">
        {children}
        <CommandPalette />
        <KeyboardShortcuts />
      </div>
    );
  }

  if (isAtlasInboxV2) {
    return (
      <div className="min-h-screen" data-theme="light">
        {children}
        <CommandPalette />
        <KeyboardShortcuts />
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-theme="dark" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Header onMenuToggle={() => setMobileOpen(true)} />
      <main className="md:pl-56 pt-16 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
      <CommandPalette />
      <KeyboardShortcuts />
      <AtlasLauncher />
    </div>
  );
}
