interface Props {
  revenue24h: number;
  revenue30d: number;
  topSpenders: { username: string; amount: number }[];
}

export function RevenueRadarMini({ revenue24h, revenue30d, topSpenders }: Props) {
  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
    >
      <h3 className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
        Revenue Radar
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
            24h
          </p>
          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            ${revenue24h.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
            30 jours
          </p>
          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            ${revenue30d.toLocaleString()}
          </p>
        </div>
      </div>

      {topSpenders.length > 0 && (
        <div>
          <p className="text-[9px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Top Spenders
          </p>
          {topSpenders.slice(0, 3).map((s) => (
            <div key={s.username} className="flex justify-between text-[10px]">
              <span style={{ color: "var(--text-secondary)" }}>{s.username}</span>
              <span style={{ color: "var(--success)" }}>${s.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
