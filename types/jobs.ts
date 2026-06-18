export type Job = {
  id: string;
  title: string;
  description?: string | null;
  requirements?: string | null;
  salary?: string | null;
  location?: string | null;
  type?: string | null;
  skills?: string[] | null;
  benefits?: string[] | null;
  deadline?: string | null;
  created_at?: string;
  is_active?: boolean;
  company_id?: string;
  companies?: {
    id?: string;
    name: string | null;
    description?: string | null;
    company_size?: string | null;
    logo_url?: string | null;
  } | null;
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

export type JobWithMatch = Job & {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  alreadyApplied: boolean;
  color: string;
};

export type JobWithStats = Job & {
  applicantCount: number;
  shortlistedCount: number;
  reviewCount: number;
  avgMatchScore: number;
  topCandidates: {
    name: string;
    initials: string;
    color: string;
    matchScore: number;
  }[];
};

export type JobsSummaryData = {
  totalActive: number;
  totalApplicants: number;
  totalShortlisted: number;
  overallAvgMatch: number;
};
