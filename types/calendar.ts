// ─────────────────────────────────────────────────────────────────────────────

export type InterviewType = "online" | "onsite";

export type InterviewStatus = "scheduled" | "done" | "cancelled" | "overdue";

export type ViewMode = "month" | "week" | "day";

export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: InterviewType;
  location: string | null;
  notes?: string | null;
  status: InterviewStatus;

  job_title?: string;
  company_name?: string;
  candidate_name?: string;
  candidate_id?: string;
  // — Data interviewer
  interviewer_name?: string;
  interviewer_avatar?: string;
  // — Metadata tambahan
  duration_minutes?: number;
  round?: string;
  recording_duration?: string;
  created_at?: string;
};
