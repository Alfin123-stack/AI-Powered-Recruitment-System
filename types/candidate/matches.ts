// types/candidate/matches.ts
// ─────────────────────────────────────────────────────────────────────────────
// Job, JobWithMatch & CvAnalysis → canonical di jobs.ts & candidate-dashboard.ts
// Application (hanya job_id) → digabung ke candidate-dashboard.ts::Application
// ─────────────────────────────────────────────────────────────────────────────

export type { Job, JobWithMatch } from "@/types/jobs";
export type { CvAnalysis, Application } from "@/types/candidate/dashboard";
