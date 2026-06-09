// ─── Types ───────────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  job_id: string;
  job_title?: string;
  candidate_name?: string;
  status: "applied" | "review" | "shortlisted" | "rejected" | "hired";
  resume_score?: number;
  matching_score?: number;
  created_at?: string;
}

export interface Job {
  id: string;
  title?: string;
  is_active?: boolean;
}

export interface AnalyticsData {
  apps: Application[];
  jobs: Job[];
}
