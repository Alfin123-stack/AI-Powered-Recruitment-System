// SERVER Component — no "use client" directive.
// Used as <Suspense> fallback while CompanyListClient
// (which loads data) is still loading. Pure static HTML.

export default function CompanyGridSkeleton() {
  return (
    <div
      className="grid gap-[10px]"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-[11px] rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0f1612] p-[18px] overflow-hidden animate-pulse"
        >
          {/* Accent strip skeleton */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.06]" />

          {/* Header skeleton */}
          <div className="flex items-start gap-[10px]">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-white/[0.05] flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-[6px]">
              <div className="h-[14px] w-[60%] rounded-[4px] bg-white/[0.06]" />
              <div className="h-[10px] w-[40%] rounded-[4px] bg-white/[0.04]" />
            </div>
            <div className="h-[24px] w-[72px] rounded-[6px] bg-white/[0.05]" />
          </div>

          {/* Description skeleton */}
          <div className="flex flex-col gap-[5px]">
            <div className="h-[10px] w-full rounded-[4px] bg-white/[0.04]" />
            <div className="h-[10px] w-[80%] rounded-[4px] bg-white/[0.04]" />
          </div>

          {/* Location skeleton */}
          <div className="h-[10px] w-[45%] rounded-[4px] bg-white/[0.04]" />

          {/* Tags skeleton */}
          <div className="flex gap-[4px]">
            {[48, 56, 44].map((w, j) => (
              <div
                key={j}
                className="h-[18px] rounded-[4px] bg-white/[0.04]"
                style={{ width: w }}
              />
            ))}
          </div>

          {/* CTA skeleton */}
          <div className="h-[34px] rounded-[8px] bg-white/[0.04] mt-auto" />
        </div>
      ))}
    </div>
  );
}
