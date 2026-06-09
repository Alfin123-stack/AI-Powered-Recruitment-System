// All skeletons for the Job Detail page in one file

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-emerald-500/[0.06] rounded-md ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-emerald-500/[0.08] to-transparent" />
    </div>
  );
}

// ─── Hero Skeleton ────────────────────────────────────────────────────────────
export function JobDetailHeroSkeleton() {
  return (
    <section
      className="pt-[100px] pb-14 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
      }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Badge */}
        <Shimmer className="h-[26px] w-[96px] rounded-full mb-5" />

        <div className="flex items-start gap-5 mb-6">
          {/* Logo */}
          <Shimmer className="w-16 h-16 rounded-[14px] flex-shrink-0" />

          <div className="flex-1">
            {/* Title */}
            <Shimmer className="h-10 w-3/4 mb-3 rounded-[10px]" />
            <Shimmer className="h-5 w-1/3 mb-5 rounded-md" />

            {/* Meta chips */}
            <div className="flex gap-4 mb-5">
              {[80, 100, 130].map((w) => (
                <Shimmer key={w} className={`h-4 w-[${w}px] rounded-md`} />
              ))}
            </div>

            {/* Skill tags */}
            <div className="flex gap-2">
              {[64, 80, 72, 88, 60].map((w, i) => (
                <Shimmer key={i} className={`h-[28px] w-[${w}px] rounded-[7px]`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function SkeletonCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-7 mb-4 ${className}`}>
      {children}
    </div>
  );
}

// ─── Content Skeleton (left column) ──────────────────────────────────────────
export function JobDetailContentSkeleton() {
  return (
    <div>
      {/* Description card */}
      <SkeletonCard>
        <Shimmer className="h-5 w-44 mb-5 rounded-md" />
        <div className="flex flex-col gap-3">
          {[100, 90, 95, 85, 100, 70].map((w, i) => (
            <Shimmer key={i} className={`h-4 w-[${w}%] rounded-md`} />
          ))}
        </div>
      </SkeletonCard>

      {/* Requirements card */}
      <SkeletonCard>
        <Shimmer className="h-5 w-52 mb-5 rounded-md" />
        <div className="flex flex-col gap-[10px]">
          {[88, 76, 92, 68, 80].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <Shimmer className="w-4 h-4 rounded-full flex-shrink-0" />
              <Shimmer className={`h-4 w-[${w}%] rounded-md`} />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Benefits card */}
      <SkeletonCard>
        <Shimmer className="h-5 w-40 mb-5 rounded-md" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-[40px] rounded-[9px]" />
          ))}
        </div>
      </SkeletonCard>

      {/* Company card */}
      <SkeletonCard>
        <Shimmer className="h-5 w-44 mb-5 rounded-md" />
        <div className="flex gap-[14px] items-start mb-4">
          <Shimmer className="w-12 h-12 rounded-[11px] flex-shrink-0" />
          <div className="flex-1">
            <Shimmer className="h-5 w-40 mb-2 rounded-md" />
            <Shimmer className="h-4 w-24 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {[100, 95, 88].map((w, i) => (
            <Shimmer key={i} className={`h-4 w-[${w}%] rounded-md`} />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

// ─── Sidebar Skeleton ─────────────────────────────────────────────────────────
export function JobDetailSidebarSkeleton() {
  return (
    <div>
      <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 mb-4">
        {/* Apply button */}
        <Shimmer className="h-[48px] w-full rounded-[11px] mb-[10px]" />
        {/* Save button */}
        <Shimmer className="h-[42px] w-full rounded-[11px] mb-5" />

        <div className="border-t border-emerald-500/15 my-5" />

        {/* Job info rows */}
        <div className="mb-5 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-[9px] border-b border-emerald-500/15 last:border-0">
              <Shimmer className="h-4 w-24 rounded-md" />
              <Shimmer className="h-4 w-28 rounded-md" />
            </div>
          ))}
        </div>

        {/* AI Match box */}
        <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-[12px] p-4">
          <Shimmer className="h-4 w-32 mb-3 rounded-md" />
          <Shimmer className="h-4 w-full mb-1 rounded-md" />
          <Shimmer className="h-4 w-3/4 mb-3 rounded-md" />
          <Shimmer className="h-[36px] w-full rounded-[9px]" />
        </div>
      </div>

      {/* Share box */}
      <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] px-[22px] py-[18px]">
        <Shimmer className="h-4 w-32 mb-3 rounded-md" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className="flex-1 h-9 rounded-[8px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Full page skeleton (hero + content grid) ─────────────────────────────────
export function JobDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        <JobDetailHeroSkeleton />
        <div
          className="max-w-[1100px] mx-auto px-6 pt-10 pb-20 grid gap-6"
          style={{ gridTemplateColumns: "1fr 320px" }}>
          <JobDetailContentSkeleton />
          <JobDetailSidebarSkeleton />
        </div>
      </main>
    </div>
  );
}
