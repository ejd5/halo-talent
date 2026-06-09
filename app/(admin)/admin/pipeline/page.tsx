"use client";

import { GitPullRequest, Construction } from "lucide-react";

export default function PipelinePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3" style={{ backgroundColor: "rgba(199,91,57,0.08)" }}>
            <GitPullRequest size={32} style={{ color: "#C75B39" }} />
          </div>
        </div>
        <h1 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
          Pipeline d&apos;acquisition
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(245,240,235,0.4)" }}>
          Cette page est en cours de construction. Elle affichera le pipeline complet
          des candidatures et leur progression.
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px]" style={{ color: "rgba(245,240,235,0.2)" }}>
          <Construction size={12} /> Bientôt disponible
        </div>
      </div>
    </div>
  );
}
