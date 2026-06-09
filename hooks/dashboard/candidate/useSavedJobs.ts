"use client";

import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { FilterValue, SavedJob, SortOption } from "@/types/candidate/saved";
import { isDeadlineSoon, isExpired } from "@/lib/helpers/candidate/saved";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useSavedJobs(initialJobs: SavedJob[]) {
  const { token } = useDashboard();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(initialJobs);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sortBy, setSortBy] = useState<SortOption>("saved_at");

  const handleUnsave = async (jobId: string): Promise<void> => {
    setRemovingId(jobId);
    try {
      await fetch(`${API}/api/saved-jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch {
      // silent
    } finally {
      setRemovingId(null);
    }
  };

  const afterFilter = savedJobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      j.title.toLowerCase().includes(q) ||
      j.companies?.name.toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (filter === "active") return !isExpired(j.deadline);
    if (filter === "expiring")
      return isDeadlineSoon(j.deadline) && !isExpired(j.deadline);
    if (filter === "expired") return isExpired(j.deadline);
    return true;
  });

  const sorted = [...afterFilter].sort((a, b) => {
    if (sortBy === "saved_at")
      return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime();
    if (sortBy === "deadline") {
      const dA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dA - dB;
    }
    if (sortBy === "matching_score")
      return (b.matching_score ?? 0) - (a.matching_score ?? 0);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return {
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
  };
}
