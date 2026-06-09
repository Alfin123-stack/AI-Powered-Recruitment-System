// @/components/hr/jobs/types.ts
// Shared types untuk semua komponen Jobs

import type { Job } from "@/app/(role)/dashboard/hr/_components/shared";

// ─────────────────────────────────────────────────────────────────────────────
// JOB WITH STATS — Job enriched dengan data dari applications
// ─────────────────────────────────────────────────────────────────────────────
export interface JobWithStats extends Job {
  applicantCount: number;
  shortlistedCount: number;
  reviewCount: number;
  /** Rata-rata matching_score dari semua pelamar di posisi ini */
  avgMatchScore: number;
  topCandidates: {
    name: string;
    initials: string;
    color: string;
    matchScore: number;
  }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY STATS — Dipakai oleh JobsSummaryStats component
// ─────────────────────────────────────────────────────────────────────────────
export interface JobsSummaryData {
  totalActive: number;
  totalApplicants: number;
  totalShortlisted: number;
  overallAvgMatch: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL DATA — Data dari server (SSR/ISR) yang di-pass ke client component
// ─────────────────────────────────────────────────────────────────────────────
export interface JobsInitialData {
  jobs: Job[];
  /** raw application data dari server, di-map di client */
  applications: RawApplication[];
}

export interface RawApplication {
  id: string;
  candidate_name: string | null;
  job_title: string | null;
  job_id: string | null;
  resume_score: number | null;
  matching_score: number | null;
  status: string;
}
