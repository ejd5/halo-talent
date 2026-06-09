"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 animate-fade-in">
      <div className="w-14 h-14 flex items-center justify-center mb-5" style={{ background: "rgba(199,91,57,0.1)" }}>
        <Send size={28} style={{ color: "#C75B39" }} />
      </div>
      <h1 className="text-2xl italic mb-2" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Multi-publish</h1>
      <p className="text-sm mb-8 text-center max-w-md" style={{ color: "rgba(255,255,255,0.5)" }}>
        En construction
      </p>
      <div className="text-xs px-4 py-2 mb-8" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)" }}>
        En construction — Disponible prochainement
      </div>
      <Link href="/studio" className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70" style={{ color: "#C75B39" }}>
        <ArrowLeft size={14} />
        Retour au Studio
      </Link>
    </div>
  );
}
