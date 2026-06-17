// types/hr/analytics.ts
// Application & Job → canonical di candidate-dashboard.ts & jobs.ts

export type { Application } from "../candidate/dashboard";
export type { Job } from "../jobs";

export interface AnalyticsData {
  apps: import("../candidate/dashboard").Application[];
  jobs: import("../jobs").Job[];
}
