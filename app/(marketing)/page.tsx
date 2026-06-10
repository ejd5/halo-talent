import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { CalculatorSection } from "@/components/home/CalculatorSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { FAQSection } from "@/components/home/FAQSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { FooterSection } from "@/components/home/FooterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ComparisonSection />
      <CalculatorSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <SocialProofSection />
      <FinalCtaSection />
      <FooterSection />
    </>
  );
}
