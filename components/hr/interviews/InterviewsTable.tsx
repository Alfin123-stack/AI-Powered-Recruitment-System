"use client";

import { AnimatePresence } from "framer-motion";
import { Interview, InterviewFilterType } from "@/types/hr/interviews";
import { InterviewTableHeader } from "./InterviewTableHeader";
import { InterviewDayHeader } from "./InterviewDayHeader";
import { InterviewEmptyState } from "./InterviewEmptyState";
import { InterviewRow } from "./InterviewRow";
import { groupByDay } from "@/lib/helpers/hr/interviews";
import { FadeIn } from "@/components/FadeIn";

// ── Re-export primitives so consumers only need one import path ───────────────
export { InterviewTableHeader } from "./InterviewTableHeader";
export { InterviewDayHeader } from "./InterviewDayHeader";
export { InterviewEmptyState } from "./InterviewEmptyState";
export { InterviewRow } from "./InterviewRow";
export { InterviewActionBtn } from "./InterviewActionBtn";
export { InterviewIconBtn } from "./InterviewIconBtn";
export { InterviewDropItem } from "./InterviewDropItem";
export { InterviewMoreDropdown } from "./InterviewMoreDropdown";
export type {
  InterviewConfirmType,
  InterviewFilterType,
  InterviewStatusKey,
  InterviewStatusStyle,
} from "@/types/hr/interviews";
export {
  INTERVIEW_STATUS_STYLE,
  INTERVIEW_ACCENT_CLASSES,
} from "../../../constants/hr/Interviews";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface InterviewTableProps {
  interviews: Interview[];
  token: string;
  onUpdate: () => void;
  filter: InterviewFilterType;
}

export default function InterviewTable({
  interviews,
  token,
  onUpdate,
  filter,
}: InterviewTableProps) {
  const grouped = groupByDay(interviews);

  return (
    <div className="rounded-[18px] overflow-hidden bg-[#0f1612] border border-emerald-500/[0.15]">
      <div className="h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400/50 to-transparent" />

      <InterviewTableHeader />

      {interviews.length === 0 ? (
        <InterviewEmptyState filter={filter} />
      ) : (
        Object.entries(grouped).map(([dateLabel, { dateStr, items }], gi) => (
          <FadeIn key={dateLabel} delay={gi * 0.04}>
            <InterviewDayHeader dateStr={dateStr} />
            <AnimatePresence>
              {items.map((iv, i) => (
                <InterviewRow
                  key={iv.id}
                  interview={iv}
                  token={token}
                  onUpdate={onUpdate}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </FadeIn>
        ))
      )}
    </div>
  );
}
