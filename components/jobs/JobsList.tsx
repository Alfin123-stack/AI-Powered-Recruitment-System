

import { useState } from "react";
import Pagination from "@/components/Pagination";
import { JobsListHeader } from "./JobsListHeader";
import { JobsGrid } from "./JobsGrid";
import type { Job } from "@/types/jobs";
import type { UserRole } from "@/hooks/main/useUserRole";

const JOBS_PER_PAGE = 9;

interface JobsListProps {
  filtered: Job[];
  search: string;
  role?: UserRole;
}

export function JobsList({ filtered, search, role }: JobsListProps) {
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
        <JobsGrid jobs={paginated} role={role} />
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