"use client";

import type { StatusFilter } from "@/types/candidates";
import type { JobMeta } from "@/types/candidates";
import { CandidatesJobFilterDropdown } from "./CandidatesJobFilterDropdown";
import { STATUS_TABS } from "@/constants/candidates";

interface CandidatesFilterBarProps {
  jobMetas: JobMeta[];
  activeJob: string;
  totalCount: number;
  onSelectJob: (job: string) => void;
  activeStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  candidates: { job: string; status: string }[];
}

export function CandidatesFilterBar({
  jobMetas,
  activeJob,
  totalCount,
  onSelectJob,
  activeStatus,
  onStatusChange,
  candidates,
}: CandidatesFilterBarProps) {
  return (
    <div
      className="flex items-center gap-3 px-6 py-[10px] bg-[#0d1510]"
      style={{ borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
      <CandidatesJobFilterDropdown
        jobMetas={jobMetas}
        activeJob={activeJob}
        totalCount={totalCount}
        onSelect={onSelectJob}
      />
      <div
        className="w-px self-stretch"
        style={{ background: "rgba(16,185,129,0.1)" }}
      />
      <div
        className="flex items-center gap-1"
        role="tablist"
        aria-label="Filter candidate status">
        {STATUS_TABS.map(({ key, label }) => {
          const scope =
            activeJob === "all"
              ? candidates
              : candidates.filter((c) => c.job === activeJob);
          const count =
            key === "all"
              ? scope.length
              : scope.filter((c) => c.status === key).length;
          const isActive = activeStatus === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              title={`Filter candidates by status: ${label}`}
              onClick={() => onStatusChange(key)}
              className="flex items-center gap-[5px] px-[10px] py-[4px] rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer"
              style={
                isActive
                  ? {
                      background: "rgba(16,185,129,0.12)",
                      color: "#10b981",
                      border: "1px solid rgba(16,185,129,0.3)",
                    }
                  : {
                      background: "transparent",
                      color: "#7a9585",
                      border: "1px solid transparent",
                    }
              }>
              {label}
              <span
                className="text-[10px] font-bold px-[5px] py-[1px] rounded-[3px]"
                style={{
                  background: isActive
                    ? "rgba(16,185,129,0.2)"
                    : "rgba(16,185,129,0.06)",
                  color: isActive ? "#10b981" : "#7a9585",
                }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
