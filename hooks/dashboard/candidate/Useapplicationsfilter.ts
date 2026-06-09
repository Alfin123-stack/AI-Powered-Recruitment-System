"use client";

import { useState } from "react";
import type { Application, Interview } from "@/types/candidate-dashboard";

export function useApplicationsFilter(
  applications: Application[],
  interviews: Interview[],
) {
  const [activeTab, setActiveTab] = useState<"applications" | "interviews">(
    "applications",
  );
  const [appSearch, setAppSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const upcomingInterviews = interviews.filter(
    (iv) => iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date(),
  );

  const filteredApps = applications.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const q = appSearch.toLowerCase();
    return (
      matchStatus &&
      ((a.job_title || "").toLowerCase().includes(q) ||
        (a.company_name || "").toLowerCase().includes(q))
    );
  });

  return {
    activeTab,
    setActiveTab,
    appSearch,
    setAppSearch,
    filter,
    setFilter,
    selectedApp,
    setSelectedApp,
    upcomingInterviews,
    filteredApps,
  };
}
