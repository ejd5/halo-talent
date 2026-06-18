"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck, AlertTriangle, Check, Camera } from "lucide-react";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { FreshnessBadge } from "@/components/legal/FreshnessBadge";

function useReveal(amount = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const, delay: d } }),
};
const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay: d } }),
};

export interface PlatformProtectionData {
  id: string;
  name: string;
  description: string;
  freshnessDate: string;
  risques: { titre: string; description: string }[];
  bonnesPratiques: { titre: string; description: string }[];
  aDocumenter: string[];
  aNePasFaire: string[];
  commentHaloAide: string[];
  checklist: string[];
  faq: { q: string; r: string }[];
  ctaLabel: string;
  ctaLink: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryLink?: string;
  cguLink: string;
}

function FAQItem({ q, r, fond }: { q: string; r: string; fond: "creme" | "encre" }) {
  const [ouvert, setOuvert] = useState(false);
  const isCreme = fond === "creme";
  return (
    <div style={{ border: `1px solid ${isCreme ? "var(--ligne-faible)" : "rgba(244,238,227,0.08)"}` }}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left"
        style={{ background: ouvert ? (isCreme ? "rgba(216,169,91,0.04)" : "rgba(216,169,91,0.06)") : "transparent", transition: "background 0.3s ease" }}
        onClick={() => setOuvert(!ouvert)}
      >
        <span className="text-[14px] font-medium pr-4" style={{ color: isCreme ? "var(--encre)" : "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{q}</span>
        <ChevronDown size={14} style={{ color: "var(--or)", transform: ouvert ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: isCreme ? "var(--encre)" : "var(--pierre)", opacity: isCreme ? 0.65 : 1, fontFamily: "var(--font-body), sans-serif" }}>{r}</p>
        </div>
      )}
    </div>
  );
}

export function PlatformProtectionClient({ data }: { data: PlatformProtectionData }) {
  return (
    <main>
      <HeroSection data={data} />
      <DisclaimerSection />
      <RisquesSection data={data} />
      <BonnesPratiquesSection data={data} />
      <ADocumenterSection data={data} />
      <ANePasFaireSection data={data} />
      <CommentHaloAideSection data={data} />
      <ChecklistSection data={data} />
      <FAQSection data={data} />
      <CTASection data={data} />
      <SourceSection data={data} />
    </main>
  );
}

function HeroSection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Protection créateur
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Protection {data.name} pour créateurs
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-8" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          {data.description}
        </motion.p>
        <motion.div className="flex items-center justify-center" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.35}>
          <FreshnessBadge date={data.freshnessDate} />
        </motion.div>
      </div>
    </section>
  );
}

function DisclaimerSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 40, paddingBottom: 40 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <LegalDisclaimer variant="short" />
        </motion.div>
      </div>
    </section>
  );
}

function RisquesSection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Vigilance
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Risques fréquents sur {data.name}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 800, margin: "0 auto" }}>
          {data.risques.map((r, i) => (
            <motion.div key={r.titre} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.05}>
              <div className="flex items-start gap-4 p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{r.titre}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{r.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BonnesPratiquesSection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Guide
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Bonnes pratiques
        </motion.h2>
        <div className="space-y-3">
          {data.bonnesPratiques.map((bp, i) => (
            <motion.div key={bp.titre} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.05}>
              <div className="flex items-start gap-4 p-5" style={{ borderLeft: "2px solid var(--or)", background: "rgba(12,10,8,0.02)" }}>
                <span className="text-[0.6rem] font-bold tracking-[0.12em] shrink-0 pt-0.5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{bp.titre}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{bp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ADocumenterSection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-8" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <Camera size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--ivoire)" }}>Ce qu'il faut documenter</h2>
        </motion.div>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          {data.aDocumenter.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3" style={{ borderBottom: "1px solid var(--ligne-faible)" }}>
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: "#5A7D4A" }} />
              <span className="text-[14px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ANePasFaireSection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-8" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}>
            <AlertTriangle size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--encre)" }}>Ce qu'il ne faut pas faire</h2>
        </motion.div>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          {data.aNePasFaire.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3" style={{ borderLeft: "2px solid #C44536", background: "rgba(196,69,54,0.03)" }}>
              <span className="text-[#C44536] font-bold shrink-0">&times;</span>
              <span className="text-[14px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CommentHaloAideSection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-8" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <ShieldCheck size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--ivoire)" }}>Comment WTF vous aide sur {data.name}</h2>
        </motion.div>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          {data.commentHaloAide.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3" style={{ borderBottom: "1px solid var(--ligne-faible)" }}>
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: "var(--or)" }} />
              <span className="text-[14px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ChecklistSection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Avant de publier
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Checklist {data.name}
        </motion.h2>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          {data.checklist.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3" style={{ borderBottom: "1px solid var(--ligne-faible)" }}>
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: "#5A7D4A" }} />
              <span className="text-[14px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Protection {data.name}
        </motion.h2>
        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
              <FAQItem q={item.q} r={item.r} fond="encre" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ data }: { data: PlatformProtectionData }) {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--creme)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Sécurisez votre présence sur {data.name}
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Analysez votre contrat, documentez votre activité, et protégez vos droits de créateur.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href={data.ctaLink} className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>{data.ctaLabel}</Link>
          {data.ctaSecondaryLabel && data.ctaSecondaryLink && (
            <Link href={data.ctaSecondaryLink} className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--encre)" }}>{data.ctaSecondaryLabel}</Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function SourceSection({ data }: { data: PlatformProtectionData }) {
  return (
    <section className="couture-section text-center" style={{ backgroundColor: "var(--creme)", paddingTop: 0, paddingBottom: 60 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <a
          href={data.cguLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}
        >
          Lire les CGU officielles de {data.name}
          <ArrowRight size={12} />
        </a>
        <div className="mt-8">
          <LegalDisclaimer variant="agency" />
        </div>
      </div>
    </section>
  );
}
