import { SkBox } from "./AnalyticsSkeletonBase";

export function AnalyticsPageHeaderSkeleton() {
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
