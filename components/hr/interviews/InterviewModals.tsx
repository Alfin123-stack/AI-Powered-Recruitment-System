"use client";

import { AnimatePresence } from "framer-motion";
import { Interview } from "@/types/hr/interviews";
import { ShortlistedCandidate } from "@/types/hr/interviews";

import { InterviewConfirmModal } from "./InterviewConfirmModal";
import { InterviewReminderModal } from "./InterviewReminderModal";
import { InterviewStartMeetingModal } from "./InterviewStartMeetingModal";
import { InterviewRescheduleModal } from "./InterviewRescheduleModal";
import { InterviewScheduleModal } from "./InterviewScheduleModal";

// ── Re-exports so consumers only need one import path ─────────────────────────
export { InterviewConfirmModal } from "./InterviewConfirmModal";
export { InterviewReminderModal } from "./InterviewReminderModal";
export { InterviewStartMeetingModal } from "./InterviewStartMeetingModal";
export { InterviewRescheduleModal } from "./InterviewRescheduleModal";
export { InterviewScheduleModal } from "./InterviewScheduleModal";
export { InterviewField } from "./InterviewField";
export { InterviewSection } from "./InterviewSection";
export { InterviewModalShell } from "./InterviewModalShell";
export { InterviewTypeToggle } from "./InterviewTypeToggle";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type InterviewModalState =
  | { type: "confirm"; confirmType: "done" | "cancelled" }
  | { type: "reminder" }
  | { type: "startMeeting" }
  | { type: "reschedule" }
  | null;

interface InterviewModalsProps {
  // shared
  modal: InterviewModalState;
  interview: Interview;
  token: string;
  onClose: () => void;
  onDone: () => void;
  // confirm
  confirmLoading?: boolean;
  onConfirm?: () => void;
  // schedule (create new)
  showSchedule?: boolean;
  candidates?: ShortlistedCandidate[];
  onCloseSchedule?: () => void;
  onScheduleDone?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORCHESTRATOR
// ─────────────────────────────────────────────────────────────────────────────
export default function InterviewModals({
  modal,
  interview,
  token,
  onClose,
  onDone,
  confirmLoading = false,
  onConfirm,
  showSchedule = false,
  candidates = [],
  onCloseSchedule,
  onScheduleDone,
}: InterviewModalsProps) {
  return (
    <AnimatePresence>
      {modal?.type === "confirm" && (
        <InterviewConfirmModal
          key="confirm"
          type={modal.confirmType}
          candidateName={interview.candidate_name ?? "Candidate"}
          onConfirm={onConfirm ?? (() => {})}
          onCancel={onClose}
          loading={confirmLoading}
        />
      )}

      {modal?.type === "reminder" && (
        <InterviewReminderModal
          key="reminder"
          interview={interview}
          onClose={onClose}
        />
      )}

      {modal?.type === "startMeeting" && (
        <InterviewStartMeetingModal
          key="startMeeting"
          interview={interview}
          onClose={onClose}
        />
      )}

      {modal?.type === "reschedule" && (
        <InterviewRescheduleModal
          key="reschedule"
          interview={interview}
          token={token}
          onDone={() => {
            onDone();
            onClose();
          }}
          onClose={onClose}
        />
      )}

      {showSchedule && (
        <InterviewScheduleModal
          key="schedule"
          token={token}
          candidates={candidates}
          onDone={onScheduleDone ?? (() => {})}
          onClose={onCloseSchedule ?? onClose}
        />
      )}
    </AnimatePresence>
  );
}
