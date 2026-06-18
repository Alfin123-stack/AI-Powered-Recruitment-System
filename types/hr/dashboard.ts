export type { Job } from "../jobs";
export type { Interview, InterviewType, InterviewStatus } from "../calendar";
export type {
  Application,
  ApplicationStatus,
  RawApplication,
} from "../candidate/dashboard";
export type { Company as CompanyInfo } from "../main/company";

export type CandidateUI = {
  id: string;
  name: string;
  avatar: string;
  job: string;
  jobId?: string;
  jobName?: string;
  resumeScore: number;
  matchScore: number;
  skills: string[];
  status: string;
  appliedDate: string;
  createdAt: string;
  color: string;
  cv_url: string | null;
};

// ── Job Summary ───────────────────────────────────────────────────────────────
export type JobSummary = {
  title: string;
  applicants: number;
  shortlisted: number;
  color: string;
};

// ── Job Group ─────────────────────────────────────────────────────────────────
export type JobGroup = {
  title: string;
  color: string;
  candidates: CandidateUI[];
  allCandidates: CandidateUI[];
  shortlisted: number;
  avgScore: number;
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export type DashboardStats = {
  total: number;
  shortlisted: number;
  inReview: number;
  totalInterviews: number;
  totalHired: number;
  totalRejected: number;
  uniqueJobs: string[];
};

import { COMPANY_SIZES, INDUSTRIES } from "@/constants/hr/dashboard";
// ── Fetch Result ──────────────────────────────────────────────────────────────
import type { Company } from "../main/company";

export type FetchDashboardResult = {
  candidates: CandidateUI[];
  interviews: import("../calendar").Interview[];
  company: Company | null;
};

// ── UI Component Types ────────────────────────────────────────────────────────
export type ActionButton = {
  onClick: () => void;
  title: string;
  Icon: React.ComponentType<{ size?: number }>;
  color: string;
  bg: string;
  border: string;
  disabled: boolean;
};

export type ScoreItem = {
  label: string;
  val: number;
  suffix: string;
};

export type InsightPanel = {
  title: string;
  items: string[];
  color: string;
  bg: string;
  border: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
};

export type StatusAction = {
  label: string;
  status: string;
  Icon: React.ComponentType<{ size?: number }>;
  color: string;
  bg: string;
  border: string;
};

export type GroupMetric = {
  label: string;
  val: number;
  color: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type CandidateInsight = {
  strengths: string[];
  weaknesses: string[];
};

export type LegendItem = {
  dot: string;
  label: string;
};

export type CompanySize = (typeof COMPANY_SIZES)[number];

export type Industry = (typeof INDUSTRIES)[number] | "";

export type CompanyForm = {
  name: string;
  description: string;
  company_size: CompanySize | "";
  industry: Industry;
};
