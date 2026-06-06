export type CvAnalysis = {
  id: string;
  resume_score: number;
  ats_score: number;
  overall_score: number;
  extracted_skills: { name: string; level: number }[];
  categories: { label: string; score: number }[];
  strengths: string[];
  improvements: string[];
  file_name?: string;
  created_at: string;
};

export type ApplicationStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "rejected";

export type Application = {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  status: ApplicationStatus;
  matching_score?: number;
  resume_score?: number;
  created_at: string;
};

export type InterviewType = "online" | "onsite";
export type InterviewStatus = "scheduled" | "done" | "cancelled";

export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: InterviewType;
  location: string;
  notes?: string;
  status: InterviewStatus;
  job_title?: string;
  company_name?: string;
};

export type Job = {
  id: string;
  title: string;
  skills: string[];
  location?: string;
  type?: string;
  salary?: string;
  companies: { name: string; logo_url?: string };
};

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};
