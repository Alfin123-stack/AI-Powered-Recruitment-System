"use client";

// Wajib client karena menggunakan framer-motion untuk animasi.

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  MapPin,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import type { JobWithMatch } from "./types";
import { getMatchLabel, timeAgo } from "./helpers";

type JobMatchCardProps = {
  job: JobWithMatch;
  index: number;
};

export default function JobMatchCard({ job, index }: JobMatchCardProps) {
  const { color, matchScore, matchedSkills, missingSkills, alreadyApplied } =
    job;
  const match = getMatchLabel(matchScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`relative bg-[#0f1612] border rounded-[14px] p-5 transition-all overflow-hidden
        ${alreadyApplied
          ? "border-white/[0.05] opacity-55"
          : "border-white/[0.07] hover:border-white/[0.13] hover:-translate-y-[2px]"
        }`}>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: alreadyApplied ? "rgba(255,255,255,0.05)" : color }}
      />

      <div className="flex items-start gap-4">
        {/* Company logo / icon */}
        <div
          className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.06]"
          style={{ background: `${color}15` }}>
          {job.companies?.logo_url ? (
            <img
              src={job.companies.logo_url}
              alt={job.companies.name}
              className="w-full h-full object-cover rounded-[10px]"
            />
          ) : (
            <Building2 size={17} style={{ color }} />
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

            {/* Match score block */}
            <div className="flex flex-col items-end flex-shrink-0">
              <div
                className="font-extrabold text-[1.25rem] leading-none tabular-nums"
                style={{ color: match.color }}>
                {matchScore}%
              </div>
              <span
                className="text-[0.6rem] font-semibold px-[7px] py-[2px] rounded-full mt-[4px]"
                style={{ background: match.bg, color: match.color }}>
                {match.label}
              </span>
            </div>
          </div>

          {/* Match progress bar */}
          <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}, #06b6d4)` }}
              initial={{ width: 0 }}
              animate={{ width: `${matchScore}%` }}
              transition={{
                duration: 1,
                delay: index * 0.04 + 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>

          {/* Skills: matched + missing side by side */}
          <div className="flex gap-4 flex-wrap mb-4">
            {/* Matched skills */}
            {matchedSkills.length > 0 && (
              <div className="flex items-start gap-[6px] flex-wrap">
                <div className="flex items-center gap-[4px] text-[0.65rem] text-emerald-400 flex-shrink-0 mt-[2px]">
                  <CheckCircle2 size={10} />
                  <span>Match</span>
                </div>
                {matchedSkills.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="px-[7px] py-[2px] rounded-[4px] text-[0.65rem] font-mono"
                    style={{
                      background: `${color}12`,
                      color: color,
                      border: `1px solid ${color}25`,
                    }}>
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

            {/* Missing skills */}
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
            {/* Meta info */}
            <div className="flex items-center gap-3 flex-wrap text-[0.72rem] text-white/30">
              <span className="flex items-center gap-[4px]">
                <MapPin size={10} /> {job.location}
              </span>
              {job.salary && (
                <span className="flex items-center gap-[3px]">
                  <span className="text-white/20">Rp</span> {job.salary}
                </span>
              )}
              <span
                className="px-[7px] py-[1px] rounded-[4px] text-[0.62rem] font-medium"
                style={{
                  background: `${color}10`,
                  color: color,
                  border: `1px solid ${color}18`,
                }}>
                {job.type}
              </span>
              <span className="flex items-center gap-[3px]">
                <Clock size={10} /> {timeAgo(job.created_at)}
              </span>
            </div>

            {/* Action buttons */}
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
