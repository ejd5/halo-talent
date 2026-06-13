// WtfCoutureLogo, Style n°4 validated by user.
// "WTF" in serif display uppercase + "Where Talent Forms" in italic script underneath.
// Champagne/gold on dark backgrounds, encre on light backgrounds.

interface HaloCoutureLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "gold" | "encre" | "ivoire";
  className?: string;
}

const SIZE_MAP = {
  sm: { wordmark: 18, script: 14 },
  md: { wordmark: 22, script: 16 },
  lg: { wordmark: 28, script: 20 },
};

const COLOR_MAP = {
  gold: { primary: "var(--or, #D8A95B)", secondary: "var(--or-clair, #EBC98A)" },
  encre: { primary: "var(--encre, #0C0A08)", secondary: "var(--pierre, #9C9183)" },
  ivoire: { primary: "var(--ivoire, #F4EEE3)", secondary: "var(--or, #D8A95B)" },
};

export function HaloCoutureLogo({
  size = "md",
  variant = "gold",
  className,
}: HaloCoutureLogoProps) {
  const s = SIZE_MAP[size];
  const c = COLOR_MAP[variant];

  return (
    <div className={`inline-flex items-baseline leading-none ${className ?? ""}`} style={{ gap: "0.35em" }}>
      <span
        style={{
          fontFamily: "var(--font-display-alt), Georgia, serif",
          fontSize: s.wordmark,
          fontWeight: 400,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: c.primary,
          lineHeight: 1.1,
        }}
      >
        WTF
      </span>
      <span
        style={{
          fontFamily: "var(--font-accent), Georgia, serif",
          fontSize: s.script,
          fontWeight: 400,
          fontStyle: "italic",
          color: c.secondary,
          lineHeight: 1.2,
        }}
      >
        Talent
      </span>
    </div>
  );
}
