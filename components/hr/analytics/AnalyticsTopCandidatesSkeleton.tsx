import { SkBox, SkCard } from "./AnalyticsSkeletonBase";

export function AnalyticsTopCandidatesSkeleton() {
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
