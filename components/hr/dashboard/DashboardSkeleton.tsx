// ─────────────────────────────────────────────────────────────────────────────
// SKELETON UI — HR Dashboard (semua skeleton dalam 1 file)
// ─────────────────────────────────────────────────────────────────────────────
// Route: @/components/hr/dashboard/DashboardSkeleton.tsx

export function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-white/[0.06] ${className}`}
      style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }}
    />
  );
}

// ── Stat Cards Skeleton ──────────────────────────────────────────────────────
export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-3 mb-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[16px] p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04] rounded-t-[16px]" />
          <SkeletonPulse className="w-8 h-8 rounded-[8px] mb-3" />
          <SkeletonPulse className="w-12 h-8 mb-2" />
          <SkeletonPulse className="w-20 h-3 mb-1" />
          <SkeletonPulse className="w-14 h-2" />
        </div>
      ))}
    </div>
  );
}

// ── AI Insight Panel Skeleton ────────────────────────────────────────────────
export function AIInsightPanelSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/20 rounded-[18px] p-5 mb-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-8 h-8 rounded-[8px]" />
          <div>
            <SkeletonPulse className="w-40 h-4 mb-1" />
            <SkeletonPulse className="w-56 h-3" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonPulse key={i} className="w-20 h-12 rounded-[10px]" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-14 rounded-[12px]" />
        ))}
      </div>
    </div>
  );
}

// ── Analytics Section Skeleton ───────────────────────────────────────────────
export function AnalyticsSectionSkeleton() {
  return (
    <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "minmax(0,1fr) 280px" }}>
      {/* Left column */}
      <div className="flex flex-col gap-5 min-w-0">
        {/* Overview + Pipeline row */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1.5fr" }}>
          <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5">
            <div className="flex items-center gap-2 mb-4">
              <SkeletonPulse className="w-6 h-6 rounded-[6px]" />
              <SkeletonPulse className="w-28 h-4" />
            </div>
            <div className="flex flex-col items-center gap-4">
              <SkeletonPulse className="w-28 h-28 rounded-full" />
              <div className="w-full space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <SkeletonPulse className="w-20 h-3" />
                    <SkeletonPulse className="w-8 h-3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5">
            <div className="flex items-center gap-2 mb-5">
              <SkeletonPulse className="w-6 h-6 rounded-[6px]" />
              <SkeletonPulse className="w-28 h-4" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonPulse className="w-4 h-4 rounded" />
                  <SkeletonPulse className="w-20 h-3" />
                  <SkeletonPulse className="flex-1 h-[5px] rounded-full" />
                  <SkeletonPulse className="w-6 h-4" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-14 rounded-[10px]" />
              ))}
            </div>
          </div>
        </div>

        {/* Chart row */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5">
              <div className="flex items-center gap-2 mb-4">
                <SkeletonPulse className="w-6 h-6 rounded-[6px]" />
                <SkeletonPulse className="w-36 h-4" />
              </div>
              <SkeletonPulse className="w-full h-40 rounded-[10px]" />
            </div>
          ))}
        </div>

        {/* Radar + Job table row */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5">
            <div className="flex items-center gap-2 mb-2">
              <SkeletonPulse className="w-6 h-6 rounded-[6px]" />
              <SkeletonPulse className="w-44 h-4" />
            </div>
            <SkeletonPulse className="w-full h-52 rounded-[10px]" />
          </div>
          <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-2">
              <SkeletonPulse className="w-6 h-6 rounded-[6px]" />
              <SkeletonPulse className="w-28 h-4" />
            </div>
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <SkeletonPulse className="w-2 h-2 rounded-full" />
                  <SkeletonPulse className="flex-1 h-3" />
                  <SkeletonPulse className="w-8 h-3" />
                  <SkeletonPulse className="w-12 h-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="flex flex-col gap-4">
        {/* Calendar skeleton */}
        <div className="bg-[#0a0f0c] border border-emerald-500/20 rounded-[18px] overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2 mb-3">
              <SkeletonPulse className="w-6 h-6 rounded-[6px]" />
              <SkeletonPulse className="w-36 h-4" />
            </div>
            <div className="flex items-center justify-between mb-3">
              <SkeletonPulse className="w-6 h-6 rounded-[5px]" />
              <SkeletonPulse className="w-20 h-4" />
              <SkeletonPulse className="w-6 h-6 rounded-[5px]" />
            </div>
            <div className="grid grid-cols-7 gap-y-[2px] mb-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-3 mx-1" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-[2px]">
              {Array.from({ length: 35 }).map((_, i) => (
                <SkeletonPulse key={i} className="aspect-square rounded-[6px] m-[1px]" />
              ))}
            </div>
          </div>
          <div className="px-4 pb-4 pt-3">
            <SkeletonPulse className="w-full h-3 mb-2" />
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonPulse key={i} className="w-full h-12 rounded-[9px] mb-2" />
            ))}
          </div>
        </div>

        {/* Interview schedule skeleton */}
        <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] overflow-hidden">
          <div className="px-4 py-4 border-b border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonPulse className="w-6 h-6 rounded-[6px]" />
              <SkeletonPulse className="w-32 h-4" />
            </div>
            <SkeletonPulse className="w-16 h-6 rounded-full" />
          </div>
          <div className="px-4 py-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-[9px] border border-white/[0.05]">
                <SkeletonPulse className="w-2 h-2 rounded-full mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <SkeletonPulse className="w-28 h-3" />
                  <SkeletonPulse className="w-36 h-2" />
                  <SkeletonPulse className="w-24 h-2" />
                  <div className="flex gap-1">
                    <SkeletonPulse className="w-14 h-4 rounded-full" />
                    <SkeletonPulse className="w-16 h-4 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Candidate Ranking Skeleton ───────────────────────────────────────────────
export function CandidateRankingSkeleton() {
  return (
    <div>
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <SkeletonPulse className="w-56 h-5 mb-1" />
          <SkeletonPulse className="w-40 h-3" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonPulse className="w-48 h-9 rounded-[10px]" />
          <SkeletonPulse className="w-36 h-9 rounded-[10px]" />
        </div>
      </div>

      {/* Job group tables skeleton */}
      {Array.from({ length: 3 }).map((_, gi) => (
        <div key={gi} className="rounded-[14px] overflow-hidden mb-3 bg-[#0a0f0c] border border-emerald-500/12">
          {/* Group header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
            <SkeletonPulse className="w-[10px] h-[10px] rounded-full flex-shrink-0" />
            <SkeletonPulse className="flex-1 h-4 max-w-[200px]" />
            <div className="flex items-center gap-4 mr-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonPulse key={i} className="w-16 h-3" />
              ))}
            </div>
            <SkeletonPulse className="w-4 h-4 rounded" />
          </div>

          {/* Table rows */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 700 }}>
              <thead>
                <tr className="bg-black/25">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <th key={i} className="px-4 py-2">
                      <SkeletonPulse className="h-3 w-12" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, ri) => (
                  <tr key={ri} className="border-t border-white/[0.04]">
                    <td className="px-4 py-3">
                      <SkeletonPulse className="w-6 h-6 rounded-[6px]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <SkeletonPulse className="w-9 h-9 rounded-[10px] flex-shrink-0" />
                        <div>
                          <SkeletonPulse className="w-32 h-3 mb-1" />
                          <SkeletonPulse className="w-20 h-2" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <SkeletonPulse className="w-16 h-3" />
                    </td>
                    <td className="px-4 py-3">
                      <SkeletonPulse className="w-10 h-3" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <SkeletonPulse className="w-12 h-4 rounded" />
                        <SkeletonPulse className="w-10 h-4 rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <SkeletonPulse className="w-24 h-5 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <SkeletonPulse className="w-16 h-5 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 4 }).map((_, bi) => (
                          <SkeletonPulse key={bi} className="w-7 h-7 rounded-[7px]" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Full Page Skeleton (dipakai sebagai loading.tsx atau Suspense fallback) ──
export function HRDashboardSkeleton() {
  return (
    <div className="min-h-screen p-5" style={{ background: "#080d0a" }}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-4">
          <SkeletonPulse className="w-11 h-11 rounded-[13px] flex-shrink-0" />
          <div>
            <SkeletonPulse className="w-48 h-6 mb-1" />
            <SkeletonPulse className="w-64 h-3" />
          </div>
        </div>
      </div>

      <StatCardsSkeleton />
      <AIInsightPanelSkeleton />
      <AnalyticsSectionSkeleton />
      <CandidateRankingSkeleton />

      {/* Company footer skeleton */}
      <div className="rounded-[14px] p-4 flex items-center gap-4 mt-4 bg-[#0a0f0c] border border-emerald-500/12">
        <SkeletonPulse className="w-10 h-10 rounded-[11px] flex-shrink-0" />
        <div className="flex-1">
          <SkeletonPulse className="w-40 h-4 mb-1" />
          <SkeletonPulse className="w-24 h-3" />
        </div>
      </div>
    </div>
  );
}
