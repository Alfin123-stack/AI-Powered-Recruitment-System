"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  SortKey,
  SortDir,
  StatusFilter,
  DateFilter,
  CandidateRaw,
} from "@/types/candidates";
import { STATUS_TABS } from "@/constants/candidates";

export function useCandidatesTable(
  candidates: CandidateRaw[],
  initialJob?: string,
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [activeJob, setActiveJob] = useState<string>(
    initialJob ?? searchParams.get("job") ?? "all",
  );
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateRaw | null>(null);
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<DateFilter>("Last 30 days");

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key as SortKey);
      setSortDir("desc");
    }
    setPage(1);
  };

  const handleSelectJob = (job: string) => {
    setActiveJob(job);
    setPage(1);
    if (job === "all") router.replace("/dashboard/hr/candidates");
    else
      router.replace(`/dashboard/hr/candidates?job=${encodeURIComponent(job)}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleStatusChange = (status: StatusFilter) => {
    setActiveStatus(status);
    setPage(1);
  };

  const scoped =
    activeJob === "all"
      ? candidates
      : candidates.filter((c) => c.job === activeJob);

  // FIX: dulu `c.status === activeStatus` — strict equality ke 1 key.
  // Tab seperti "In Review" (review+shortlisted) atau "Hired"
  // (hired+onboard) mewakili >1 status sekaligus (lihat STATUS_TABS di
  // constants/candidates.ts), jadi harus dicek lewat membership ke
  // `statuses[]` tab yang aktif, bukan disamakan langsung dengan
  // activeStatus. Tanpa ini, kandidat "shortlisted"/"onboard" tidak akan
  // ikut kefilter saat tab gabungan itu dipilih walau count di
  // CandidatesFilterBar sudah benar menghitungnya.
  const activeTabStatuses =
    STATUS_TABS.find((t) => t.key === activeStatus)?.statuses ?? [];

  const filtered = useMemo(() => {
    return scoped
      .filter((c) => {
        const statusMatch =
          activeStatus === "all" || activeTabStatuses.includes(c.status);
        const q = search.toLowerCase();
        const queryMatch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)) ||
          c.job.toLowerCase().includes(q);
        return statusMatch && queryMatch;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "score") cmp = b.resumeScore - a.resumeScore;
        else if (sortKey === "match") cmp = b.matchScore - a.matchScore;
        else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
        else if (sortKey === "applied_role") cmp = a.job.localeCompare(b.job);
        return sortDir === "asc" ? -cmp : cmp;
      });
  }, [scoped, activeStatus, activeTabStatuses, search, sortKey, sortDir]);

  return {
    search,
    handleSearchChange,
    activeJob,
    handleSelectJob,
    activeStatus,
    handleStatusChange,
    sortKey,
    sortDir,
    handleSort,
    selectedCandidate,
    setSelectedCandidate,
    page,
    setPage,
    dateFilter,
    setDateFilter,
    filtered,
  };
}