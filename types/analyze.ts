export type ScoreTier = "high" | "mid" | "low";

export type Skill = { name: string; level: number };
export type Category = { label: string; score: number; feedback?: string };
export type ATSCheck = { label: string; ok: boolean; tip?: string };
export type LineFeedback = {
  section: string;
  line: string;
  type: "good" | "warn" | "bad";
  tip: string;
};
export type WritingSuggestion = {
  section: string;
  original: string;
  improved: string;
  reason: string;
};

export type AnalysisData = {
  resumeScore: number;
  atsScore: number;
  overallScore: number;
  readabilityScore?: number;
  impactScore?: number;
  skills: Skill[];
  categories: Category[];
  strengths: string[];
  improvements: string[];
  atsChecks?: ATSCheck[];
  lineFeedback?: LineFeedback[];
  writingSuggestions?: WritingSuggestion[];
  aiSummary?: string;
  jobTitle?: string;
  experienceLevel?: string;
  fileName?: string;
  created_at?: string;
  isFromDB?: boolean;
};

export type Tab = "overview" | "ats" | "feedback" | "writing";

export type AnalysisApiResponse = {
  resume_score: number;
  ats_score: number;
  overall_score: number;
  readability_score?: number | null;
  impact_score?: number | null;
  extracted_skills?: Skill[];
  categories?: Category[];
  strengths?: string[];
  improvements?: string[];
  ats_checks?: ATSCheck[];
  line_feedback?: LineFeedback[];
  writing_suggestions?: WritingSuggestion[];
  ai_summary?: string | null;
  job_title?: string | null;
  experience_level?: string | null;
  file_name: string;
  created_at?: string;
};

// ─── Raw shape dari API /ai/analyze (camelCase) ───────────────────────────────
export type AnalyzeApiResult = {
  resumeScore: number;
  atsScore: number;
  overallScore: number;
  readabilityScore?: number | null;
  impactScore?: number | null;
  skills?: Skill[];
  categories?: Category[];
  strengths?: string[];
  improvements?: string[];
  atsChecks?: ATSCheck[];
  lineFeedback?: LineFeedback[];
  writingSuggestions?: WritingSuggestion[];
  aiSummary?: string | null;
  jobTitle?: string | null;
  experienceLevel?: string | null;
};
