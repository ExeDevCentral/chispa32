import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { PricingSection } from "@/components/marketing/PricingSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FAQSection } from "@/components/marketing/FAQSection";
import { ReviewsMarquee } from "@/components/marketing/ReviewsMarquee";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <LocalBusinessJsonLd />
      <Hero />
      <ServicesGrid />
      <div id="opiniones">
        <ReviewsMarquee />
      </div>
      <PricingSection />
      <HowItWorks />
      <FAQSection />
    </div>
  );
}
