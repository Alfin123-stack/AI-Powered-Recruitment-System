// Skeleton UI for Interviews Page — satu file untuk semua skeleton

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE SKELETON BLOCK
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonBlock({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-[6px] bg-emerald-500/[0.06] ${className}`}
      style={style}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLBAR SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function InterviewsToolbarSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
      {/* Tab pills */}
      <div className="flex items-center gap-1 bg-[#0d1810] border border-emerald-500/12 rounded-[11px] p-1">
        {[80, 60, 90, 70].map((w, i) => (
          <SkeletonBlock key={i} className="h-[32px] rounded-[8px]" style={{ width: w }} />
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-[33px] w-[200px] rounded-[9px]" />
        <SkeletonBlock className="h-[33px] w-[80px] rounded-[9px]" />
        <SkeletonBlock className="h-[33px] w-[72px] rounded-[9px]" />
        <SkeletonBlock className="h-[33px] w-[140px] rounded-[9px]" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE ROW SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function InterviewRowSkeleton({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-0 border-b last:border-b-0 border-emerald-500/[0.08]"
      style={{ animationDelay: `${index * 60}ms` }}>
      {/* Time Column */}
      <div className="w-[230px] flex-shrink-0 px-4 py-4 flex flex-col gap-2">
        <SkeletonBlock className="h-[18px] w-[160px]" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-[18px] w-[70px] rounded-[5px]" />
          <SkeletonBlock className="h-[18px] w-[90px] rounded-[5px]" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-[13px] w-[50px]" />
          <SkeletonBlock className="h-[13px] w-[40px]" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-[16px] w-[16px] rounded-full" />
          <SkeletonBlock className="h-[13px] w-[80px]" />
        </div>
      </div>

      {/* Candidate Column */}
      <div className="flex-1 min-w-0 px-4 py-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-7 h-7 rounded-[7px] flex-shrink-0" />
          <SkeletonBlock className="h-[17px] w-[140px]" />
        </div>
        <SkeletonBlock className="h-[13px] w-[100px]" />
        <SkeletonBlock className="h-[13px] w-[180px]" />
      </div>

      {/* Actions Column */}
      <div className="flex items-center gap-2 px-4 py-4 flex-shrink-0">
        <SkeletonBlock className="h-[32px] w-[110px] rounded-[8px]" />
        <SkeletonBlock className="h-[32px] w-[32px] rounded-[8px]" />
        <SkeletonBlock className="h-[32px] w-[32px] rounded-[8px]" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE GROUP HEADER SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function DateGroupHeaderSkeleton() {
  return (
    <div className="flex items-stretch min-h-[1px]">
      <div className="w-[230px] flex-shrink-0 px-4 py-3 flex items-start gap-3 border-b border-emerald-500/[0.08]">
        <SkeletonBlock className="w-11 h-11 rounded-[11px] flex-shrink-0" />
      </div>
      <div className="flex-1 border-b border-emerald-500/[0.08]" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE SKELETON — exported, groups + rows
// ─────────────────────────────────────────────────────────────────────────────
export function InterviewsTableSkeleton() {
  // 2 groups, first has 2 rows, second has 3 rows
  const groups = [2, 3];

  return (
    <div className="bg-[#0d1810] border border-emerald-500/12 rounded-[16px]">
      {/* Column headers */}
      <div className="flex items-center gap-0 bg-emerald-500/[0.03] border-b border-emerald-500/10 rounded-t-[16px]">
        <div className="w-[230px] flex-shrink-0 px-4 py-[10px]">
          <SkeletonBlock className="h-[10px] w-[60px]" />
        </div>
        <div className="flex-1 px-4 py-[10px]">
          <SkeletonBlock className="h-[10px] w-[70px]" />
        </div>
        <div className="w-[300px] flex-shrink-0 px-4 py-[10px] flex justify-end">
          <SkeletonBlock className="h-[10px] w-[55px]" />
        </div>
      </div>

      {groups.map((rowCount, gi) => (
        <div key={gi}>
          <DateGroupHeaderSkeleton />
          {Array.from({ length: rowCount }).map((_, ri) => (
            <InterviewRowSkeleton key={ri} index={gi * 5 + ri} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL PAGE SKELETON — combines toolbar + table
// ─────────────────────────────────────────────────────────────────────────────
export function InterviewsPageSkeleton() {
  return (
    <div>
      <InterviewsToolbarSkeleton />
      <InterviewsTableSkeleton />
    </div>
  );
}
