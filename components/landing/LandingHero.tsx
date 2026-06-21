"use client";

import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Brain,
  Zap,
  Target,
  BarChart3,
  Award,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { LandingTag } from "./LandingTag";

export function LandingHero() {
  return (
    <section className="pt-[110px] pb-20 relative overflow-hidden">
      {/* Background grid + glow */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none bg-[radial-gradient(ellipse,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid gap-12 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>

            <h1 className="font-syne font-extrabold text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.09] tracking-tight mb-6">
              Upload CV. Get a Score.{" "}
              <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Find the Right Job.
              </span>
            </h1>

            <p className="text-[#7a9585] text-[1rem] leading-[1.78] mb-8 max-w-[500px]">
              RecruitAI uses artificial intelligence to automatically analyze your CV
              — generating a quality score, screening compatibility rating,
              improvement recommendations, and suggesting the jobs that best match
              your profile.
            </p>

            {/* 3 value props */}
            <div className="grid grid-cols-3 rounded-[12px] overflow-hidden border border-emerald-500/15 gap-[1px] bg-[rgba(16,185,129,0.12)] mb-8 max-w-[460px]">
              {[
                { icon: <Brain size={16} />, label: "AI Analysis" },
                { icon: <Zap size={16} />, label: "30-sec Results" },
                { icon: <Target size={16} />, label: "Job Matching" },
              ].map((s, i) => (
                <div key={i} className="bg-[#0f1612] py-4 px-3 text-center">
                  <div className="flex justify-center text-emerald-400 mb-1">
                    {s.icon}
                  </div>
                  <div className="text-[#7a9585] text-[0.72rem]">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.88rem] px-6 py-[11px] rounded-[10px] no-underline transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_28px_rgba(16,185,129,0.3)]">
                <FileText size={14} /> Analyze My CV Now
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] text-[0.88rem] px-6 py-[10px] rounded-[10px] no-underline transition-all">
                Browse Jobs <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

          {/* Right: hero image + floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative h-[420px] max-lg:h-[280px] rounded-[24px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f0d]/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-emerald-900/20 z-[5] mix-blend-multiply" />
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
              alt="Professional team working together"
              className="w-full h-full object-cover"
            />
            {/* ATS Score badge */}
            <div className="absolute bottom-6 left-6 z-20 bg-[#0a0f0d]/90 border border-emerald-500/30 backdrop-blur-sm rounded-[12px] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <BarChart3 size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[0.65rem] text-[#7a9585]">ATS Score</p>
                <p className="text-[0.9rem] font-bold text-emerald-400">
                  82 / 100
                </p>
              </div>
            </div>
            {/* Job Match badge */}
            <div className="absolute top-6 right-6 z-20 bg-[#0a0f0d]/90 border border-cyan-500/30 backdrop-blur-sm rounded-[12px] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Award size={14} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-[0.65rem] text-[#7a9585]">Job Match</p>
                <p className="text-[0.9rem] font-bold text-cyan-400">
                  8 openings
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
