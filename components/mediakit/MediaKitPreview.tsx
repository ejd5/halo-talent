"use client";

import { useRef, useState } from "react";
import { Download, Link2, Check, Smartphone, Monitor } from "lucide-react";
import { TemplateRenderer } from "./templates/TemplateRenderer";
import { generateShareUrl } from "./templates/utils";
import type { MediaKitState } from "@/lib/mediakit/types";

export function MediaKitPreview({
  state,
}: {
  state: MediaKitState;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  const shareUrl = generateShareUrl(state.data.profile.pseudo);

  const handleExportPdf = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Simple QR code representation (CSS-based)
  const QrPlaceholder = () => (
    <div
      className="w-12 h-12 rounded flex items-center justify-center text-[6px] font-bold leading-tight text-center"
      style={{ backgroundColor: "#1F2937", color: "#fff" }}
    >
      QR
      <br />
      LINK
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-xl"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("desktop")}
            className="p-1.5 rounded transition-colors"
            style={{
              backgroundColor: viewMode === "desktop" ? "var(--bg-surface)" : "transparent",
              color: "var(--text-secondary)",
            }}
          >
            <Monitor size={13} />
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className="p-1.5 rounded transition-colors"
            style={{
              backgroundColor: viewMode === "mobile" ? "var(--bg-surface)" : "transparent",
              color: "var(--text-secondary)",
            }}
          >
            <Smartphone size={13} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2 py-1.5 text-[9px] font-medium rounded transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            {copied ? <Check size={10} /> : <Link2 size={10} />}
            {copied ? "Copié" : "Lien"}
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1 px-2 py-1.5 text-[9px] font-medium rounded transition-colors"
            style={{ color: "var(--accent)", backgroundColor: "var(--accent-soft)" }}
          >
            <Download size={10} />
            PDF
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div
        ref={previewRef}
        className={`rounded-xl overflow-hidden transition-all ${viewMode === "mobile" ? "max-w-[380px] mx-auto" : ""}`}
        style={{
          backgroundColor: "#fff",
          border: "1px solid var(--border-default)",
          boxShadow: viewMode === "mobile" ? "0 4px 24px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <TemplateRenderer state={state} />
      </div>

      {/* QR Code */}
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-xl"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <QrPlaceholder />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-medium" style={{ color: "var(--text-primary)" }}>
            Lien partageable
          </p>
          <p className="text-[8px] truncate" style={{ color: "var(--text-tertiary)" }}>
            {shareUrl || "halo.talent/mediakit/..."}
          </p>
        </div>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1 px-2 py-1 text-[9px] font-medium rounded"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Link2 size={10} />
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
    </div>
  );
}
