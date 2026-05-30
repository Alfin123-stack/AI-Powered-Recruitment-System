// components/blog/DevToSkeleton.tsx
// Fallback untuk <Suspense> di page.tsx saat DevToSection (async Server Component) masih loading.
// Tidak ada "use client" — ini pure server/shared component.

export default function DevToSkeleton() {
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
            <div key={i} className="bg-[#080d0b] border border-emerald-500/[0.06] rounded-[16px] overflow-hidden flex flex-col">
              {hasThumbnail ? (
                <div className="sk-shimmer" style={{ height: 130, width: "100%", borderRadius: 0 }} />
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
    </section>
  );
}
