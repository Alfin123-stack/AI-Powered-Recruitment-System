"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Bookmark,
  Loader2,
  ChevronRight,
  Trash2,
  Eye,
  Clock,
  MapPin,
} from "lucide-react";
import { SavedJob } from "../../../types/candidate/saved";

import SavedJobsDeadlineBar from "./SavedJobsDeadlineBar";
import SavedJobsInsightsPanel from "./SavedJobsInsightsPanel";
import SavedJobsScoreBars from "./SavedJobsScoreBars";

import { timeAgo } from "@/lib/utils";
import { getJobInsights, isDeadlineSoon, isExpired } from "@/lib/helpers/candidate/saved";

type SavedJobsCardProps = {
  job: SavedJob;
  index: number;
  onUnsave: (id: string) => void;
  removingId: string | null;
};

export default function SavedJobsCard({
  job,
  index,
  onUnsave,
  removingId,
}: SavedJobsCardProps) {
  const expired = isExpired(job.deadline);
  const soon = isDeadlineSoon(job.deadline);
  const insights = getJobInsights(job);
  const isRemoving = removingId === job.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`bg-[#0a0f0c] border rounded-[18px] overflow-hidden transition-all
        ${
          expired
            ? "border-white/[0.05] opacity-55"
            : soon
              ? "border-amber-500/20 hover:border-amber-500/32 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]"
              : "border-emerald-500/12 hover:border-emerald-500/28 hover:-translate-y-[1px] hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
        }`}>
      {!expired && (
        <div
          className={`h-[2px] w-full ${
            soon
              ? "bg-gradient-to-r from-amber-500/60 via-amber-400/30 to-transparent"
              : "bg-gradient-to-r from-emerald-500/30 via-cyan-500/20 to-transparent"
          }`}
        />
      )}

      <div className="flex">
        <div
          className="w-[3px] flex-shrink-0"
          style={{
            background: expired
              ? "transparent"
              : `linear-gradient(180deg, ${job.color}60, ${job.color}10)`,
          }}
        />

        <div className="flex-1 p-5">
          <div className="flex items-start gap-4">
            {/* Company Icon */}
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.07]"
              style={{ background: `${job.color}14`, color: job.color }}>
              <Building2 size={18} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title + badges */}
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <div className="font-bold text-[0.93rem] truncate">
                    {job.title}
                  </div>
                  <div className="text-[0.76rem] text-[#7a9585]">
                    {job.companies?.name}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  {expired && (
                    <span className="px-[8px] py-[2px] rounded-full text-[0.63rem] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                      Expired
                    </span>
                  )}
                  {!expired && soon && (
                    <span className="px-[8px] py-[2px] rounded-full text-[0.63rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
                      ⚡ Soon!
                    </span>
                  )}
                  {job.type && (
                    <span
                      className="px-[8px] py-[2px] rounded-[5px] text-[0.63rem] font-semibold"
                      style={{
                        background: `${job.color}15`,
                        color: job.color,
                        border: `1px solid ${job.color}25`,
                      }}>
                      {job.type}
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline bar */}
              {!expired && job.deadline && (
                <div className="mb-2">
                  <SavedJobsDeadlineBar deadline={job.deadline} />
                </div>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.73rem] text-[#7a9585] mb-3">
                {job.location && (
                  <span className="flex items-center gap-[4px]">
                    <MapPin size={11} className="flex-shrink-0" />{" "}
                    {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-[4px]">
                    💰 {job.salary}
                  </span>
                )}
                {job.deadline && (
                  <span
                    className={`flex items-center gap-[4px] ${soon && !expired ? "text-amber-400 font-medium" : ""}`}>
                    <Clock size={11} className="flex-shrink-0" />
                    {new Date(job.deadline).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span className="flex items-center gap-[4px] text-[#7a9585]/50">
                  <Bookmark size={10} /> {timeAgo(job.saved_at)}
                </span>
              </div>

              {/* Score bars */}
              <SavedJobsScoreBars
                resumeScore={job.resume_score}
                matchingScore={job.matching_score}
              />

              {/* Skills */}
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-[5px] mb-3">
                  {job.skills.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="px-[7px] py-[2px] rounded-[4px] text-[0.67rem] font-mono bg-white/[0.04] border border-white/[0.07] text-[#e8f0ec]">
                      {s}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="text-[0.67rem] text-[#7a9585] py-[2px]">
                      +{job.skills.length - 5}
                    </span>
                  )}
                </div>
              )}

              {/* AI Insights */}
              <SavedJobsInsightsPanel insights={insights} />

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                  {!expired && (
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex items-center gap-1.5 px-4 py-[7px] rounded-[8px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.78rem] font-bold no-underline transition-all hover:shadow-[0_4px_12px_rgba(16,185,129,0.28)]">
                      Apply Now <ChevronRight size={12} />
                    </Link>
                  )}
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-1.5 px-3 py-[7px] rounded-[8px] bg-white/[0.03] border border-emerald-500/15 text-emerald-400 text-[0.78rem] font-semibold no-underline hover:border-emerald-500/30 transition-all">
                    <Eye size={12} /> Detail
                  </Link>
                </div>

                <button
                  onClick={() => onUnsave(job.id)}
                  disabled={isRemoving}
                  className="flex items-center gap-1.5 px-3 py-[7px] rounded-[8px] bg-red-500/[0.05] border border-red-500/12 text-red-400 text-[0.75rem] font-medium cursor-pointer hover:bg-red-500/10 hover:border-red-500/22 transition-all disabled:opacity-40">
                  {isRemoving ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
