"use client";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
};

export function RevenueTabBar({ tabs, active, onChange }: Props) {
  return (
    <div className="flex items-center gap-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="pb-3 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors relative"
            style={{
              color: isActive ? "#C75B39" : "#7A736B",
              borderBottom: isActive ? "2px solid #C75B39" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
