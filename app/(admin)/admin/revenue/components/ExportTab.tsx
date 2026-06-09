"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, File, Clock } from "lucide-react";
import { formatDate, formatEuro } from "../../creators/utils";
import type { ExportRecord } from "../types";

export function ExportTab() {
  const [periodStart, setPeriodStart] = useState("2026-01-01");
  const [periodEnd, setPeriodEnd] = useState("2026-06-30");
  const [format, setFormat] = useState<"csv" | "pdf" | "xlsx">("csv");
  const [contentType, setContentType] = useState<"global" | "by_creator" | "by_platform">("global");
  const [exports, setExports] = useState<ExportRecord[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newExport: ExportRecord = {
        id: `exp-${Date.now()}`,
        type: contentType,
        format,
        period_start: periodStart,
        period_end: periodEnd,
        generated_at: new Date().toISOString(),
        status: "ready",
      };
      setExports((prev) => [newExport, ...prev]);
      setGenerating(false);
    }, 1500);
  };

  const formatIcons: Record<string, React.ElementType> = {
    csv: File,
    pdf: FileText,
    xlsx: FileSpreadsheet,
  };

  const formatLabels: Record<string, string> = {
    csv: "CSV",
    pdf: "PDF",
    xlsx: "Excel",
  };

  const contentTypeLabels: Record<string, string> = {
    global: "Vue globale",
    by_creator: "Par créateur",
    by_platform: "Par plateforme",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 card-accent">
      {/* Export form */}
      <div>
        <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "#F5F0EB" }}>
            Générer un rapport
          </p>

          {/* Période */}
          <div className="mb-4">
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "#E0D8D0" }}>
              Période
            </p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="flex-1 bg-transparent text-xs font-sans px-3 py-2 outline-none"
                style={{ color: "#D0CCC6", border: "1px solid rgba(255,255,255,0.06)" }}
              />
              <span className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>→</span>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="flex-1 bg-transparent text-xs font-sans px-3 py-2 outline-none"
                style={{ color: "#D0CCC6", border: "1px solid rgba(255,255,255,0.06)" }}
              />
            </div>
          </div>

          {/* Format */}
          <div className="mb-4">
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "#E0D8D0" }}>
              Format
            </p>
            <div className="flex gap-2">
              {(["csv", "pdf", "xlsx"] as const).map((f) => {
                const Icon = formatIcons[f];
                const isActive = format === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-sans font-semibold uppercase tracking-[0.08em] transition-colors"
                    style={{
                      background: isActive ? "rgba(199,91,57,0.15)" : "transparent",
                      color: isActive ? "#C75B39" : "#F5F0EB",
                      border: `1px solid ${isActive ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    <Icon size={11} strokeWidth={1.5} />
                    {formatLabels[f]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenu */}
          <div className="mb-6">
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "#E0D8D0" }}>
              Contenu
            </p>
            <div className="flex flex-col gap-1.5">
              {(["global", "by_creator", "by_platform"] as const).map((ct) => {
                const isActive = contentType === ct;
                return (
                  <button
                    key={ct}
                    onClick={() => setContentType(ct)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-sans transition-colors text-left"
                    style={{
                      background: isActive ? "rgba(199,91,57,0.08)" : "transparent",
                      color: isActive ? "#C75B39" : "#E0D8D0",
                    }}
                  >
                    <span className="w-3 h-3 flex items-center justify-center border text-[7px]"
                      style={{ borderColor: isActive ? "#C75B39" : "rgba(255,255,255,0.15)" }}>
                      {isActive ? "✓" : ""}
                    </span>
                    {contentTypeLabels[ct]}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 w-full justify-center py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ background: "#C75B39", color: "#F5F0EB" }}
          >
            <Download size={13} strokeWidth={1.5} />
            {generating ? "Génération en cours..." : "Générer le rapport"}
          </button>
        </div>
      </div>

      {/* Export history */}
      <div>
        <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "#F5F0EB" }}>
          Exports récents
        </p>
        {exports.length === 0 ? (
          <div className="p-5 text-center" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
            <FileText size={24} strokeWidth={1.5} style={{ color: "#E0D8D0" }} className="mx-auto mb-2" />
            <p className="text-xs font-sans" style={{ color: "#E0D8D0" }}>
              Aucun export pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {exports.map((exp) => {
              const Icon = formatIcons[exp.format];
              return (
                <div
                  key={exp.id}
                  className="flex items-center gap-3 p-3"
                  style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="w-8 h-8 flex items-center justify-center" style={{ background: "rgba(199,91,57,0.1)" }}>
                    <Icon size={14} strokeWidth={1.5} style={{ color: "#C75B39" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans font-medium truncate" style={{ color: "#D0CCC6" }}>
                      {contentTypeLabels[exp.type]} · {formatLabels[exp.format]}
                    </p>
                    <p className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>
                      {formatDate(exp.generated_at)}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-sans font-semibold uppercase tracking-[0.08em] px-2 py-0.5"
                    style={{ background: "rgba(122,154,101,0.15)", color: "#7A9A65" }}
                  >
                    Prêt
                  </span>
                  <button className="p-1 transition-colors hover:bg-white/5" style={{ color: "#F5F0EB" }}>
                    <Download size={12} strokeWidth={1.5} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
