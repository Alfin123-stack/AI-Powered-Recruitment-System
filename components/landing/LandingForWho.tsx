"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
  Award,
  Search,
  Zap,
  LayoutDashboard,
  FileText,
  Building2,
} from "lucide-react";
import { LandingFadeIn } from "./LandingFadeIn";
import { LandingTag } from "./LandingTag";
import { LandingCard } from "./LandingCard";

const CANDIDATE_CARDS = [
  {
    icon: <TrendingUp size={28} />,
    title: "Instant CV Score",
    desc: "Find out how strong your CV is based on Resume Score, ATS Score, and Overall Rating in seconds.",
    href: "/analyze",
  },
  {
    icon: <Target size={28} />,
    title: "Automatic Job Matching",
    desc: "Skills detected from your CV are used immediately to suggest the most relevant openings — no need to re-enter your details.",
    href: "/dashboard/candidate/matches",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Concrete Recommendations",
    desc: "Get specific improvement suggestions for each section of your CV that you can act on right away to boost your score.",
    href: "/analyze",
  },
  {
    icon: <CheckCircle2 size={28} />,
    title: "Screening Compatibility Check",
    desc: "ATS Score shows how well your CV will be read by a company's automated screening system before it ever reaches HR.",
    href: "/analyze",
  },
];

const HR_CARDS = [
  {
    icon: <Award size={28} />,
    title: "Automatic Candidate Ranking",
    desc: "All applicants are automatically sorted by AI score — no need to read through them one by one manually.",
    href: "/dashboard/hr",
  },
  {
    icon: <Search size={28} />,
    title: "Candidate Details & CV",
    desc: "View detected skills, score breakdowns, and access the original CV directly from your dashboard without switching pages.",
    href: "/dashboard/hr",
  },
  {
    icon: <Zap size={28} />,
    title: "Quick Status Updates",
    desc: "Shortlist, move to review, or reject candidates with a single click. Status updates instantly across the system.",
    href: "/dashboard/hr",
  },
  {
    icon: <LayoutDashboard size={28} />,
    title: "Per-Position Summary",
    desc: "See the number of applicants and percentage shortlisted per job opening in an easy-to-read view.",
    href: "/dashboard/hr",
  },
];

export function LandingForWho() {
  const [activeTab, setActiveTab] = useState("candidate");
  const cards = activeTab === "candidate" ? CANDIDATE_CARDS : HR_CARDS;

  return (
    <section className="py-[100px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid gap-16 items-center [grid-template-columns:1fr_1fr] max-lg:grid-cols-1 mb-[60px]">
          <LandingFadeIn>
            <LandingTag>Who It's For</LandingTag>
            <h2 className="font-syne font-extrabold mt-4 text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.15] mb-5">
              Built for Candidates and HR Teams
            </h2>
            <p className="text-[#7a9585] text-[0.95rem] leading-[1.78]">
              This platform serves both sides of the hiring process — job seekers who want
              to stand out stronger, and HR teams who want a more efficient, data-driven
              selection process.
            </p>
          </LandingFadeIn>
          <LandingFadeIn
            delay={0.1}
            className="relative rounded-[20px] overflow-hidden h-[260px]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-emerald-900/20 z-[5] mix-blend-multiply" />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Developer and HR team working together"
              className="w-full h-full object-cover"
            />
          </LandingFadeIn>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {[
            { k: "candidate", l: "Candidate / Job Seeker", icon: <FileText size={15} /> },
            { k: "hr", l: "HR / Company", icon: <Building2 size={15} /> },
          ].map(({ k, l, icon }) => (
            <button
              key={k}
              onClick={() => setActiveTab(k)}
              className={`px-6 py-[10px] rounded-[8px] text-[0.9rem] font-medium cursor-pointer transition-all border flex items-center gap-2
                ${
                  activeTab === k
                    ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-400"
                    : "bg-transparent border-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                }`}>
              {icon} {l}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {cards.map((c, i) => (
              <Link key={i} href={c.href} className="no-underline block">
                <LandingCard className="h-full cursor-pointer group">
                  <div className="text-emerald-400 mb-3 group-hover:text-emerald-300 transition-colors">
                    {c.icon}
                  </div>
                  <h3 className="font-syne font-bold text-[0.95rem] mb-2 group-hover:text-emerald-400 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[#7a9585] text-[0.85rem] leading-[1.6]">{c.desc}</p>
                </LandingCard>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
