import { SkBox, SkCard } from "./AnalyticsSkeletonBase";

export function AnalyticsPipelineFunnelSkeleton() {
  return (
    <SkCard>
      <div className="flex items-center gap-3 mb-5">
        <SkBox w={28} h={28} r={8} />
        <div className="flex flex-col gap-1 flex-1">
          <SkBox w="45%" h={14} />
          <SkBox w="35%" h={10} />
        </div>
      </div>
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
