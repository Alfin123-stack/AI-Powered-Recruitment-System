// @/components/hr/interviews/InterviewsSkeleton.tsx
// Skeleton UI for Interviews Page — disesuaikan style dengan JobsSkeleton

"use client";

import { motion } from "framer-motion";

// ─── pulse animation class helper ─────────────────────────────────────────────
// Selaras dengan JobsSkeleton: bg emerald-500/[0.07], animate-pulse, rounded
const pulse = "animate-pulse rounded bg-emerald-500/[0.07]";
const pulseStrong = "animate-pulse rounded bg-emerald-500/[0.10]";

// ─────────────────────────────────────────────────────────────────────────────
// HEADING SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function InterviewsHeadingSkeleton() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${pulseStrong} w-8 h-8 rounded-[9px] flex-shrink-0`} />
        <div className={`${pulseStrong} h-[22px] w-[120px] rounded-[7px]`} />
      </div>
      <div className="ml-11">
        <div className={`${pulse} h-[13px] w-[200px] rounded`} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLBAR SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function InterviewsToolbarSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
      {/* Tab pills */}
      <div className="flex items-center gap-1 bg-[#0f1612] border border-emerald-500/[0.13] rounded-[12px] p-[5px]">
        {[80, 60, 90, 70].map((w, i) => (
          <div
            key={i}
            className={`${pulse} h-8 rounded-[9px]`}
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <div className={`${pulse} h-[33px] w-[200px] rounded-[10px]`} />
        <div className={`${pulse} h-[33px] w-[80px] rounded-[10px]`} />
        <div className={`${pulse} h-[33px] w-[72px] rounded-[10px]`} />
        <div className={`${pulseStrong} h-[33px] w-[140px] rounded-[10px]`} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE ROW SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function InterviewRowSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="flex items-center border-b border-emerald-500/[0.08]">
      {/* Time column */}
      <div className="w-[230px] flex-shrink-0 p-4 flex flex-col gap-2">
        <div className={`${pulse} h-[18px] w-[160px] rounded`} />
        <div className="flex gap-2">
          <div className={`${pulse} h-[18px] w-[70px] rounded`} />
          <div className={`${pulse} h-[18px] w-[90px] rounded`} />
        </div>
        <div className="flex gap-2">
          <div className={`${pulse} h-[13px] w-[50px] rounded`} />
          <div className={`${pulse} h-[13px] w-[40px] rounded`} />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`${pulseStrong} w-4 h-4 rounded-full flex-shrink-0`}
          />
          <div className={`${pulse} h-[13px] w-[80px] rounded`} />
        </div>
      </div>

      {/* Candidate column */}
      <div className="flex-1 min-w-0 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`${pulseStrong} w-7 h-7 rounded-[7px] flex-shrink-0`}
          />
          <div className={`${pulse} h-[17px] w-[140px] rounded`} />
        </div>
        <div className={`${pulse} h-[13px] w-[100px] rounded`} />
        <div className={`${pulse} h-[13px] w-[180px] rounded`} />
      </div>

      {/* Actions column */}
      <div className="flex items-center gap-2 p-4 flex-shrink-0">
        <div className={`${pulseStrong} h-8 w-[110px] rounded-[9px]`} />
        <div className={`${pulse} h-8 w-8 rounded-[9px]`} />
        <div className={`${pulse} h-8 w-8 rounded-[9px]`} />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE GROUP HEADER SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function DateGroupHeaderSkeleton() {
  return (
    <div className="flex items-stretch min-h-[1px]">
      <div className="w-[230px] flex-shrink-0 px-4 py-3 flex items-start gap-3 border-b border-emerald-500/[0.08]">
        <div
          className={`${pulseStrong} w-11 h-11 rounded-[11px] flex-shrink-0`}
        />
      </div>
      <div className="flex-1 border-b border-emerald-500/[0.08]" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function InterviewsTableSkeleton() {
  // [rowCount per group]
  const groups = [2, 3];

  return (
    <div className="bg-[#0f1612] border border-emerald-500/[0.13] rounded-[16px] overflow-hidden">
      {/* Column headers */}
      <div className="flex items-center bg-emerald-500/[0.03] border-b border-emerald-500/[0.10]">
        <div className="w-[230px] flex-shrink-0 px-4 py-[10px]">
          <div className={`${pulse} h-[10px] w-[60px] rounded`} />
        </div>
        <div className="flex-1 px-4 py-[10px]">
          <div className={`${pulse} h-[10px] w-[70px] rounded`} />
        </div>
        <div className="w-[300px] flex-shrink-0 px-4 py-[10px] flex justify-end">
          <div className={`${pulse} h-[10px] w-[55px] rounded`} />
        </div>
      </div>

      {groups.map((rowCount, gi) => (
        <div key={gi}>
          <DateGroupHeaderSkeleton />
          {Array.from({ length: rowCount }).map((_, ri) => (
            <InterviewRowSkeleton key={ri} delay={(gi * 5 + ri) * 0.04} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL PAGE SKELETON — heading + toolbar + table
// ─────────────────────────────────────────────────────────────────────────────
export function InterviewsPageSkeleton() {
  return (
    <div>
      <InterviewsHeadingSkeleton />
      <InterviewsToolbarSkeleton />
      <InterviewsTableSkeleton />
    </div>
  );
}
