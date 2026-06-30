"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "recruitai_dashboard_tour_seen";

export interface TourStep {
  id: string;
  /** CSS selector for the target element, e.g. '[data-tour="welcome"]' */
  target: string;
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
}

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: '[data-tour="welcome"]',
    title: "Welcome! 👋",
    description:
      "This is your progress summary on RecruitAI — your name, status, and number of applications are shown here.",
    placement: "bottom",
  },
  {
    id: "stats",
    target: '[data-tour="stats"]',
    title: "Track your application progress",
    description:
      "Total applications, shortlisted count, upcoming interviews, and your average CV match score — all in one place.",
    placement: "bottom",
  },
  {
    id: "upload-cv",
    target: '[data-tour="upload-cta"]',
    title: "Start here",
    description:
      "Upload your CV so the system can give you automatic insights and recommend the jobs that fit you best.",
    placement: "left",
  },
  // ── Explanation for each candidate sidebar menu ──
  // Target uses the href selector directly from the sidebar link, so no
  // data-tour attribute needs to be added to Sidebar.tsx.
  {
    id: "nav-dashboard",
    target: 'a[href="/dashboard/candidate"]',
    title: "Dashboard",
    description:
      "Your home page — a summary of your applications, upcoming interviews, and job recommendations in one screen.",
    placement: "right",
  },
  {
    id: "nav-applications",
    target: 'a[href="/dashboard/candidate/applications"]',
    title: "My Applications",
    description:
      "A list of every job you've applied to, along with its current status (in review, shortlisted, rejected, etc).",
    placement: "right",
  },
  {
    id: "nav-saved",
    target: 'a[href="/dashboard/candidate/saved"]',
    title: "Saved",
    description:
      "Jobs you've bookmarked to apply to later, so they don't get lost while browsing many listings.",
    placement: "right",
  },
  {
    id: "nav-matches",
    target: 'a[href="/dashboard/candidate/matches"]',
    title: "Job Matches",
    description:
      "Job recommendations that best match the skills in your CV, ranked by match score.",
    placement: "right",
  },
  {
    id: "nav-calendar",
    target: 'a[href="/dashboard/candidate/calendar"]',
    title: "Calendar",
    description:
      "See all your interview schedules in a calendar view, so nothing slips through the cracks.",
    placement: "right",
  },
  {
    id: "nav-find-jobs",
    target: 'a[href="/jobs"]',
    title: "Find Jobs",
    description:
      "Search and browse all jobs available on RecruitAI, with filters to match what you're looking for.",
    placement: "right",
  },
  {
    id: "nav-analyze-cv",
    target: 'a[href="/analyze"]',
    title: "Analyze CV",
    description:
      "Upload your CV here to get it analyzed automatically — detected skills, strengths, and areas to improve.",
    placement: "right",
  },
];

export function useDashboardTour(steps: TourStep[] = DASHBOARD_TOUR_STEPS) {
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