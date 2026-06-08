"use client";

import { AlertTriangle, DollarSign, FileText, TrendingDown } from "lucide-react";
import { relativeTime } from "../../creators/utils";
import type { FinancialAlert } from "../types";

type Props = { alerts: FinancialAlert[] };

const alertIcons: Record<string, React.ElementType> = {
  revenue_drop: TrendingDown,
  payment_pending: DollarSign,
  contract_expiring: FileText,
  forecast_risk: AlertTriangle,
};

const alertBg: Record<string, string> = {
  high: "rgba(196,69,54,0.06)",
  medium: "rgba(199,91,57,0.06)",
  low: "rgba(255,255,255,0.02)",
};

const alertBorder: Record<string, string> = {
  high: "2px solid rgba(196,69,54,0.3)",
  medium: "2px solid rgba(199,91,57,0.2)",
  low: "2px solid rgba(255,255,255,0.06)",
};

export function AlertCards({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="p-5 text-center" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-xs font-sans" style={{ color: "#5A544C" }}>
          Aucune alerte financière
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: "#7A736B" }}>
        Alertes & notifications
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {alerts.map((alert) => {
          const Icon = alertIcons[alert.type] || AlertTriangle;
          return (
            <div
              key={alert.id}
              className="p-4"
              style={{
                background: alertBg[alert.severity] || "rgba(255,255,255,0.02)",
                borderLeft: alertBorder[alert.severity] || "2px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <Icon size={14} strokeWidth={1.5} className="shrink-0 mt-0.5"
                  style={{
                    color:
                      alert.severity === "high" ? "#C44536"
                      : alert.severity === "medium" ? "#C75B39"
                      : "#7A736B",
                  }}
                />
                <div>
                  <p className="text-xs font-sans leading-relaxed" style={{ color: "#D0CCC6" }}>
                    {alert.message}
                  </p>
                  {alert.creator_name && (
                    <p className="text-[10px] font-sans mt-1" style={{ color: "#5A544C" }}>
                      {alert.creator_name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
