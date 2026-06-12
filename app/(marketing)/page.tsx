import { CoutureHero } from "@/components/home/CoutureHero";
import { CoutureSignalStrip } from "@/components/home/CoutureSignalStrip";
import { CoutureVignettes } from "@/components/home/CoutureVignettes";
import { CoutureEditorialIntro } from "@/components/home/CoutureEditorialIntro";
import { CoutureServicesGrid } from "@/components/home/CoutureServicesGrid";
import { CoutureCarousel } from "@/components/home/CoutureCarousel";
import { CoutureReassurance } from "@/components/home/CoutureReassurance";
import { CoutureStatement } from "@/components/home/CoutureStatement";
import { CoutureCommissionSection } from "@/components/home/CoutureCommissionSection";
import { CoutureLegalShield } from "@/components/home/CoutureLegalShield";

export default function HomePage() {
  return (
    <>
      <CoutureHero />
      <CoutureSignalStrip />
      <CoutureVignettes />
      <CoutureEditorialIntro />
      <CoutureServicesGrid />
      <CoutureCarousel />
      <CoutureReassurance />
      <CoutureStatement />
      <CoutureSignalStrip />
      <CoutureCommissionSection />
      <CoutureLegalShield />
    </>
  );
}
