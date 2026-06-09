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
    <div className="flex items-center gap-1" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      {OPTIONS.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors"
            style={{
              background: isActive ? "#C75B39" : "transparent",
              color: isActive ? "#F5F0EB" : "#F5F0EB",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
