// @/components/hr/analytics/shared.ts
// Shared theme tokens, color palette, types — dipakai oleh semua komponen analytics

export const T = {
  bg: "#07100a",
  card: "#0b1410",
  cardBorder: "rgba(16,185,129,0.13)",
  cardBorderHover: "rgba(16,185,129,0.32)",
  emerald: "#10b981",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  orange: "#f97316",
  textPrimary: "#e8f5ee",
  textSecondary: "#7a9585",
  textMuted: "rgba(122,149,133,0.55)",
  gridLine: "rgba(16,185,129,0.07)",
  tick: { fill: "#7a9585", fontSize: 10.5, fontWeight: 600 } as const,
} as const;

export const PALETTE = [
  T.emerald,
  T.cyan,
  T.violet,
  T.amber,
  T.rose,
  T.orange,
  "#34d399",
  "#a78bfa",
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  job_id: string;
  job_title?: string;
  candidate_name?: string;
  status: "applied" | "review" | "shortlisted" | "rejected" | "hired";
  resume_score?: number;
  matching_score?: number;
  created_at?: string;
}

export interface Job {
  id: string;
  title?: string;
  is_active?: boolean;
}

export interface AnalyticsData {
  apps: Application[];
  jobs: Job[];
}

// ─── Derived analytics computed server-side ──────────────────────────────────

export function computeStats(apps: Application[], jobs: Job[]) {
  const total = apps.length;
  const shortlisted = apps.filter((a) => a.status === "shortlisted").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;
  const review = apps.filter((a) => a.status === "review").length;
  const applied = apps.filter((a) => a.status === "applied").length;
  const hired = apps.filter((a) => a.status === "hired").length;
  const activeJobs = jobs.filter((j) => j.is_active).length;

  const avgScore = total
    ? Math.round(apps.reduce((s, a) => s + (a.resume_score ?? 0), 0) / total)
    : 0;
  const avgMatch = total
    ? Math.round(apps.reduce((s, a) => s + (a.matching_score ?? 0), 0) / total)
    : 0;
  const conversionRate = total ? Math.round((shortlisted / total) * 100) : 0;

  return {
    total,
    shortlisted,
    rejected,
    review,
    applied,
    hired,
    activeJobs,
    avgScore,
    avgMatch,
    conversionRate,
  };
}
