"use client";

import { Check, X } from "lucide-react";

/* ─── Comparison data ─── */

interface ComparisonRow {
  label: string;
  details?: string;
  values: Record<string, boolean | string>;
}

const STUDIO_NAMES = ["Free", "Creator", "Premium", "Elite"] as const;
const ATLAS_NAMES = ["Free", "Pro", "Enterprise"] as const;

const STUDIO_ROWS: ComparisonRow[] = [
  { label: "Plateformes", values: { Free: "3", Creator: "5", Premium: "10", Elite: "Illimité" } },
  { label: "Crédits IA/mois", values: { Free: "5", Creator: "100", Premium: "500", Elite: "1 500" } },
  { label: "Génération texte", values: { Free: true, Creator: true, Premium: true, Elite: true } },
  { label: "Génération image", values: { Free: false, Creator: true, Premium: true, Elite: true } },
  { label: "Génération vidéo", values: { Free: false, Creator: false, Premium: true, Elite: true } },
  { label: "Génération audio", values: { Free: false, Creator: false, Premium: true, Elite: true } },
  { label: "Templates premium", values: { Free: false, Creator: true, Premium: true, Elite: true } },
  { label: "ByOK (clés API)", values: { Free: false, Creator: false, Premium: false, Elite: true } },
  { label: "Multi-publish", values: { Free: false, Creator: false, Premium: true, Elite: true } },
  { label: "Tone Guard", values: { Free: false, Creator: false, Premium: true, Elite: true } },
  { label: "Support prioritaire", values: { Free: false, Creator: false, Premium: false, Elite: true } },
];

const ATLAS_ROWS: ComparisonRow[] = [
  { label: "Canaux", values: { Free: "1", Pro: "3", Enterprise: "5+" } },
  { label: "Fans maximum", values: { Free: "100", Pro: "10 000", Enterprise: "Illimité" } },
  { label: "Revenue Radar", values: { Free: false, Pro: true, Enterprise: true } },
  { label: "Segments automatiques", values: { Free: false, Pro: true, Enterprise: true } },
  { label: "Funnels automatisés", values: { Free: false, Pro: true, Enterprise: true } },
  { label: "Règles Si-Alors", values: { Free: false, Pro: true, Enterprise: true } },
  { label: "API & Webhooks", values: { Free: false, Pro: false, Enterprise: true } },
  { label: "Multi-comptes", values: { Free: false, Pro: false, Enterprise: true } },
  { label: "Conformité avancée", values: { Free: false, Pro: false, Enterprise: true } },
  { label: "Support dédié", values: { Free: false, Pro: false, Enterprise: true } },
];

/* ─── Component ─── */

export function PricingComparison() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Studio comparison */}
      <div>
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Studio IA — Comparatif des plans
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: "separate", borderSpacing: "0 2px" }}>
            <thead>
              <tr>
                <th className="sticky left-0 text-[10px] font-medium px-3 py-2" style={{ color: "var(--text-tertiary)" }}>
                  Fonctionnalité
                </th>
                {STUDIO_NAMES.map((name) => (
                  <th key={name} className="text-[11px] font-semibold px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STUDIO_ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2.5 text-[11px] rounded-l-lg" style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-card)" }}>
                    {row.label}
                  </td>
                  {STUDIO_NAMES.map((name) => (
                    <td key={name} className="px-3 py-2.5 text-center text-[11px]" style={{ backgroundColor: "var(--bg-card)" }}>
                      <Cell value={row.values[name]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Atlas comparison */}
      <div>
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Atlas CRM — Comparatif des plans
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: "separate", borderSpacing: "0 2px" }}>
            <thead>
              <tr>
                <th className="sticky left-0 text-[10px] font-medium px-3 py-2" style={{ color: "var(--text-tertiary)" }}>
                  Fonctionnalité
                </th>
                {ATLAS_NAMES.map((name) => (
                  <th key={name} className="text-[11px] font-semibold px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ATLAS_ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2.5 text-[11px] rounded-l-lg" style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-card)" }}>
                    {row.label}
                  </td>
                  {ATLAS_NAMES.map((name) => (
                    <td key={name} className="px-3 py-2.5 text-center text-[11px]" style={{ backgroundColor: "var(--bg-card)" }}>
                      <Cell value={row.values[name]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check size={14} className="inline" style={{ color: "var(--success, #7A9A65)" }} />
    ) : (
      <X size={14} className="inline" style={{ color: "var(--text-tertiary)", opacity: 0.4 }} />
    );
  }
  return <span style={{ color: "var(--text-primary)" }}>{value}</span>;
}
