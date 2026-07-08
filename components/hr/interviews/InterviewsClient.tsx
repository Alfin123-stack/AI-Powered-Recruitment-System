"use client";

import { AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import InterviewsToolbar from "./InterviewsToolbar";
import InterviewsTable from "./InterviewsTable";
import type {
  Interview,
  ShortlistedCandidate,
} from "../../../types/hr/interviews";
import { useInterviewsClient } from "@/hooks/dashboard/hr/useInterviewsClient";
import { InterviewScheduleModal } from "./InterviewModals";
import { FadeIn } from "@/components/FadeIn";
import { useEvaluationFlow } from "@/hooks/dashboard/hr/useEvaluationFlow";
import EvaluationFlowController from "./EvaluationFlowController";

const T = {
  emerald: "#10b981",
  textPrimary: "#e8f5ee",
  textSecondary: "#7a9585",
};

type Props = {
  initialInterviews: Interview[];
  initialShortlisted: ShortlistedCandidate[];
  token: string;
  /** Company name dibutuhkan untuk EvaluationFlowController */
  companyName: string;
};

export default function InterviewsClient({
  initialInterviews,
  initialShortlisted,
  token,
  companyName,
}: Props) {
  const {
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
  } = useInterviewsClient(initialInterviews, initialShortlisted, token);

  // ── Evaluation flow ────────────────────────────────────────────────────────
  // fetchData dioper sebagai onSuccess: begitu evaluasi (hire/reject/consider)
  // berhasil tersimpan ke backend, list interview di-refetch supaya tombol
  // "Evaluate" langsung berubah status tanpa perlu reload manual.
  const flow = useEvaluationFlow(token, fetchData);

  const handleEvaluate = (interview: Interview) => {
    // candidate_email diambil dari field interview — pastikan backend
    // menyertakan field ini. Fallback ke string kosong kalau belum ada.
    const candidateEmail = (interview as Interview & { candidate_email?: string })
      .candidate_email ?? "";
    flow.start(interview, candidateEmail, companyName);
  };

  // Kandidat sudah dievaluasi "Hire" (application_status === "evaluated")
  // tapi offer letter belum dikirim — misalnya HR sebelumnya membatalkan
  // OfferLetterModal. Resume langsung ke step offer, skip form evaluasi.
  const handleSendOffer = (interview: Interview) => {
    const candidateEmail = (interview as Interview & { candidate_email?: string })
      .candidate_email ?? "";
    flow.resumeOffer(interview, candidateEmail, companyName);
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <InterviewScheduleModal
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

      {/* ── Heading ── */}
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
          onEvaluate={handleEvaluate}
          onSendOffer={handleSendOffer}
        />
      </FadeIn>

      {/* ── Evaluation flow modal chain (Evaluate → Offer / Rejection) ── */}
      <EvaluationFlowController flow={flow} companyName={companyName} />
    </>
  );
}