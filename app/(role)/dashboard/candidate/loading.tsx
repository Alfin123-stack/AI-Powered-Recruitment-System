// app/dashboard/candidate/loading.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SEMUA Skeleton UI dalam satu file — dipakai oleh <Suspense fallback> dan
// Next.js loading.tsx convention (otomatis ditampilkan saat page SSR loading).
// ─────────────────────────────────────────────────────────────────────────────

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.04] rounded-[8px] ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

// ── Welcome Banner Skeleton ───────────────────────────────────────────────────
export function WelcomeBannerSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[18px] px-7 py-6 mb-6">
      <div className="flex items-center justify-between gap-5">
        <div className="flex-1 space-y-3">
          <Shimmer className="h-3 w-24 rounded-full" />
          <Shimmer className="h-7 w-48 rounded-[8px]" />
          <Shimmer className="h-4 w-64 rounded-full" />
        </div>
        <Shimmer className="h-10 w-36 rounded-[10px] flex-shrink-0" />
      </div>
    </div>
  );
}

// ── Stats Grid Skeleton ───────────────────────────────────────────────────────
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[16px] p-5">
          <Shimmer className="w-8 h-8 rounded-[8px] mb-3" />
          <Shimmer className="h-8 w-16 rounded-[6px] mb-2" />
          <Shimmer className="h-3 w-24 rounded-full mb-1" />
          <Shimmer className="h-2 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ── AI Insight Card Skeleton ──────────────────────────────────────────────────
export function AiInsightCardSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[18px] overflow-hidden mb-5">
      <div className="px-5 pt-5 pb-4 bg-gradient-to-r from-emerald-500/[0.04] to-transparent">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shimmer className="w-7 h-7 rounded-[8px]" />
            <Shimmer className="h-4 w-36 rounded-full" />
            <Shimmer className="h-4 w-16 rounded-full" />
          </div>
          <Shimmer className="h-7 w-20 rounded-[7px]" />
        </div>

        {/* Score rings + bars */}
        <div className="flex items-center gap-6">
          <Shimmer className="w-[88px] h-[88px] rounded-full" />
          <Shimmer className="w-[72px] h-[72px] rounded-full" />
          <Shimmer className="w-[72px] h-[72px] rounded-full" />
          <div className="flex-1 space-y-[10px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Shimmer className="h-3 w-[110px] rounded-full flex-shrink-0" />
                <Shimmer className="flex-1 h-[4px] rounded-full" />
                <Shimmer className="h-3 w-7 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Skills chips */}
        <div className="flex flex-wrap gap-[5px] mt-3">
          {Array.from({ length: 7 }).map((_, i) => {
            const widths = [
              "w-[60px]",
              "w-[72px]",
              "w-[84px]",
              "w-[96px]",
              "w-[108px]",
              "w-[120px]",
              "w-[132px]",
            ];

            return (
              <Shimmer key={i} className={`h-6 rounded-[5px] ${widths[i]}`} />
            );
          })}
        </div>
      </div>

      {/* Expand button */}
      <div className="px-5 py-[10px] border-t border-emerald-500/10 flex items-center justify-between">
        <Shimmer className="h-3 w-32 rounded-full" />
        <Shimmer className="h-4 w-4 rounded-full" />
      </div>
    </div>
  );
}

// ── Application Funnel Skeleton ───────────────────────────────────────────────
export function ApplicationFunnelSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[14px] p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Shimmer className="w-4 h-4 rounded-full" />
        <Shimmer className="h-4 w-28 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Shimmer className="h-3 w-[72px] rounded-full flex-shrink-0" />
            <Shimmer className="flex-1 h-[6px] rounded-full" />
            <Shimmer className="h-3 w-4 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Application Tabs Skeleton ─────────────────────────────────────────────────
export function ApplicationListSkeleton() {
  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-[#0a0f0c] border border-emerald-500/10 rounded-[10px] p-[5px] mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer
            key={i}
            className={`h-8 rounded-[7px] ${i === 0 ? "w-16" : "w-24"}`}
          />
        ))}
      </div>

      {/* Application cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[16px] p-5 mb-3">
          <div className="flex items-start gap-3 mb-3">
            <Shimmer className="w-10 h-10 rounded-[10px] flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-48 rounded-full" />
              <Shimmer className="h-3 w-32 rounded-full" />
            </div>
            <Shimmer className="h-6 w-20 rounded-full flex-shrink-0" />
          </div>
          <div className="space-y-[7px] mb-3">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <Shimmer className="h-3 w-[105px] rounded-full flex-shrink-0" />
                <Shimmer className="flex-1 h-[4px] rounded-full" />
                <Shimmer className="h-3 w-7 rounded-full" />
              </div>
            ))}
          </div>
          <Shimmer className="h-3 w-40 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ── Mini Calendar Skeleton ────────────────────────────────────────────────────
export function MiniCalendarSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-cyan-500/10 rounded-[18px] overflow-hidden mb-4">
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.04]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shimmer className="w-6 h-6 rounded-[6px]" />
            <Shimmer className="h-4 w-32 rounded-full" />
          </div>
        </div>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <Shimmer className="w-6 h-6 rounded-[5px]" />
          <Shimmer className="h-4 w-28 rounded-full" />
          <Shimmer className="w-6 h-6 rounded-[5px]" />
        </div>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-y-[2px] mb-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Shimmer key={i} className="h-3 mx-auto w-5 rounded-full" />
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-[2px]">
          {Array.from({ length: 35 }).map((_, i) => (
            <Shimmer key={i} className="aspect-square rounded-[6px] m-[1px]" />
          ))}
        </div>
      </div>
      {/* Upcoming slot */}
      <div className="px-4 py-3">
        <Shimmer className="h-3 w-24 rounded-full mb-2" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 rounded-[9px] bg-white/[0.015]">
              <Shimmer className="w-7 h-7 rounded-[7px] flex-shrink-0" />
              <div className="flex-1 space-y-[6px]">
                <Shimmer className="h-3 w-32 rounded-full" />
                <Shimmer className="h-2 w-24 rounded-full" />
              </div>
              <Shimmer className="h-3 w-8 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Recommendations Panel Skeleton ────────────────────────────────────────────
export function RecommendationsPanelSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[18px] p-5 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Shimmer className="w-7 h-7 rounded-[8px]" />
        <Shimmer className="h-4 w-32 rounded-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0">
            <Shimmer className="w-8 h-8 rounded-[8px] flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Shimmer className="h-4 w-36 rounded-full" />
                <Shimmer className="h-4 w-8 rounded-full flex-shrink-0" />
              </div>
              <Shimmer className="h-3 w-24 rounded-full" />
              <Shimmer className="h-[3px] w-full rounded-full" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Shimmer key={j} className="h-4 w-14 rounded-[3px]" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Full Page Skeleton (untuk Next.js loading.tsx) ────────────────────────────
export default function DashboardLoadingSkeleton() {
  return (
    <div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <WelcomeBannerSkeleton />
      <StatsGridSkeleton />
      <AiInsightCardSkeleton />

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 310px" }}>
        <div>
          <ApplicationFunnelSkeleton />
          <ApplicationListSkeleton />
        </div>
        <div>
          <MiniCalendarSkeleton />
          <RecommendationsPanelSkeleton />
          {/* Upload CTA skeleton */}
          <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[18px] p-5 text-center space-y-3">
            <Shimmer className="w-10 h-10 rounded-full mx-auto" />
            <Shimmer className="h-4 w-32 rounded-full mx-auto" />
            <Shimmer className="h-3 w-48 rounded-full mx-auto" />
            <Shimmer className="h-3 w-40 rounded-full mx-auto" />
            <Shimmer className="h-10 w-full rounded-[9px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
