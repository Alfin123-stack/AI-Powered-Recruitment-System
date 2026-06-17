// types/candidate-dashboard.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth untuk types kandidat.
//
// Menggabungkan:
//   - types/candidate-dashboard.ts
//   - shared/types/candidate.ts :: CandidateUser      → alias UserProfile
//   - shared/types/candidate.ts :: CandidateApplication → alias Application
//   - shared/types/recruiter.ts :: Application
//   - types/candidate/matches.ts :: Application (hanya job_id) → digabung ke sini
// ─────────────────────────────────────────────────────────────────────────────

export type { Job, JobWithMatch } from "../jobs";
export type { Interview, InterviewType, InterviewStatus } from "../calendar";

// ── Application Status ────────────────────────────────────────────────────────
export type ApplicationStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "hired"
  | "rejected";

export type Application = {
  id: string;
  job_id?: string;
  job_title: string;
  company_name?: string;
  candidate_name?: string;
  status: ApplicationStatus;
  matching_score?: number | null;
  resume_score?: number | null;
  cv_url?: string | null;
  extracted_skills?: Array<{ name?: string } | string>;
  candidate_email?: string;
  candidate_phone?: string;
  location?: string;
  created_at: string;
};

/** @deprecated Gunakan `Application` */
export type CandidateApplication = Application;

// ── Raw Application dari API ──────────────────────────────────────────────────
export type RawApplication = {
  id: string;
  candidate_name?: string | null;
  job_title?: string | null;
  job_id?: string | null;
  resume_score?: number | null;
  matching_score?: number | null;
  extracted_skills?: Array<string | { name?: string }>;
  status: string;
  created_at?: string;
  cv_url?: string | null;
  candidate_email?: string;
  candidate_phone?: string;
  location?: string;
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

// ── User Profile ──────────────────────────────────────────────────────────────
// Identik dengan CandidateUser di shared/types/candidate.ts
export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

/** @deprecated Gunakan `UserProfile` */
export type CandidateUser = UserProfile;

// ── Insight ───────────────────────────────────────────────────────────────────
export type InsightType = "tip" | "warning" | "success";

export type Insight = {
  type: InsightType;
  text: string;
};
