"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MapPin, Calendar, Loader2, Search, ArrowUp, ArrowDown } from "lucide-react";

import { useCandidatesData } from "@/hooks/dashboard/hr/useCandidatesData";
import { useCandidatesTable } from "@/hooks/dashboard/hr/useCandidatesTable";
import { getScoreColor, getScoreGradient } from "@/lib/helpers/candidate/dashboard";
import { CandidatesHeaderBar } from "./CandidatesHeaderBar";
import { CandidatesFilterBar } from "./CandidatesFilterBar";
import { CandidatesStageBadge } from "./CandidatesStageBadge";
import { CandidatesPagination } from "./CandidatesPagination";
import { CandidatesActionDropdown } from "./CandidatesActionDropdown";
import { CandidatesModal } from "./CandidatesModal";
import CandidatesOpeningsSection from "./CandidatesOpeningsSection";
import { ROWS_PER_PAGE as RPP } from "@/constants/candidates";
import type { CandidateRaw, SortKey, SortDir } from "@/types/candidates";
import OnboardingModal from "../dashboard/OnboardingModal";

// ─────────────────────────────────────────────────────────────────────────────
// SORT INDICATOR — read-only, TIDAK bisa diklik. Cuma menampilkan panah kecil
// di header kolom yang lagi jadi acuan sort dari dropdown di
// CandidatesHeaderBar. Tujuannya kasih konfirmasi visual "ini yang lagi
// disortir" tanpa membuka kontrol sorting kedua di tabel (itu yang bikin HR
// bingung sebelumnya — 2 tempat sorting yang bisa nggak sinkron).
// ─────────────────────────────────────────────────────────────────────────────
function SortIndicator({
  columnKey,
  activeKey,
  dir,
}: {
  columnKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
}) {
  if (columnKey !== activeKey) return null;
  const Icon = dir === "asc" ? ArrowUp : ArrowDown;
  return <Icon size={10} className="text-[#10b981] inline-block ml-1" />;
}

export default function CandidatesTable({
  initialJob,
  // TAMBAHAN: dibutuhkan OnboardingModal untuk isi nama perusahaan di email.
  // Kalau komponen ini dirender dari halaman yang sudah punya data company
  // (mis. lewat context/hook lain), sambungkan ke situ — sementara saya
  // default-kan ke "Perusahaan" supaya tidak breaking kalau belum di-pass.
  companyName = "Perusahaan",
}: {
  initialJob?: string;
  companyName?: string;
}) {
  const { candidates, loading, jobMetas, getJobColor, updateStatus } =
    useCandidatesData();

  // TAMBAHAN: candidate yang sedang dikirimi onboarding email.
  const [onboardingCandidate, setOnboardingCandidate] =
    useState<CandidateRaw | null>(null);
  // TAMBAHAN: override lokal untuk onboarding_sent setelah kirim sukses —
  // dipakai karena useCandidatesData belum tentu re-fetch otomatis. Kalau
  // hook itu sudah punya cara sendiri untuk update/refetch candidate list,
  // ini bisa dihapus dan diganti pemanggilan itu langsung.
 const [onboardingSentOverrides, setOnboardingSentOverrides] = useState<Record<string, boolean>>({});

  const withOnboardingOverride = (c: CandidateRaw): CandidateRaw => ({
    ...c,
    onboarding_sent: onboardingSentOverrides[c.id] ?? c.onboarding_sent,
  });

  const {
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
  } = useCandidatesTable(candidates, initialJob);

  const paginated = filtered.slice((page - 1) * RPP, page * RPP);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 bg-[#0a100d]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={22} className="animate-spin text-[#10b981]" />
          <span className="text-[13px] text-[#7a9585]">
            Loading candidates...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {selectedCandidate && (
          <CandidatesModal
            candidate={withOnboardingOverride(selectedCandidate)}
            onClose={() => setSelectedCandidate(null)}
            onStatusChange={updateStatus}
            onSendOnboarding={(c) => {
              setSelectedCandidate(null);
              setOnboardingCandidate(c);
            }}
          />
        )}
      </AnimatePresence>

      {/* TAMBAHAN: Onboarding Modal */}
      <AnimatePresence>
        {onboardingCandidate && (
          <OnboardingModal
            applicationId={onboardingCandidate.id}
            candidateName={onboardingCandidate.name}
            candidateEmail={onboardingCandidate.email}
            jobTitle={onboardingCandidate.job}
            companyName={companyName}
            onClose={() => setOnboardingCandidate(null)}
            onSent={() => {
              setOnboardingSentOverrides((prev) => ({
                ...prev,
                [onboardingCandidate.id]: true,
              }));
              // TAMBAHAN: dulu cuma set onboarding_sent lokal, status
              // kandidat tidak pernah benar-benar pindah dari "hired".
              // Sekarang sekalian diubah jadi "onboard" (persist ke
              // backend lewat updateStatus, sama seperti aksi status
              // manual lainnya).
              updateStatus(onboardingCandidate.id, "onboard");
              setOnboardingCandidate(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="bg-[#0a100d]">
        {/* PAGE HEADING */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.2)]">
            <Users size={15} className="text-[#10b981]" />
          </div>
          <div>
            <div className="font-extrabold text-[#e8f0ec] text-[16px] leading-tight">
              Candidates
            </div>
            <div className="text-[12px] mt-[3px] text-[#7a9585]">
              Registered candidates —{" "}
              <span className="font-bold text-[#e8f0ec]">
                {candidates.length}
              </span>{" "}
              active candidates
            </div>
          </div>
        </div>

        <CandidatesOpeningsSection jobMetas={jobMetas} />

       <CandidatesHeaderBar
  search={search}
  onSearchChange={handleSearchChange}
  sortKey={sortKey}
  onSortChange={(k) => {
    handleSort(k);
  }}
  dateFilter={dateFilter}
  onDateFilterChange={setDateFilter}
/>

        <CandidatesFilterBar
          jobMetas={jobMetas}
          activeJob={activeJob}
          totalCount={candidates.length}
          onSelectJob={handleSelectJob}
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
          candidates={candidates}
        />

        {/* TABLE */}
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr
                className="bg-[#0d1510]"
                style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
                <th className="px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-left whitespace-nowrap w-10 text-[#7a9585]">
                  #
                </th>
                {/* Sorting dikontrol lewat dropdown di CandidatesHeaderBar.
                    Header kolom di sini hanya label + indikator read-only
                    (SortIndicator) — TIDAK bisa diklik, supaya cuma ada
                    satu kontrol sorting di halaman ini. */}
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Applied Role
                  <SortIndicator
                    columnKey="applied_role"
                    activeKey={sortKey}
                    dir={sortDir}
                  />
                </th>
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Location
                </th>
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Candidates
                  <SortIndicator
                    columnKey="name"
                    activeKey={sortKey}
                    dir={sortDir}
                  />
                </th>
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Contact
                </th>
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Applied Date
                  <SortIndicator
                    columnKey="date"
                    activeKey={sortKey}
                    dir={sortDir}
                  />
                </th>
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Stage
                </th>
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  AI Score
                  <SortIndicator
                    columnKey="score"
                    activeKey={sortKey}
                    dir={sortDir}
                  />
                </th>
                <th className="px-4 py-[11px] w-10" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="flex flex-col items-center justify-center py-20">
                        <Search
                          size={32}
                          className="mb-3 opacity-20 text-[#7a9585]"
                        />
                        <p className="text-[14px] font-semibold text-[#e8f0ec]">
                          No candidates found
                        </p>
                        <p className="text-[12px] mt-1 text-[#7a9585] opacity-70">
                          Try changing the filter or search keyword
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((raw, i) => {
                    const c = withOnboardingOverride(raw);
                    const rowNum = (page - 1) * RPP + i + 1;
                    const jobColor = getJobColor(c.job);
                    return (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, delay: i * 0.03 }}
                        className="cursor-pointer transition-colors hover:bg-[rgba(16,185,129,0.03)]"
                        style={{
                          borderBottom: "1px solid rgba(16,185,129,0.06)",
                        }}
                        onClick={() => setSelectedCandidate(c)}>
                        <td className="px-4 py-3 w-10">
                          <span className="text-[11px] font-bold tabular-nums text-[#7a9585]">
                            {rowNum}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-[12px] font-semibold"
                            style={{ color: jobColor }}>
                            {c.job}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <MapPin size={10} className="text-[#7a9585]" />
                            <span className="text-[12px] text-[#7a9585]">
                              {c.location}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[11px] flex-shrink-0"
                              style={{
                                background: `${c.color}18`,
                                color: c.color,
                                border: `1px solid ${c.color}30`,
                              }}>
                              {c.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-[#e8f0ec] text-[13px]">
                                {c.name}
                              </div>
                              <div className="text-[11px] text-[#7a9585]">
                                {c.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] text-[#7a9585] font-mono">
                            {c.phone}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={10} className="text-[#7a9585]" />
                            <span className="text-[12px] text-[#7a9585]">
                              {c.appliedDate}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <CandidatesStageBadge status={c.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-12 h-[4px] rounded-full overflow-hidden"
                              style={{ background: "rgba(255,255,255,0.05)" }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${c.resumeScore}%`,
                                  background: getScoreGradient(c.resumeScore),
                                }}
                              />
                            </div>
                            <span
                              className="text-[13px] font-extrabold"
                              style={{ color: getScoreColor(c.resumeScore) }}>
                              {c.resumeScore}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-4 py-3"
                          onClick={(e) => e.stopPropagation()}>
                          <CandidatesActionDropdown
                            candidate={c}
                            onStatusChange={updateStatus}
                            onView={() => setSelectedCandidate(c)}
                            onSendOnboarding={setOnboardingCandidate}
                          />
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div
          className="flex items-center justify-between px-6 py-3 bg-[#0f1612]"
          style={{ borderTop: "1px solid rgba(16,185,129,0.1)" }}>
          <span className="text-[12px] text-[#7a9585]">
            Showing{" "}
            <span className="font-semibold text-[#e8f0ec]">
              {filtered.length === 0
                ? 0
                : Math.min((page - 1) * RPP + 1, filtered.length)}
            </span>{" "}
            –{" "}
            <span className="font-semibold text-[#e8f0ec]">
              {Math.min(page * RPP, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#e8f0ec]">
              {filtered.length}
            </span>{" "}
            candidates
          </span>
          <CandidatesPagination
            page={page}
            total={filtered.length}
            perPage={RPP}
            onChange={setPage}
          />
        </div>
      </div>
    </>
  );
}