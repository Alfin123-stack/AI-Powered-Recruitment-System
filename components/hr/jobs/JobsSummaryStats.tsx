// @/components/hr/jobs/JobsSummaryStats.tsx
// Server-renderable display component — no state/hooks
// Can be used as pure server component without motion

"use client";

import { Briefcase, Users, TrendingUp, Sparkles } from "lucide-react";
import type { JobsSummaryData } from "../../../types/hr/jobs";

interface Props {
  data: JobsSummaryData;
}

const STAT_CONFIGS = [
  {
    key: "totalActive" as const,
    label: "Active Positions",
    col: "#10b981",
    Icon: Briefcase,
  },
  {
    key: "totalApplicants" as const,
    label: "Total Applicants",
    col: "#06b6d4",
    Icon: Users,
  },
  {
    key: "totalShortlisted" as const,
    label: "Shortlisted",
    col: "#f59e0b",
    Icon: Sparkles,
  },
  {
    key: "overallAvgMatch" as const,
    label: "Avg Match Score",
    col: "#8b5cf6",
    Icon: TrendingUp,
    isPercent: true,
  },
];

export function JobsSummaryStats({ data }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {STAT_CONFIGS.map(({ key, label, col, Icon, isPercent }) => {
        const raw = data[key];
        const display =
          isPercent
            ? data.totalApplicants > 0
              ? `${raw}%`
              : "—"
            : raw;

        return (
          <div
            key={key}
            className="bg-[#0f1612] border border-emerald-500/12 rounded-[12px] p-4 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ background: `${col}15`, color: col }}>
              <Icon size={15} />
            </div>
            <div>
              <div
                className="font-extrabold text-[1.35rem] leading-none"
                style={{ color: col }}>
                {display}
              </div>
              <div className="text-[0.68rem] text-[#7a9585] mt-[2px]">
                {label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
