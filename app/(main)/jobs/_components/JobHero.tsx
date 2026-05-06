"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2, MapPin } from "lucide-react";

export default function JobHero({ jobs, loading }: any) {
  return (
    <section
      className="pt-[120px] pb-[72px] relative overflow-hidden text-center"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 70%), #0a0f0d",
      }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        className="relative max-w-[720px] mx-auto px-6"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
        <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.72rem] font-semibold tracking-[0.1em] uppercase mb-5">
          <span className="animate-pulse">●</span> Job Board
        </div>

        <h1
          className="font-syne font-extrabold leading-[1.1] tracking-tight mb-4"
          style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>
          Temukan Karir{" "}
          <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Impian Anda
          </span>
        </h1>

        <p className="text-[#7a9585] text-base leading-[1.65] mb-9 max-w-[520px] mx-auto">
          Temukan pekerjaan yang cocok dengan skill dan passion Anda. Lamar
          langsung dan analisis kecocokan CV Anda dengan AI.
        </p>

        {/* Stats bar */}
        <div className="inline-flex items-center gap-6 bg-[#0f1612] border border-emerald-500/15 rounded-full px-6 py-[10px] text-[0.75rem]">
          <span className="flex items-center gap-[6px] text-[#7a9585]">
            <Briefcase size={13} className="text-emerald-400" />
            <span className="text-[#e8f0ec] font-bold">
              {loading ? "—" : jobs.length}
            </span>{" "}
            lowongan
          </span>
          <span className="w-px h-3 bg-emerald-500/20" />
          <span className="flex items-center gap-[6px] text-[#7a9585]">
            <Building2 size={13} className="text-emerald-400" />
            <span className="text-[#e8f0ec] font-bold">
              {loading ? "—" : new Set(jobs.map((j) => j.companies?.name)).size}
            </span>{" "}
            perusahaan
          </span>
          <span className="w-px h-3 bg-emerald-500/20" />
          <span className="flex items-center gap-[6px] text-[#7a9585]">
            <MapPin size={13} className="text-emerald-400" />
            <span className="text-[#e8f0ec] font-bold">Remote</span> tersedia
          </span>
        </div>
      </motion.div>
    </section>
  );
}
