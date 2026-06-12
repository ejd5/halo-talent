import { HeroSection } from "@/components/home/HeroSection";
import { MarqueeBar } from "@/components/home/MarqueeBar";
import { MaisonsSection } from "@/components/home/MaisonsSection";
import { SimulateurSection } from "@/components/home/SimulateurSection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { BouclierSection } from "@/components/home/BouclierSection";
import { DepartmentsSection } from "@/components/home/DepartmentsSection";
import { ManifesteSection } from "@/components/home/ManifesteSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <MaisonsSection />
      <SimulateurSection />
      <ComparisonSection />
      <BouclierSection />
      <DepartmentsSection />
      <ManifesteSection />
      <FinalCtaSection />
    </>
  );
}
