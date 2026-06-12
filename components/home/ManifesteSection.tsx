"use client";

import { useEffect, useRef } from "react";

export function ManifesteSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    if (ref.current) ref.current.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="manifeste-section sec-eco" ref={ref} style={{ backgroundColor: "var(--encre, #0C0A08)" }}>
      <div className="wrap-eco rv">
        <span className="eyebrow">Manifeste</span>
        <blockquote style={{ marginTop: "34px" }}>
          &laquo; Une maison qui r&eacute;ussit n&apos;a pas besoin de retenir ses talents par contrat. <em>Elle les retient par ce qu&apos;elle leur apporte.</em> &raquo;
        </blockquote>
        <cite>&mdash; Le manifeste Halo Talent</cite>
      </div>
    </section>
  );
}
