"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, MapPin, ChevronRight, Briefcase } from "lucide-react";
import { FadeIn } from "../_components/shared";

// Placeholder — nanti bisa fetch dari backend berdasarkan skills kandidat
const matches = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "GoTo Group",
    location: "Jakarta / Remote",
    match: 91,
    salary: "Rp 15–25 jt",
    color: "#10b981",
  },
  {
    id: "2",
    title: "Frontend Specialist",
    company: "Tokopedia",
    location: "Jakarta",
    match: 87,
    salary: "Rp 12–20 jt",
    color: "#06b6d4",
  },
  {
    id: "3",
    title: "Next.js Engineer",
    company: "Traveloka",
    location: "Remote",
    match: 83,
    salary: "Rp 10–18 jt",
    color: "#8b5cf6",
  },
  {
    id: "4",
    title: "UI Engineer",
    company: "Shopee",
    location: "Jakarta",
    match: 79,
    salary: "Rp 8–15 jt",
    color: "#f59e0b",
  },
  {
    id: "5",
    title: "Frontend Developer",
    company: "Bukalapak",
    location: "Bandung / Hybrid",
    match: 76,
    salary: "Rp 8–14 jt",
    color: "#ef4444",
  },
];

export default function MatchesPage() {
  return (
    <div>
      <FadeIn>
        <div className="mb-5">
          <div className="font-bold text-[1rem]">Job Matches</div>
          <div className="text-[0.75rem] text-[#7a9585] mt-[3px]">
            Lowongan yang cocok berdasarkan profil dan CV kamu
          </div>
        </div>
      </FadeIn>

      <div className="flex flex-col gap-3">
        {matches.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 hover:border-emerald-500/30 transition-all hover:-translate-y-[2px]">
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                style={{ background: `${job.color}18`, color: job.color }}>
                <Building2 size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-syne font-bold text-[0.95rem]">
                      {job.title}
                    </div>
                    <div className="text-[0.78rem] text-[#7a9585]">
                      {job.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-[6px] flex-shrink-0">
                    <span
                      className="font-extrabold text-[1.1rem]"
                      style={{ color: job.color }}>
                      {job.match}%
                    </span>
                    <span className="text-[0.68rem] text-[#7a9585]">match</span>
                  </div>
                </div>

                {/* Match bar */}
                <div className="h-[5px] rounded-full bg-white/[0.05] overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-[1s]"
                    style={{
                      width: `${job.match}%`,
                      background: `linear-gradient(90deg, ${job.color}, #06b6d4)`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-[0.75rem] text-[#7a9585]">
                    <span className="flex items-center gap-[4px]">
                      <MapPin size={11} /> {job.location}
                    </span>
                    <span>💰 {job.salary}</span>
                  </div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-1 text-[0.78rem] text-emerald-400 hover:text-emerald-300 no-underline font-semibold transition-colors">
                    Lihat Lowongan <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[10px] rounded-[9px] text-[0.85rem] font-semibold no-underline transition-all">
          <Briefcase size={14} /> Lihat Semua Lowongan
        </Link>
      </div>
    </div>
  );
}
