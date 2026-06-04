"use client";

import { getColor, timeAgo } from "@/lib/utils";
import { Briefcase, Building2, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import type { Job } from "@/types/jobs";

const TYPE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "Full-time": {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/25",
  },
  Remote: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/25",
  },
  Contract: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/25",
  },
  "Part-time": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/25",
  },
};

const DEFAULT_TYPE_STYLE = {
  bg: "bg-white/5",
  text: "text-[#7a9585]",
  border: "border-white/10",
};

export default function JobCard({ job }: { job: Job }) {
  if (!job) return null;

  const color = getColor(Number(job.id));
  const typeStyle = TYPE_STYLES[job.type ?? ""] ?? DEFAULT_TYPE_STYLE;

  const meta = [
    { icon: MapPin, label: job.location },
    {
      icon: Clock,
      label: job.created_at ? timeAgo(job.created_at) : undefined,
    },
    { icon: Briefcase, label: job.salary },
  ].filter((m) => Boolean(m.label));

  return (
    <div className="group relative bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-5 flex flex-col gap-3 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[2px] overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
            style={{ background: `${color}18`, color }}>
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#e8f0ec] leading-snug truncate">
              {job.title ?? "—"}
            </h3>
            <p className="text-xs text-[#7a9585] mt-0.5">
              {job.companies?.name ?? "Perusahaan tidak diketahui"}
            </p>
          </div>
        </div>
        {job.type && (
          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
            {job.type}
          </span>
        )}
      </div>

      {meta.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {meta.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-xs text-[#7a9585]">
              <Icon size={12} /> {label}
            </span>
          ))}
        </div>
      )}

      {job.description && (
        <p className="text-xs text-[#7a9585] leading-relaxed line-clamp-2">
          {job.description}
        </p>
      )}

      {(job.skills ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(job.skills ?? []).map((s) => (
            <span
              key={s}
              className="font-mono text-[11px] text-[#e8f0ec] bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-[6px] transition-all duration-200 hover:border-emerald-500/35 hover:text-emerald-400 cursor-default">
              {s}
            </span>
          ))}
        </div>
      )}

      <hr className="border-emerald-500/10 -mx-1" />

      <div className="flex gap-2 mt-auto">
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[9px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-xs font-bold no-underline hover:bg-emerald-500/15 transition-all">
          Detail
        </Link>
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center py-2 rounded-[9px] bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold no-underline hover:-translate-y-[1px] transition-all">
          Apply Sekarang →
        </Link>
      </div>
    </div>
  );
}
