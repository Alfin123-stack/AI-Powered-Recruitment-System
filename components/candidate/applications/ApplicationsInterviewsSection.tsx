"use client";

// ApplicationsInterviewsSection.tsx — Client Component
// CSR: search filter, grouped rendering, empty state with link

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Lightbulb,
  Mic,
  Search,
  Target,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import ApplicationsInterviewCard from "./ApplicationsInterviewCard";
import { INTERVIEW_TIPS } from "@/constants/candidate/dashboard";
import { groupInterviewsByDate } from "@/lib/helpers/candidate/applications";
import { Interview } from "@/types/candidate/dashboard";

// ── Empty State ───────────────────────────────────────────────────────────────

const TIP_ICONS = { BookOpen, Mic, Target, Lightbulb };

function InterviewEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8">
      <div className="flex items-center justify-center mb-5">
        <div className="w-[72px] h-[72px] rounded-full bg-cyan-500/[0.05] border border-dashed border-cyan-500/20 animate-pulse flex items-center justify-center">
          <Search size={22} className="text-cyan-500/40" />
        </div>
      </div>
      <div className="text-center mb-7">
        <p className="font-bold text-[0.95rem] mb-[5px]">
          Belum ada jadwal interview
        </p>
        <p className="text-[0.78rem] text-[#7a9585] max-w-[280px] mx-auto leading-relaxed">
          Jadwal interview akan muncul di sini setelah HR menjadwalkan sesi
          untukmu.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-[560px] mx-auto">
        {INTERVIEW_TIPS.map(({ icon, title, desc }) => {
          const Icon = TIP_ICONS[icon];
          return (
            <div
              key={title}
              className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[14px] p-4 hover:border-emerald-500/22 transition-all">
              <div className="w-7 h-7 rounded-[7px] bg-emerald-500/10 flex items-center justify-center mb-3">
                <Icon size={13} className="text-emerald-400" />
              </div>
              <div className="text-[0.78rem] font-bold mb-[4px]">{title}</div>
              <div className="text-[0.71rem] text-[#7a9585] leading-relaxed">
                {desc}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-[9px] rounded-[9px] text-[0.82rem] no-underline transition-all hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
          Lamar Lebih Banyak Lowongan <ChevronRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface InterviewsSectionProps {
  interviews: Interview[];
}

export default function InterviewsSection({
  interviews,
}: InterviewsSectionProps) {
  const [search, setSearch] = useState("");

  if (interviews.length === 0) return <InterviewEmptyState />;

  const filtered = interviews.filter((iv) => {
    const q = search.toLowerCase();
    return (
      (iv.job_title ?? "").toLowerCase().includes(q) ||
      (iv.company_name ?? "").toLowerCase().includes(q)
    );
  });

  const { grouped, sortedKeys } = groupInterviewsByDate(filtered);

  return (
    <>
      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={13}
          className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari posisi atau perusahaan..."
          className="pl-[34px] pr-8 bg-[#0a0f0c] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
        />
        {search && (
          <button
            title="Reset Pencarian"
            onClick={() => setSearch("")}
            className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer bg-transparent border-0">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Empty search result */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#7a9585]">
          <div className="text-[2rem] mb-2 opacity-25">🔍</div>
          <div className="text-[0.85rem]">
            Tidak ditemukan interview yang cocok.
          </div>
          <button
            onClick={() => setSearch("")}
            className="mt-2 text-emerald-400 text-[0.78rem] hover:opacity-75 transition-opacity cursor-pointer bg-transparent border-0">
            Reset pencarian
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedKeys.map((dateLabel) => {
            const items = grouped[dateLabel];
            return (
              <div key={dateLabel}>
                {/* Date group header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`px-3 py-[5px] rounded-[7px] text-[0.74rem] font-bold
                      ${
                        dateLabel === "Hari Ini"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/22"
                          : dateLabel === "Besok"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/22"
                            : "bg-white/[0.03] text-[#7a9585] border border-white/[0.07]"
                      }`}>
                    {dateLabel}
                  </div>
                  <div className="flex-1 h-px bg-emerald-500/8" />
                  <span className="text-[0.7rem] text-[#7a9585]">
                    {items.length} interview
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3">
                  {items.map((iv, i) => (
                    <ApplicationsInterviewCard key={iv.id} iv={iv} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
