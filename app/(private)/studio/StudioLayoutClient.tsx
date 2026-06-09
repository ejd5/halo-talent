"use client";

import type { ReactNode } from "react";
import { StudioSidebar } from "./components/StudioSidebar";
import { StudioTopbar } from "./components/StudioTopbar";

export function StudioLayoutClient({
  children,
  userName,
}: {
  children: ReactNode;
  userName: string;
}) {
  return (
    <div
      className="min-h-screen"
      data-theme="dark"
      style={{ backgroundColor: "var(--color-base)" }}
    >
      <StudioSidebar />
      <div className="flex flex-col min-h-screen" style={{ marginLeft: 260 }}>
        <StudioTopbar />
        {/* Spacer for fixed topbar */}
        <div className="shrink-0" style={{ height: 56 }} />
        {/* Content fills remaining space */}
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
