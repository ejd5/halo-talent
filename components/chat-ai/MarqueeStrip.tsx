// ── MarqueeStrip, Infinite scrolling text banner ─────────
// Inspired by Synchronized Studio's marquee technique.
// Renders a single row of text that scrolls infinitely.

const words = [
  "Fan Brain",
  "PPV Check",
  "QA Review",
  "Compliance Gate",
  "Audit Log",
  "Human Approved",
  "Draft Ready",
  "Risk Checked",
];

interface MarqueeStripProps {
  /** Top/bottom border toggle */
  bordered?: boolean;
  className?: string;
}

export function MarqueeStrip({ bordered = true, className }: MarqueeStripProps) {
  // Repeat the word list enough times to fill ~2x viewport width
  const repeats = 8;

  return (
    <div
      className={className}
      style={{
        borderTop: bordered ? "1px solid var(--border-default)" : "none",
        borderBottom: bordered ? "1px solid var(--border-default)" : "none",
        padding: "18px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: "var(--bg-surface)",
      }}
      aria-hidden="true"
    >
      <div
        className="inline-flex gap-14"
        style={{
          animation: "marquee-loading 22s linear infinite",
          fontFamily: "var(--font-util), monospace",
          fontSize: "12px",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {Array.from({ length: repeats }).map((_, chunk) => (
          <span key={chunk} className="inline-flex gap-14 whitespace-nowrap">
            {words.map((word) => (
              <span key={`${chunk}-${word}`}>
                {word}
                <b
                  style={{
                    color: "rgb(16,185,129)",
                    fontWeight: 400,
                    marginLeft: "14px",
                  }}
                >
                  ·
                </b>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
