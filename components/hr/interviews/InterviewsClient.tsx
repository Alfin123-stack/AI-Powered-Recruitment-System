"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { apiFetch, FadeIn } from "@/app/(role)/dashboard/hr/_components/shared";
import { ScheduleModal } from "./InterviewModals";
import InterviewsToolbar from "./InterviewsToolbar";
import InterviewsTable from "./InterviewsTable";
import {
  Interview,
  ShortlistedCandidate,
  FilterStatus,
  SortOption,
  AdvancedFilters,
  applyFilters,
  applySort,
} from "./types";

type Props = {
  /** Initial data streamed from the server component */
  initialInterviews: Interview[];
  initialShortlisted: ShortlistedCandidate[];
  token: string;
};

export default function InterviewsClient({
  initialInterviews,
  initialShortlisted,
  token,
}: Props) {
  // ── data state ──
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [shortlisted, setShortlisted] =
    useState<ShortlistedCandidate[]>(initialShortlisted);

  // ── ui state ──
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("date_asc");
  const [advFilters, setAdvFilters] = useState<AdvancedFilters>({
    round: "",
    type: "",
    interviewer: "",
  });

  // ── re-fetch after any mutation ──
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

  // ── derived counts ──
  const scheduledCount = interviews.filter(
    (iv) => iv.status === "scheduled",
  ).length;
  const doneCount = interviews.filter((iv) => iv.status === "done").length;
  const overdueCount = interviews.filter(
    (iv) => iv.status === "overdue",
  ).length;

  // ── apply filters + sort ──
  const filtered = applySort(
    applyFilters(interviews, filter, search, advFilters),
    sort,
  );

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <ScheduleModal
            token={token}
            candidates={shortlisted}
            onDone={() => {
              setShowModal(false);
              fetchData();
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Toolbar — CSR: owns search, filter, sort, create */}
      <FadeIn>
        <InterviewsToolbar
          interviews={interviews}
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          advFilters={advFilters}
          onAdvFiltersChange={setAdvFilters}
          scheduledCount={scheduledCount}
          doneCount={doneCount}
          overdueCount={overdueCount}
          totalCount={interviews.length}
          shortlistedCount={shortlisted.length}
          onCreateClick={() => setShowModal(true)}
        />
      </FadeIn>

      {/* Table — CSR: row-level mutations re-call fetchData */}
      <FadeIn delay={0.06}>
        <InterviewsTable
          interviews={filtered}
          token={token}
          onUpdate={fetchData}
          filter={filter}
        />
      </FadeIn>
    </>
  );
}
