import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { DepartmentsSection } from "@/components/home/DepartmentsSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { LegalShieldSection } from "@/components/home/LegalShieldSection";
import { CommissionsSection } from "@/components/home/CommissionsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <DepartmentsSection />
      <WhyUsSection />
      <LegalShieldSection />
      <CommissionsSection />
      <SocialProofSection />
      <FinalCtaSection />
    </>
  );
}
