"use client";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mon calendrier</h1>
        <p className="text-xs opacity-40 mt-1">Planifiez et gérez vos publications</p>
      </div>
      <div className="p-12 border border-[var(--color-border)] flex items-center justify-center" style={{ backgroundColor: "var(--color-card)", minHeight: 400 }}>
        <div className="text-center">
          <CalendarIcon size={32} className="opacity-10 mx-auto mb-2" />
          <div className="text-xs opacity-20">Calendrier de contenu interactif</div>
        </div>
      </div>
    </div>
  );
}
