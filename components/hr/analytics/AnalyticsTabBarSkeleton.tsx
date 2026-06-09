import { SkBox } from "./AnalyticsSkeletonBase";

export function AnalyticsTabBarSkeleton() {
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
