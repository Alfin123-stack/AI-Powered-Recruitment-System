import { daysUntilDeadline } from "@/lib/helpers/candidate/saved";

interface SavedJobsDeadlineBarProps {
  deadline: string | null;
}

export default function SavedJobsDeadlineBar({
  deadline,
}: SavedJobsDeadlineBarProps) {
  if (!deadline) return null;
  const days = daysUntilDeadline(deadline);
  if (days === null || days < 0) return null;

  const maxDays = 30;
  const pct = Math.max(0, Math.min(100, (days / maxDays) * 100));
  const color = days <= 3 ? "#ef4444" : days <= 7 ? "#f59e0b" : "#10b981";

  return (
    <div className="flex items-center gap-2 text-[0.68rem]">
      <span
        style={{ color }}
        className="font-semibold tabular-nums whitespace-nowrap">
        {days === 0 ? "Last day!" : `${days} days left`}
      </span>
      <div className="flex-1 h-[3px] bg-white/[0.05] rounded-full overflow-hidden min-w-[40px]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${100 - pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
