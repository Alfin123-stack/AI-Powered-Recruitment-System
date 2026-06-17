"use client";

import type {
  Application,
  CvAnalysis,
  Interview,
  Job,
  UserProfile,
} from "@/types/candidate/dashboard";

import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { DashboardAIInsight } from "./DashboardAIInsight";
import { DashboardAppFunnel } from "./DashboardAppFunnel";
import { DashboardAppList } from "./DashboardAppList";
import { DashboardCalendar } from "./DashboardCalendar";
import {
  DashboardRecommendations,
  DashboardUploadCTA,
} from "./DashboardRecommendations";
import { useDashboardDerived } from "@/hooks/dashboard/candidate/useDashboardDerived";

interface DashboardShellProps {
  initialApplications: Application[];
  initialCvAnalysis: CvAnalysis | null;
  initialInterviews: Interview[];
  initialJobs: Job[];
  user: UserProfile | null;
}

export function DashboardShell({
  initialApplications,
  initialCvAnalysis,
  initialInterviews,
  initialJobs,
  user,
}: DashboardShellProps) {
  const {
    activeTab,
    setActiveTab,
    recommendations,
    avgMatchScore,
    upcomingInterviews,
    shortlistedCount,
    filteredApplications,
  } = useDashboardDerived(
    initialApplications,
    initialCvAnalysis,
    initialInterviews,
    initialJobs,
  );

  return (
    <div>
      <DashboardWelcome
        user={user}
        shortlistedCount={shortlistedCount}
        upcomingInterviewCount={upcomingInterviews.length}
      />

      <DashboardStatsGrid
        totalApplications={initialApplications.length}
        shortlistedCount={shortlistedCount}
        upcomingInterviewCount={upcomingInterviews.length}
        avgMatchScore={avgMatchScore}
        hasCv={!!initialCvAnalysis}
      />

      <DashboardAIInsight cv={initialCvAnalysis} />

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 310px" }}>
        <div>
          {initialApplications.length > 0 && (
            <DashboardAppFunnel applications={initialApplications} />
          )}

          <DashboardAppList
            applications={initialApplications}
            filteredApplications={filteredApplications}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div>
          <DashboardCalendar interviews={initialInterviews} />

          <DashboardRecommendations
            recommendations={recommendations}
            hasCv={!!initialCvAnalysis}
          />

          <DashboardUploadCTA hasCv={!!initialCvAnalysis} />
        </div>
      </div>
    </div>
  );
}
