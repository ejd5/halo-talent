import type { Metadata } from "next";
import { CoutureHero } from "@/components/home/CoutureHero";
import { CoutureSignalStrip } from "@/components/home/CoutureSignalStrip";
import { CoutureConstat } from "@/components/home/CoutureConstat";
import { CoutureVignettes } from "@/components/home/CoutureVignettes";
import { CoutureEditorialIntro } from "@/components/home/CoutureEditorialIntro";
import { CoutureServicesGrid } from "@/components/home/CoutureServicesGrid";
import { CoutureCarousel } from "@/components/home/CoutureCarousel";
import { CoutureComparison } from "@/components/home/CoutureComparison";
import { CoutureReassurance } from "@/components/home/CoutureReassurance";
import { CoutureStatement } from "@/components/home/CoutureStatement";
import { CoutureFAQ } from "@/components/home/CoutureFAQ";
import { CoutureCommissionSection } from "@/components/home/CoutureCommissionSection";
import { CoutureLegalShield } from "@/components/home/CoutureLegalShield";

export const metadata: Metadata = {
  title: "Where Talent Forms, Maison de management créatif",
  description:
    "Where Talent Forms réunit management, IA, CRM, protection juridique et stratégie de croissance pour aider les créateurs à structurer leur activité sans perdre le contrôle. Paris, New York, Milan, Tokyo.",
  openGraph: {
    title: "Where Talent Forms, Maison de management créatif",
    description:
      "Management, IA, CRM, protection juridique et stratégie de croissance. Tout ce dont un créateur a besoin dans une seule maison.",
  },
};

export default function HomePage() {
  return (
    <>
      <CoutureHero />
      <CoutureSignalStrip />
      <CoutureConstat />
      <CoutureVignettes />
      <CoutureEditorialIntro />
      <CoutureServicesGrid />
      <CoutureCarousel />
      <CoutureComparison />
      <CoutureReassurance />
      <CoutureStatement />
      <CoutureSignalStrip />
      <CoutureCommissionSection />
      <CoutureFAQ />
      <CoutureLegalShield />
    </>
  );
}
