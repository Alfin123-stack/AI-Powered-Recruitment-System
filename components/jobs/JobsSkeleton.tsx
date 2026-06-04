// app/jobs/_components/JobsSkeleton.tsx
// ─── SEMUA SKELETON ADA DI SINI — TIDAK DIPISAH ───────────────────────────────

"use client";

import { SlidersHorizontal } from "lucide-react";

// ── Primitive: pulse box ──────────────────────────────────────────────────────
function Pulse({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded bg-emerald-500/[0.06] ${className}`}
      style={style}
    />
  );
}

// ── Skeleton: satu kartu lowongan ─────────────────────────────────────────────
function JobCardSkeleton() {
  return (
    <div className="relative bg-[#0f1612] border border-emerald-500/10 rounded-[16px] p-5 flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Pulse className="w-10 h-10 rounded-[10px] flex-shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col gap-2 pt-0.5">
            <Pulse className="h-3.5 w-3/4 rounded-[6px]" />
            <Pulse className="h-2.5 w-1/2 rounded-[6px]" />
          </div>
        </div>
        <Pulse className="h-6 w-16 rounded-full flex-shrink-0" />
      </div>

      {/* Meta row */}
      <div className="flex gap-4">
        <Pulse className="h-2.5 w-20 rounded-[6px]" />
        <Pulse className="h-2.5 w-16 rounded-[6px]" />
        <Pulse className="h-2.5 w-24 rounded-[6px]" />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Pulse className="h-2.5 w-full rounded-[6px]" />
        <Pulse className="h-2.5 w-4/5 rounded-[6px]" />
      </div>

      {/* Skills */}
      <div className="flex gap-1.5 flex-wrap">
        <Pulse className="h-5 w-14 rounded-[6px]" />
        <Pulse className="h-5 w-16 rounded-[6px]" />
        <Pulse className="h-5 w-12 rounded-[6px]" />
      </div>

      <hr className="border-emerald-500/10 -mx-1" />

      {/* Footer buttons */}
      <div className="flex gap-2 mt-auto">
        <Pulse className="flex-1 h-8 rounded-[9px]" />
        <Pulse className="flex-1 h-8 rounded-[9px]" />
      </div>
    </div>
  );
}

// ── Skeleton: toolbar (search + filter chips) ─────────────────────────────────
function JobToolbarSkeleton() {
  return (
    <section className="pt-7">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-4 flex items-center gap-3 flex-wrap">
          {/* Search bar */}
          <Pulse className="flex-1 min-w-[200px] h-10 rounded-[10px]" />
          {/* Filter chips */}
          <div className="flex gap-[6px]">
            {[80, 72, 90, 68, 76].map((w, i) => (
              <Pulse
                key={i}
                className="h-8 rounded-[8px]"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Skeleton: grid label + pagination hint ────────────────────────────────────
function JobListHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-5">
      <Pulse className="h-3 w-40 rounded-[6px]" />
      <span className="flex items-center gap-[6px] text-[#7a9585] text-[0.78rem]">
        <SlidersHorizontal size={13} />
        <Pulse className="h-3 w-20 rounded-[6px]" />
      </span>
    </div>
  );
}

// ── EXPORT: full-page skeleton (toolbar + grid) ───────────────────────────────
// Ini yang di-render Suspense fallback di page.tsx
export default function JobsSkeleton({ count = 9 }: { count?: number }) {
  return (
    <>
      <JobToolbarSkeleton />

      <section className="py-8 pb-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <JobListHeaderSkeleton />

          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            }}>
            {Array.from({ length: count }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
