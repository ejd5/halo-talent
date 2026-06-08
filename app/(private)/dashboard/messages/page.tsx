"use client";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mes messages</h1>
        <p className="text-xs opacity-40 mt-1">Boîte de réception unifiée</p>
      </div>
      <div className="p-12 border border-[var(--color-border)] flex items-center justify-center" style={{ backgroundColor: "var(--color-card)", minHeight: 400 }}>
        <div className="text-center">
          <MessageSquare size={32} className="opacity-10 mx-auto mb-2" />
          <div className="text-xs opacity-20">Messagerie centralisée (DM, team, manager)</div>
        </div>
      </div>
    </div>
  );
}
