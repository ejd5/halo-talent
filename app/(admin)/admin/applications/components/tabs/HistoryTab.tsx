"use client";

import { auditLogs } from "../../data";
import { formatDate, relativeTime } from "../../utils";
import {
  FileText,
  UserCheck,
  Brain,
  MessageSquare,
  CheckCircle,
  Clock,
} from "lucide-react";

type Props = { applicationId: string };

const actionIcons: Record<string, React.ElementType> = {
  Soumise: FileText,
  "Analyse IA": Brain,
  "Mise en review": Clock,
  Approuvée: CheckCircle,
  "Note ajoutée": MessageSquare,
  Vu: UserCheck,
};

const actionColors: Record<string, string> = {
  Soumise: "#E0D8D0",
  "Analyse IA": "#F5F0EB",
  "Mise en review": "#C75B39",
  Approuvée: "#7A9A65",
  "Note ajoutée": "#E0D8D0",
  Vu: "#E0D8D0",
};

export function HistoryTab({ applicationId }: Props) {
  const logs = auditLogs[applicationId];

  if (!logs || logs.length === 0) {
    return (
      <p className="text-sm font-sans text-center py-8" style={{ color: "#E0D8D0" }}>
        Aucun historique pour cette candidature.
      </p>
    );
  }

  return (
    <div className="relative card-accent" style={{ background: "#0A0908" }}>
      {/* Timeline line */}
      <div
        className="absolute left-[11px] top-2 bottom-2 w-px"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      <div className="space-y-0">
        {logs
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .map((log) => {
            // Determine icon based on action prefix
            const prefix = Object.keys(actionIcons).find((k) =>
              log.action.startsWith(k)
            );
            const Icon = prefix ? actionIcons[prefix] : Clock;
            const color = prefix ? actionColors[prefix] : "#E0D8D0";

            return (
              <div key={log.id} className="flex gap-4 pb-5 relative">
                <div className="relative z-10 mt-0.5">
                  <div
                    className="w-[22px] h-[22px] flex items-center justify-center"
                    style={{ background: `${color}12` }}
                  >
                    <Icon size={11} strokeWidth={1.5} style={{ color }} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans font-medium" style={{ color: "#D0CCC6" }}>
                    {log.action}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-sans" style={{ color: "#E0D8D0" }}>
                      par {log.actor}
                    </span>
                    <span className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>
                      {relativeTime(log.created_at)}
                    </span>
                  </div>
                  {(log.metadata?.note as string | undefined) && (
                    <p
                      className="mt-1.5 text-xs font-sans p-2 leading-relaxed"
                      style={{
                        color: "#E0D8D0",
                        background: "rgba(255,255,255,0.02)",
                        borderLeft: "2px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {String((log.metadata as Record<string, unknown>)?.note ?? "")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
