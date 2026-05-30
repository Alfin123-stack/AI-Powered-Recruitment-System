// ─── ANALYZE TYPES ────────────────────────────────────────────────────────────

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
