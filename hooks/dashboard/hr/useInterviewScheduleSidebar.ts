import { useMemo } from "react";
import type { Interview } from "@/types/hr/dashboard";

type StatItem = {
  label: string;
  val: number;
  color: string;
};

export function useInterviewScheduleSidebar(interviews: Interview[]) {
  const upcoming = useMemo(
    () =>
      interviews
        .filter((iv) => iv.status === "scheduled" || iv.status === "overdue")
        .sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime(),
        )
        .slice(0, 8),
    [interviews],
  );

  const stats: StatItem[] = [
    { label: "Total", val: interviews.length, color: "#94a3b8" },
    {
      label: "Selesai",
      val: interviews.filter((iv) => iv.status === "done").length,
      color: "#10b981",
    },
    {
      label: "Batal",
      val: interviews.filter((iv) => iv.status === "cancelled").length,
      color: "#ef4444",
    },
  ];

  return { upcoming, stats };
}
