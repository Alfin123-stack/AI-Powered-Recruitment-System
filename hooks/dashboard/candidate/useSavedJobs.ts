"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { FilterValue, SavedJob, SortOption } from "@/types/candidate/saved";
import { isDeadlineSoon, isExpired } from "@/lib/helpers/candidate/saved";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Guard ringan: kalau backend pernah ngirim skills null/undefined (data lama
// sebelum kolom `skills jsonb default '[]'` ke-backfill), jangan sampai
// `.length`/`.slice` di SavedJobsCard throw dan bikin seluruh list gagal
// render. Tidak menyentuh `color` — itu tanggung jawab fetchSavedJobs (SSR).
function normalize(job: SavedJob): SavedJob {
  return {
    ...job,
    skills: Array.isArray(job.skills) ? job.skills : [],
  };
}

export function useSavedJobs(initialJobs: SavedJob[]) {
  const { token } = useDashboard();
  const router = useRouter();

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(
    initialJobs.map(normalize),
  );
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sortBy, setSortBy] = useState<SortOption>("saved_at");

  const handleUnsave = async (jobId: string): Promise<void> => {
    setRemovingId(jobId);
    try {
      const res = await fetch(`${API}/api/saved-jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Gagal menghapus saved job (status ${res.status})`);
      }

      // Optimistic update biar langsung ilang dari UI...
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
      // ...lalu revalidate server component supaya cache tag "saved-jobs"
      // (fetchSavedJobs, revalidate: 60) ke-refresh dan initialJobs di
      // request berikutnya konsisten sama DB.
      router.refresh();
    } catch (err) {
      console.error("[useSavedJobs] unsave error:", err);
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