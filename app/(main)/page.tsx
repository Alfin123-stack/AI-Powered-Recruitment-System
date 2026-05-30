import { LandingHero, LandingStats } from "@/components/landing/LandingHero";
import {
  LandingProblems,
  LandingHowItWorks,
  LandingVisualSteps,
  LandingFeatures,
  LandingForWho,
  LandingMission,
} from "@/components/landing/LandingContent";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingCTA } from "@/components/landing/LandingCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        {/* 1. Hero + floating badges */}
        <LandingHero />

        {/* 2. Stats bar */}
        <LandingStats />

        {/* 3. Masalah rekrutmen konvensional */}
        <LandingProblems />

        {/* 4. Cara kerja (steps + mock result card) */}
        <LandingHowItWorks />

        {/* 5. Tiga langkah visual dengan foto */}
        <LandingVisualSteps />

        {/* 6. Fitur utama (4 kartu) */}
        <LandingFeatures />

        {/* 7. Untuk siapa — tab kandidat / HR */}
        <LandingForWho />

        {/* 8. Misi, visi, nilai */}
        <LandingMission />

        {/* 9. Testimoni */}
        <LandingTestimonials />

        {/* 10. FAQ */}
        <LandingFAQ />

        {/* 11. CTA final */}
        <LandingCTA />
      </main>
    </div>
  );
}
