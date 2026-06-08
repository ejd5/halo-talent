"use client";

import type { Application } from "../../types";
import { Quote } from "lucide-react";

type Props = { application: Application };

export function ResponsesTab({ application }: Props) {
  const app = application;
  return (
    <div className="space-y-6">
      {/* Objectifs */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Quote size={13} strokeWidth={1.5} style={{ color: "#C75B39" }} />
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em]" style={{ color: "#C75B39" }}>
            Objectifs
          </p>
        </div>
        <div
          className="p-4 text-sm font-sans leading-relaxed"
          style={{
            background: "rgba(255,255,255,0.02)",
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
          <Quote size={13} strokeWidth={1.5} style={{ color: "#C75B39" }} />
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em]" style={{ color: "#C75B39" }}>
            Pourquoi nous
          </p>
        </div>
        <div
          className="p-4 text-sm font-sans leading-relaxed"
          style={{
            background: "rgba(255,255,255,0.02)",
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
            <Quote size={13} strokeWidth={1.5} style={{ color: "#9A9590" }} />
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em]" style={{ color: "#9A9590" }}>
              Freins / Hésitations
            </p>
          </div>
          <div
            className="p-4 text-sm font-sans leading-relaxed"
            style={{
              background: "rgba(255,255,255,0.02)",
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
