"use client";

import { useEffect, useState, useCallback } from "react";
import type { TourStep } from "@/hooks/dashboard/candidate/useDashboardTour";

const STORAGE_KEY = "recruitai_dashboard_tour_seen_hr";

// Explanation for each section of the HR dashboard content, followed by
// each item in the HR sidebar (see HR_SECTIONS in constants/dashboardNav.ts).
// Content steps target data-tour attributes added to DashboardClient.tsx;
// nav steps target the href selector directly from the sidebar link, so no
// extra attribute needs to be added to Sidebar.tsx.
export const HR_DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: "hr-welcome",
    target: '[data-tour="hr-welcome"]',
    title: "Welcome! 👋",
    description:
      "This is your HR Dashboard — a live overview of your company's recruitment activity, updated in real time.",
    placement: "bottom",
  },
  {
    id: "hr-stats",
    target: '[data-tour="hr-stats"]',
    title: "Recruitment at a glance",
    description:
      "Active jobs, total candidates, applications, interviews, hires, and rejections — all your key numbers in one row.",
    placement: "bottom",
  },
  {
    id: "hr-ai-insight",
    target: '[data-tour="hr-ai-insight"]',
    title: "AI Talent Intelligence",
    description:
      "Automatic insights from resume analysis and job matching — top score, average score, and conversion rate of your candidates.",
    placement: "bottom",
  },
  {
    id: "hr-analytics",
    target: '[data-tour="hr-analytics"]',
    title: "Analytics",
    description:
      "Pipeline breakdown, candidate trends, and detailed charts to help you understand how your recruitment is performing.",
    placement: "right",
  },
  {
    id: "hr-calendar-sidebar",
    target: '[data-tour="hr-calendar-sidebar"]',
    title: "Interview calendar",
    description:
      "A quick look at upcoming interviews — see today's schedule and what's coming up this month without leaving the dashboard.",
    placement: "left",
  },
  {
    id: "hr-candidate-ranking",
    target: '[data-tour="hr-candidate-ranking"]',
    title: "Candidate ranking",
    description:
      "Candidates grouped by job and ranked by resume score, so you can quickly spot your top applicants for each position.",
    placement: "top",
  },
  // ── Sidebar navigation ──
  {
    id: "hr-nav-dashboard",
    target: 'a[href="/dashboard/hr"]',
    title: "Dashboard",
    description:
      "Your overview — candidate pipeline, upcoming interviews, and recruitment summary in one screen.",
    placement: "right",
  },
  {
    id: "hr-nav-jobs",
    target: 'a[href="/dashboard/hr/jobs"]',
    title: "Jobs",
    description:
      "Manage your job postings — create new openings, edit existing ones, and track how many applicants each job has.",
    placement: "right",
  },
  {
    id: "hr-nav-candidates",
    target: 'a[href="/dashboard/hr/candidates"]',
    title: "Candidates",
    description:
      "Review every candidate who applied — see their CV analysis, match score, and update their application status.",
    placement: "right",
  },
  {
    id: "hr-nav-analytics",
    target: 'a[href="/dashboard/hr/analytics"]',
    title: "Analytics",
    description:
      "Real-time recruitment data — pipeline breakdown, candidate trends, and performance per job posting.",
    placement: "right",
  },
  {
    id: "hr-nav-interviews",
    target: 'a[href="/dashboard/hr/interviews"]',
    title: "Interviews",
    description:
      "Schedule and manage candidate interviews, and see who's shortlisted and ready to be interviewed.",
    placement: "right",
  },
  {
    id: "hr-nav-calendar",
    target: 'a[href="/dashboard/hr/calendar"]',
    title: "Calendar",
    description:
      "View all your interview schedules and HR agenda in an interactive calendar layout.",
    placement: "right",
  },
];

export function useDashboardTourHR(steps: TourStep[] = HR_DASHBOARD_TOUR_STEPS) {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        // small delay to ensure dashboard elements are rendered and have layout
        const t = setTimeout(() => setIsActive(true), 400);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage not available (e.g. SSR/privacy mode) — skip the tour
    } finally {
      setReady(true);
    }
  }, []);

  const finish = useCallback(() => {
    setIsActive(false);
    setStepIndex(0);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  const next = useCallback(() => {
    setStepIndex((i) => {
      if (i >= steps.length - 1) {
        finish();
        return i;
      }
      return i + 1;
    });
  }, [steps.length, finish]);

  const prev = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  /** Call this from a "View tour again" button in Settings/Help */
  const restart = useCallback(() => {
    setStepIndex(0);
    setIsActive(true);
  }, []);

  return {
    isActive: ready && isActive,
    stepIndex,
    currentStep: steps[stepIndex],
    totalSteps: steps.length,
    next,
    prev,
    skip,
    restart,
  };
}