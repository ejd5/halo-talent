// ─── Empty State — Halo Companion ───────────

import type { ReactNode } from "react";
import { type LucideIcon, Inbox } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <Icon size={22} style={{ color: "var(--text-tertiary)" }} />
      </div>
      <p className="text-[11px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      {description && (
        <p className="text-[10px] leading-relaxed max-w-xs" style={{ color: "var(--text-tertiary)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
