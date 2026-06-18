import { TrackedLink } from "@/components/chat-ai/TrackedLink";
import { ChatAITrackingEvents } from "@/lib/tracking/chat-ai-events";

// ── Orbital node definitions ──────────────────────────────

interface OrbitNode {
  label: string;
  angle: number;
  distance: number;
  color: string;
  glowColor: string;
}

const ORBIT_NODES: OrbitNode[] = [
  { label: "Fan Brain", angle: -28, distance: 0.43, color: "rgb(16,185,129)", glowColor: "rgba(16,185,129,0.5)" },
  { label: "PPV Check", angle: 42, distance: 0.47, color: "rgb(59,130,246)", glowColor: "rgba(59,130,246,0.5)" },
  { label: "QA Review", angle: 115, distance: 0.44, color: "rgb(245,158,11)", glowColor: "rgba(245,158,11,0.5)" },
  { label: "Compliance Gate", angle: 205, distance: 0.46, color: "rgb(239,68,68)", glowColor: "rgba(239,68,68,0.5)" },
  { label: "Audit Log", angle: 290, distance: 0.44, color: "rgb(168,85,247)", glowColor: "rgba(168,85,247,0.5)" },
];

// ── Circular Text SVG ─────────────────────────────────────
// Spinning circular text like Synchronized Studio's circle-text.svg

function CircularText() {
  const r = 74;
  const text = "FAN BRAIN  ·  PPV CHECK  ·  QA REVIEW  ·  COMPLIANCE GATE  ·  AUDIT LOG  ·  HUMAN APPROVED  ·  ";

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        width: 180,
        height: 180,
        right: -40,
        top: -30,
        animation: "chat-ai-orbital-spin 18s linear infinite",
        opacity: 0.18,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 180 180" className="w-full h-full">
        <defs>
          <path
            id="circle-path"
            d={`M ${90 - r},90 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
          />
        </defs>
        <text fontSize="9.5" fill="var(--text-secondary)" letterSpacing="2.8">
          <textPath href="#circle-path" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

// ── Floating Orbs ─────────────────────────────────────────

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute rounded-full"
        style={{
          width: 140,
          height: 140,
          left: "8%",
          top: "20%",
          background: "radial-gradient(circle, rgba(16,185,129,0.04), transparent 70%)",
          animation: "chat-ai-float 7s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          right: "12%",
          bottom: "15%",
          background: "radial-gradient(circle, rgba(59,130,246,0.04), transparent 70%)",
          animation: "chat-ai-float-slower 8s ease-in-out infinite",
          animationDelay: "1.5s",
        }}
      />
      <div
        className="absolute rounded-full hidden lg:block"
        style={{
          width: 60,
          height: 60,
          left: "45%",
          top: "60%",
          background: "radial-gradient(circle, rgba(216,169,91,0.03), transparent 70%)",
          animation: "chat-ai-float 6s ease-in-out infinite",
          animationDelay: "3s",
        }}
      />
    </div>
  );
}

// ── Orbital System ────────────────────────────────────────

function OrbitalSystem({ compact = false }: { compact?: boolean }) {
  const size = compact ? 260 : 360;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 1;

  const lines = ORBIT_NODES.map((node) => {
    const rad = ((node.angle - 90) * Math.PI) / 180;
    const r = outerR * node.distance;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  });

  return (
    <div
      className="chat-ai-hero-reveal relative mx-auto"
      style={{
        width: size,
        height: size,
        animation: "chat-ai-fade-in 1.2s ease-out both",
        animationDelay: "250ms",
      }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {lines.map((p, i) => (
          <line
            key={i}
            x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke="var(--border-default)"
            strokeWidth="0.5"
            opacity="0.25"
          />
        ))}
      </svg>

      <div
        className="absolute rounded-full"
        style={{
          inset: 0,
          border: "1px solid var(--border-default)",
          opacity: 0.15,
          animation: compact ? "none" : "chat-ai-orbital-spin 52s linear infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: "16%",
          border: "1px dashed var(--border-default)",
          opacity: 0.2,
          animation: compact ? "none" : "chat-ai-orbital-spin-reverse 40s linear infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: "32%",
          border: "1px solid var(--border-default)",
          opacity: 0.1,
          animation: compact ? "none" : "chat-ai-orbital-spin 60s linear infinite",
        }}
      />

      {ORBIT_NODES.map((node, i) => {
        const rad = ((node.angle - 90) * Math.PI) / 180;
        const r = outerR * node.distance;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);

        return (
          <div
            key={node.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 text-[9px] font-medium whitespace-nowrap select-none"
            style={{
              left: x, top: y,
              color: "var(--text-secondary)",
              background: "rgba(28, 23, 18, 0.88)",
              border: "1px solid var(--border-default)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              animation: compact ? "none" : `chat-ai-float ${4 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
              style={{
                background: node.color,
                boxShadow: `0 0 7px ${node.glowColor}`,
                animation: compact ? "none" : `chat-ai-pulse-node ${2.5 + i * 0.4}s ease-out infinite`,
              }}
            />
            {node.label}
          </div>
        );
      })}

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-3 text-center select-none"
        style={{
          background: "rgba(28, 23, 18, 0.92)",
          border: "1px solid rgba(16,185,129,0.18)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 0 40px rgba(16,185,129,0.05)",
          animation: compact ? "none" : "chat-ai-float-slower 6s ease-in-out infinite",
        }}
      >
        <p className="text-[10px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {compact ? "Draft ready" : "Draft ready for review"}
        </p>
        <p className="text-[8px] mt-1 leading-tight" style={{ color: "var(--text-secondary)" }}>
          Human approval required
        </p>
        <p className="text-[8px] mt-0.5 flex items-center justify-center gap-1 leading-tight"
          style={{ color: "rgb(16,185,129)" }}>
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{
              background: "rgb(16,185,129)",
              animation: compact ? "none" : "chat-ai-pulse-node 2s ease-out infinite",
            }}
          />
          Risk checked
        </p>
      </div>
    </div>
  );
}

// ── Scan Line ─────────────────────────────────────────────

function ScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.12), rgba(59,130,246,0.08), transparent)",
          animation: "chat-ai-scan-line 8s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// ── Stats Row ─────────────────────────────────────────────

const STATS = [
  { value: "8", label: "Piliers", sub: "couverture complète" },
  { value: "5", label: "Étapes", sub: "validation humaine" },
  { value: "100%", label: "Audit", sub: "traçabilité totale" },
];

function HeroStats() {
  return (
    <div
      className="chat-ai-hero-reveal flex flex-wrap justify-center lg:justify-start gap-8 md:gap-14 mt-10"
      style={{
        animation: "chat-ai-fade-in 0.9s ease-out both",
        animationDelay: "750ms",
      }}
    >
      {STATS.map((s) => (
        <div key={s.label} className="text-center lg:text-left">
          <div
            className="text-[28px] md:text-[34px] font-light tracking-[-0.02em] leading-none"
            style={{ fontFamily: "var(--font-display-alt), serif", color: "var(--text-primary)" }}
          >
            {s.value}
            <em
              className="not-italic text-lg md:text-xl ml-1"
              style={{ color: "rgb(16,185,129)" }}
            >
              {s.value === "100%" ? "" : ""}
            </em>
          </div>
          <div
            className="text-[9px] uppercase tracking-[0.2em] mt-1.5"
            style={{ fontFamily: "var(--font-util), monospace", color: "var(--text-secondary)" }}
          >
            {s.label}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Line-by-Line H1 ──────────────────────────────────────
// Split like SYNCHRO / NIZED for staggered reveal

function HeroTitle() {
  const lines = [
    { text: "Un copilote de chatting", delay: "100ms" },
    { text: "", delay: "180ms", isGradient: true, parts: [
      { text: "conçu pour ", isGradient: false },
      { text: "vendre mieux", isGradient: true },
      { text: ",", isGradient: false },
    ]},
    { text: "sans perdre le contrôle.", delay: "260ms" },
  ];

  return (
    <h1
      className="chat-ai-hero-reveal max-w-4xl mx-auto lg:mx-0"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1.08,
        color: "var(--text-primary)",
      }}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className="block overflow-hidden"
          style={{ animation: `chat-ai-reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) both`, animationDelay: line.delay }}
        >
          <span className="block" style={{ animation: `chat-ai-rise 0.9s cubic-bezier(0.16,1,0.3,1) both`, animationDelay: line.delay }}>
            {line.parts ? (
              line.parts.map((part, j) =>
                part.isGradient ? (
                  <span
                    key={j}
                    style={{
                      background: "linear-gradient(135deg, rgb(16,185,129), rgb(59,130,246))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {part.text}
                  </span>
                ) : (
                  <span key={j}>{part.text}</span>
                )
              )
            ) : (
              line.text
            )}
          </span>
        </span>
      ))}
    </h1>
  );
}

// ── Hero Component ────────────────────────────────────────

export function ChatAIHero() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(244,238,227,0.035) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "900px", height: "550px",
            background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.055) 0%, rgba(59,130,246,0.025) 40%, transparent 72%)",
            animation: "chat-ai-spotlight-breathe 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: "500px", height: "400px",
            background: "radial-gradient(ellipse at 70% 80%, rgba(216,169,91,0.035) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating orbs */}
      <FloatingOrbs />

      {/* Scanning line */}
      <ScanLine />

      {/* Circular text, desktop only */}
      <div className="hidden lg:block">
        <CircularText />
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto w-full max-w-5xl px-6 md:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14 items-center">
          {/* ── Text block ── */}
          <div className="lg:col-span-3 text-center lg:text-left">
            {/* Badge */}
            <span
              className="chat-ai-hero-reveal inline-block text-[10px] font-semibold uppercase tracking-[0.12em] mb-5 px-3 py-1"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "rgb(16,185,129)",
                animation: "chat-ai-reveal-up 0.7s ease-out both",
                animationDelay: "0ms",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                style={{
                  background: "rgb(16,185,129)",
                  boxShadow: "0 0 8px rgba(16,185,129,0.6)",
                  animation: "chat-ai-pulse-node 2.5s ease-out infinite",
                }}
              />
CHATEENG
            </span>

            {/* H1, split lines */}
            <HeroTitle />

            {/* Subtitle */}
            <p
              className="chat-ai-hero-reveal text-base md:text-lg mt-5 max-w-xl mx-auto lg:mx-0"
              style={{
                color: "var(--text-secondary)",
                animation: "chat-ai-reveal-up 0.8s ease-out both",
                animationDelay: "380ms",
                lineHeight: 1.6,
              }}
            >
              Préparez des réponses, priorisez les conversations, recommandez des PPV,
              contrôlez les risques et gardez une trace de chaque action, avec validation humaine.
            </p>

            {/* CTAs */}
            <div
              className="chat-ai-hero-reveal flex flex-wrap justify-center lg:justify-start gap-3 mt-8"
              style={{
                animation: "chat-ai-reveal-up 0.8s ease-out both",
                animationDelay: "500ms",
              }}
            >
              <TrackedLink
                href="/demo"
                eventName={ChatAITrackingEvents.LANDING_HERO_DEMO}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "var(--accent)",
                  color: "#1C1917",
                  boxShadow: "0 0 24px rgba(216,169,91,0.15)",
                }}
              >
                Demander une démo
              </TrackedLink>
              <TrackedLink
                href="#workflow"
                eventName={ChatAITrackingEvents.LANDING_HERO_HOW_IT_WORKS}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
                style={{
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                }}
              >
                Voir comment ça fonctionne
              </TrackedLink>
            </div>

            {/* Stats row */}
            <HeroStats />

            {/* Micro-reassurance */}
            <p
              className="chat-ai-hero-reveal text-[11px] mt-6"
              style={{
                color: "var(--text-secondary)",
                opacity: 0.5,
                animation: "chat-ai-fade-in 0.7s ease-out both",
                animationDelay: "850ms",
              }}
            >
              Validation humaine requise. Aucune promesse de revenu. Aucun envoi automatique.
            </p>
          </div>

          {/* ── Orbital visual, desktop right ── */}
          <div className="lg:col-span-2 hidden lg:flex justify-center items-center">
            <OrbitalSystem />
          </div>
        </div>

        {/* ── Orbital visual, mobile/tablet below ── */}
        <div className="lg:hidden mt-12 flex justify-center">
          <OrbitalSystem compact />
        </div>
      </div>
    </section>
  );
}
