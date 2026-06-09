// @/components/hr/jobs/JobsSkeleton.tsx
// All skeleton UI in one file — used via Suspense fallback

"use client";

import { motion } from "framer-motion";

// ─── pulse animation class helper ────────────────────────────────────────────
const pulse =
  "animate-pulse rounded bg-emerald-500/[0.07]";


// STAT CARD SKELETON

function StatCardSkeleton() {
  return (
    <div className="bg-[#0f1612] border border-emerald-500/12 rounded-[12px] p-4 flex items-center gap-3">
      <div className={`${pulse} w-9 h-9 rounded-[8px] flex-shrink-0`} />
      <div className="flex flex-col gap-[6px]">
        <div className={`${pulse} h-6 w-12 rounded`} />
        <div className={`${pulse} h-2.5 w-20 rounded`} />
      </div>
    </div>
  );
}


// JOB CARD SKELETON

function JobCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-[#0f1612] border border-emerald-500/[0.08] rounded-[14px] p-4 overflow-hidden">
      {/* header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`${pulse} w-10 h-10 rounded-[10px] flex-shrink-0`} />
        <div className="flex-1 flex flex-col gap-[7px] pt-[2px]">
          <div className={`${pulse} h-2.5 w-16 rounded`} />
          <div className={`${pulse} h-4 w-32 rounded`} />
        </div>
        <div className="flex items-center gap-[5px]">
          <div className={`${pulse} w-7 h-7 rounded-[6px]`} />
          <div className={`${pulse} w-7 h-7 rounded-[6px]`} />
        </div>
      </div>

      {/* match score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-[6px]">
          <div className={`${pulse} h-2.5 w-28 rounded`} />
          <div className={`${pulse} h-2.5 w-8 rounded`} />
        </div>
        {/* dots */}
        <div className="flex items-center gap-[4px] mb-[6px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`${pulse} w-[9px] h-[9px] rounded-full`}
            />
          ))}
        </div>
        {/* bar */}
        <div className={`${pulse} h-[3px] w-full rounded-full`} />
      </div>

      {/* applicants row */}
      <div className="flex items-center justify-between mb-4">
        <div className={`${pulse} h-2.5 w-20 rounded`} />
        <div className="flex items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${pulse} w-[26px] h-[26px] rounded-full border-2 border-[#0f1612]`}
              style={{ marginLeft: i === 0 ? 0 : -7 }}
            />
          ))}
        </div>
      </div>

      {/* divider */}
      <div className="h-px bg-emerald-500/8 mb-3" />

      {/* tags */}
      <div className="flex flex-wrap gap-[5px]">
        {[60, 80, 50].map((w, i) => (
          <div
            key={i}
            className={`${pulse} h-[22px] rounded-[5px]`}
            style={{ width: w }}
          />
        ))}
      </div>
    </motion.div>
  );
}


// FULL PAGE SKELETON — used as Suspense fallback

export function JobsPageSkeleton() {
  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`${pulse} w-8 h-8 rounded-[8px]`} />
          <div className="flex flex-col gap-[6px]">
            <div className={`${pulse} h-4 w-16 rounded`} />
            <div className={`${pulse} h-2.5 w-48 rounded`} />
          </div>
        </div>
        <div className={`${pulse} h-9 w-40 rounded-[9px]`} />
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[0, 1, 2, 3].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* search */}
      <div className={`${pulse} h-9 w-[280px] rounded-[8px] mb-5`} />

      {/* job cards grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <JobCardSkeleton key={i} delay={i * 0.04} />
        ))}
      </div>
    </div>
  );
}


// MODAL FORM SKELETON — optional, for lazy loading modal

export function JobFormSkeleton() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]">
      <div className="w-full max-w-[600px] max-h-[92vh] flex flex-col bg-[#0a100c] border border-emerald-500/20 rounded-[20px] overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className={`${pulse} w-9 h-9 rounded-[10px]`} />
            <div className="flex flex-col gap-[6px]">
              <div className={`${pulse} h-4 w-32 rounded`} />
              <div className={`${pulse} h-2.5 w-44 rounded`} />
            </div>
          </div>
          <div className={`${pulse} w-8 h-8 rounded-[7px]`} />
        </div>
        {/* body */}
        <div className="flex-1 px-6 py-5 flex flex-col gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-[5px]">
              <div className={`${pulse} h-2.5 w-24 rounded`} />
              <div className={`${pulse} h-10 w-full rounded-[10px]`} />
            </div>
          ))}
        </div>
        {/* footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-emerald-500/10 bg-[#080f0b]">
          <div className={`${pulse} flex-1 h-10 rounded-[10px]`} />
          <div className={`${pulse} flex-1 h-10 rounded-[10px]`} />
        </div>
      </div>
    </div>
  );
}
