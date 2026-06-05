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
        label: "Lamaranku",
        matchPrefix: true,
      },
      {
        href: "/dashboard/candidate/saved",
        icon: Bookmark,
        label: "Tersimpan",
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
    heading: "Lainnya",
    items: [
      { href: "/jobs", icon: Briefcase, label: "Cari Lowongan" },
      { href: "/analyze", icon: FileText, label: "Analisis CV" },
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
  "/dashboard/candidate/applications": "Lamaranku",
  "/dashboard/candidate/saved": "Tersimpan",
  "/dashboard/candidate/matches": "Job Matches",
  "/dashboard/candidate/profile": "Profil",
};

export const HR_TITLES: Record<string, string> = {
  "/dashboard/hr": "HR Dashboard",
  "/dashboard/hr/jobs": "Kelola Lowongan",
  "/dashboard/hr/candidates": "Candidates",
  "/dashboard/hr/analytics": "Analytics",
  "/dashboard/hr/interviews": "Interviews",
  "/dashboard/hr/calendar": "Calendar",
};
