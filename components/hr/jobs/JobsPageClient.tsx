// @/components/hr/jobs/JobsPageClient.tsx
// CSR — orchestrator: state management, search, delete, modal trigger
// Menerima initialData dari Server Component (SSR/ISR) via props
// Dynamic import JobFormModal agar tidak masuk bundle awal

"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { Plus, Briefcase, Search, X } from "lucide-react";
import {
  apiFetch,
  getColor,
  getInitials,
  FadeIn,
  type Job,
  type Candidate,
} from "@/app/(role)/dashboard/hr/_components/shared";
import { JobCard } from "./JobCard";
import { JobsSummaryStats } from "./JobsSummaryStats";
import { JobFormSkeleton } from "./JobsSkeleton";
import type { JobWithStats, JobsSummaryData, RawApplication } from "./types";
import { useDashboard } from "@/context/DashboardContext";

// ─── Lazy load modal — berat, hanya diload saat user klik "Post job" ──────────
const JobFormModal = dynamic(
  () => import("./JobFormModal").then((m) => ({ default: m.JobFormModal })),
  {
    loading: () => <JobFormSkeleton />,
    ssr: false, // modal pure client, tidak perlu SSR
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — enrich jobs dengan stats dari candidates
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────
interface JobsPageClientProps {
  initialJobs: Job[];
  initialApplications: RawApplication[];
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function JobsPageClient({
  initialJobs,
  initialApplications,
}: JobsPageClientProps) {
  const { token } = useDashboard();

  // ── State ──────────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    mapApplicationsToCandidates(initialApplications),
  );
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // ── Refetch setelah mutasi (create/edit/delete) ────────────────────────────
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
      console.error("[JobsPageClient] refetch error:", err);
    }
  }, [token]);

  // ── Delete / close job ─────────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Tutup lowongan ini?")) return;
      setDeletingId(id);
      try {
        await apiFetch(`/api/jobs/${id}`, token, { method: "DELETE" });
        // Optimistic update — set is_active false tanpa refetch
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, is_active: false } : j)),
        );
      } catch (err) {
        console.error("[JobsPageClient] delete error:", err);
      } finally {
        setDeletingId(null);
      }
    },
    [token],
  );

  // ── Modal handlers ─────────────────────────────────────────────────────────
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

  // ── Derived data (memoized) ────────────────────────────────────────────────
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

  const summaryData = useMemo<JobsSummaryData>(() => {
    const totalActive = jobs.filter((j) => j.is_active).length;
    const totalApplicants = candidates.length;
    const totalShortlisted = candidates.filter(
      (c) => c.status === "shortlisted",
    ).length;
    const overallAvgMatch =
      candidates.length > 0
        ? Math.round(
            candidates.reduce((s, c) => s + (c.matchScore ?? 0), 0) /
              candidates.length,
          )
        : 0;
    return { totalActive, totalApplicants, totalShortlisted, overallAvgMatch };
  }, [jobs, candidates]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Modal (lazy loaded, hanya di-mount saat showModal=true) ── */}
      <AnimatePresence>
        {showModal && (
          <JobFormModal
            token={token}
            editJob={editJob}
            onDone={handleModalDone}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>

      <FadeIn>
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Briefcase size={15} />
            </div>
            <div>
              <h1 className="font-bold text-[1rem] text-[#e8f0ec]">Jobs</h1>
              <p className="text-[0.72rem] text-[#7a9585] mt-[1px]">
                {jobs.length} lowongan · {summaryData.totalActive} aktif ·{" "}
                {summaryData.totalApplicants} total pelamar
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-[7px] bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.82rem] px-4 py-[9px] rounded-[9px] transition-all cursor-pointer shadow-[0_0_16px_rgba(16,185,129,0.2)]">
            <Plus size={14} /> Post a new job
          </button>
        </div>

        {/* ── Summary Stats (hanya muncul kalau ada data) ── */}
        {jobs.length > 0 && <JobsSummaryStats data={summaryData} />}

        {/* ── Search Bar ── */}
        {jobs.length > 0 && (
          <div className="relative mb-5 max-w-[280px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d5a45] pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari lowongan, lokasi, skill..."
              className="bg-[#0a100c] border border-emerald-500/15 rounded-[8px] pl-8 pr-8 py-[8px] text-[0.8rem] text-[#e8f0ec] placeholder:text-[#2d4a38] focus:outline-none focus:border-emerald-500/35 transition-all w-full"
            />
            {search && (
              <button
                title="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d5a45] hover:text-[#7a9585]">
                <X size={11} />
              </button>
            )}
          </div>
        )}

        {/* ── Grid atau Empty State ── */}
        {filteredJobs.length === 0 ? (
          <div className="bg-[#0f1612] border border-dashed border-emerald-500/20 rounded-[14px] py-16 text-center">
            <div className="text-[2.5rem] mb-3 opacity-30">📋</div>
            <div className="font-bold text-[1rem] mb-2 text-[#e8f0ec]">
              {search ? "Tidak ada hasil" : "Belum ada lowongan"}
            </div>
            <p className="text-[#7a9585] text-[0.82rem] mb-5">
              {search
                ? `Tidak ditemukan lowongan untuk "${search}"`
                : "Buat lowongan pertama untuk mulai menerima pelamar."}
            </p>
            {!search && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-[10px] rounded-[9px] text-[0.82rem] transition-all cursor-pointer">
                <Plus size={14} /> Buat Lowongan Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                index={i}
                onEdit={() => openEdit(job)}
                onDelete={() => handleDelete(job.id)}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </FadeIn>
    </>
  );
}
