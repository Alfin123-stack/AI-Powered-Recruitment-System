import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  Target,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import type { NavSection } from "@/types/dashboard";

export const CANDIDATE_SECTIONS: NavSection[] = [
  {
    heading: "Menu",
    items: [
      {
        href: "/dashboard/candidate",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        href: "/dashboard/candidate/applications",
        icon: Briefcase,
        label: "My Applications",
        matchPrefix: true,
      },
      {
        href: "/dashboard/candidate/saved",
        icon: Bookmark,
        label: "Saved",
        matchPrefix: true,
      },
      {
        href: "/dashboard/candidate/matches",
        icon: Target,
        label: "Job Matches",
        matchPrefix: true,
      },
      {
        href: "/dashboard/candidate/calendar",
        icon: Calendar,
        label: "Calendar",
        matchPrefix: true,
      },
    ],
  },
  {
    heading: "Other",
    items: [
      { href: "/jobs", icon: Briefcase, label: "Find Jobs" },
      { href: "/analyze", icon: FileText, label: "Analyze CV" },
    ],
  },
];

export const HR_SECTIONS: NavSection[] = [
  {
    heading: "Menu",
    items: [
      { href: "/dashboard/hr", icon: BarChart3, label: "Dashboard" },
      {
        href: "/dashboard/hr/jobs",
        icon: Briefcase,
        label: "Jobs",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/candidates",
        icon: Users,
        label: "Candidates",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/analytics",
        icon: TrendingUp,
        label: "Analytics",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/interviews",
        icon: BarChart3,
        label: "Interviews",
        matchPrefix: true,
      },
      {
        href: "/dashboard/hr/calendar",
        icon: Calendar,
        label: "Calendar",
        matchPrefix: true,
      },
    ],
  },
];

export const CANDIDATE_TITLES: Record<string, string> = {
  "/dashboard/candidate": "Dashboard",
  "/dashboard/candidate/applications": "My Applications",
  "/dashboard/candidate/saved": "Saved",
  "/dashboard/candidate/matches": "Job Matches",
  "/dashboard/candidate/profile": "Profile",
};

export const HR_TITLES: Record<string, string> = {
  "/dashboard/hr": "HR Dashboard",
  "/dashboard/hr/jobs": "Manage Jobs",
  "/dashboard/hr/candidates": "Candidates",
  "/dashboard/hr/analytics": "Analytics",
  "/dashboard/hr/interviews": "Interviews",
  "/dashboard/hr/calendar": "Calendar",
};