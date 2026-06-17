"use client";

import { Bookmark, Timer, Target, AlertCircle } from "lucide-react";
import { SavedJob } from "../../../types/candidate/saved";
import { isDeadlineSoon, isExpired } from "@/lib/helpers/candidate/saved";



export default function SavedJobsStatsBar({ jobs }: { jobs: SavedJob[] }) {
  const total = jobs.length;
  const expiring = jobs.filter(
    (j) => isDeadlineSoon(j.deadline) && !isExpired(j.deadline),
  ).length;
  const expired = jobs.filter((j) => isExpired(j.deadline)).length;
  const highMatch = jobs.filter((j) => (j.matching_score ?? 0) >= 75).length;

  const stats = [
    {
      label: "Tersimpan",
      value: total,
      Icon: Bookmark,
      color: "text-emerald-400",
      bg: "bg-emerald-500/8",
      border: "border-emerald-500/12",
    },
    {
      label: "Segera Expired",
      value: expiring,
      Icon: Timer,
      color: "text-amber-400",
      bg: "bg-amber-500/8",
      border: "border-amber-500/12",
    },
    {
      label: "High Match",
      value: highMatch,
      Icon: Target,
      color: "text-violet-400",
      bg: "bg-violet-500/8",
      border: "border-violet-500/12",
    },
    {
      label: "Sudah Expired",
      value: expired,
      Icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-500/8",
      border: "border-red-500/12",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {stats.map(({ label, value, Icon, color, bg, border }) => (
        <div
          key={label}
          className={`bg-[#0a0f0c] border ${border} rounded-[14px] p-4`}>
          <div
            className={`w-8 h-8 rounded-[8px] ${bg} flex items-center justify-center mb-3`}>
            <Icon size={15} className={color} />
          </div>
          <div
            className={`text-[1.5rem] font-black ${color} leading-none mb-1`}>
            {value}
          </div>
          <div className="text-[0.68rem] text-[#7a9585]">{label}</div>
        </div>
      ))}
    </div>
  );
}
