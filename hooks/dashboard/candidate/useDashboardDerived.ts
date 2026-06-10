"use client";

import { useState, useMemo } from "react";

import type {
  Application,
  CvAnalysis,
  Interview,
  Job,
} from "@/types/candidate-dashboard";
import { calcMatchScore } from "@/lib/helpers/candidate/dashboard";

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

const SCORE_COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export function useDashboardDerived(
  initialApplications: Application[],
  initialCvAnalysis: CvAnalysis | null,
  initialInterviews: Interview[],
  initialJobs: Job[],
) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const { recommendations, avgMatchScore } = useMemo(() => {
    if (!initialCvAnalysis?.extracted_skills) {
      return { recommendations: [], avgMatchScore: 0 };
    }

    const candidateSkills = initialCvAnalysis.extracted_skills.map(
      (s) => s.name,
    );
    const appliedIds = new Set(initialApplications.map((a) => a.job_id));

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

    const recommendations: JobRecommendation[] = initialJobs
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

    return { recommendations, avgMatchScore };
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

  return {
    activeTab,
    setActiveTab,
    recommendations,
    avgMatchScore,
    upcomingInterviews,
    shortlistedCount,
    filteredApplications,
  };
}
