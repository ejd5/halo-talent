"use client";

import { useState } from "react";
import { FileText, ArrowLeft } from "lucide-react";
import { MediaKitForm } from "./MediaKitForm";
import { MediaKitPreview } from "./MediaKitPreview";
import { MOCK_MEDIAKIT_STATE } from "@/lib/mediakit/mock-data";
import type { MediaKitState } from "@/lib/mediakit/types";

export function MediaKitBuilder() {
  const [state, setState] = useState<MediaKitState>(MOCK_MEDIAKIT_STATE);
  const [mobileFormOpen, setMobileFormOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border-default)", backgroundColor: "var(--bg-card)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <FileText size={13} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h2 className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Générateur de Média Kit
            </h2>
            <p className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
              Créez votre kit de présentation professionnel
            </p>
          </div>
        </div>
        {/* Mobile toggle */}
        <button
          onClick={() => setMobileFormOpen(!mobileFormOpen)}
          className="lg:hidden px-3 py-1.5 text-[9px] font-medium rounded"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {mobileFormOpen ? "Voir l'aperçu" : "Personnaliser"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel, Form */}
        <div
          className={`${
            mobileFormOpen ? "flex" : "hidden"
          } lg:flex flex-col w-full lg:w-[320px] xl:w-[360px] shrink-0 overflow-y-auto custom-scrollbar`}
          style={{ borderRight: "1px solid var(--border-default)" }}
        >
          <MediaKitForm state={state} onStateChange={setState} />
        </div>

        {/* Right panel, Preview */}
        <div
          className={`${
            mobileFormOpen ? "hidden" : "flex"
          } lg:flex flex-1 flex-col overflow-y-auto custom-scrollbar p-4`}
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <MediaKitPreview state={state} />
        </div>
      </div>
    </div>
  );
}
