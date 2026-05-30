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

export type JobSummary = {
  title: string;
  applicants: number;
  shortlisted: number;
  color: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  benefits: string[];
  deadline: string | null;
  is_active: boolean;
  created_at: string;
};

export type JobForm = {
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  type: string;
  skills: string;
  benefits: string;
  deadline: string;
};

export type Company = {
  id: string;
  name: string;
  description: string;
  company_size: string;
  logo_url: string | null;
  openJobs: number;
  location: string;
  tags: string[];
  color: string;
  verified?: boolean;
  website?: string;
};
