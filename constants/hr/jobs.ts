import { Briefcase, Sparkles, TrendingUp, Users } from "lucide-react";

export const STAT_CONFIGS = [
  {
    key: "totalActive" as const,
    label: "Active Positions",
    col: "#10b981",
    Icon: Briefcase,
  },
  {
    key: "totalApplicants" as const,
    label: "Total Applicants",
    col: "#06b6d4",
    Icon: Users,
  },
  {
    key: "totalShortlisted" as const,
    label: "Shortlisted",
    col: "#f59e0b",
    Icon: Sparkles,
  },
  {
    key: "overallAvgMatch" as const,
    label: "Avg Match Score",
    col: "#8b5cf6",
    Icon: TrendingUp,
    isPercent: true,
  },
];
