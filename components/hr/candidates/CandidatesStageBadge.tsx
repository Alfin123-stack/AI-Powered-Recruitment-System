"use client";

import { STATUS_CONFIG } from "@/constants/candidates";
import { CandidateStatus } from "@/types/candidates";

export function CandidatesStageBadge({ status }: { status: string }) {
  const st = STATUS_CONFIG[status as CandidateStatus] ?? STATUS_CONFIG.applied;
  return (
    <span
      className="inline-flex items-center gap-[5px] text-[11px] font-bold px-[9px] py-1 rounded-[6px]"
      style={{
        background: st.bg,
        color: st.color,
        border: `1px solid ${st.border}`,
      }}>
      {st.label}
    </span>
  );
}
