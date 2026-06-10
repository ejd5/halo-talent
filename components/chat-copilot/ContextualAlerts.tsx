"use client";

import { useState } from "react";
import { X, Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import type { ContextualAlert } from "@/lib/chat-copilot/types";

const ALERT_CONFIG = {
  info: { icon: Info, bg: "var(--info-bg)" as string, color: "var(--info-text)" as string },
  warning: { icon: AlertTriangle, bg: "var(--warning-bg)" as string, color: "var(--warning-text)" as string },
  danger: { icon: AlertCircle, bg: "var(--danger-bg)" as string, color: "var(--danger-text)" as string },
  success: { icon: CheckCircle, bg: "var(--success-bg)" as string, color: "var(--success-text)" as string },
};

export function ContextualAlerts({
  alerts,
  onDismiss,
}: {
  alerts: ContextualAlert[];
  onDismiss: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-1 px-3 pt-2">
      {alerts.slice(0, 3).map((alert) => {
        const config = ALERT_CONFIG[alert.level];
        const Icon = config.icon;
        const isExpanded = expandedId === alert.id;

        return (
          <div
            key={alert.id}
            className="flex items-start gap-2 px-2.5 py-1.5 text-[11px] leading-relaxed rounded"
            style={{
              backgroundColor: config.bg || `${config.color}15`,
              color: config.color || "var(--text-primary)",
            }}
          >
            <Icon size={12} className="shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <button
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                className="text-left w-full"
              >
                {alert.message}
              </button>
              {isExpanded && alert.detail && (
                <p
                  className="mt-1 text-[10px] leading-relaxed"
                  style={{ opacity: 0.8 }}
                >
                  {alert.detail}
                </p>
              )}
            </div>
            <button
              onClick={() => onDismiss(alert.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={10} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
