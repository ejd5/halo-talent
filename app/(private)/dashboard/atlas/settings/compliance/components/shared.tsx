"use client";

import { Loader, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export function Section({ title, icon: Icon, children }: {
  title: string; icon: any; children: React.ReactNode;
}) {
  return (
    <div className="border" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(245,240,235,0.04)" }}>
        <Icon size={16} style={{ color: "#C75B39" }} />
        <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader size={16} className="animate-spin" style={{ color: "rgba(245,240,235,0.2)" }} />
    </div>
  );
}

export function StatusBadge({ status }: { status: "ok" | "warning" | "error" }) {
  const config = {
    ok: { icon: CheckCircle, bg: "rgba(122,154,101,0.08)", color: "#7A9A65", label: "Conforme" },
    warning: { icon: AlertTriangle, bg: "rgba(199,91,57,0.08)", color: "#C75B39", label: "Attention" },
    error: { icon: XCircle, bg: "rgba(196,69,54,0.08)", color: "#C44536", label: "Non conforme" },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1" style={{ backgroundColor: c.bg, color: c.color }}>
      <Icon size={12} /> {c.label}
    </span>
  );
}

export function Toggle({ label, checked, onChange, desc }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; desc?: string;
}) {
  return (
    <label className="flex items-start gap-3 py-3 cursor-pointer" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative w-9 h-5 shrink-0 mt-0.5 transition-colors"
        style={{ backgroundColor: checked ? "#C75B39" : "rgba(245,240,235,0.1)" }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 transition-transform"
          style={{ backgroundColor: "#F5F0EB", transform: checked ? "translateX(16px)" : "translateX(0)" }}
        />
      </button>
      <div>
        <span className="text-sm font-medium" style={{ color: "#F5F0EB" }}>{label}</span>
        {desc && <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{desc}</p>}
      </div>
    </label>
  );
}

export function CopyBlock({ content }: { content: string }) {
  return (
    <div className="relative group">
      <pre
        className="text-xs p-4 overflow-x-auto whitespace-pre-wrap"
        style={{ backgroundColor: "#1A1614", border: "1px solid rgba(245,240,235,0.06)", color: "#B0A89E", fontFamily: "var(--font-mono)" }}
      >{content}</pre>
      <button
        onClick={() => navigator.clipboard.writeText(content)}
        className="absolute top-2 right-2 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
      >
        Copier
      </button>
    </div>
  );
}
