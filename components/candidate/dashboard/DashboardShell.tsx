"use client";

// app/dashboard/candidate/_components/DashboardShell.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CLIENT COMPONENT — orchestrator utama dashboard kandidat.
// Menerima initial data dari Server Component (page.tsx) via props,
// lalu mendistribusikan ke setiap section component.
// Mengelola state shared: activeTab untuk ApplicationList.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useState, useMemo } from "react";

import { WelcomeBanner } from "./WelcomeBanner";
import { StatsGrid } from "./StatsGrid";
import { AiInsightCard } from "./AiInsightCard";
import { ApplicationFunnel } from "./ApplicationFunnel";
import { ApplicationList } from "./ApplicationList";
import { MiniCalendar } from "./MiniCalendar";
import { RecommendationsPanel } from "./RecommendationsPanel";
import { UploadCtaCard } from "./RecommendationsPanel";
import { calcMatchScore } from "./helpers";

export type CvAnalysis = {
  id: string;
  resume_score: number;
  ats_score: number;
  overall_score: number;
  extracted_skills: { name: string; level: number }[];
  categories: { label: string; score: number }[];
  strengths: string[];
  improvements: string[];
  file_name?: string;
  created_at: string;
};

export type Application = {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  status: "applied" | "review" | "shortlisted" | "rejected";
  matching_score?: number;
  resume_score?: number;
  created_at: string;
};

export type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  type: "online" | "onsite";
  location: string;
  notes?: string;
  status: "scheduled" | "done" | "cancelled";
  job_title?: string;
  company_name?: string;
};

export type Job = {
  id: string;
  title: string;
  skills: string[];
  location?: string;
  type?: string;
  salary?: string;
  companies: { name: string; logo_url?: string };
};

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};
// ── Warna untuk rekomendasi ───────────────────────────────────────────────────
const SCORE_COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export type JobRecommendation = {
  id: string;
  title: string;
  company: string;
  match: number;
  color: string;
  location?: string;
  type?: string;
  salary?: string;
  skills: string[];
};

interface DashboardShellProps {
  initialApplications: Application[];
  initialCvAnalysis: CvAnalysis | null;
  initialInterviews: Interview[];
  initialJobs: Job[];
  user: UserProfile | null;
  // Fallback skeletons dikirim dari server (sudah diimport di page.tsx)
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
  const [activeTab, setActiveTab] = useState<string>("all");

  // ── Derived data (memoized) ───────────────────────────────────────────────
  const { recommendations, avgMatchScore } = useMemo(() => {
    if (!initialCvAnalysis?.extracted_skills) {
      return { recommendations: [], avgMatchScore: 0 };
    }

    const candidateSkills = initialCvAnalysis.extracted_skills.map(
      (s) => s.name,
    );
    const appliedIds = new Set(initialApplications.map((a) => a.job_id));

    // Avg match score untuk jobs yang sudah dilamar
    const appliedJobs = initialJobs.filter((j) => appliedIds.has(j.id));
    let avgMatchScore = 0;
    if (appliedJobs.length > 0) {
      const scores = appliedJobs.map(
        (j) => calcMatchScore(candidateSkills, j.skills || []).score,
      );
      avgMatchScore = Math.round(
        scores.reduce((s, v) => s + v, 0) / scores.length,
      );
    }

    // Rekomendasi: jobs yang belum dilamar, sorted by match, max 3
    const recs: JobRecommendation[] = initialJobs
      .filter((j) => !appliedIds.has(j.id))
      .map((j, i) => ({
        id: j.id,
        title: j.title,
        company: j.companies?.name ?? "",
        match: calcMatchScore(candidateSkills, j.skills || []).score,
        color: SCORE_COLORS[i % SCORE_COLORS.length],
        location: j.location,
        type: j.type,
        salary: j.salary,
        skills: j.skills || [],
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);

    return { recommendations: recs, avgMatchScore };
  }, [initialCvAnalysis, initialApplications, initialJobs]);

  const upcomingInterviews = useMemo(
    () =>
      initialInterviews.filter(
        (i) =>
          i.status === "scheduled" && new Date(i.scheduled_at) > new Date(),
      ),
    [initialInterviews],
  );

  const shortlistedCount = useMemo(
    () => initialApplications.filter((a) => a.status === "shortlisted").length,
    [initialApplications],
  );

  const filteredApplications = useMemo(
    () =>
      activeTab === "all"
        ? initialApplications
        : initialApplications.filter((a) => a.status === activeTab),
    [activeTab, initialApplications],
  );

  return (
    <div>
      {/* Welcome Banner — CSR karena greeting berbasis waktu */}
      <Suspense fallback={welcomeBannerFallback}>
        <WelcomeBanner
          user={user}
          shortlistedCount={shortlistedCount}
          upcomingInterviewCount={upcomingInterviews.length}
        />
      </Suspense>

      {/* Stats Grid — CSR dengan animated counter */}
      <Suspense fallback={statsFallback}>
        <StatsGrid
          totalApplications={initialApplications.length}
          shortlistedCount={shortlistedCount}
          upcomingInterviewCount={upcomingInterviews.length}
          avgMatchScore={avgMatchScore}
          hasCv={!!initialCvAnalysis}
        />
      </Suspense>

      {/* AI CV Analysis Card */}
      <Suspense fallback={cvFallback}>
        <AiInsightCard cv={initialCvAnalysis} />
      </Suspense>

      {/* 2-col layout */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 310px" }}>
        {/* LEFT: Funnel + Application List */}
        <div>
          <Suspense fallback={funnelFallback}>
            {initialApplications.length > 0 && (
              <ApplicationFunnel applications={initialApplications} />
            )}
          </Suspense>

          <Suspense fallback={appListFallback}>
            <ApplicationList
              applications={initialApplications}
              filteredApplications={filteredApplications}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </Suspense>
        </div>

        {/* RIGHT: Calendar + Recs + Upload CTA */}
        <div>
          <Suspense fallback={calendarFallback}>
            <MiniCalendar interviews={initialInterviews} />
          </Suspense>

          <Suspense fallback={recsFallback}>
            <RecommendationsPanel
              recommendations={recommendations}
              hasCv={!!initialCvAnalysis}
            />
          </Suspense>

          <UploadCtaCard hasCv={!!initialCvAnalysis} />
        </div>
      </div>
    </div>
  );
}
