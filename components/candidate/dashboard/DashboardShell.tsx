"use client";

import { Suspense } from "react";
import type {
  Application,
  CvAnalysis,
  Interview,
  Job,
  UserProfile,
} from "@/types/candidate-dashboard";

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
  welcomeBannerFallback: React.ReactNode;
  statsFallback: React.ReactNode;
  cvFallback: React.ReactNode;
  funnelFallback: React.ReactNode;
  appListFallback: React.ReactNode;
  calendarFallback: React.ReactNode;
  recsFallback: React.ReactNode;
}

export function DashboardShell({
  initialApplications,
  initialCvAnalysis,
  initialInterviews,
  initialJobs,
  user,
  welcomeBannerFallback,
  statsFallback,
  cvFallback,
  funnelFallback,
  appListFallback,
  calendarFallback,
  recsFallback,
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
      <Suspense fallback={welcomeBannerFallback}>
        <DashboardWelcome
          user={user}
          shortlistedCount={shortlistedCount}
          upcomingInterviewCount={upcomingInterviews.length}
        />
      </Suspense>

      <Suspense fallback={statsFallback}>
        <DashboardStatsGrid
          totalApplications={initialApplications.length}
          shortlistedCount={shortlistedCount}
          upcomingInterviewCount={upcomingInterviews.length}
          avgMatchScore={avgMatchScore}
          hasCv={!!initialCvAnalysis}
        />
      </Suspense>

      <Suspense fallback={cvFallback}>
        <DashboardAIInsight cv={initialCvAnalysis} />
      </Suspense>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 310px" }}>
        <div>
          <Suspense fallback={funnelFallback}>
            {initialApplications.length > 0 && (
              <DashboardAppFunnel applications={initialApplications} />
            )}
          </Suspense>

          <Suspense fallback={appListFallback}>
            <DashboardAppList
              applications={initialApplications}
              filteredApplications={filteredApplications}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={calendarFallback}>
            <DashboardCalendar interviews={initialInterviews} />
          </Suspense>

          <Suspense fallback={recsFallback}>
            <DashboardRecommendations
              recommendations={recommendations}
              hasCv={!!initialCvAnalysis}
            />
          </Suspense>

          <DashboardUploadCTA hasCv={!!initialCvAnalysis} />
        </div>
      </div>
    </div>
  );
}
