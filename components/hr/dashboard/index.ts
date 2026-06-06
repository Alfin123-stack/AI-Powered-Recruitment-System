// ─────────────────────────────────────────────────────────────────────────────
// BARREL EXPORT — @/components/hr/dashboard
// Gunakan import dari sini untuk konsistensi path
// ─────────────────────────────────────────────────────────────────────────────

export { HRDashboardClient } from "./HRDashboardClient";
export { StatCards } from "./StatCards";
export { AIInsightPanel } from "./AIInsightPanel";
export { AnalyticsSection } from "./AnalyticsSection";
export { DashboardSidebar } from "./Sidebar";
export { CandidateRanking } from "./CandidateRanking";

export {
  HRDashboardSkeleton,
  StatCardsSkeleton,
  AIInsightPanelSkeleton,
  AnalyticsSectionSkeleton,
  CandidateRankingSkeleton,
  SkeletonPulse,
} from "./DashboardSkeleton";

export type {
  Interview,
  CandidateExtended,
  JobGroup,
  CandidateInsight,
  DashboardStats,
  CompanyInfo,
} from "@/types/hr-dashboard";

export {
  getScoreColor,
  getScoreGradient,
  getRec,
  computeInsight,
  generateInsights,
  isToday,
  isTomorrow,
  formatInterviewTime,
  formatInterviewDate,
  getColor,
  getInitials,
  statusMap,
  JOB_COLORS,
  roundConfig,
} from "./helpers";
