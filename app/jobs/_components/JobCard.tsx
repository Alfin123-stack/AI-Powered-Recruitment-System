import { Job } from "@/app/dashboard/hr/_components/shared";
import { getColor, timeAgo } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";

import Link from "next/link";

export default function JobCard({ job }: { job: Job }) {
  const color = getColor(Number(job.id));
  return (
    <div className="group relative bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 items-start">
          <div
            className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
            style={{ background: `${color}15`, color }}>
            <Building2 size={20} />
          </div>
          <div>
            <div className="font-syne font-bold text-[1.05rem] leading-snug mb-1">
              {job.title}
            </div>
            <div className="text-[0.82rem] text-[#7a9585]">
              {job.companies?.name}
            </div>
          </div>
        </div>
        <span
          className="px-[10px] py-1 rounded-[6px] text-[0.7rem] font-semibold whitespace-nowrap flex-shrink-0"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
            color,
          }}>
          {job.type}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-[10px]">
        {[
          { Icon: MapPin, text: job.location },
          { Icon: Clock, text: timeAgo(job.created_at) },
          { Icon: Briefcase, text: job.salary },
        ]
          .filter((m) => m.text)
          .map(({ Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-[5px] text-[#7a9585] text-[0.78rem]">
              <Icon size={12} /> {text}
            </span>
          ))}
      </div>

      {/* Description */}
      <p className="text-[#7a9585] text-[0.82rem] leading-relaxed line-clamp-2">
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-[6px]">
        {(job.skills || []).map((s) => (
          <span
            key={s}
            className="bg-white/[0.04] border border-white/[0.08] text-[#e8f0ec] px-[10px] py-1 rounded-[6px] text-[0.75rem] font-medium font-mono transition-all duration-200 hover:border-emerald-500/35 hover:text-emerald-400 cursor-default">
            {s}
          </span>
        ))}
      </div>

      {/* Actions — keduanya ke halaman detail */}
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center gap-[6px] px-[9px] py-[9px] rounded-[9px] bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-[0.8rem] font-bold no-underline hover:bg-emerald-500/15 transition-all">
          Detail <ChevronRight size={13} />
        </Link>
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-[9px] text-[0.82rem] no-underline hover:shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:-translate-y-[1px] transition-all">
          Apply Sekarang →
        </Link>
      </div>
    </div>
  );
}
