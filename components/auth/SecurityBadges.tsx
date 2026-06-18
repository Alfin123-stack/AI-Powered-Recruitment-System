import { DEFAULT_BADGES } from "@/constants/auth/auth";
import { SecurityBadge } from "@/types/auth/auth";

export function SecurityBadges({
  badges = DEFAULT_BADGES,
}: {
  badges?: SecurityBadge[];
}) {
  return (
    <div className="flex items-center justify-center gap-[10px] flex-wrap">
      {badges.map((b, i) => {
        const Icon = b.icon;
        return (
          <span
            key={i}
            className="flex items-center gap-[5px] text-[#2e4a3a] text-[0.68rem] font-medium">
            <span style={{ color: b.iconColor ?? "inherit" }}>
              <Icon size={11} />
            </span>
            {b.label}
            {i < badges.length - 1 && (
              <span className="ml-[10px] w-[3px] h-[3px] rounded-full bg-[#2e4a3a]" />
            )}
          </span>
        );
      })}
    </div>
  );
}
