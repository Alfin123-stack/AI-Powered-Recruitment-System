import { SkBox, SkCard } from "./AnalyticsSkeletonBase";

export function AnalyticsStatCardSkeleton() {
  return (
    <SkCard>
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
