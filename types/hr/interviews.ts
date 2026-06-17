export type { Interview, InterviewType, InterviewStatus } from "../calendar";

// ── HR-specific interview types ───────────────────────────────────────────────

export type ShortlistedCandidate = {
  application_id: string;
  candidate_id: string;
  candidate_name: string;
  job_title: string;
};

export type AnyInputEvent = { target: { value: string } };

export type SortOption =
  | "date_asc"
  | "date_desc"
  | "name_asc"
  | "name_desc"
  | "created_asc"
  | "created_desc";

export type FilterStatus =
  | "all"
  | "scheduled"
  | "done"
  | "cancelled"
  | "overdue";

export type AdvancedFilters = {
  round: string;
  type: string;
  interviewer: string;
};

export type InterviewConfirmType = "done" | "cancelled";
export type InterviewFilterType =
  | "scheduled"
  | "done"
  | "overdue"
  | "cancelled"
  | string;

// "scheduled_late" hanya ada di UI (bukan nilai DB)
export type InterviewStatusKey =
  | "scheduled"
  | "scheduled_late"
  | "done"
  | "overdue"
  | "cancelled";

export interface InterviewStatusStyle {
  bg: string;
  color: string;
  border: string;
  dot: string;
  label: string;
}
