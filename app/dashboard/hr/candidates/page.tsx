"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Building2,
  Loader2,
  X,
  CheckCircle2,
  TrendingUp,
  FileText,
  Star,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FadeIn,
  apiFetch,
  getColor,
  getInitials,
  statusMap,
  rankColors,
  Candidate,
} from "../_components/shared";
import { useDashboard } from "../layout";
import { motion as m } from "framer-motion";

// ── Candidate Detail Modal ────────────────────────────────────────────────────
function CandidateDetailModal({
  candidate,
  onClose,
  onStatusChange,
}: {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const st = statusMap[candidate.status] ?? {
    label: candidate.status,
    color: "#7a9585",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f1612] border border-emerald-500/20 rounded-[20px] w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-emerald-500/15">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center font-extrabold text-[1rem] flex-shrink-0"
              style={{
                background: `${candidate.color}18`,
                color: candidate.color,
              }}>
              {candidate.avatar}
            </div>
            <div>
              <div className="font-syne font-bold text-[1rem]">
                {candidate.name}
              </div>
              <div className="text-[0.75rem] text-[#7a9585]">
                {candidate.job}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-[10px] py-[4px] rounded-full text-[0.67rem] font-bold"
              style={{
                background: `${st.color}15`,
                color: st.color,
                border: `1px solid ${st.color}30`,
              }}>
              {st.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-[8px] bg-[#141f19] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] cursor-pointer transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="px-7 py-6">
          {/* Score cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#141f19] border border-emerald-500/15 rounded-[12px] p-4">
              <div className="text-[0.68rem] font-bold text-[#7a9585] tracking-[0.08em] uppercase mb-2">
                Resume Score
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="font-extrabold text-[2rem] leading-none text-emerald-400">
                  {candidate.resumeScore || "—"}
                </span>
                <span className="text-[#7a9585] text-[0.75rem] mb-1">/100</span>
              </div>
              <div className="h-[5px] rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-[1.2s]"
                  style={{
                    width: `${candidate.resumeScore}%`,
                    background: "linear-gradient(90deg,#10b981,#06b6d4)",
                  }}
                />
              </div>
            </div>
            <div className="bg-[#141f19] border border-emerald-500/15 rounded-[12px] p-4">
              <div className="text-[0.68rem] font-bold text-[#7a9585] tracking-[0.08em] uppercase mb-2">
                Match Score
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="font-extrabold text-[2rem] leading-none text-violet-400">
                  {candidate.matchScore ? `${candidate.matchScore}%` : "—"}
                </span>
              </div>
              <div className="h-[5px] rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-[1.2s]"
                  style={{
                    width: `${candidate.matchScore}%`,
                    background: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <div className="mb-5">
              <div className="text-[0.72rem] font-bold text-[#7a9585] tracking-[0.08em] uppercase mb-3">
                Skills Terdeteksi
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-white/[0.04] border border-white/[0.08] px-[10px] py-[5px] rounded-[6px] text-[0.78rem] font-mono text-[#e8f0ec]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-[#141f19] border border-emerald-500/15 rounded-[12px] p-4 mb-5">
            <div className="flex items-center gap-[6px] text-[0.72rem] text-[#7a9585] mb-[6px]">
              <Building2 size={12} /> {candidate.job}
            </div>
            <div className="flex items-center gap-[6px] text-[0.72rem] text-[#7a9585]">
              <Clock size={12} /> Dilamar {candidate.appliedDate}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                onStatusChange(candidate.id, "shortlisted");
                onClose();
              }}
              disabled={candidate.status === "shortlisted"}
              className="flex-1 flex items-center justify-center gap-2 py-[11px] rounded-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold text-[0.85rem] cursor-pointer hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <ThumbsUp size={14} /> Shortlist
            </button>
            <button
              onClick={() => {
                onStatusChange(candidate.id, "review");
                onClose();
              }}
              disabled={candidate.status === "review"}
              className="flex-1 flex items-center justify-center gap-2 py-[11px] rounded-[10px] bg-cyan-500/[0.07] border border-cyan-500/20 text-cyan-400 font-bold text-[0.85rem] cursor-pointer hover:bg-cyan-500/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <FileText size={14} /> Review
            </button>
            <button
              onClick={() => {
                onStatusChange(candidate.id, "rejected");
                onClose();
              }}
              disabled={candidate.status === "rejected"}
              className="flex-1 flex items-center justify-center gap-2 py-[11px] rounded-[10px] bg-red-500/[0.07] border border-red-500/20 text-red-400 font-bold text-[0.85rem] cursor-pointer hover:bg-red-500/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <ThumbsDown size={14} /> Tolak
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CandidatesPage() {
  const { token } = useDashboard();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [filterJob, setFilterJob] = useState("all");
  const [sortBy, setSortBy] = useState<
    "resumeScore" | "matchScore" | "appliedDate"
  >("resumeScore");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/applications/hr", token)
      .then((apps) => {
        const mapped: Candidate[] = apps.map((a: any, i: number) => ({
          id: a.id,
          name: a.candidate_name || "Kandidat",
          avatar: getInitials(a.candidate_name || "KD"),
          job: a.job_title || "-",
          jobId: a.job_id,
          resumeScore: a.resume_score ?? 0,
          matchScore: a.matching_score ?? 0,
          skills: (a.extracted_skills || [])
            .slice(0, 5)
            .map((s: any) => s.name || s),
          status: a.status,
          appliedDate: new Date(a.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          }),
          color: getColor(i),
        }));
        setCandidates(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (applicationId: string, status: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === applicationId ? { ...c, status } : c)),
    );
    try {
      await apiFetch(`/api/applications/${applicationId}/status`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Unique jobs for filter
  const uniqueJobs = [...new Set(candidates.map((c) => c.job))];

  const filtered = candidates
    .filter((c) => {
      const ms = filterStatus === "all" || c.status === filterStatus;
      const mj = filterJob === "all" || c.job === filterJob;
      const mq =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.job.toLowerCase().includes(search.toLowerCase());
      return ms && mj && mq;
    })
    .sort((a, b) => {
      if (sortBy === "resumeScore") return b.resumeScore - a.resumeScore;
      if (sortBy === "matchScore") return b.matchScore - a.matchScore;
      return 0;
    });

  // Stats
  const total = candidates.length;
  const shortlistedCount = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;
  const reviewCount = candidates.filter((c) => c.status === "review").length;
  const avgScore = total
    ? Math.round(candidates.reduce((s, c) => s + c.resumeScore, 0) / total)
    : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-emerald-400 animate-spin" />
          <span className="text-[#7a9585] text-[0.85rem]">
            Memuat kandidat...
          </span>
        </div>
      </div>
    );

  return (
    <>
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateDetailModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onStatusChange={updateStatus}
          />
        )}
      </AnimatePresence>

      <div>
        {/* Mini stats */}
        <FadeIn>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Total Kandidat",
                num: total,
                col: "#10b981",
                Icon: Star,
              },
              {
                label: "Shortlisted",
                num: shortlistedCount,
                col: "#f59e0b",
                Icon: ThumbsUp,
              },
              {
                label: "In Review",
                num: reviewCount,
                col: "#06b6d4",
                Icon: FileText,
              },
              {
                label: "Avg CV Score",
                num: avgScore,
                col: "#8b5cf6",
                Icon: TrendingUp,
              },
            ].map(({ label, num, col, Icon }, i) => (
              <div
                key={i}
                className="bg-[#0f1612] border border-emerald-500/15 rounded-[12px] p-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
                  style={{ background: `${col}15`, color: col }}>
                  <Icon size={15} />
                </div>
                <div>
                  <div
                    className="font-extrabold text-[1.4rem] leading-none"
                    style={{ color: col }}>
                    {num}
                  </div>
                  <div className="text-[0.7rem] text-[#7a9585] mt-[2px]">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.05}>
          <div className="flex gap-3 mb-5 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={14}
                className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama kandidat..."
                className="pl-[34px] bg-[#0f1612] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-[#0f1612] border border-emerald-500/15 rounded-[9px] py-[9px] pl-3 pr-8 text-[#e8f0ec] text-[0.82rem] outline-none cursor-pointer appearance-none focus:border-emerald-500">
                <option value="all">Semua Status</option>
                <option value="applied">Applied</option>
                <option value="review">In Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Ditolak</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
            </div>

            {/* Job filter */}
            {uniqueJobs.length > 1 && (
              <div className="relative">
                <select
                  value={filterJob}
                  onChange={(e) => setFilterJob(e.target.value)}
                  className="bg-[#0f1612] border border-emerald-500/15 rounded-[9px] py-[9px] pl-3 pr-8 text-[#e8f0ec] text-[0.82rem] outline-none cursor-pointer appearance-none focus:border-emerald-500 max-w-[180px]">
                  <option value="all">Semua Posisi</option>
                  {uniqueJobs.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
                />
              </div>
            )}

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0f1612] border border-emerald-500/15 rounded-[9px] py-[9px] pl-3 pr-8 text-[#e8f0ec] text-[0.82rem] outline-none cursor-pointer appearance-none focus:border-emerald-500">
                <option value="resumeScore">Sort: CV Score</option>
                <option value="matchScore">Sort: Match Score</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
            </div>

            <div className="text-[0.75rem] text-[#7a9585] ml-auto">
              {filtered.length} kandidat
            </div>
          </div>
        </FadeIn>

        {/* Candidate cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#7a9585]">
            <div className="text-[2.5rem] mb-3 opacity-30">🔍</div>
            <div className="font-syne font-bold text-[1rem] mb-2">
              {candidates.length === 0
                ? "Belum ada kandidat"
                : "Tidak ada kandidat ditemukan"}
            </div>
            <p className="text-[0.82rem]">
              {candidates.length === 0
                ? "Kandidat akan muncul setelah ada yang melamar lowongan."
                : "Coba ubah filter pencarian."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {filtered.map((c, i) => {
                const st = statusMap[c.status] ?? {
                  label: c.status,
                  color: "#7a9585",
                };
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 hover:border-emerald-500/25 transition-all group">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div
                        className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center font-extrabold text-[0.75rem] flex-shrink-0"
                        style={{
                          background: i < 3 ? `${rankColors[i]}20` : "#141f19",
                          color: i < 3 ? rankColors[i] : "#7a9585",
                          border: `1px solid ${i < 3 ? rankColors[i] + "40" : "rgba(16,185,129,0.15)"}`,
                        }}>
                        {i + 1}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center font-extrabold text-[0.8rem] flex-shrink-0"
                        style={{ background: `${c.color}18`, color: c.color }}>
                        {c.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-[3px] flex-wrap">
                          <span className="font-semibold text-[0.9rem]">
                            {c.name}
                          </span>
                          <span
                            className="px-[8px] py-[2px] rounded-full text-[0.65rem] font-bold"
                            style={{
                              background: `${st.color}15`,
                              color: st.color,
                              border: `1px solid ${st.color}30`,
                            }}>
                            {st.label}
                          </span>
                        </div>
                        <div className="text-[0.72rem] text-[#7a9585]">
                          {c.job} · {c.appliedDate}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="hidden md:flex flex-wrap gap-[4px] max-w-[200px]">
                        {c.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="bg-white/[0.04] border border-white/[0.07] px-[6px] py-[2px] rounded-[4px] text-[0.65rem] font-mono text-[#e8f0ec]">
                            {s}
                          </span>
                        ))}
                        {c.skills.length > 3 && (
                          <span className="text-[0.65rem] text-[#7a9585] py-[2px]">
                            +{c.skills.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Scores */}
                      <div className="flex items-center gap-5 flex-shrink-0">
                        <div className="text-center">
                          <div className="font-extrabold text-[1.1rem] text-emerald-400">
                            {c.resumeScore || "—"}
                          </div>
                          <div className="text-[0.62rem] text-[#7a9585]">
                            CV
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-extrabold text-[1.1rem] text-violet-400">
                            {c.matchScore ? `${c.matchScore}%` : "—"}
                          </div>
                          <div className="text-[0.62rem] text-[#7a9585]">
                            Match
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-[6px] flex-shrink-0">
                        <button
                          onClick={() => updateStatus(c.id, "shortlisted")}
                          disabled={c.status === "shortlisted"}
                          className="w-8 h-8 rounded-[7px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Shortlist">
                          <ThumbsUp size={12} />
                        </button>
                        <button
                          onClick={() => updateStatus(c.id, "rejected")}
                          disabled={c.status === "rejected"}
                          className="w-8 h-8 rounded-[7px] bg-red-500/[0.07] border border-red-500/20 text-red-400 flex items-center justify-center cursor-pointer hover:bg-red-500/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Tolak">
                          <ThumbsDown size={12} />
                        </button>
                        <button
                          onClick={() => setSelectedCandidate(c)}
                          className="w-8 h-8 rounded-[7px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] flex items-center justify-center cursor-pointer hover:border-emerald-500/35 hover:text-[#e8f0ec] transition-all"
                          title="Lihat detail">
                          <Eye size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
