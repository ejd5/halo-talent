interface Props {
  itemTitle: string;
  compliancePassed: boolean;
  hasModelRelease: boolean;
}

export function VaultChecker({ itemTitle, compliancePassed, hasModelRelease }: Props) {
  return (
    <div
      className="flex items-start gap-2 p-2.5 rounded-lg text-[10px]"
      style={{
        backgroundColor: compliancePassed
          ? "rgba(16,185,129,0.06)"
          : "rgba(239,68,68,0.06)",
        border: `1px solid ${
          compliancePassed
            ? "rgba(16,185,129,0.15)"
            : "rgba(239,68,68,0.15)"
        }`,
      }}
    >
      <span>{compliancePassed ? "✅" : "⚠️"}</span>
      <div>
        <p className="font-medium" style={{ color: "var(--text-primary)" }}>
          {itemTitle}
        </p>
        <p style={{ color: "var(--text-tertiary)" }}>
          Compliance: {compliancePassed ? "OK" : "Attention"} · Model Release:{" "}
          {hasModelRelease ? "OK" : "Manquant"}
        </p>
      </div>
    </div>
  );
}
