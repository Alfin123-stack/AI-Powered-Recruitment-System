// components/blog/BlogSkeleton.tsx
// Skeleton untuk BlogPage — mereplikasi struktur:
//   BlogHero  →  EditorialSection (featured 2-col + regular 3-col)  →  DevToSection (3-col)

export function SkeletonPill({ w }: { w: string }) {
  return <div className="sk-shimmer rounded-full" style={{ height: 10, width: w }} />;
}

export function SkeletonBlock({ w, h, radius = 8 }: { w: string; h: number; radius?: number }) {
  return (
    <div
      className="sk-shimmer"
      style={{ height: h, width: w, borderRadius: radius }}
    />
  );
}

// ── Editorial card skeleton ────────────────────────────────────────────────────
function EditorialCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className="bg-[#0f1612] border border-emerald-500/[0.08] rounded-[16px] p-5 flex flex-col gap-3">
      {/* Top row: icon + badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="sk-shimmer rounded-[9px]" style={{ height: 36, width: 36, flexShrink: 0 }} />
        <div className="flex items-center gap-2">
          {featured && <div className="sk-shimmer rounded-full" style={{ height: 18, width: 88 }} />}
          <div className="sk-shimmer rounded-full" style={{ height: 18, width: 56 }} />
        </div>
      </div>
      {/* Category label */}
      <div className="sk-shimmer rounded-full" style={{ height: 9, width: 60 }} />
      {/* Title */}
      <div className="sk-shimmer rounded-md" style={{ height: featured ? 18 : 15, width: "92%" }} />
      <div className="sk-shimmer rounded-md" style={{ height: featured ? 18 : 15, width: "72%" }} />
      {/* Excerpt */}
      <div className="flex flex-col gap-[6px]">
        <div className="sk-shimmer rounded-full" style={{ height: 10, width: "100%" }} />
        <div className="sk-shimmer rounded-full" style={{ height: 10, width: "85%" }} />
        <div className="sk-shimmer rounded-full" style={{ height: 10, width: "68%" }} />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-emerald-500/[0.06]">
        <div className="sk-shimmer rounded-full" style={{ height: 9, width: 120 }} />
        <div className="sk-shimmer rounded-full" style={{ height: 9, width: 14 }} />
      </div>
    </div>
  );
}

// ── Dev.to card skeleton ──────────────────────────────────────────────────────
function DevToCardSkeleton({ hasThumbnail = true }: { hasThumbnail?: boolean }) {
  return (
    <div className="bg-[#080d0b] border border-emerald-500/[0.06] rounded-[16px] overflow-hidden flex flex-col">
      {hasThumbnail ? (
        <div className="sk-shimmer" style={{ height: 130, width: "100%", borderRadius: 0 }} />
      ) : (
        <div style={{ height: 6, background: "rgba(16,185,129,0.12)" }} />
      )}
      <div className="flex flex-col gap-[10px] p-5">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="sk-shimmer rounded-full" style={{ height: 18, width: 18 }} />
          <div className="sk-shimmer rounded-full" style={{ height: 9, width: 110 }} />
        </div>
        {/* Title */}
        <div className="sk-shimmer rounded-md" style={{ height: 14, width: "90%" }} />
        <div className="sk-shimmer rounded-md" style={{ height: 14, width: "68%" }} />
        {/* Description */}
        <div className="flex flex-col gap-[5px]">
          <div className="sk-shimmer rounded-full" style={{ height: 9, width: "100%" }} />
          <div className="sk-shimmer rounded-full" style={{ height: 9, width: "78%" }} />
        </div>
        {/* Tags */}
        <div className="flex items-center gap-[6px]">
          <div className="sk-shimmer rounded-full" style={{ height: 16, width: 42 }} />
          <div className="sk-shimmer rounded-full" style={{ height: 16, width: 50 }} />
          <div className="sk-shimmer rounded-full" style={{ height: 16, width: 36 }} />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-500/[0.05]">
          <div className="sk-shimmer rounded-full" style={{ height: 9, width: 90 }} />
          <div className="sk-shimmer rounded-full" style={{ height: 9, width: 40 }} />
        </div>
      </div>
    </div>
  );
}

// ── Main skeleton ─────────────────────────────────────────────────────────────
export default function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">

      {/* ── HERO ── */}
      <section className="pt-[100px] pb-16 px-6">
        <div className="max-w-[1180px] mx-auto flex flex-col gap-4">
          {/* Badge */}
          <div className="sk-shimmer rounded-full" style={{ height: 22, width: 180 }} />
          {/* H1 line 1 */}
          <div className="sk-shimmer rounded-lg" style={{ height: 42, width: "72%" }} />
          {/* H1 line 2 */}
          <div className="sk-shimmer rounded-lg" style={{ height: 42, width: "52%" }} />
          {/* Subtitle */}
          <div className="sk-shimmer rounded-full" style={{ height: 13, width: "80%", marginTop: 4 }} />
          <div className="sk-shimmer rounded-full" style={{ height: 13, width: "60%" }} />
          {/* Search bar */}
          <div className="sk-shimmer rounded-[10px]" style={{ height: 44, width: 520, marginTop: 8 }} />
        </div>
      </section>

      {/* ── EDITORIAL SECTION ── */}
      <section className="pb-20 px-6">
        <div className="max-w-[1180px] mx-auto">

          {/* Category filter pills */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {[70, 90, 80, 100, 75, 85].map((w, i) => (
              <div key={i} className="sk-shimmer rounded-[8px]" style={{ height: 34, width: w }} />
            ))}
            <div className="ml-auto sk-shimmer rounded-full" style={{ height: 10, width: 110 }} />
          </div>

          {/* Section label row */}
          <div className="flex items-center gap-3 mb-6">
            <div className="sk-shimmer rounded-full" style={{ height: 12, width: 180 }} />
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* Featured 2-col */}
          <div
            className="grid gap-5 mb-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <EditorialCardSkeleton featured />
            <EditorialCardSkeleton featured />
          </div>

          {/* Regular 3-col */}
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <EditorialCardSkeleton />
            <EditorialCardSkeleton />
            <EditorialCardSkeleton />
          </div>
        </div>
      </section>

      {/* ── DEV.TO SECTION ── */}
      <section className="bg-[#060b09] border-t border-emerald-500/[0.06] py-20 px-6">
        <div className="max-w-[1180px] mx-auto">

          {/* Header row */}
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
              <div className="sk-shimmer rounded-full" style={{ height: 10, width: 80 }} />
              <div className="sk-shimmer rounded-[8px]" style={{ height: 32, width: 80 }} />
            </div>
          </div>

          {/* 3-col cards */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
            <DevToCardSkeleton hasThumbnail={true} />
            <DevToCardSkeleton hasThumbnail={false} />
            <DevToCardSkeleton hasThumbnail={true} />
          </div>
        </div>
      </section>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes sk-sweep {
          0%   { background-position: -700px 0; }
          100% { background-position:  700px 0; }
        }
        .sk-shimmer {
          background: linear-gradient(
            90deg,
            #0f1612 25%,
            #172119 50%,
            #0f1612 75%
          );
          background-size: 700px 100%;
          animation: sk-sweep 1.7s infinite linear;
        }
      `}</style>
    </div>
  );
}