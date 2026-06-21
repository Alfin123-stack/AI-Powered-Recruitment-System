// SERVER Component — no "use client" directive.
// Skeleton terpadu untuk seluruh halaman /companies: Hero + Toolbar + Grid.
// Dipakai sebagai satu-satunya fallback <Suspense> di page.tsx selagi
// CompanySection (server component yang fetch data) masih resolve.

function CompanyHeroSkeleton() {
  return (
    <section
      className="pt-[108px] pb-[56px] relative overflow-hidden text-center"
      style={{
        background:
          "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(16,185,129,0.06) 0%, transparent 65%), #0a0f0d",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative max-w-[680px] mx-auto px-6 flex flex-col items-center gap-[14px] animate-pulse">
        {/* Title — 2 baris, mirip "Companies That Are" + "Actively Hiring" */}
        <div className="h-[34px] w-[88%] rounded-[8px] bg-white/[0.06]" />
        <div className="h-[34px] w-[55%] rounded-[8px] bg-white/[0.06]" />

        {/* Subtitle */}
        <div className="flex flex-col items-center gap-[6px] w-full mt-1">
          <div className="h-[10px] w-[78%] rounded-[4px] bg-white/[0.04]" />
          <div className="h-[10px] w-[55%] rounded-[4px] bg-white/[0.04]" />
        </div>

        {/* Stats pill */}
        <div className="h-[38px] w-[340px] max-w-full rounded-full bg-white/[0.04] mt-2" />
      </div>
    </section>
  );
}

function CompanyToolbarSkeleton() {
  return (
    <section className="pt-5">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="bg-[#0f1612] border border-white/[0.07] rounded-[13px] p-[14px] flex items-center gap-[10px] flex-wrap animate-pulse">
          {/* Search box */}
          <div className="h-[36px] flex-1 min-w-[200px] rounded-[8px] bg-white/[0.04]" />

          {/* Filter pills */}
          <div className="flex gap-[5px] flex-wrap">
            {[64, 78, 58, 70].map((w, i) => (
              <div
                key={i}
                className="h-[30px] rounded-[7px] bg-white/[0.04]"
                style={{ width: w }}
              />
            ))}
          </div>

          {/* Result count */}
          <div className="h-[10px] w-[90px] rounded-[4px] bg-white/[0.04] ml-auto" />
        </div>
      </div>
    </section>
  );
}

function CompanyGridSkeletonCards() {
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

function CompanyGridSkeletonSection() {
  return (
    <section className="py-7 pb-20">
      <div className="max-w-[1160px] mx-auto px-6">
        <CompanyGridSkeletonCards />
      </div>
    </section>
  );
}

export default function CompanySkeleton() {
  return (
    <div>
      <CompanyHeroSkeleton />
      <CompanyToolbarSkeleton />
      <CompanyGridSkeletonSection />
    </div>
  );
}