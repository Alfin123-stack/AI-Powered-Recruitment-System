// @/components/hr/jobs/JobsCard.tsx
// Pure display component — no state, no data fetching
// Rendered client-side — requires router & motion

"use client";

import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Loader2,
  Clock,
  ExternalLink,
  Users,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { JobWithStats } from "../../../types/hr/jobs";
import { getColor } from "@/app/(role)/dashboard/hr/_components/shared";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export function getMatchColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 65) return "#06b6d4";
  if (score >= 50) return "#f59e0b";
  return "#f43f5e";
}

// ─────────────────────────────────────────────────────────────────────────────
// MATCH SCORE DOTS — 5 lingkaran mengisi sesuai avg score
// ─────────────────────────────────────────────────────────────────────────────
function MatchScoreDots({ score, color }: { score: number; color: string }) {
  const filled = Math.round((score / 100) * 5);
  return (
    <div className="flex items-center gap-[4px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-[9px] h-[9px] rounded-full border transition-all"
          style={{
            background: i < filled ? color : "transparent",
            borderColor: i < filled ? color : "rgba(255,255,255,0.12)",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR STACK — tumpukan inisial kandidat
// ─────────────────────────────────────────────────────────────────────────────
function AvatarStack({
  candidates,
  total,
}: {
  candidates: JobWithStats["topCandidates"];
  total: number;
}) {
  const shown = candidates.slice(0, 5);
  const extra = total - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((c, i) => (
        <div
          key={i}
          className="w-[26px] h-[26px] rounded-full border-2 border-[#0f1612] flex items-center justify-center text-[8px] font-bold flex-shrink-0"
          style={{
            background: `${c.color}28`,
            color: c.color,
            marginLeft: i === 0 ? 0 : -7,
            zIndex: shown.length - i,
          }}>
          {c.initials}
        </div>
      ))}
      {extra > 0 && (
        <div
          className="w-[26px] h-[26px] rounded-full border-2 border-[#0f1612] flex items-center justify-center text-[8px] font-bold flex-shrink-0 bg-white/[0.05] text-[#7a9585]"
          style={{ marginLeft: -7 }}>
          +{extra}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOB CARD
// ─────────────────────────────────────────────────────────────────────────────
interface JobsCardProps {
  job: JobWithStats;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  deletingId: string | null;
}

export function JobsCard({
  job,
  index,
  onEdit,
  onDelete,
  deletingId,
}: JobsCardProps) {
  const router = useRouter();
  const color = getColor(index);
  const matchColor = getMatchColor(job.avgMatchScore);

  const displayTags = [job.location, ...(job.skills || []).slice(0, 2)].filter(
    Boolean,
  ) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={`bg-[#0f1612] border rounded-[14px] overflow-hidden transition-all group ${
        job.is_active
          ? "border-emerald-500/15 hover:border-emerald-500/30"
          : "border-white/[0.05] opacity-55"
      }`}>
      <div className="p-4">
        {/* ── Header ── */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.07] text-[11px] font-black tracking-tight"
            style={{ background: `${color}18`, color }}>
            {job.title.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[0.65rem] font-semibold text-[#5a8070] uppercase tracking-[0.07em] truncate">
              {job.type}
              {!job.is_active && (
                <span className="ml-2 text-[#3d5a45]">· Closed</span>
              )}
            </p>
            <p className="font-bold text-[0.88rem] text-[#e8f0ec] leading-tight truncate">
              {job.title}
            </p>
          </div>

          <div className="flex items-center gap-[5px] flex-shrink-0">
            <button
              onClick={onEdit}
              title="Edit job listing"
              className="w-7 h-7 rounded-[6px] bg-white/[0.03] border border-emerald-500/12 text-[#7a9585] flex items-center justify-center cursor-pointer hover:border-emerald-500/35 hover:text-emerald-400 transition-all opacity-0 group-hover:opacity-100">
              <Pencil size={11} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={deletingId === job.id || !job.is_active}
              title="Close job listing"
              className="w-7 h-7 rounded-[6px] bg-white/[0.03] border border-emerald-500/12 text-[#7a9585] flex items-center justify-center cursor-pointer hover:border-red-500/30 hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100">
              {deletingId === job.id ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Trash2 size={11} />
              )}
            </button>
            <button
              onClick={() =>
                router.push(
                  `/dashboard/hr/candidates?job=${encodeURIComponent(job.title)}`,
                )
              }
              title="View candidates"
              className="w-7 h-7 rounded-[6px] bg-white/[0.03] border border-emerald-500/12 text-[#7a9585] flex items-center justify-center cursor-pointer hover:border-emerald-500/35 hover:text-emerald-400 transition-all">
              <ExternalLink size={11} />
            </button>
          </div>
        </div>

        {/* ── Match Score section ── */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-[6px]">
            <div className="flex items-center gap-[5px]">
              <TrendingUp size={10} style={{ color: matchColor }} />
              <span className="text-[0.67rem] text-[#5a7868] font-medium">
                {job.applicantCount === 0
                  ? "Avg Match Score"
                  : job.applicantCount === 1
                    ? "Match Score"
                    : `Avg Match Score · ${job.applicantCount} applicants`}
              </span>
            </div>
            {job.applicantCount > 0 ? (
              <span
                className="text-[0.68rem] font-extrabold"
                style={{ color: matchColor }}>
                {job.avgMatchScore}%
              </span>
            ) : (
              <span className="text-[0.68rem] text-[#3d5a45]">—</span>
            )}
          </div>

          {job.applicantCount > 0 ? (
            <>
              <MatchScoreDots score={job.avgMatchScore} color={matchColor} />
              <div
                className="mt-[6px] h-[3px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${job.avgMatchScore}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: matchColor }}
                />
              </div>
            </>
          ) : (
            <div
              className="h-[3px] rounded-full"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          )}
        </div>

        {/* ── Applicants row ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-[5px]">
            <Users size={10} className="text-[#5a7868]" />
            <span className="text-[0.67rem] text-[#5a7868] font-medium">
              Applicants
            </span>
          </div>
          {job.applicantCount > 0 ? (
            <AvatarStack
              candidates={job.topCandidates}
              total={job.applicantCount}
            />
          ) : (
            <span className="text-[0.68rem] text-[#3d5a45]">Belum ada</span>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-emerald-500/8 mb-3" />

        {/* ── Tags ── */}
        <div className="flex flex-wrap gap-[5px]">
          {displayTags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-[8px] py-[3px] rounded-[5px] text-[0.67rem] font-medium"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#9ab8a8",
              }}>
              {tag}
            </span>
          ))}
          {job.deadline && (
            <span
              className="px-[8px] py-[3px] rounded-[5px] text-[0.67rem] font-medium flex items-center gap-[3px]"
              style={{
                background: "rgba(245,158,11,0.07)",
                border: "1px solid rgba(245,158,11,0.18)",
                color: "#fbbf24aa",
              }}>
              <Clock size={9} />
              {new Date(job.deadline).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
          {job.shortlistedCount > 0 && (
            <span
              className="px-[8px] py-[3px] rounded-[5px] text-[0.67rem] font-bold flex items-center gap-[3px]"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#10b981",
              }}>
              ✓ {job.shortlistedCount} shortlisted
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
