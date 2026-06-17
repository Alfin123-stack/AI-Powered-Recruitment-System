"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  MapPin,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import type { JobWithMatch } from "../../../types/candidate/matches";
import { getMatchLabel, timeAgo } from "../../../lib/helpers/candidate/matches";

type MatchesCardProps = {
  job: JobWithMatch;
  index: number;
};

// ── Match score color → Tailwind class maps ───────────────────────────────────
const ACCENT_COLOR_MAP: Record<
  string,
  {
    border: string;
    icon: string;
    scoreText: string;
    skillBg: string;
    skillText: string;
    skillBorder: string;
    typeBg: string;
    typeText: string;
    typeBorder: string;
    bar: string;
    logoBg: string;
  }
> = {
  "#10b981": {
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    icon: "text-emerald-400",
    scoreText: "text-emerald-400",
    skillBg: "bg-emerald-500/[0.07]",
    skillText: "text-emerald-400",
    skillBorder: "border-emerald-500/20",
    typeBg: "bg-emerald-500/10",
    typeText: "text-emerald-400",
    typeBorder: "border-emerald-500/15",
    bar: "from-emerald-500 to-cyan-400",
    logoBg: "bg-emerald-500/[0.08]",
  },
  "#06b6d4": {
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    icon: "text-cyan-400",
    scoreText: "text-cyan-400",
    skillBg: "bg-cyan-500/[0.07]",
    skillText: "text-cyan-400",
    skillBorder: "border-cyan-500/20",
    typeBg: "bg-cyan-500/10",
    typeText: "text-cyan-400",
    typeBorder: "border-cyan-500/15",
    bar: "from-cyan-500 to-blue-400",
    logoBg: "bg-cyan-500/[0.08]",
  },
  "#8b5cf6": {
    border: "border-violet-500/20 hover:border-violet-500/40",
    icon: "text-violet-400",
    scoreText: "text-violet-400",
    skillBg: "bg-violet-500/[0.07]",
    skillText: "text-violet-400",
    skillBorder: "border-violet-500/20",
    typeBg: "bg-violet-500/10",
    typeText: "text-violet-400",
    typeBorder: "border-violet-500/15",
    bar: "from-violet-500 to-purple-400",
    logoBg: "bg-violet-500/[0.08]",
  },
  "#f59e0b": {
    border: "border-amber-500/20 hover:border-amber-500/40",
    icon: "text-amber-400",
    scoreText: "text-amber-400",
    skillBg: "bg-amber-500/[0.07]",
    skillText: "text-amber-400",
    skillBorder: "border-amber-500/20",
    typeBg: "bg-amber-500/10",
    typeText: "text-amber-400",
    typeBorder: "border-amber-500/15",
    bar: "from-amber-500 to-orange-400",
    logoBg: "bg-amber-500/[0.08]",
  },
  "#ef4444": {
    border: "border-red-500/20 hover:border-red-500/40",
    icon: "text-red-400",
    scoreText: "text-red-400",
    skillBg: "bg-red-500/[0.07]",
    skillText: "text-red-400",
    skillBorder: "border-red-500/20",
    typeBg: "bg-red-500/10",
    typeText: "text-red-400",
    typeBorder: "border-red-500/15",
    bar: "from-red-500 to-rose-400",
    logoBg: "bg-red-500/[0.08]",
  },
  "#ec4899": {
    border: "border-pink-500/20 hover:border-pink-500/40",
    icon: "text-pink-400",
    scoreText: "text-pink-400",
    skillBg: "bg-pink-500/[0.07]",
    skillText: "text-pink-400",
    skillBorder: "border-pink-500/20",
    typeBg: "bg-pink-500/10",
    typeText: "text-pink-400",
    typeBorder: "border-pink-500/15",
    bar: "from-pink-500 to-fuchsia-400",
    logoBg: "bg-pink-500/[0.08]",
  },
};

const DEFAULT_ACCENT = ACCENT_COLOR_MAP["#10b981"];

export default function MatchesCard({ job, index }: MatchesCardProps) {
  const { color, matchScore, matchedSkills, missingSkills, alreadyApplied } =
    job;
  const match = getMatchLabel(matchScore);
  const accent = ACCENT_COLOR_MAP[color] ?? DEFAULT_ACCENT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative bg-[#0f1612] border rounded-[14px] p-5 transition-all overflow-hidden
        ${
          alreadyApplied
            ? "border-white/[0.05] opacity-55"
            : `${accent.border} hover:-translate-y-[2px]`
        }`}>
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${alreadyApplied ? "from-white/5 to-white/5" : `${accent.bar}`}`}
      />

      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div
          className={`w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.06] ${accent.logoBg}`}>
          {job.companies?.logo_url ? (
            <Image
              src={job.companies.logo_url}
              alt={job.companies.name ?? "company"}
              width={44}
              height={44}
              className="w-full h-full object-cover rounded-[10px]"
            />
          ) : (
            <Building2 size={17} className={accent.icon} />
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: title + match badge */}
          <div className="flex items-start justify-between gap-3 mb-[6px]">
            <div className="min-w-0">
              <div className="font-semibold text-[0.9rem] text-white/90 leading-tight truncate">
                {job.title}
              </div>
              <div className="text-[0.73rem] text-white/35 mt-[2px]">
                {job.companies?.name}
              </div>
            </div>

            {/* Match score */}
            <div className="flex flex-col items-end flex-shrink-0">
              <div
                className={`font-extrabold text-[1.25rem] leading-none tabular-nums ${accent.scoreText}`}>
                {matchScore}%
              </div>
              <span
                className={`text-[0.6rem] font-semibold px-[7px] py-[2px] rounded-full mt-[4px] ${accent.typeBg} ${accent.typeText}`}>
                {match.label}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden mb-4">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${accent.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${matchScore}%` }}
              transition={{
                duration: 1,
                delay: index * 0.04 + 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>

          {/* Skills */}
          <div className="flex gap-4 flex-wrap mb-4">
            {matchedSkills.length > 0 && (
              <div className="flex items-start gap-[6px] flex-wrap">
                <div className="flex items-center gap-[4px] text-[0.65rem] text-emerald-400 flex-shrink-0 mt-[2px]">
                  <CheckCircle2 size={10} />
                  <span>Match</span>
                </div>
                {matchedSkills.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className={`px-[7px] py-[2px] rounded-[4px] text-[0.65rem] font-mono border ${accent.skillBg} ${accent.skillText} ${accent.skillBorder}`}>
                    {s}
                  </span>
                ))}
                {matchedSkills.length > 4 && (
                  <span className="text-[0.65rem] text-white/25 py-[2px]">
                    +{matchedSkills.length - 4}
                  </span>
                )}
              </div>
            )}

            {missingSkills.length > 0 && matchScore < 100 && (
              <div className="flex items-start gap-[6px] flex-wrap">
                <div className="flex items-center gap-[4px] text-[0.65rem] text-white/25 flex-shrink-0 mt-[2px]">
                  <XCircle size={10} />
                  <span>Kurang</span>
                </div>
                {missingSkills.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="px-[7px] py-[2px] rounded-[4px] text-[0.65rem] font-mono text-white/25 border border-white/[0.07] bg-white/[0.03]">
                    {s}
                  </span>
                ))}
                {missingSkills.length > 3 && (
                  <span className="text-[0.65rem] text-white/20 py-[2px]">
                    +{missingSkills.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Meta + actions */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap text-[0.72rem] text-white/30">
              {job.location && (
                <span className="flex items-center gap-[4px]">
                  <MapPin size={10} /> {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-[3px]">
                  <span className="text-white/20">Rp</span> {job.salary}
                </span>
              )}
              {job.type && (
                <span
                  className={`px-[7px] py-[1px] rounded-[4px] text-[0.62rem] font-medium border ${accent.typeBg} ${accent.typeText} ${accent.typeBorder}`}>
                  {job.type}
                </span>
              )}
              {job.created_at && (
                <span className="flex items-center gap-[3px]">
                  <Clock size={10} /> {timeAgo(job.created_at)}
                </span>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              {alreadyApplied ? (
                <span className="flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[0.72rem] font-semibold">
                  <CheckCircle2 size={11} /> Sudah Dilamar
                </span>
              ) : (
                <Link
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-[5px] px-4 py-[7px] rounded-[8px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.75rem] font-bold no-underline transition-all hover:shadow-[0_4px_14px_rgba(16,185,129,0.25)]">
                  Apply Sekarang
                </Link>
              )}
              <Link
                href={`/jobs/${job.id}`}
                className="flex items-center gap-[4px] px-3 py-[7px] rounded-[8px] bg-white/[0.03] border border-white/[0.07] text-white/40 text-[0.75rem] font-medium no-underline hover:border-white/[0.13] hover:text-white/70 transition-all">
                Detail <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
