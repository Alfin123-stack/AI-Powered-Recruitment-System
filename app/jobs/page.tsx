"use client";

import JobHero from "./_components/JobHero";
import JobToolbar from "./_components/JobToolbar";
import JobList from "./_components/JobList";
import { useJobs } from "@/hooks/useJobs";

export type Job = {
  id: string;
  title: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  created_at: string;
  companies: { name: string; logo_url: string | null; company_size: string };
  color: string;
};

// ── Job Card ──────────────────────────────────────────────────────────────────

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const { jobs, loading, search, setSearch, filter, setFilter, filtered } =
    useJobs();

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      <main className="pt-16">
        {/* HERO */}
        <JobHero jobs={jobs} loading={loading} />

        {/* TOOLBAR */}
        <JobToolbar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        {/* JOBS GRID */}
        <JobList filtered={filtered} search={search} loading={loading} />
      </main>
    </div>
  );
}
