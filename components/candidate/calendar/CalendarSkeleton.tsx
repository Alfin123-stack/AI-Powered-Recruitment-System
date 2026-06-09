// All skeleton UI in one file — do not split

// ── Skeleton primitives ───────────────────────────────────────────────────────

function SkeletonBox({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-[8px] bg-emerald-500/[0.06] ${className}`}
      style={style}
    />
  );
}

// ── Interview Card Skeleton ───────────────────────────────────────────────────

function InterviewCardSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[16px] overflow-hidden p-4">
      <div className="h-[2px] w-2/3 bg-emerald-500/10 rounded-full mb-4" />
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-9 h-9 flex-shrink-0 rounded-[9px]" />
          <div className="space-y-2">
            <SkeletonBox className="h-3 w-32" />
            <SkeletonBox className="h-2.5 w-20" />
          </div>
        </div>
        <SkeletonBox className="h-5 w-16 rounded-full" />
      </div>
      <SkeletonBox className="h-8 w-full rounded-[8px] mb-3" />
      <div className="flex items-center gap-4 mb-3">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-3 w-16" />
      </div>
      <SkeletonBox className="h-9 w-full rounded-[9px]" />
    </div>
  );
}

// ── Calendar Grid Skeleton ────────────────────────────────────────────────────

function CalendarGridSkeleton() {
  return (
    <div className="bg-[#070d0a] border border-emerald-500/12 rounded-[20px] overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-500/10">
        <div className="space-y-2">
          <SkeletonBox className="h-5 w-36" />
          <SkeletonBox className="h-3 w-24" />
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="w-9 h-9 rounded-[9px]" />
          <SkeletonBox className="w-20 h-9 rounded-[9px]" />
          <SkeletonBox className="w-9 h-9 rounded-[9px]" />
        </div>
      </div>

      <div className="p-5">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonBox key={i} className="h-4 w-6 mx-auto" />
          ))}
        </div>

        {/* Grid cells */}
        <div className="grid grid-cols-7 gap-[4px]">
          {Array.from({ length: 35 }).map((_, i) => (
            <SkeletonBox
              key={i}
              className="min-h-[56px] rounded-[10px]"
              style={{ opacity: Math.random() > 0.3 ? 1 : 0.3 }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-emerald-500/8 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <SkeletonBox className="w-[8px] h-[8px] rounded-[2px]" />
              <SkeletonBox className="h-2.5 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Right Panel Skeleton ──────────────────────────────────────────────────────

function RightPanelSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Upcoming interviews panel */}
      <div className="bg-[#070d0a] border border-emerald-500/12 rounded-[16px] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-2">
          <SkeletonBox className="w-3.5 h-3.5 rounded-sm" />
          <SkeletonBox className="h-4 w-28" />
        </div>
        <div className="p-3 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <SkeletonBox className="w-8 h-8 rounded-[8px] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBox className="h-3 w-full" />
                <SkeletonBox className="h-2.5 w-3/4" />
              </div>
              <SkeletonBox className="w-3 h-3 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] p-4 border border-white/[0.05] text-center bg-emerald-500/[0.03]">
            <SkeletonBox className="h-8 w-10 mx-auto mb-2" />
            <SkeletonBox className="h-2.5 w-14 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Full Page Skeleton — exported default ─────────────────────────────────────

export default function CalendarPageSkeleton() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-5 space-y-2">
        <SkeletonBox className="h-6 w-48" />
        <SkeletonBox className="h-3 w-80" />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
        <CalendarGridSkeleton />
        <RightPanelSkeleton />
      </div>
    </div>
  );
}

// Named exports for granular use inside CalendarClient if needed
export { InterviewCardSkeleton, CalendarGridSkeleton, RightPanelSkeleton };
