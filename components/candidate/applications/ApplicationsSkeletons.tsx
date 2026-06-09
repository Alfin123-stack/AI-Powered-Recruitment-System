function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-emerald-500/[0.06] ${className}`}
    />
  );
}

// ── Stats Bar Skeleton ────────────────────────────────────────────────────────

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[14px] p-4">
            <Pulse className="w-8 h-8 rounded-[8px] mb-3" />
            <Pulse className="h-7 w-12 mb-1" />
            <Pulse className="h-3 w-24" />
          </div>
        ))}
    </div>
  );
}

// ── Application Card Skeleton ─────────────────────────────────────────────────

export function ApplicationCardSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[18px] p-5">
      <div className="flex items-start gap-4">
        <Pulse className="w-11 h-11 rounded-[10px] flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <Pulse className="h-4 w-48 mb-2" />
              <Pulse className="h-3 w-32" />
            </div>
            <Pulse className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-5 mb-3">
            <Pulse className="h-3 w-36" />
            <Pulse className="h-3 w-36" />
          </div>
          <div className="flex items-center justify-between">
            <Pulse className="h-3 w-24" />
            <Pulse className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Applications List Skeleton ────────────────────────────────────────────────

export function ApplicationsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <ApplicationCardSkeleton key={i} />
        ))}
    </div>
  );
}

// ── Interview Card Skeleton ───────────────────────────────────────────────────

export function InterviewCardSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[18px] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Pulse className="w-10 h-10 rounded-[10px] flex-shrink-0" />
          <div>
            <Pulse className="h-4 w-36 mb-2" />
            <Pulse className="h-3 w-24" />
          </div>
        </div>
        <Pulse className="h-6 w-20 rounded-full" />
      </div>
      <Pulse className="h-16 rounded-[11px] mb-3" />
      <Pulse className="h-10 rounded-[10px]" />
    </div>
  );
}

// ── Interviews List Skeleton ──────────────────────────────────────────────────

export function InterviewsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            {/* Date group header */}
            <div className="flex items-center gap-3 mb-3">
              <Pulse className="h-7 w-20 rounded-[7px]" />
              <div className="flex-1 h-px bg-emerald-500/8" />
              <Pulse className="h-4 w-16" />
            </div>
            <InterviewCardSkeleton />
          </div>
        ))}
    </div>
  );
}

// ── Tabs Skeleton ─────────────────────────────────────────────────────────────

export function TabsSkeleton() {
  return (
    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
      <Pulse className="h-10 w-64 rounded-[12px]" />
      <div className="flex items-center gap-2">
        <Pulse className="h-9 w-24 rounded-[9px]" />
        <Pulse className="h-9 w-24 rounded-[9px]" />
      </div>
    </div>
  );
}

// ── Filter Bar Skeleton ───────────────────────────────────────────────────────

export function FilterBarSkeleton() {
  return (
    <div className="flex gap-3 mb-5 flex-wrap">
      <Pulse className="h-9 flex-1 min-w-[200px] rounded-[9px]" />
      <div className="flex gap-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Pulse key={i} className="h-9 w-20 rounded-[8px]" />
          ))}
      </div>
    </div>
  );
}

// ── Full Page Skeleton ────────────────────────────────────────────────────────
// Digunakan sebagai fallback utama di page.tsx

export function ApplicationsPageSkeleton() {
  return (
    <div>
      <StatsBarSkeleton />
      <TabsSkeleton />
      <FilterBarSkeleton />
      <ApplicationsListSkeleton count={4} />
    </div>
  );
}
