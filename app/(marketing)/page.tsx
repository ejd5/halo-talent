import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { DepartmentsSection } from "@/components/home/DepartmentsSection";
import { CommissionsSection } from "@/components/home/CommissionsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      {/* ─── HERO — Split-screen 5/7 asymétrique ─── */}
      <HeroSection />

      {/* ─── PULL-QUOTE (Instrument Serif — section claire) ─── */}
      <section className="py-32 md:py-44 bg-base border-b border-ink/5">
        <div className="mx-auto w-full max-w-5xl px-8 md:px-16">
          <blockquote className="font-accent text-3xl md:text-5xl italic leading-[1.3] max-w-4xl text-ink">
            &ldquo;Le marché du management créatif est cassé. 50% de commission.
            Contrats opaques. Créateurs qui perdent le contrôle de leur propre
            travail. Nous avons construit l&apos;opposé.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ─── DÉPARTEMENTS — Grille éditoriale asymétrique ─── */}
      <DepartmentsSection />

      {/* ─── COMMISSIONS — Escalier inversé visuel ─── */}
      <CommissionsSection />

      {/* ─── SOCIAL PROOF — Logos, stats, citation ─── */}
      <SocialProofSection />

      {/* ─── CTA FINAL — Pleine page image + overlay ─── */}
      <FinalCtaSection />
    </>
  );
}
