"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, ChevronDown, X, Target, Brain } from "lucide-react";
import type { CandidateUI, JobGroup } from "@/types/hr/dashboard";
import type { CandidateStatus } from "@/types/candidates";
import { STATUS_FILTER_OPTIONS } from "@/constants/hr/dashboard";
import { showOnboardingSentToast } from "@/lib/helpers/hr/dashboardStatus";
// NOTE: sesuaikan path ini kalau OnboardingModal.tsx ditaruh di lokasi lain.
import OnboardingModal from "../OnboardingModal";
import { DashboardCandidateModal } from "./DashboardCandidateModal";
import { DashboardJobGroupTable } from "./DashboardJobGroupTable";

type DashboardCandidateRankingProps = {
  jobGroups: JobGroup[];
  total: number;
  onStatusChange: (id: string, status: CandidateStatus) => void;
  // Dibutuhkan OnboardingModal untuk mengisi nama perusahaan di email. Di
  // DashboardClient.tsx, tinggal diisi dari `company?.name`.
  companyName: string;
  // Dipanggil setelah onboarding email berhasil dikirim, supaya parent bisa
  // refetch/mutate candidates list-nya agar `onboarding_sent` ikut ter-update
  // tanpa reload penuh. Opsional — kalau tidak diisi, tombol akan tetap
  // "Kirim Onboarding Email" sampai halaman di-refresh.
  onOnboardingSent?: (id: string) => void;
};

export function DashboardCandidateRanking({
  jobGroups,
  total,
  onStatusChange,
  companyName,
  onOnboardingSent,
}: DashboardCandidateRankingProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateUI | null>(null);
  // Candidate yang sedang dikirimi onboarding email — state terpisah dari
  // selectedCandidate supaya bisa dibuka langsung dari row tabel tanpa harus
  // buka detail modal dulu.
  const [onboardingCandidate, setOnboardingCandidate] =
    useState<CandidateUI | null>(null);

  const filteredGroups = useMemo(() => {
    return jobGroups
      .map((g) => ({
        ...g,
        candidates: g.allCandidates
          .filter((c) => {
            if (filterStatus !== "all" && c.status !== filterStatus)
              return false;
            if (search) {
              const q = search.toLowerCase();
              return (
                c.name.toLowerCase().includes(q) ||
                c.skills.some((s) => s.toLowerCase().includes(q))
              );
            }
            return true;
          })
          .sort((a, b) => b.resumeScore - a.resumeScore),
      }))
      .filter((g) => g.candidates.length > 0);
  }, [jobGroups, search, filterStatus]);

  return (
    <>
      {/* Modal detail kandidat */}
      <AnimatePresence>
        {selectedCandidate && (
          <DashboardCandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onStatusChange={(id, status) => {
              onStatusChange(id, status);
              setSelectedCandidate(null);
            }}
            onSendOnboarding={(c) => {
              setSelectedCandidate(null);
              setOnboardingCandidate(c);
            }}
          />
        )}
      </AnimatePresence>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {onboardingCandidate && (
          <OnboardingModal
            applicationId={onboardingCandidate.id}
            candidateName={onboardingCandidate.name}
            // ASUMSI: CandidateUI punya field `email`. Kalau nama field-nya
            // beda, sesuaikan baris ini.
            candidateEmail={onboardingCandidate.email ?? ""}
            jobTitle={onboardingCandidate.job}
            companyName={companyName}
            onClose={() => setOnboardingCandidate(null)}
            onSent={() => {
              // TAMBAHAN: toast sonner konfirmasi onboarding email terkirim —
              // sebelumnya tidak ada notifikasi eksplisit di titik ini.
              showOnboardingSentToast(onboardingCandidate.name);
              onOnboardingSent?.(onboardingCandidate.id);
              setOnboardingCandidate(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="font-black text-[1rem] text-[#e8f0ec] flex items-center gap-2">
            <Target size={16} className="text-emerald-400" aria-hidden="true" />
            Ranking Kandidat per Posisi
          </div>
          <div className="text-[0.68rem] text-[#7a9585] mt-1 flex items-center gap-1">
            Klik{" "}
            <Brain size={10} className="text-[#8b5cf6]" aria-hidden="true" />{" "}
            for AI insight per candidate
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau skill..."
              aria-label="Search candidate by name or skill"
              className="pl-8 pr-8 py-2 w-[200px] rounded-[10px] text-[0.82rem] outline-none bg-[#0a0f0c] border border-emerald-500/12 text-[#e8f0ec] placeholder-[#7a9585] focus:border-emerald-500/30 transition-colors"
            />
            {search && (
              <button
                type="button"
                title="Clear search"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#7a9585] hover:text-[#e8f0ec]">
                <X size={11} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter by candidate status"
              className="appearance-none py-2 pl-3 pr-8 rounded-[10px] text-[0.82rem] outline-none cursor-pointer bg-[#0a0f0c] border border-emerald-500/12 text-[#e8f0ec] focus:border-emerald-500/30 transition-colors">
              {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-[9px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Tables */}
      {filteredGroups.length === 0 ? (
        <div className="rounded-[18px] flex flex-col items-center justify-center py-16 text-center bg-[#0a0f0c] border border-emerald-500/12">
          <Users size={28} className="text-[#334155] mb-3" aria-hidden="true" />
          <div className="text-[0.82rem] font-bold text-[#e8f0ec] mb-2">
            {total === 0 ? "No applicants yet" : "No candidates found"}
          </div>
          <div className="text-[0.72rem] text-[#7a9585]">
            {total === 0
              ? "Kandidat akan muncul setelah ada yang melamar"
              : "Try changing the search filter"}
          </div>
        </div>
      ) : (
        <AnimatePresence>
          {filteredGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <DashboardJobGroupTable
                group={group}
                onView={setSelectedCandidate}
                onStatusChange={onStatusChange}
                onSendOnboarding={setOnboardingCandidate}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </>
  );
}
