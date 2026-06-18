export type Candidate = {
  id: string;
  name: string;
  avatar: string;
  job: string;
  jobId: string;
  resumeScore: number;
  matchScore: number;
  skills: string[];
  status: string;
  appliedDate: string;
  color: string;
  cv_url: string | null;
};

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

export interface CandidateRaw extends Candidate {
  created_at: string;
  email: string;
  phone: string;
  location: string;
}
