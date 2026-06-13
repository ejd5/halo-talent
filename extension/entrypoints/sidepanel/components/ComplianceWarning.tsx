import { AlertTriangle } from "lucide-react";

interface Props {
  message: string;
  severity: "warning" | "block";
  onDismiss?: () => void;
}

export function ComplianceWarning({ message, severity, onDismiss }: Props) {
  return (
    <div
      className="flex items-start gap-2 p-2.5 rounded-lg text-[10px] leading-relaxed"
      style={{
        backgroundColor:
          severity === "block"
            ? "rgba(239,68,68,0.08)"
            : "rgba(245,158,11,0.08)",
        border: `1px solid ${
          severity === "block"
            ? "rgba(239,68,68,0.2)"
            : "rgba(245,158,11,0.2)"
        }`,
      }}
    >
      <AlertTriangle
        size={12}
        className="shrink-0 mt-0.5"
        style={{ color: severity === "block" ? "var(--danger)" : "var(--warning)" }}
      />
      <div className="flex-1 min-w-0">
        <p
          style={{
            color: severity === "block" ? "var(--danger)" : "var(--warning)",
          }}
        >
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-[9px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
