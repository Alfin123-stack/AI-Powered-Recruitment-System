import { Briefcase, Calendar, Target, User, Users } from "lucide-react";
import type { NavItem } from "../types/notifications";

// ─── Per-role navigation config ───────────────────────────────────────────────
// Defined server-side so it can be imported by the Server Component page
// without bundling into the client JS.

export const ROLE_CONFIG: Record<
  "hr" | "candidate",
  { backHref: string; navItems: NavItem[] }
> = {
  candidate: {
    backHref: "/dashboard/candidate",
    navItems: [
      {
        href: "/dashboard/candidate/applications",
        icon: Briefcase,
        label: "Lamaranku",
      },
      {
        href: "/dashboard/candidate/matches",
        icon: Target,
        label: "Job Matches",
      },
      {
        href: "/dashboard/candidate/profile",
        icon: User,
        label: "Profil",
      },
    ],
  },
  hr: {
    backHref: "/dashboard/hr",
    navItems: [
      { href: "/dashboard/hr/jobs", icon: Briefcase, label: "Jobs" },
      { href: "/dashboard/hr/candidates", icon: Users, label: "Kandidat" },
      {
        href: "/dashboard/hr/interviews",
        icon: Calendar,
        label: "Interview",
      },
    ],
  },
};
