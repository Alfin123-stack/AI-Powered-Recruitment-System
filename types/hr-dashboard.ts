// ─────────────────────────────────────────────────────────────────────────────
// TYPES — HR Dashboard (single source of truth)
// ─────────────────────────────────────────────────────────────────────────────

// ── Raw API response ──────────────────────────────────────────────────────────
export type RawApplication = {
  id: string;
  candidate_name?: string;
  job_title?: string;
  job_id?: string;
  resume_score?: number;
  matching_score?: number;
  extracted_skills?: Array<string | { name?: string }>;
  status: string;
  created_at: string;
  cv_url?: string;
};

// ── Interview ─────────────────────────────────────────────────────────────────
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

// ── Candidate ─────────────────────────────────────────────────────────────────
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

// ── Company ───────────────────────────────────────────────────────────────────
export type CompanyInfo = {
  id?: string;
  name: string;
  description?: string | null;
  company_size?: string | null;
  logo_url?: string | null;
  industry?: string | null;
  location?: string | null;
  website?: string | null;
};

// ── Job Group ─────────────────────────────────────────────────────────────────
export type JobGroup = {
  title: string;
  color: string;
  candidates: CandidateExtended[];
  allCandidates: CandidateExtended[];
  shortlisted: number;
  avgScore: number;
};

// ── Insight ───────────────────────────────────────────────────────────────────
export type CandidateInsight = {
  strengths: string[];
  weaknesses: string[];
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export type DashboardStats = {
  total: number;
  shortlisted: number;
  inReview: number;
  totalInterviews: number;
  totalHired: number;
  totalRejected: number;
  uniqueJobs: string[];
};

// ── Fetch result ──────────────────────────────────────────────────────────────
export type FetchDashboardResult = {
  candidates: CandidateExtended[];
  interviews: Interview[];
  company: CompanyInfo | null;
};

// lib/types/hr.ts
// Single source of truth untuk semua shared HR types.
// Import dari sini — JANGAN definisikan ulang di _components/shared atau analytics/shared.

export type ApplicationStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "hired"
  | "rejected";

export type Application = {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  candidate_name?: string;
  resume_score?: number;
  matching_score?: number;
  status: ApplicationStatus;
  created_at: string;
};

export type Job = {
  id: string;
  title: string;
  skills: string[];
  location?: string;
  type?: string;
  salary?: string;
  is_active?: boolean;
  companies: { name: string; logo_url?: string };
};
