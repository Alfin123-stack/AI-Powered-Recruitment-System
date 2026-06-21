// @/components/blog/BlogSkeleton.tsx
// Skeleton terpadu untuk seluruh halaman /blog — ditampilkan selama
// BlogHero, BlogSearchClient, dan DevToSection masih resolve di dalam
// satu Suspense boundary yang sama di page.tsx.

function BlogHeroSkeleton() {
  return (
    <section className="pt-[100px] pb-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse,rgba(16,185,129,0.07)_0%,transparent_70%)]" />

      <div className="max-w-[1180px] mx-auto px-6 relative">
        <div className="max-w-[640px] flex flex-col gap-3">
          {/* H1 — 2 baris, mirip "The Latest Tips, Trends, and" + "Career Insights" */}
          <div className="sk-shimmer rounded-md" style={{ height: 40, width: "92%" }} />
          <div className="sk-shimmer rounded-md" style={{ height: 40, width: "50%" }} />

          {/* Paragraf deskripsi */}
          <div className="flex flex-col gap-[10px] mt-3">
            <div className="sk-shimmer rounded-full" style={{ height: 12, width: "100%" }} />
            <div className="sk-shimmer rounded-full" style={{ height: 12, width: "92%" }} />
            <div className="sk-shimmer rounded-full" style={{ height: 12, width: "60%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSearchBarSkeleton() {
  return (
    <div className="max-w-[1180px] mx-auto px-6 pt-2 pb-6">
      <div
        className="sk-shimmer rounded-[10px]"
        style={{ height: 44, width: "100%", maxWidth: 520 }}
      />
    </div>
  );
}

function EditorialSectionSkeleton() {
  return (
    <section className="pb-[80px]">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Category filter pills */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {[64, 92, 78, 104, 70].map((w, i) => (
            <div
              key={i}
              className="sk-shimmer rounded-[8px]"
              style={{ height: 32, width: w }}
            />
          ))}
          <div
            className="sk-shimmer rounded-full ml-auto"
            style={{ height: 12, width: 130 }}
          />
        </div>

        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="sk-shimmer rounded-full"
            style={{ height: 14, width: 170 }}
          />
          <div className="flex-1 h-[1px] bg-emerald-500/10" />
        </div>

        {/* Cards grid — meniru EditorialCard */}
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div
                  className="sk-shimmer rounded-[9px]"
                  style={{ height: 36, width: 36 }}
                />
                <div
                  className="sk-shimmer rounded-full"
                  style={{ height: 20, width: 72 }}
                />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <div
                  className="sk-shimmer rounded-full"
                  style={{ height: 10, width: 90 }}
                />
                <div
                  className="sk-shimmer rounded-md"
                  style={{ height: 14, width: "95%" }}
                />
                <div
                  className="sk-shimmer rounded-md"
                  style={{ height: 14, width: "68%" }}
                />
                <div className="flex flex-col gap-[6px] mt-1">
                  <div
                    className="sk-shimmer rounded-full"
                    style={{ height: 9, width: "100%" }}
                  />
                  <div
                    className="sk-shimmer rounded-full"
                    style={{ height: 9, width: "100%" }}
                  />
                  <div
                    className="sk-shimmer rounded-full"
                    style={{ height: 9, width: "78%" }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-emerald-500/10">
                <div
                  className="sk-shimmer rounded-full"
                  style={{ height: 9, width: 90 }}
                />
                <div
                  className="sk-shimmer rounded-full"
                  style={{ height: 14, width: 14 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DevToSectionSkeleton() {
  return (
    <section className="bg-[#060b09] py-[80px] pb-[100px] border-t border-emerald-500/[0.07]">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Header skeleton */}
        <div className="flex items-start justify-between gap-4 mb-10 flex-wrap">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-2">
              <div className="sk-shimmer rounded-[6px]" style={{ height: 24, width: 24 }} />
              <div className="sk-shimmer rounded-full" style={{ height: 14, width: 160 }} />
              <div className="sk-shimmer rounded-full" style={{ height: 14, width: 50 }} />
            </div>
            <div className="sk-shimmer rounded-full" style={{ height: 10, width: 340 }} />
            <div className="sk-shimmer rounded-full" style={{ height: 10, width: 260 }} />
          </div>
          <div className="flex items-center gap-3">
            <div className="sk-shimmer rounded-full" style={{ height: 10, width: 100 }} />
            <div className="sk-shimmer rounded-[8px]" style={{ height: 32, width: 80 }} />
          </div>
        </div>

        {/* Cards grid skeleton */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
          {[true, false, true, false, true, false].map((hasThumbnail, i) => (
            <div
              key={i}
              className="bg-[#080d0b] border border-emerald-500/[0.06] rounded-[16px] overflow-hidden flex flex-col">
              {hasThumbnail ? (
                <div
                  className="sk-shimmer"
                  style={{ height: 130, width: "100%", borderRadius: 0 }}
                />
              ) : (
                <div style={{ height: 6, background: "rgba(16,185,129,0.12)" }} />
              )}
              <div className="flex flex-col gap-[10px] p-5">
                <div className="flex items-center gap-2">
                  <div className="sk-shimmer rounded-full" style={{ height: 18, width: 18 }} />
                  <div className="sk-shimmer rounded-full" style={{ height: 9, width: 110 }} />
                </div>
                <div className="sk-shimmer rounded-md" style={{ height: 14, width: "90%" }} />
                <div className="sk-shimmer rounded-md" style={{ height: 14, width: "68%" }} />
                <div className="flex flex-col gap-[5px]">
                  <div className="sk-shimmer rounded-full" style={{ height: 9, width: "100%" }} />
                  <div className="sk-shimmer rounded-full" style={{ height: 9, width: "78%" }} />
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="sk-shimmer rounded-full" style={{ height: 16, width: 42 }} />
                  <div className="sk-shimmer rounded-full" style={{ height: 16, width: 50 }} />
                  <div className="sk-shimmer rounded-full" style={{ height: 16, width: 36 }} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/[0.05]">
                  <div className="sk-shimmer rounded-full" style={{ height: 9, width: 90 }} />
                  <div className="sk-shimmer rounded-full" style={{ height: 9, width: 40 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BlogSkeleton() {
  return (
    <>
      <BlogHeroSkeleton />
      <BlogSearchBarSkeleton />
      <EditorialSectionSkeleton />
      <DevToSectionSkeleton />

      <style>{`
        @keyframes sk-sweep {
          0%   { background-position: -700px 0; }
          100% { background-position:  700px 0; }
        }
        .sk-shimmer {
          background: linear-gradient(90deg, #0f1612 25%, #172119 50%, #0f1612 75%);
          background-size: 700px 100%;
          animation: sk-sweep 1.7s infinite linear;
        }
      `}</style>
    </>
  );
}