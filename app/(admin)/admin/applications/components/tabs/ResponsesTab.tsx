"use client";

import type { Application } from "../../types";
import { Quote } from "lucide-react";

type Props = { application: Application };

export function ResponsesTab({ application }: Props) {
  const app = application;
  return (
    <div className="space-y-6 card-accent" style={{ background: "var(--bg-primary)" }}>
      {/* Objectifs */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Quote size={13} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
            Objectifs
          </p>
        </div>
        <div
          className="p-4 text-sm font-sans leading-relaxed"
          style={{
            background: "var(--bg-card)",
            borderLeft: "2px solid rgba(199,91,57,0.3)",
            color: "#D0CCC6",
          }}
        >
          {app.goals || "Non renseigné"}
        </div>
      </div>

      {/* Pourquoi nous */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Quote size={13} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
            Pourquoi nous
          </p>
        </div>
        <div
          className="p-4 text-sm font-sans leading-relaxed"
          style={{
            background: "var(--bg-card)",
            borderLeft: "2px solid rgba(199,91,57,0.3)",
            color: "#D0CCC6",
          }}
        >
          {app.why_us || "Non renseigné"}
        </div>
      </div>

      {/* Freins */}
      {app.concerns && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Quote size={13} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--text-secondary)" }}>
              Freins / Hésitations
            </p>
          </div>
          <div
            className="p-4 text-sm font-sans leading-relaxed"
            style={{
              background: "var(--bg-card)",
              borderLeft: "2px solid rgba(154,149,144,0.3)",
              color: "#D0CCC6",
            }}
          >
            {app.concerns}
          </div>
        </div>
      )}
    </div>
  );
}
