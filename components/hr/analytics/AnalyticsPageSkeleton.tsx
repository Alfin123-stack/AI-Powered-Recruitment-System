import { SkeletonStyleInjector } from "./AnalyticsSkeletonBase";
import { AnalyticsPageHeaderSkeleton } from "./AnalyticsPageHeaderSkeleton";
import { AnalyticsTabBarSkeleton } from "./AnalyticsTabBarSkeleton";
import { AnalyticsStatCardSkeleton } from "./AnalyticsStatCardSkeleton";
import { AnalyticsPipelineFunnelSkeleton } from "./AnalyticsPipelineFunnelSkeleton";
import { AnalyticsChartCardSkeleton } from "./AnalyticsChartCardSkeleton";
import { AnalyticsScoreGaugesSkeleton } from "./AnalyticsScoreGaugesSkeleton";

export function AnalyticsPageSkeleton() {
  return (
    <div className="min-h-screen pb-10" style={{ background: "#07100a" }}>
      <SkeletonStyleInjector />

      <AnalyticsPageHeaderSkeleton />
      <AnalyticsTabBarSkeleton />

      {/* Stat cards row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <AnalyticsStatCardSkeleton key={i} />
        ))}
      </div>

      {/* Row 1: Pipeline + Donut + Gauges */}
      <div
        className="grid gap-5 mb-5"
        style={{ gridTemplateColumns: "1.3fr 1fr 1fr" }}>
        <AnalyticsPipelineFunnelSkeleton />
        <AnalyticsChartCardSkeleton height={180} />
        <AnalyticsScoreGaugesSkeleton />
      </div>

      {/* Row 2: Area chart full width */}
      <AnalyticsChartCardSkeleton height={190} className="mb-5" />
    </div>
  );
}
