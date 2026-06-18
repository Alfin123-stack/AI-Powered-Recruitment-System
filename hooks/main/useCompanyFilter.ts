// @/hooks/company/useCompanyFilter.ts
// State search & filter + logika filtering company list

import { useState, useMemo } from "react";
import type { Company } from "@/types/main/company";

interface UseCompanyFilterReturn {
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
  filtered: Company[];
}

export function useCompanyFilter(companies: Company[]): UseCompanyFilterReturn {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return companies.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.tags?.some((t) => t.toLowerCase().includes(q));
      const matchFilter = filter === "Semua" || c.location === filter;
      return matchSearch && matchFilter;
    });
  }, [companies, search, filter]);

  return { search, setSearch, filter, setFilter, filtered };
}
