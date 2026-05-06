// app/notifications/hr/page.tsx
"use client";

import { Briefcase, Users, Calendar } from "lucide-react";
import NotificationsPage from "@/components/NotificationsPage";

export default function HRNotificationsPage() {
  return (
    <NotificationsPage
      role="hr"
      backHref="/dashboard/hr/overview"
      navItems={[
        { href: "/dashboard/hr/jobs", icon: Briefcase, label: "Jobs" },
        { href: "/dashboard/hr/candidates", icon: Users, label: "Kandidat" },
        {
          href: "/dashboard/hr/interviews",
          icon: Calendar,
          label: "Interview",
        },
      ]}
    />
  );
}
