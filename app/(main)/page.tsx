import { LandingHero } from "@/components/landing/LandingHero";

import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingCTA } from "@/components/landing/LandingCTA";
import LandingContent from "@/components/landing/LandingContent";
import { LandingStats } from "@/components/landing/LandingStats";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        <LandingHero />

        <LandingStats />

        <LandingContent />

        <LandingTestimonials />

        <LandingFAQ />

        <LandingCTA />
      </main>
    </div>
  );
}