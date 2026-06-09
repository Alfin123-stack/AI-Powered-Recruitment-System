"use client";

import { JobsToolbar } from "./JobsToolbar";
import { JobsList } from "./JobsList";
import type { Job } from "@/types/jobs";
import { useJobFilter } from "@/hooks/main/useJobFilter";

export default function JobsContainer({ initialJobs }: { initialJobs: Job[] }) {
  const { search, setSearch, filter, setFilter, filtered, listKey } =
    useJobFilter(initialJobs);

  return (
    <>
      <JobsToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />
      {/* key changes when filter/search changes → JobsList remounts → page resets to 1 */}
      <JobsList key={listKey} filtered={filtered} search={search} />
    </>
  );
}
