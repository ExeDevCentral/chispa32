import { Hero } from "@/components/marketing/Hero";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { PricingSection } from "@/components/marketing/PricingSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FAQSection } from "@/components/marketing/FAQSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesGrid />
      <PricingSection />
      <HowItWorks />
      <FAQSection />
    </div>
  );
}
