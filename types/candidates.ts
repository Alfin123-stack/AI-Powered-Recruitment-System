import type { Candidate } from "@/app/(role)/dashboard/hr/_components/shared";

export type SortKey = "score" | "match" | "name" | "date" | "applied_role";
export type SortDir = "asc" | "desc";
export type StatusFilter =
  | "all"
  | "applied"
  | "review"
  | "shortlisted"
  | "rejected";
export type CandidateStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "rejected"
  | "hired";
export type DateFilter =
  | "Last 7 days"
  | "Last 30 days"
  | "Last 90 days"
  | "All time";

export interface JobMeta {
  key: string;
  label: string;
  color: string;
  count: number;
  todayCount: number;
}

export interface ApplicationRaw {
  id: string;
  candidate_name?: string;
  job_title?: string;
  job_id?: string;
  resume_score?: number;
  matching_score?: number;
  extracted_skills?: Array<{ name?: string } | string>;
  status: CandidateStatus;
  created_at: string;
  cv_url?: string;
  candidate_email?: string;
  candidate_phone?: string;
  location?: string;
}

export interface CandidateExtended extends Candidate {
  created_at: string;
  email: string;
  phone: string;
  location: string;
}


