// app/jobs/_components/JobsSkeleton.tsx
// ─── ALL SKELETONS LIVE HERE — NOT SPLIT INTO SEPARATE FILES ──────────────────

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

// ── Skeleton: hero (title + subtitle + stats pill) ────────────────────────────
function JobsHeroSkeleton() {
  return (
    <section className="pt-[120px] pb-[80px] relative overflow-hidden text-center">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0a0f0d)",
        }}
      />

      <div className="relative max-w-[680px] mx-auto px-6 flex flex-col items-center">
        {/* Title — 2 baris, mirip "Find the Career" + "That's Right for You" */}
        <Pulse className="h-[34px] sm:h-[44px] w-[85%] rounded-[8px] mb-3" />
        <Pulse className="h-[34px] sm:h-[44px] w-[62%] rounded-[8px] mb-5" />

        {/* Subtitle */}
        <div className="flex flex-col items-center gap-2 w-full mb-8">
          <Pulse className="h-3 w-[88%] rounded-[6px]" />
          <Pulse className="h-3 w-[58%] rounded-[6px]" />
        </div>

        {/* Stats pill — 3 item: Openings / Companies / Remote */}
        <div className="flex items-center bg-[#0d1610] border border-emerald-500/15 rounded-[14px] overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center">
              {i > 0 && <div className="w-px h-9 bg-emerald-500/10" />}
              <div className="flex items-center gap-3 px-6 py-4">
                <Pulse className="w-8 h-8 rounded-[8px] flex-shrink-0" />
                <div className="text-left flex flex-col gap-[6px]">
                  <Pulse className="h-3 w-8 rounded-[4px]" />
                  <Pulse className="h-2.5 w-16 rounded-[4px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Skeleton: single job card ─────────────────────────────────────────────────
function JobsCardSkeleton() {
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
function JobsToolbarSkeleton() {
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
function JobsListHeaderSkeleton() {
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


export default function JobsSkeleton({ count = 9 }: { count?: number }) {
  return (
    <>
      <JobsHeroSkeleton />
      <JobsToolbarSkeleton />

      <section className="py-8 pb-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <JobsListHeaderSkeleton />

          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            }}>
            {Array.from({ length: count }).map((_, i) => (
              <JobsCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}