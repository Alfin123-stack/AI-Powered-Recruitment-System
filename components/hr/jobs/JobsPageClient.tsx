// @/components/hr/jobs/JobsPageClient.tsx
"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { Plus, Briefcase, Search, X } from "lucide-react";
import { JobsCard } from "./JobsCard";
import { JobsSummaryStats } from "./JobsSummaryStats";
import { JobFormSkeleton } from "./JobsSkeleton";
import { useJobsPage } from "@/hooks/dashboard/hr/useJobsPage";
import { Job, RawApplication } from "@/types/hr/dashboard";
import { FadeIn } from "@/components/shared/FadeIn";

const JobFormModal = dynamic(
  () => import("./JobsFormModal").then((m) => ({ default: m.JobsFormModal })),
  { loading: () => <JobFormSkeleton />, ssr: false },
);

interface JobsPageClientProps {
  initialJobs: Job[];
  initialApplications: RawApplication[];
}

export function JobsPageClient({
  initialJobs,
  initialApplications,
}: JobsPageClientProps) {
  const {
    token,
    jobs,
    showModal,
    editJob,
    deletingId,
    search,
    setSearch,
    handleDelete,
    openCreate,
    openEdit,
    closeModal,
    handleModalDone,
    filteredJobs,
    summaryData,
  } = useJobsPage(initialJobs, initialApplications);

  return (
    <>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Briefcase size={15} />
            </div>
            <div>
              <h1 className="font-bold text-[1rem] text-[#e8f0ec]">Jobs</h1>
              <p className="text-[0.72rem] text-[#7a9585] mt-[1px]">
                {jobs.length} jobs · {summaryData.totalActive} aktif ·{" "}
                {summaryData.totalApplicants} total applicants
              </p>
            </div>
          </div>
          <button
            title="Post new job listing"
            onClick={openCreate}
            className="inline-flex items-center gap-[7px] bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.82rem] px-4 py-[9px] rounded-[9px] transition-all cursor-pointer shadow-[0_0_16px_rgba(16,185,129,0.2)]">
            <Plus size={14} /> Post a new job
          </button>
        </div>

        {jobs.length > 0 && <JobsSummaryStats data={summaryData} />}

        {jobs.length > 0 && (
          <div className="relative mb-5 max-w-[280px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d5a45] pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, location, skills..."
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

        {filteredJobs.length === 0 ? (
          <div className="bg-[#0f1612] border border-dashed border-emerald-500/20 rounded-[14px] py-16 text-center">
            <div className="text-[2.5rem] mb-3 opacity-30">📋</div>
            <div className="font-bold text-[1rem] mb-2 text-[#e8f0ec]">
              {search ? "No results found" : "No job listings yet"}
            </div>
            <p className="text-[#7a9585] text-[0.82rem] mb-5">
              {search
                ? `No jobs found for "${search}"`
                : "Create your first job listing to start receiving applicants."}
            </p>
            {!search && (
              <button
                title="Create first job listing"
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-[10px] rounded-[9px] text-[0.82rem] transition-all cursor-pointer">
                <Plus size={14} /> Buat Lowongan Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job, i) => (
              <JobsCard
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
