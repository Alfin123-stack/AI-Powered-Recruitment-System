// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  duration_minutes?: number;
  type: "online" | "onsite";
  location: string | null;
  notes: string | null;
  status: "scheduled" | "done" | "cancelled" | "overdue";
  round?: string;
  created_at: string;
  candidate_name: string;
  candidate_id?: string;
  job_title: string;
  interviewer_name?: string;
  interviewer_avatar?: string;
  recording_duration?: string;
};

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

// ─────────────────────────────────────────────────────────────────────────────
// SHARED INPUT STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const inputCls =
  "w-full bg-[#080f0b] border border-emerald-500/15 rounded-[10px] px-3 py-[10px] text-[0.85rem] text-[#e8f0ec] placeholder:text-[#2d4a38] focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/8 transition-all";

export const inputErrorCls =
  "w-full bg-[#080f0b] border border-red-500/40 rounded-[10px] px-3 py-[10px] text-[0.85rem] text-[#e8f0ec] placeholder:text-[#2d4a38] focus:outline-none focus:border-red-500/60 transition-all";

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  scheduled: {
    label: "Scheduled",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.10)",
    border: "rgba(99,102,241,0.28)",
    dot: "#6366f1",
  },
  done: {
    label: "Completed",
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.28)",
    dot: "#10b981",
  },
  overdue: {
    label: "Overdue",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.28)",
    dot: "#f59e0b",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.28)",
    dot: "#ef4444",
  },
};

export const roundConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  "First Interview": {
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
  },
  "Second Interview": {
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
  },
  "Final Interview": {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
};
