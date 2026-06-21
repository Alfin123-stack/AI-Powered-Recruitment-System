"use client";

// Must be client because it uses framer-motion (motion.div)
// for fade-in animation on initial page load.

import { motion } from "framer-motion";
import { Building2, Briefcase, Globe } from "lucide-react";

type CompanyHeroProps = {
  companyCount: number;
  totalJobs: number;
};

export default function CompanyHero({ companyCount, totalJobs }: CompanyHeroProps) {
  return (
    <section
      className="pt-[108px] pb-[56px] relative overflow-hidden text-center"
      style={{
        background:
          "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(16,185,129,0.06) 0%, transparent 65%), #0a0f0d",
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        className="relative max-w-[680px] mx-auto px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >


        <h1
          className="font-bold leading-[1.12] tracking-tight mb-[12px] text-[#e8f0ec]"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
        >
          Companies That Are{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #10b981, #06b6d4)" }}
          >
            Actively Hiring
          </span>
        </h1>

        <p className="text-[#5d7a6a] text-[0.88rem] leading-[1.7] mb-7 max-w-[480px] mx-auto">
          Discover your dream company, learn about their work culture, and apply to
          open positions available right now.
        </p>

        {/* Stats — data available from server at render time */}
        <div className="inline-flex items-center gap-5 bg-[#0f1612] border border-white/[0.07] rounded-full px-5 py-[9px] text-[0.72rem]">
          <span className="flex items-center gap-[5px] text-[#5d7a6a]">
            <Building2 size={12} className="text-emerald-400" />
            <span className="text-[#e8f0ec] font-semibold">{companyCount}</span> companies
          </span>
          <span className="w-px h-3 bg-white/[0.07]" />
          <span className="flex items-center gap-[5px] text-[#5d7a6a]">
            <Briefcase size={12} className="text-emerald-400" />
            <span className="text-[#e8f0ec] font-semibold">{totalJobs}</span> active jobs
          </span>
          <span className="w-px h-3 bg-white/[0.07]" />
          <span className="flex items-center gap-[5px] text-[#5d7a6a]">
            <Globe size={12} className="text-emerald-400" />
            <span className="text-[#e8f0ec] font-semibold">Remote</span> available
          </span>
        </div>
      </motion.div>
    </section>
  );
}
