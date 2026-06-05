const T = {
  card: "#0b1410",
  cardBorder: "rgba(16,185,129,0.13)",
  shimmerBase: "rgba(16,185,129,0.04)",
  shimmerHigh: "rgba(16,185,129,0.09)",
};

const SHIMMER_STYLE = `
@keyframes skeletonShimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.sk-pulse {
  background: linear-gradient(
    90deg,
    ${T.shimmerBase} 25%,
    ${T.shimmerHigh} 50%,
    ${T.shimmerBase} 75%
  );
  background-size: 400px 100%;
  animation: skeletonShimmer 1.6s ease-in-out infinite;
  border-radius: 6px;
}
`;

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: SHIMMER_STYLE }} />;
}

// ─── Primitive: Shimmer Box ──────────────────────────────────────────────────
function SkBox({
  w = "100%",
  h = 16,
  r = 6,
  className = "",
}: {
  w?: string | number;
  h?: string | number;
  r?: number;
  className?: string;
}) {
  return (
    <div
      className={`sk-pulse ${className}`}
      style={{
        width: w,
        height: h,
        borderRadius: r,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Primitive: Skeleton Card Wrapper ───────────────────────────────────────
function SkCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[18px] p-5 ${className}`}
      style={{
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        ...style,
      }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. STAT CARD SKELETON  (used × 5 in overview)
// ─────────────────────────────────────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <SkCard>
      {/* top accent */}
      <SkBox h={2} r={2} className="mb-4" />
      <div className="flex items-start justify-between mb-4">
        <SkBox w={40} h={40} r={11} />
        <SkBox w={48} h={20} r={10} />
      </div>
      <SkBox w="55%" h={36} r={6} className="mb-2" />
      <SkBox w="70%" h={13} r={4} className="mb-1" />
      <SkBox w="50%" h={11} r={4} />
    </SkCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CHART CARD SKELETON — generic wrapper with configurable inner height
// ─────────────────────────────────────────────────────────────────────────────
export function ChartCardSkeleton({
  height = 220,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <SkCard className={className}>
      {/* header */}
      <div className="flex items-center gap-3 mb-5">
        <SkBox w={28} h={28} r={8} />
        <div className="flex flex-col gap-1 flex-1">
          <SkBox w="40%" h={14} />
          <SkBox w="30%" h={10} />
        </div>
      </div>
      {/* chart body */}
      <SkBox w="100%" h={height} r={10} />
    </SkCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PIPELINE FUNNEL SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function PipelineFunnelSkeleton() {
  return (
    <SkCard>
      {/* header */}
      <div className="flex items-center gap-3 mb-5">
        <SkBox w={28} h={28} r={8} />
        <div className="flex flex-col gap-1 flex-1">
          <SkBox w="45%" h={14} />
          <SkBox w="35%" h={10} />
        </div>
      </div>
      {/* funnel rows */}
      <div className="flex flex-col gap-4">
        {[100, 80, 65, 45, 30].map((pct, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkBox w={28} h={28} r={8} />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <SkBox w="45%" h={11} />
                <SkBox w={24} h={11} />
              </div>
              <SkBox w={`${pct}%`} h={6} r={3} />
            </div>
            <SkBox w={28} h={11} />
          </div>
        ))}
      </div>
      {/* bottom metrics */}
      <div
        className="grid grid-cols-2 gap-2 mt-5 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            className="text-center py-2 rounded-[10px]"
            style={{ background: "rgba(255,255,255,0.025)" }}>
            <SkBox w="40%" h={22} r={5} className="mx-auto mb-1" />
            <SkBox w="55%" h={10} r={4} className="mx-auto" />
          </div>
        ))}
      </div>
    </SkCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SCORE GAUGES SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function ScoreGaugesSkeleton() {
  return (
    <SkCard>
      <div className="flex items-center gap-3 mb-5">
        <SkBox w={28} h={28} r={8} />
        <div className="flex flex-col gap-1 flex-1">
          <SkBox w="50%" h={14} />
          <SkBox w="40%" h={10} />
        </div>
      </div>
      {/* 3 gauge circles */}
      <div className="flex justify-around mb-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <SkBox w={96} h={56} r={8} />
            <SkBox w={64} h={10} r={4} />
          </div>
        ))}
      </div>
      {/* mini metric rows */}
      <div
        className="space-y-3 mt-3 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <SkBox w="55%" h={11} />
            <SkBox w={28} h={14} />
          </div>
        ))}
      </div>
    </SkCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TOP CANDIDATES LIST SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function TopCandidatesSkeleton() {
  return (
    <SkCard>
      <div className="flex items-center gap-3 mb-5">
        <SkBox w={28} h={28} r={8} />
        <div className="flex flex-col gap-1 flex-1">
          <SkBox w="40%" h={14} />
          <SkBox w="30%" h={10} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 px-3 rounded-[11px]"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
            <SkBox w={24} h={24} r={6} />
            <SkBox w={32} h={32} r={10} />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <SkBox w="55%" h={13} />
              <SkBox w="40%" h={10} />
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex flex-col items-center gap-1">
                <SkBox w={28} h={16} />
                <SkBox w={18} h={9} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <SkBox w={34} h={16} />
                <SkBox w={22} h={9} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CONVERSION RATE LIST SKELETON  (per posisi tab)
// ─────────────────────────────────────────────────────────────────────────────
export function ConversionListSkeleton() {
  return (
    <SkCard>
      <div className="flex items-center gap-3 mb-5">
        <SkBox w={28} h={28} r={8} />
        <div className="flex flex-col gap-1 flex-1">
          <SkBox w="45%" h={14} />
          <SkBox w="35%" h={10} />
        </div>
      </div>
      <div
        className="flex flex-col divide-y"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <SkBox w={8} h={8} r={4} />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <SkBox w="60%" h={14} />
              <SkBox w="45%" h={10} />
            </div>
            <SkBox w={144} h={5} r={3} />
            <SkBox w={36} h={18} />
          </div>
        ))}
      </div>
    </SkCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TAB BAR SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function TabBarSkeleton() {
  return (
    <div
      className="flex items-center gap-1 mb-6 p-1 rounded-[12px] w-fit"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
      {[80, 72, 88].map((w, i) => (
        <SkBox key={i} w={w} h={30} r={9} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. PAGE HEADER SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function PageHeaderSkeleton() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <SkBox w={32} h={32} r={9} />
        <SkBox w={120} h={24} />
      </div>
      <SkBox w={280} h={13} r={4} className="ml-11" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. FULL PAGE SKELETON  — dipakai di Suspense fallback page.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function AnalyticsPageSkeleton() {
  return (
    <div className="min-h-screen pb-10" style={{ background: "#07100a" }}>
      <StyleInjector />

      <PageHeaderSkeleton />
      <TabBarSkeleton />

      {/* Stat cards row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Row 1: Pipeline + Donut + Gauges */}
      <div
        className="grid gap-5 mb-5"
        style={{ gridTemplateColumns: "1.3fr 1fr 1fr" }}>
        <PipelineFunnelSkeleton />
        <ChartCardSkeleton height={180} />
        <ScoreGaugesSkeleton />
      </div>

      {/* Row 2: Area chart full width */}
      <ChartCardSkeleton height={190} className="mb-5" />
    </div>
  );
}
