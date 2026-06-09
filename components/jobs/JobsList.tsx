// @/components/jobs/JobsList.tsx
// Manages local pagination + renders JobsListHeader, JobsGrid, Pagination
// Re-mounted by parent via `key` when filter/search changes → page auto-resets to 1

import { useState } from "react";
import Pagination from "@/components/Pagination";
import { JobsListHeader } from "./JobsListHeader";
import { JobsGrid } from "./JobsGrid";
import type { Job } from "@/types/jobs";

const JOBS_PER_PAGE = 9;

interface JobsListProps {
  filtered: Job[];
  search: string;
}

export function JobsList({ filtered, search }: JobsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  return (
    <section className="py-8 pb-20">
      <div className="max-w-[1180px] mx-auto px-6">
        <JobsListHeader count={filtered.length} search={search} />
        <JobsGrid jobs={paginated} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollTargetId="jobs-section"
          />
        )}
      </div>
    </section>
  );
}
