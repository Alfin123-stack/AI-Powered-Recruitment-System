// ─────────────────────────────────────────────────────────────────────────────
// TYPES — HR Dashboard
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
};

export type CandidateExtended = {
  id: string;
  name: string;
  avatar: string;
  job: string;
  jobId?: string;
  resumeScore: number;
  matchScore: number;
  skills: string[];
  status: string;
  appliedDate: string;
  createdAt: string;
  color: string;
  cv_url: string | null;
};

export interface JobGroup {
  title: string;
  color: string;
  candidates: CandidateExtended[];
  allCandidates: CandidateExtended[];
  shortlisted: number;
  avgScore: number;
}

export interface CandidateInsight {
  strengths: string[];
  weaknesses: string[];
}

export interface DashboardStats {
  total: number;
  shortlisted: number;
  inReview: number;
  totalInterviews: number;
  totalHired: number;
  totalRejected: number;
  uniqueJobs: string[];
}

export interface CompanyInfo {
  name: string;
  company_size?: string;
}
