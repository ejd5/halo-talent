"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// ── RevealSection — scroll-triggered reveal ────────────────

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Stagger delay per child (ms), for grid children */
  staggerMs?: number;
  /** Trigger when element is this fraction visible (0–1) */
  threshold?: number;
  /** Extra CSS class applied once visible */
  revealedClass?: string;
}

export function RevealSection({
  children,
  className,
  style,
  staggerMs,
  threshold = 0.12,
  revealedClass = "rv-in",
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-revealed={inView ? "true" : undefined}
    >
      <div
        className={inView ? revealedClass : "rv-hidden"}
        style={
          staggerMs
            ? ({ "--stagger-ms": `${staggerMs}ms` } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}

// ── SectionDivider — ambient separator between sections ────

export function SectionDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(16,185,129,0.12), rgba(59,130,246,0.08), transparent)",
        }}
      />
    </div>
  );
}
