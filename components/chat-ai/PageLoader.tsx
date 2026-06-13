"use client";

import { useEffect, useState, useRef } from "react";

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const duration = 1800;

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      const id1 = setTimeout(() => setProgress(100), 0);
      const id2 = setTimeout(() => setExit(true), 100);
      const id3 = setTimeout(() => setHidden(true), 700);
      return () => {
        clearTimeout(id1);
        clearTimeout(id2);
        clearTimeout(id3);
      };
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.round(eased * 100));

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setExit(true), 200);
        setTimeout(() => setHidden(true), 800);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "var(--bg-primary, #0C0A08)",
        opacity: exit ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: exit ? "none" : "auto",
      }}
      aria-hidden={exit}
    >
      {/* Counter */}
      <div
        className="text-[4rem] md:text-[7rem] font-bold tracking-[-0.03em] leading-none"
        style={{
          fontFamily: "var(--font-display), sans-serif",
          color: "var(--text-primary)",
          opacity: exit ? 0 : 1,
          transform: exit ? "scale(0.95)" : "scale(1)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {progress}
        <span style={{ color: "rgb(16,185,129)" }}>%</span>
      </div>

      {/* Progress bar */}
      <div
        className="mt-6 w-48 h-[1px] relative overflow-hidden"
        style={{ background: "rgba(244,238,227,0.08)" }}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, rgb(16,185,129), rgb(59,130,246))",
          }}
        />
      </div>

      {/* Marquee text strip */}
      <div
        className="absolute bottom-12 left-0 right-0 overflow-hidden whitespace-nowrap"
        style={{
          borderTop: "1px solid rgba(244,238,227,0.05)",
          borderBottom: "1px solid rgba(244,238,227,0.05)",
          padding: "14px 0",
        }}
      >
        <div
          className="inline-flex gap-16"
          style={{
            animation: "marquee-loading 14s linear infinite",
            fontFamily: "var(--font-util), monospace",
            fontSize: "11px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="whitespace-nowrap">
              Fan Brain{" "}
              <b style={{ color: "rgb(16,185,129)", fontWeight: 400 }}>·</b>{" "}
              PPV Check{" "}
              <b style={{ color: "rgb(16,185,129)", fontWeight: 400 }}>·</b>{" "}
              QA Review{" "}
              <b style={{ color: "rgb(16,185,129)", fontWeight: 400 }}>·</b>{" "}
              Compliance Gate{" "}
              <b style={{ color: "rgb(16,185,129)", fontWeight: 400 }}>·</b>{" "}
              Audit Log{" "}
              <b style={{ color: "rgb(16,185,129)", fontWeight: 400 }}>·</b>{" "}
              Human Approved{" "}
              <b style={{ color: "rgb(16,185,129)", fontWeight: 400 }}>·</b>{" "}
              Risk Checked{" "}
              <b style={{ color: "rgb(16,185,129)", fontWeight: 400 }}>·</b>{" "}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom label */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px]"
        style={{
          fontFamily: "var(--font-util), monospace",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          opacity: 0.4,
        }}
      >
        WTF Sovereign Chat AI
      </div>
    </div>
  );
}
