// @/components/hr/calendar/CalendarSkeleton.tsx
// All skeleton UI for Calendar Page in one file
// Style aligned with JobsSkeleton (Tailwind + framer-motion)

"use client";

import { motion } from "framer-motion";

// ─── pulse animation class helper ─────────────────────────────────────────────
const pulse = "animate-pulse rounded bg-emerald-500/[0.07]";
const pulseStrong = "animate-pulse rounded bg-emerald-500/[0.10]";


// MINI CALENDAR (sidebar)

function MiniCalendarSkeleton() {
  return (
    <div className="bg-[#0f1612] border border-emerald-500/[0.13] rounded-[16px] p-4">
      {/* Header month nav */}
      <div className="flex items-center justify-between mb-3">
        <div className={`${pulse} w-4 h-4 rounded-full`} />
        <div className={`${pulse} w-[100px] h-[14px] rounded-[6px]`} />
        <div className={`${pulse} w-4 h-4 rounded-full`} />
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`${pulse} h-[10px] rounded`}
            style={{ animationDelay: `${i * 20}ms` }}
          />
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7" style={{ rowGap: 2 }}>
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center h-[26px]">
            <div
              className={`${i === 10 ? pulseStrong : pulse} w-5 h-5 rounded-full`}
              style={{ animationDelay: `${i * 10}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


// SIDEBAR

function SidebarSkeleton() {
  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col border-r border-emerald-500/[0.08]">
      {/* Add Schedule btn */}
      <div className="px-4 pt-5 pb-4">
        <div className={`${pulseStrong} h-9 w-full rounded-full`} />
      </div>

      {/* Mini calendar */}
      <div className="px-4 pb-4">
        <MiniCalendarSkeleton />
      </div>

      {/* Bottom avatars */}
      <div className="mt-auto px-4 pb-5 flex items-center justify-between">
        <div className="flex">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`${pulseStrong} w-[30px] h-[30px] rounded-full`}
              style={{
                marginLeft: i === 0 ? 0 : -8,
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>
        <div className={`${pulseStrong} w-7 h-7 rounded-full`} />
      </div>
    </div>
  );
}


// TOOLBAR

function ToolbarSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-[14px] flex-shrink-0 border-b border-emerald-500/[0.08]">
      <div className={`${pulse} w-[160px] h-[22px] rounded-[8px]`} />
      <div
        className={`${pulse} w-7 h-7 rounded-[7px]`}
        style={{ animationDelay: "40ms" }}
      />
      <div className="flex items-center gap-1">
        <div
          className={`${pulse} w-7 h-7 rounded-full`}
          style={{ animationDelay: "60ms" }}
        />
        <div
          className={`${pulse} w-[60px] h-[26px] rounded-[13px]`}
          style={{ animationDelay: "80ms" }}
        />
        <div
          className={`${pulse} w-7 h-7 rounded-full`}
          style={{ animationDelay: "100ms" }}
        />
      </div>
      <div className="flex-1" />
      <div
        className={`${pulseStrong} w-[160px] h-8 rounded-full`}
        style={{ animationDelay: "120ms" }}
      />
      <div
        className={`${pulseStrong} w-[170px] h-8 rounded-full`}
        style={{ animationDelay: "150ms" }}
      />
      <div
        className={`${pulse} w-8 h-8 rounded-full`}
        style={{ animationDelay: "180ms" }}
      />
    </div>
  );
}


// WEEK VIEW

export function WeekViewSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day headers */}
      <div className="flex flex-shrink-0 border-b border-emerald-500/[0.08]">
        <div className="w-[72px] border-r border-emerald-500/[0.08]" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center py-[10px] gap-[6px] border-r border-emerald-500/[0.06]">
            <div
              className={`${pulse} w-6 h-[10px] rounded`}
              style={{ animationDelay: `${i * 30}ms` }}
            />
            <div
              className={`${pulseStrong} w-10 h-10 rounded-[10px]`}
              style={{ animationDelay: `${i * 30}ms` }}
            />
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Hour labels */}
        <div className="w-[72px] flex-shrink-0 pt-2 flex flex-col gap-3 border-r border-emerald-500/[0.08]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex justify-end pr-3">
              <div
                className={`${pulse} w-11 h-[10px] rounded`}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Columns with fake events */}
        {Array.from({ length: 6 }).map((_, col) => (
          <div
            key={col}
            className="flex-1 relative border-r border-emerald-500/[0.06]">
            {col % 2 === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: col * 0.05 }}
                className={`${pulseStrong} absolute left-1 right-1 h-[72px] rounded-[12px]`}
                style={{ top: 60 + col * 20 }}
              />
            )}
            {col % 3 === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: col * 0.07 }}
                className={`${pulse} absolute left-1 right-1 h-14 rounded-[12px]`}
                style={{ top: 200 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// MONTH VIEW

export function MonthViewSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day header */}
      <div className="grid grid-cols-7 border-b border-emerald-500/[0.08]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="py-2 flex justify-center">
            <div
              className={`${pulse} w-6 h-[10px] rounded`}
              style={{ animationDelay: `${i * 25}ms` }}
            />
          </div>
        ))}
      </div>

      {/* Grid cells */}
      <div className="flex-1 grid grid-cols-7" style={{ gridAutoRows: "1fr" }}>
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="p-2 flex flex-col gap-1 border-r border-emerald-500/[0.06] border-b border-emerald-500/[0.06]">
            <div
              className={`${i === 10 ? pulseStrong : pulse} w-[22px] h-[22px] rounded-full`}
              style={{ animationDelay: `${i * 8}ms` }}
            />
            {i % 4 === 0 && (
              <div
                className={`${pulse} h-[18px] w-full rounded-[5px]`}
                style={{ animationDelay: `${i * 12}ms` }}
              />
            )}
            {i % 7 === 0 && (
              <div
                className={`${pulse} h-[18px] w-full rounded-[5px] opacity-60`}
                style={{ animationDelay: `${i * 16}ms` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// DAY VIEW

export function DayViewSkeleton() {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-1">
        {/* Hour labels */}
        <div className="w-[72px] flex-shrink-0 pt-2 flex flex-col gap-5 border-r border-emerald-500/[0.08]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex justify-end pr-3">
              <div
                className={`${pulse} w-11 h-[10px] rounded`}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Event column */}
        <div className="flex-1 p-2 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0 }}
            className={`${pulseStrong} h-20 w-full rounded-[12px] mt-10`}
          />
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.06 }}
            className={`${pulse} h-14 w-full rounded-[12px]`}
          />
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.12 }}
            className={`${pulseStrong} h-24 w-full rounded-[12px]`}
          />
        </div>
      </div>
    </div>
  );
}


// FULL PAGE SKELETON

export function CalendarPageSkeleton() {
  return (
    <div
      className="flex bg-[#0d1810] border border-emerald-500/[0.13] rounded-[18px] overflow-hidden"
      style={{ height: "calc(100vh - 80px)" }}>
      <SidebarSkeleton />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ToolbarSkeleton />
        <div className="flex-1 min-h-0 overflow-hidden">
          <WeekViewSkeleton />
        </div>
      </div>
    </div>
  );
}

export { MiniCalendarSkeleton };
