import { Application, Job } from "@/types/hr/analytics";

// ─── Derived analytics computed server-side ──────────────────────────────────

export function analyticStats(apps: Application[], jobs: Job[]) {
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
