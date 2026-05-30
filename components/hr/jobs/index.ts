// @/components/hr/jobs/index.ts
// Barrel exports — import semua dari satu titik

export { JobsPageClient } from "./JobsPageClient";
export { JobsServerFetcher } from "./JobsServerFetcher";
export { JobCard } from "./JobCard";
export { JobFormModal } from "./JobFormModal";
export { JobsSummaryStats } from "./JobsSummaryStats";
export { JobsPageSkeleton, JobFormSkeleton } from "./JobsSkeleton";
export type {
  JobWithStats,
  JobsSummaryData,
  JobsInitialData,
  RawApplication,
} from "./types";
