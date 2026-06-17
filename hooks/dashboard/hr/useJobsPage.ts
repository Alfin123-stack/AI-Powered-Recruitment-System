"use client";

import { useDashboard } from "@/context/DashboardContext";
import { apiFetch } from "@/lib/api";
import { getColor, getInitials } from "@/lib/utils";
import { Candidate } from "@/types/candidates";
import { Job, RawApplication } from "@/types/hr/dashboard";
import { JobsSummaryData, JobWithStats } from "@/types/jobs";
import { useState, useCallback, useMemo } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildJobsWithStats(
  jobs: Job[],
  candidates: Candidate[],
): JobWithStats[] {
  return jobs.map((job) => {
    const jobCandidates = candidates.filter((c) => c.job === job.title);
    const avgMatchScore =
      jobCandidates.length > 0
        ? Math.round(
            jobCandidates.reduce((sum, c) => sum + (c.matchScore ?? 0), 0) /
              jobCandidates.length,
          )
        : 0;
    const sortedByMatch = [...jobCandidates].sort(
      (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0),
    );
    return {
      ...job,
      applicantCount: jobCandidates.length,
      shortlistedCount: jobCandidates.filter((c) => c.status === "shortlisted")
        .length,
      reviewCount: jobCandidates.filter((c) => c.status === "review").length,
      avgMatchScore,
      topCandidates: sortedByMatch.slice(0, 6).map((c) => ({
        name: c.name,
        initials: c.avatar,
        color: c.color,
        matchScore: c.matchScore ?? 0,
      })),
    };
  });
}

function mapApplicationsToCandidates(apps: RawApplication[]): Candidate[] {
  return apps.map((a, i) => ({
    id: a.id,
    name: a.candidate_name || "Kandidat",
    avatar: getInitials(a.candidate_name || "KD"),
    job: a.job_title || "-",
    jobId: a.job_id ?? "",
    resumeScore: a.resume_score ?? 0,
    matchScore: a.matching_score ?? 0,
    skills: [],
    status: a.status,
    appliedDate: "",
    color: getColor(i),
    cv_url: null,
  }));
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useJobsPage(
  initialJobs: Job[],
  initialApplications: RawApplication[],
) {
  const { token } = useDashboard();

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    mapApplicationsToCandidates(initialApplications),
  );
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const refetch = useCallback(async () => {
    if (!token) return;
    try {
      const [jobData, appData] = await Promise.all([
        apiFetch("/api/jobs/my", token),
        apiFetch("/api/applications/hr", token).catch(() => []),
      ]);
      setJobs(jobData);
      setCandidates(mapApplicationsToCandidates(appData || []));
    } catch (err) {
      console.error("[useJobsPage] refetch error:", err);
    }
  }, [token]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Tutup lowongan ini?")) return;
      setDeletingId(id);
      try {
        await apiFetch(`/api/jobs/${id}`, token, { method: "DELETE" });
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, is_active: false } : j)),
        );
      } catch (err) {
        console.error("[useJobsPage] delete error:", err);
      } finally {
        setDeletingId(null);
      }
    },
    [token],
  );

  const openCreate = useCallback(() => {
    setEditJob(null);
    setShowModal(true);
  }, []);
  const openEdit = useCallback((job: Job) => {
    setEditJob(job);
    setShowModal(true);
  }, []);
  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditJob(null);
  }, []);
  const handleModalDone = useCallback(() => {
    closeModal();
    refetch();
  }, [closeModal, refetch]);

  const jobsWithStats = useMemo(
    () => buildJobsWithStats(jobs, candidates),
    [jobs, candidates],
  );

  const filteredJobs = useMemo(() => {
    if (!search) return jobsWithStats;
    const q = search.toLowerCase();
    return jobsWithStats.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        (job.location || "").toLowerCase().includes(q) ||
        (job.skills || []).some((s) => s.toLowerCase().includes(q)),
    );
  }, [jobsWithStats, search]);

  const summaryData = useMemo<JobsSummaryData>(
    () => ({
      totalActive: jobs.filter((j) => j.is_active).length,
      totalApplicants: candidates.length,
      totalShortlisted: candidates.filter((c) => c.status === "shortlisted")
        .length,
      overallAvgMatch:
        candidates.length > 0
          ? Math.round(
              candidates.reduce((s, c) => s + (c.matchScore ?? 0), 0) /
                candidates.length,
            )
          : 0,
    }),
    [jobs, candidates],
  );

  return {
    token,
    jobs,
    showModal,
    editJob,
    deletingId,
    search,
    setSearch,
    refetch,
    handleDelete,
    openCreate,
    openEdit,
    closeModal,
    handleModalDone,
    filteredJobs,
    summaryData,
  };
}
