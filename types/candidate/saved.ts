// types/candidate/saved.ts
// InsightType & Insight → canonical di types/candidate-dashboard.ts

export type { InsightType, Insight } from "@/types/candidate/dashboard";

export type SavedJob = {
  saved_id: string;
  saved_at: string;
  id: string;
  title: string;
  salary: string | null;
  location: string | null;
  type: string | null;
  skills: string[];
  deadline: string | null;
  created_at: string;
  resume_score?: number;
  matching_score?: number;
  companies: {
    name: string;
    logo_url: string | null;
    company_size: string | null;
  };
  color: string;
};

export type SavedJobRaw = Omit<SavedJob, "color">;

export type SortOption = "saved_at" | "deadline" | "matching_score" | "title";

export type FilterValue = "all" | "active" | "expiring" | "expired";