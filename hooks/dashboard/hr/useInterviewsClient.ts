"use client";

import { useState, useCallback } from "react";
import { apiFetch } from "@/app/(role)/dashboard/hr/_components/shared";

import {
  type Interview,
  type ShortlistedCandidate,
  type FilterStatus,
  type SortOption,
  type AdvancedFilters,
} from "@/types/hr/interviews";
import { applySort } from "@/lib/helpers/hr/interviews";

export function useInterviewsClient(
  initialInterviews: Interview[],
  initialShortlisted: ShortlistedCandidate[],
  token: string,
) {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [shortlisted, setShortlisted] =
    useState<ShortlistedCandidate[]>(initialShortlisted);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("date_asc");
  const [advFilters, setAdvFilters] = useState<AdvancedFilters>({
    round: "",
    type: "",
    interviewer: "",
  });

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [ivData, slData] = await Promise.all([
        apiFetch("/api/interviews", token),
        apiFetch("/api/interviews/shortlisted", token),
      ]);
      setInterviews(Array.isArray(ivData) ? ivData : []);
      setShortlisted(Array.isArray(slData) ? slData : []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const scheduledCount = interviews.filter(
    (iv) => iv.status === "scheduled",
  ).length;
  const doneCount = interviews.filter((iv) => iv.status === "done").length;
  const overdueCount = interviews.filter(
    (iv) => iv.status === "overdue",
  ).length;

  const filtered = applySort(interviews, sort);

  return {
    interviews,
    shortlisted,
    showModal,
    setShowModal,
    filter,
    setFilter,
    search,
    setSearch,
    sort,
    setSort,
    advFilters,
    setAdvFilters,
    fetchData,
    scheduledCount,
    doneCount,
    overdueCount,
    filtered,
  };
}
