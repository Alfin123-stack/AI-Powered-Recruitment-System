import { SkBox, SkCard } from "./AnalyticsSkeletonBase";

export function AnalyticsConversionListSkeleton() {
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
