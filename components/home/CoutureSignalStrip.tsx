"use client";

import { SIGNAL_WORDS } from "@/lib/marketing/couture-homepage";

export function CoutureSignalStrip() {
  return (
    <div
      className="couture-marquee"
      aria-hidden="true"
    >
      <div className="couture-marquee-track">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="inline-flex gap-14">
            {SIGNAL_WORDS.map((w) => (
              <span key={w}>
                {w} <b>·</b>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
