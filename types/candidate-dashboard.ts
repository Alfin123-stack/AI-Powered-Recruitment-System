// types/candidate-dashboard.ts
// Single source of truth untuk semua types kandidat.

// ── Interview ─────────────────────────────────────────────────────────────────

export type InterviewType = "online" | "onsite";
export type InterviewStatus = "scheduled" | "done" | "cancelled";

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
};

// ── CV Analysis ───────────────────────────────────────────────────────────────

export type CvAnalysis = {
  id?: string;
  resume_score: number;
  ats_score: number;
  overall_score: number;
  extracted_skills: { name: string; level: number }[];
  categories?: { label: string; score: number }[];
  strengths?: string[];
  improvements?: string[];
  file_name?: string;
  created_at: string;
};

// ── Application ───────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "rejected";

export type Application = {
  id: string;
  job_id?: string;
  job_title: string;
  company_name: string;
  status: ApplicationStatus;
  matching_score: number | null;
  resume_score: number | null;
  cv_url?: string | null;
  created_at: string;
};

// ── Job ───────────────────────────────────────────────────────────────────────

export type Job = {
  id: string;
  title: string;
  description?: string;
  skills: string[];
  location?: string;
  type?: string;
  salary?: string;
  created_at?: string;
  companies: { name: string; logo_url?: string | null };
};

// ── User ──────────────────────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

// ── AI Insight ────────────────────────────────────────────────────────────────

export type AIInsight = {
  type: "tip" | "warning" | "success";
  text: string;
};
