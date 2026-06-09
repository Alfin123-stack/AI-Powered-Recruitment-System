// @/hooks/jobs/useJobFilter.ts
// State search & filter + logika filtering job list

import { useState, useMemo } from "react";
import type { Job } from "@/types/jobs";

interface UseJobFilterReturn {
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
  filtered: Job[];
  listKey: string;
}

export function useJobFilter(initialJobs: Job[]): UseJobFilterReturn {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filtered = useMemo(() => {
    let result = initialJobs;

    if (filter !== "Semua") {
      result = result.filter((j) => j.type === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.companies?.name?.toLowerCase().includes(q) ||
          j.skills?.some((s) => s.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [initialJobs, search, filter]);

  // key berubah setiap filter/search berubah → JobList di-remount → page reset ke 1
  // tanpa useEffect, tanpa cascading render
  const listKey = `${filter}__${search}`;

  return { search, setSearch, filter, setFilter, filtered, listKey };
}
