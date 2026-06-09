// skeletons.tsx — semua skeleton UI dalam satu file

function SavedJobsSkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-emerald-500/[0.06] ${className}`}
    />
  );
}

export function SavedJobsCardSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[18px] overflow-hidden">
      <div className="flex">
        <div className="w-[3px] bg-emerald-500/10 rounded-l-[18px] flex-shrink-0" />
        <div className="flex-1 p-5">
          <div className="flex items-start gap-4">
            <SavedJobsSkeletonPulse className="w-11 h-11 rounded-[10px] flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <SavedJobsSkeletonPulse className="h-4 w-44 mb-2" />
                  <SavedJobsSkeletonPulse className="h-3 w-28" />
                </div>
                <SavedJobsSkeletonPulse className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex gap-3 mb-3">
                <SavedJobsSkeletonPulse className="h-3 w-24" />
                <SavedJobsSkeletonPulse className="h-3 w-20" />
                <SavedJobsSkeletonPulse className="h-3 w-28" />
              </div>
              <div className="flex gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <SavedJobsSkeletonPulse key={i} className="h-5 w-16 rounded-[4px]" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <SavedJobsSkeletonPulse className="h-8 w-28 rounded-[8px]" />
                  <SavedJobsSkeletonPulse className="h-8 w-20 rounded-[8px]" />
                </div>
                <SavedJobsSkeletonPulse className="h-8 w-20 rounded-[8px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SavedJobsStatsBarSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[14px] p-4">
          <SavedJobsSkeletonPulse className="w-8 h-8 rounded-[8px] mb-3" />
          <SavedJobsSkeletonPulse className="h-7 w-10 mb-1" />
          <SavedJobsSkeletonPulse className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function SavedJobsFilterBarSkeleton() {
  return (
    <div className="flex gap-2 mb-5">
      {[0, 1, 2, 3].map((i) => (
        <SavedJobsSkeletonPulse key={i} className="h-8 w-20 rounded-[7px]" />
      ))}
    </div>
  );
}

export function SavedJobsHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-5">
      <SavedJobsSkeletonPulse className="h-5 w-40" />
      <SavedJobsSkeletonPulse className="h-9 w-52 rounded-[9px]" />
    </div>
  );
}

export function SavedJobsSkeleton() {
  return (
    <div>
      <SavedJobsStatsBarSkeleton />
      <SavedJobsHeaderSkeleton />
      <SavedJobsFilterBarSkeleton />
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <SavedJobsCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
