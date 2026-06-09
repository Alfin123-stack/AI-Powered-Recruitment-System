// @/components/hr/calendar/hooks/useInterviewFilter.ts
// Hook untuk memfilter interviews berdasarkan search query
// Dipisah agar logika filter bisa diuji secara independen

import { Interview } from "@/types/calendar";
import { useMemo } from "react";

export function useInterviewFilter(
  interviews: Interview[],
  searchQuery: string,
): Interview[] {
  return useMemo(() => {
    if (!searchQuery.trim()) return interviews;

    const q = searchQuery.toLowerCase();

    return interviews.filter(
      (iv) =>
        iv.candidate_name?.toLowerCase().includes(q) ||
        iv.job_title?.toLowerCase().includes(q),
    );
  }, [interviews, searchQuery]);
}
