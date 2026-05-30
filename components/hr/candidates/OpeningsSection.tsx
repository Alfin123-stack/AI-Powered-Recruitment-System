"use client";

// @/components/hr/candidates/OpeningsSection.tsx
// CLIENT COMPONENT — menerima jobMetas dari CandidatesTable (sudah punya data)
// Tidak perlu fetch sendiri; data sudah ada di parent.

import { Briefcase, MapPin } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface JobMeta {
  key: string;
  label: string;
  color: string;
  count: number;
  todayCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENING CARD
// ─────────────────────────────────────────────────────────────────────────────
function OpeningCard({
  job,
  count,
  color,
  todayCount,
}: {
  job: string;
  count: number;
  color: string;
  todayCount: number;
}) {
  return (
    <div
      className="rounded-[14px] p-4 flex flex-col gap-3 flex-shrink-0 w-[200px] cursor-pointer transition-all"
      style={{
        background: "#0f1612",
        border: "1px solid rgba(16,185,129,0.12)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.border = `1px solid ${color}30`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.border = "1px solid rgba(16,185,129,0.12)")
      }>
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Briefcase size={14} style={{ color }} />
        </div>
        <span className="text-[10px] text-[#7a9585]">2 days left</span>
      </div>
      <div>
        <div className="font-bold text-[#e8f0ec] text-[13px] leading-tight line-clamp-2">
          {job}
        </div>
        <div className="flex items-center gap-1 mt-[2px]">
          <MapPin size={10} style={{ color: "#7a9585" }} />
          <span className="text-[11px] text-[#7a9585]">Jakarta</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div
            className="font-extrabold text-[22px] leading-none"
            style={{ color }}>
            {count}
          </div>
          <div className="text-[10px] text-[#7a9585] mt-[2px]">Applicants</div>
        </div>
        {todayCount > 0 && (
          <span
            className="text-[10px] font-bold px-2 py-[3px] rounded-full"
            style={{
              background: `${color}12`,
              color,
              border: `1px solid ${color}25`,
            }}>
            +{todayCount} today
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENINGS SECTION
// Props: jobMetas dipass dari CandidatesTable setelah data di-fetch
// ─────────────────────────────────────────────────────────────────────────────
export default function OpeningsSection({ jobMetas }: { jobMetas: JobMeta[] }) {
  return (
    <div
      className="flex-shrink-0 px-6 pt-5 pb-4"
      style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-[#e8f0ec] text-[15px]">
            Current Openings
          </h2>
          <span
            className="text-[12px] px-2 py-[2px] rounded-full font-bold"
            style={{
              background: "rgba(16,185,129,0.1)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.2)",
            }}>
            {jobMetas.length}
          </span>
        </div>
      </div>

      {/* Scrollable cards */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {jobMetas.slice(0, 5).map((job) => (
          <OpeningCard
            key={job.key}
            job={job.label}
            count={job.count}
            color={job.color}
            todayCount={job.todayCount}
          />
        ))}
        {jobMetas.length === 0 && (
          <p className="text-[13px] text-[#7a9585] py-4">
            Belum ada job opening aktif.
          </p>
        )}
      </div>
    </div>
  );
}
