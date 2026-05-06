// app/notifications/candidate/page.tsx
"use client";

import { Briefcase, Target, User } from "lucide-react";
import NotificationsPage from "@/components/NotificationsPage";

export default function CandidateNotificationsPage() {
  return (
    <NotificationsPage
      role="candidate"
      backHref="/dashboard/candidate"
      navItems={[
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
        { href: "/dashboard/candidate/profile", icon: User, label: "Profil" },
      ]}
    />
  );
}
