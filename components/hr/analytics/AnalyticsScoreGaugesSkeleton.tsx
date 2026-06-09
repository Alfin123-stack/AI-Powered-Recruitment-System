import { SkBox, SkCard } from "./AnalyticsSkeletonBase";

export function AnalyticsScoreGaugesSkeleton() {
  return (
    <SkCard>
      <div className="flex items-center gap-3 mb-5">
        <SkBox w={28} h={28} r={8} />
        <div className="flex flex-col gap-1 flex-1">
          <SkBox w="50%" h={14} />
          <SkBox w="40%" h={10} />
        </div>
      </div>
      <div className="flex justify-around mb-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <SkBox w={96} h={56} r={8} />
            <SkBox w={64} h={10} r={4} />
          </div>
        ))}
      </div>
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
