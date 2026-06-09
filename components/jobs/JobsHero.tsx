"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2, MapPin, Sparkles } from "lucide-react";
import type { Job } from "@/types/jobs";

export default function JobsHero({
  jobs,
  loading,
}: {
  jobs: Job[];
  loading: boolean;
}) {
  const companyCount = loading
    ? 0
    : new Set(jobs.map((j) => j.companies?.name).filter(Boolean)).size;

  const hasRemote = loading
    ? false
    : jobs.some(
        (j) =>
          j.location?.toLowerCase().includes("remote") || j.type === "Remote",
      );

  const stats = [
    {
      icon: Briefcase,
      value: loading ? "—" : String(jobs.length),
      label: "Openings",
      color: "#34d399",
    },
    {
      icon: Building2,
      value: loading ? "—" : String(companyCount),
      label: "Companies",
      color: "#22d3ee",
    },
    {
      icon: MapPin,
      value: hasRemote || loading ? "✓" : "—",
      label: "Remote Available",
      color: "#a78bfa",
    },
  ];

  return (
    <section className="pt-[120px] pb-[80px] relative overflow-hidden text-center">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0a0f0d)",
        }}
      />

      <motion.div
        className="relative max-w-[680px] mx-auto px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-emerald-500/[0.08] border border-emerald-500/25 text-emerald-400 px-4 py-[6px] rounded-full text-[0.7rem] font-semibold tracking-[0.1em] uppercase mb-6">
          <Sparkles size={11} />
          Latest Openings · AI-Powered Matching
        </motion.div>

        <h1
          className="font-syne font-extrabold leading-[1.08] tracking-tight mb-5 text-[#e8f0ec]"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
          Find the Career{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #34d399, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            That's Right for You
          </span>
        </h1>

        <p className="text-[#7a9585] text-[0.92rem] leading-[1.7] mb-8 max-w-[480px]">
          Explore thousands of openings from trusted companies. Apply directly
          and use AI analysis to measure how well your CV matches.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="flex items-center bg-[#0d1610] border border-emerald-500/15 rounded-[14px] overflow-hidden">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <div key={label} className="flex items-center">
              {i > 0 && <div className="w-px h-9 bg-emerald-500/10" />}
              <div className="flex items-center gap-3 px-6 py-4">
                <div
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, color }}>
                  <Icon size={14} />
                </div>
                <div className="text-left">
                  <div className="text-[0.88rem] font-bold text-[#e8f0ec] leading-none">
                    {value}
                  </div>
                  <div className="text-[0.68rem] text-[#5a8070] mt-[3px]">
                    {label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
