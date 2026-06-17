"use client";

import { STAT_CONFIGS } from "@/constants/hr/jobs";
import { JobsSummaryData } from "@/types/jobs";

interface Props {
  data: JobsSummaryData;
}

export function JobsSummaryStats({ data }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {STAT_CONFIGS.map(({ key, label, col, Icon, isPercent }) => {
        const raw = data[key];
        const display = isPercent
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
