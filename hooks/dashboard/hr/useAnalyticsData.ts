"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { apiFetch } from "@/app/(role)/dashboard/hr/_components/shared";
import type { Application, Job } from "@/types/hr/analytics";
import { computeStats } from "@/lib/helpers/hr/analytics";

// ── Status narrowing ──────────────────────────────────────────────────────────
const VALID_STATUSES = [
  "applied",
  "review",
  "shortlisted",
  "rejected",
  "hired",
] as const;

type ValidStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(s: unknown): s is ValidStatus {
  return (
    typeof s === "string" && (VALID_STATUSES as readonly string[]).includes(s)
  );
}

function normalizeApplication(raw: unknown): Application | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!isValidStatus(r.status)) return null;

  return {
    id: String(r.id ?? ""),
    job_id: String(r.job_id ?? ""),
    job_title: r.job_title != null ? String(r.job_title) : undefined,
    candidate_name:
      r.candidate_name != null ? String(r.candidate_name) : undefined,
    status: r.status,
    resume_score:
      typeof r.resume_score === "number" ? r.resume_score : undefined,
    matching_score:
      typeof r.matching_score === "number" ? r.matching_score : undefined,
    created_at: r.created_at != null ? String(r.created_at) : undefined,
  };
}

function normalizeJob(raw: unknown): Job | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  return {
    id: String(r.id ?? ""),
    title: r.title != null ? String(r.title) : undefined,
    is_active: typeof r.is_active === "boolean" ? r.is_active : undefined,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAnalyticsData() {
  const { token } = useDashboard();
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiFetch("/api/applications/hr", token),
      apiFetch("/api/jobs/my", token),
    ])
      .then(([appsData, jobsData]) => {
        const rawApps = Array.isArray(appsData) ? appsData : [];
        const rawJobs = Array.isArray(jobsData) ? jobsData : [];

        setApps(
          rawApps
            .map(normalizeApplication)
            .filter((a): a is Application => a !== null),
        );
        setJobs(rawJobs.map(normalizeJob).filter((j): j is Job => j !== null));
      })
      .catch(console.error);
  }, [token]);

  const stats = computeStats(apps, jobs);

  return { apps, jobs, stats };
}
