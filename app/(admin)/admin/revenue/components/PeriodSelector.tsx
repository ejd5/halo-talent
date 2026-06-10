"use client";

type Props = {
  value: number;
  onChange: (months: number) => void;
};

const OPTIONS = [
  { label: "3 mois", value: 3 },
  { label: "6 mois", value: 6 },
  { label: "12 mois", value: 12 },
];

export function PeriodSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1" style={{ border: "1px solid var(--border-default)" }}>
      {OPTIONS.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors"
            style={{
              background: isActive ? "var(--accent)" : "transparent",
              color: isActive ? "var(--text-primary)" : "var(--text-primary)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
