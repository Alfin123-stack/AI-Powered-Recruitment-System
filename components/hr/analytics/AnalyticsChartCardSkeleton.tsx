import { SkBox, SkCard } from "./AnalyticsSkeletonBase";

interface AnalyticsChartCardSkeletonProps {
  height?: number;
  className?: string;
}

export function AnalyticsChartCardSkeleton({
  height = 220,
  className = "",
}: AnalyticsChartCardSkeletonProps) {
  return (
    <SkCard className={className}>
      <div className="flex items-center gap-3 mb-5">
        <SkBox w={28} h={28} r={8} />
        <div className="flex flex-col gap-1 flex-1">
          <SkBox w="40%" h={14} />
          <SkBox w="30%" h={10} />
        </div>
      </div>
      <SkBox w="100%" h={height} r={10} />
    </SkCard>
  );
}
