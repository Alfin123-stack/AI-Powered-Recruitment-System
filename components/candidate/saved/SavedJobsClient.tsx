"use client";

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, X, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SavedJob } from "../../../types/candidate/saved";
import SavedJobsStatsBar from "./SavedJobsStatsBar";
import SavedJobsFilterBar from "./SavedJobsFilterBar";
import SavedJobsCard from "./SavedJobsCard";
import SavedJobsFadeIn from "./SavedJobsFadeIn";
import SavedJobsEmptyState from "./SavedJobsEmptyState";
import { useSavedJobs } from "@/hooks/dashboard/candidate/useSavedJobs";

export default function SavedJobsClient({
  initialJobs,
}: {
  initialJobs: SavedJob[];
}) {
  const {
    savedJobs,
    search,
    setSearch,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    removingId,
    handleUnsave,
    sorted,
  } = useSavedJobs(initialJobs);

  return (
    <div>
      {savedJobs.length > 0 && (
        <SavedJobsFadeIn>
          <SavedJobsStatsBar jobs={savedJobs} />
        </SavedJobsFadeIn>
      )}

      <SavedJobsFadeIn delay={0.02}>
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div>
            <div className="font-bold text-[1rem]">Saved Jobs</div>
            <div className="text-[0.73rem] text-[#7a9585] mt-[2px]">
              {savedJobs.length} jobs saved
            </div>
          </div>
          {savedJobs.length > 0 && (
            <div className="relative min-w-[220px]">
              <Search
                size={13}
                className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search saved jobs..."
                className="pl-[34px] pr-8 bg-[#0a0f0c] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
              {search && (
                <button
                  title="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer">
                  <X size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </SavedJobsFadeIn>

      {savedJobs.length === 0 ? (
        <SavedJobsEmptyState />
      ) : (
        <>
          <SavedJobsFadeIn delay={0.04}>
            <SavedJobsFilterBar
              filter={filter}
              setFilter={setFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </SavedJobsFadeIn>

          {sorted.length === 0 ? (
            <div className="text-center py-16 text-[#7a9585]">
              <div className="text-[2rem] mb-3 opacity-20">🔍</div>
              <div className="text-[0.88rem] font-semibold mb-2">
                No results found
              </div>
              <button
                title="Reset all filters"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="text-emerald-400 text-[0.78rem] hover:opacity-75 transition-opacity cursor-pointer">
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="text-[0.72rem] text-[#7a9585] mb-3">
                Showing {sorted.length} jobs
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {sorted.map((job, i) => (
                    <SavedJobsCard
                      key={job.saved_id}
                      job={job}
                      index={i}
                      onUnsave={handleUnsave}
                      removingId={removingId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          <div className="mt-7 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[10px] rounded-[9px] text-[0.84rem] font-semibold no-underline transition-all">
              <Briefcase size={14} /> Browse More Jobs
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
