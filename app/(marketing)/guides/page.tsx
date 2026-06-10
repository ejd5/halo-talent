"use client";

import { GuidesPage } from "@/components/blog/GuidesPage";

export default function GuidesRoute() {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <div className="mb-12 max-w-2xl">
            <span
              className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] mb-4 px-3 py-1 rounded-full"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
            >
              Guides
            </span>
            <h1
              className="text-[2.5rem] md:text-[4rem] font-bold tracking-[-0.02em] leading-[1.05]"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Guides pratiques
            </h1>
            <p className="text-base md:text-lg mt-4" style={{ color: "var(--text-secondary)" }}>
              Guides longs pour maîtriser tous les aspects de votre activité OFM.
            </p>
          </div>

          <GuidesPage />
        </div>
      </section>
    </div>
  );
}
