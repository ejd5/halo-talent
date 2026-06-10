"use client";

import { ShieldCheck } from "lucide-react";
import type { RiskLevel } from "@/lib/bouclier-legal/types";

export function RiskGauge({
  percent,
  level,
}: {
  percent: number;
  level: RiskLevel;
}) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const colors: Record<RiskLevel, string> = {
    low: "var(--color-success)",
    moderate: "var(--color-accent)",
    high: "var(--color-accent-hover)",
    critical: "var(--color-alert)",
  };

  const labels: Record<RiskLevel, { text: string; desc: string }> = {
    low: { text: "Faible", desc: "Votre contrat est équilibré" },
    moderate: { text: "Moyen", desc: "Plusieurs clauses à surveiller" },
    high: { text: "Élevé", desc: "Clauses préoccupantes détectées" },
    critical: { text: "Critique", desc: "Action urgente nécessaire" },
  };

  const info = labels[level];
  const color = colors[level];

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="8"
          />
          {/* Score arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1500 ease-out"
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span
              className="text-3xl font-bold block leading-none"
              style={{ color }}
            >
              {percent}%
            </span>
            <span className="text-[9px] font-medium mt-1 block" style={{ color: "var(--text-tertiary)" }}>
              risque
            </span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="mt-4 text-center">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold"
          style={{ backgroundColor: `${color}18`, color }}
        >
          <ShieldCheck size={12} />
          {info.text}
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>
          {info.desc}
        </p>
      </div>
    </div>
  );
}
