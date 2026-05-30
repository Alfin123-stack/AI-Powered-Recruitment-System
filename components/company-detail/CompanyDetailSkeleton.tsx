// SERVER Component — tidak ada directive "use client".
// Ditampilkan sebagai fallback <Suspense> saat CompanyDetailPage
// sedang fetch data di server. Pure HTML dengan animasi pulse CSS.

export default function CompanyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        {/* Header skeleton */}
        <section className="pt-[90px] pb-0 animate-pulse">
          <div className="max-w-[900px] mx-auto px-6">
            {/* Back button skeleton */}
            <div className="h-[16px] w-[140px] rounded-[6px] bg-white/[0.05] mb-[24px]" />

            {/* Company header skeleton */}
            <div className="flex items-start gap-[18px] mb-[28px]">
              {/* Logo skeleton */}
              <div className="w-[64px] h-[64px] rounded-[14px] bg-white/[0.06] flex-shrink-0" />

              {/* Info skeleton */}
              <div className="flex-1 flex flex-col gap-[8px]">
                <div className="h-[28px] w-[200px] rounded-[6px] bg-white/[0.06]" />
                <div className="h-[14px] w-[280px] rounded-[6px] bg-white/[0.04]" />
                <div className="flex gap-[5px]">
                  {[48, 56, 40].map((w, i) => (
                    <div
                      key={i}
                      className="h-[20px] rounded-[5px] bg-white/[0.04]"
                      style={{ width: w }}
                    />
                  ))}
                </div>
              </div>

              {/* Stats badge skeleton */}
              <div className="w-[80px] h-[64px] rounded-[12px] bg-white/[0.05] flex-shrink-0" />
            </div>

            {/* Tabs skeleton */}
            <div className="flex gap-[4px] border-b border-white/[0.07] pb-0">
              {[72, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-[36px] rounded-[6px] bg-white/[0.04] mx-[8px]"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Grid skeleton */}
        <section className="py-[28px] pb-24">
          <div className="max-w-[900px] mx-auto px-6">
            <div
              className="grid gap-[10px] animate-pulse"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-[10px] rounded-[12px] border border-white/[0.07] bg-[#0f1612] p-[16px]"
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex flex-col gap-[6px]">
                      <div className="h-[16px] w-[180px] rounded-[4px] bg-white/[0.06]" />
                      <div className="h-[12px] w-[100px] rounded-[4px] bg-white/[0.04]" />
                    </div>
                    <div className="h-[28px] w-[90px] rounded-[6px] bg-white/[0.05]" />
                  </div>
                  <div className="h-[10px] w-full rounded-[4px] bg-white/[0.04]" />
                  <div className="h-[10px] w-[75%] rounded-[4px] bg-white/[0.04]" />
                  <div className="flex gap-[4px]">
                    {[44, 52, 40, 56].map((w, j) => (
                      <div key={j} className="h-[18px] rounded-[4px] bg-white/[0.04]" style={{ width: w }} />
                    ))}
                  </div>
                  <div className="h-[32px] rounded-[8px] bg-white/[0.04] mt-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
