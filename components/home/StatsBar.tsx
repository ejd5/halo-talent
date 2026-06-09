"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "30%→10%", label: "Commission dégressive" },
  { value: "5", label: "Départements" },
  { value: "100%", label: "Souveraineté garantie" },
];

function useCountUp(value: string, active: boolean, delay: number): string {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      const match = value.match(/^(\d+)/);
      if (!match) { setDisplay(value); return; }
      const max = Number(match[1]);
      const suffix = value.slice(match[1].length);
      const duration = 2000;
      const start = performance.now();
      let frame: number;

      const animate = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = Math.round(eased * max);
        setDisplay(`${current}${suffix}`);
        if (p < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(t);
  }, [active, delay, value]);

  return display;
}

function StatItem({
  value,
  label,
  index,
  visible,
}: {
  value: string;
  label: string;
  index: number;
  visible: boolean;
}) {
  const count = useCountUp(value, visible, 200 * index);

  return (
    <div
      className="text-center"
      style={{
        transform: visible ? "translateY(0)" : "translateY(40px)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${200 * index}ms, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${200 * index}ms`,
      }}
    >
      <p className="font-display text-[3rem] md:text-[3.5rem] font-bold text-accent leading-none tabular-nums">
        {count}
      </p>
      <p className="label-uppercase mt-3 text-dark-muted">
        {label}
      </p>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-dark py-12 md:py-16">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-20">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
