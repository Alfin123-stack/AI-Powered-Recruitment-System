"use client";

// Wajib client karena mengelola state search & filter (useState),
// dan menggunakan AnimatePresence dari framer-motion.

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Briefcase, Search } from "lucide-react";
import type { JobWithMatch, CvAnalysis } from "./types";
import JobMatchHeader from "./JobMatchHeader";
import CVAnalysisBar from "./CVAnalysisBar";
import JobMatchToolbar from "./JobMatchToolbar";
import JobMatchCard from "./JobMatchCard";

type FilterValue = "all" | "unapplied" | "high";

type JobMatchListProps = {
  jobs: JobWithMatch[];
  cvAnalysis: CvAnalysis;
};

export default function JobMatchList({ jobs, cvAnalysis }: JobMatchListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("unapplied");

  const filtered = jobs.filter((j) => {
    const mSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companies?.name?.toLowerCase().includes(search.toLowerCase());
    const mFilter =
      filter === "all"
        ? true
        : filter === "unapplied"
          ? !j.alreadyApplied
          : j.matchScore >= 60;
    return mSearch && mFilter;
  });

  const unappliedCount = jobs.filter((j) => !j.alreadyApplied).length;
  const highMatchCount = jobs.filter((j) => j.matchScore >= 60).length;
  const appliedCount = jobs.filter((j) => j.alreadyApplied).length;

  return (
    <div>
      {/* Stats header */}
      <JobMatchHeader
        totalJobs={jobs.length}
        unappliedCount={unappliedCount}
        highMatchCount={highMatchCount}
        appliedCount={appliedCount}
      />

      {/* CV info bar */}
      <CVAnalysisBar cvAnalysis={cvAnalysis} />

      {/* Search + filter */}
      <JobMatchToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        resultCount={filtered.length}
      />

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Search size={32} className="mx-auto mb-4 opacity-20" />
          <div className="font-semibold text-[0.95rem] mb-2 text-white/50">
            {jobs.length === 0
              ? "Belum ada lowongan tersedia"
              : "Tidak ada lowongan ditemukan"}
          </div>
          <p className="text-[0.8rem]">
            Coba ubah filter atau kata kunci pencarian.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((job, i) => (
              <JobMatchCard key={job.id} job={job} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 border border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/[0.13] px-5 py-[9px] rounded-[9px] text-[0.82rem] font-medium no-underline transition-all">
          <Briefcase size={13} /> Lihat Semua Lowongan
        </Link>
      </div>
    </div>
  );
}
