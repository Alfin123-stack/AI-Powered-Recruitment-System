export type Job = {
  id: string;
  title: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  created_at: string;
  companies: { name: string; logo_url: string | null };
};

// components/candidate/matches/types.ts — tambahkan:
export type Application = {
  job_id: string;
};

export type JobWithMatch = Job & {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  alreadyApplied: boolean;
  color: string;
};

export type CvAnalysis = {
  extracted_skills: { name: string; level: number }[];
  resume_score: number;
  ats_score: number;
  overall_score: number;
  file_name?: string;
  created_at: string;
};
