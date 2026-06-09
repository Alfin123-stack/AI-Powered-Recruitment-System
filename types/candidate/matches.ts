// components/candidate/matches/types.ts
// Re-export Job dan CvAnalysis dari source of truth.
// JobWithMatch dan Application didefinisikan di sini karena matches-specific.
export type { Job, CvAnalysis } from "@/types/candidate-dashboard";
import type { Job } from "@/types/candidate-dashboard";

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
