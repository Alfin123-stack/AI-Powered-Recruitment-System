"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
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

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  emerald: "#10b981",
  textPrimary: "#e8f5ee",
  textSecondary: "#7a9585",
};

type Props = {
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

      {/* ── Heading — selaras dengan AnalyticsPage ── */}
      <FadeIn>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 4,
            }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(16,185,129,0.15)",
                color: T.emerald,
                flexShrink: 0,
              }}>
              <Calendar size={15} />
            </div>
            <h1
              style={{
                fontSize: "1.35rem",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: T.textPrimary,
                margin: 0,
              }}>
              Calendar
            </h1>
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: T.textSecondary,
              marginLeft: 44 /* 32px icon + 12px gap */,
              margin: "0 0 0 44px",
            }}>
            Jadwal interview —{" "}
            <span style={{ color: T.emerald, fontWeight: 700 }}>
              {interviews.length}
            </span>{" "}
            jadwal terdaftar
          </p>
        </div>
      </FadeIn>

      {/* ── Toolbar ── */}
      <FadeIn delay={0.04}>
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

      {/* ── Table ── */}
      <FadeIn delay={0.08}>
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
