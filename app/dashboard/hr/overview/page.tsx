"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  TrendingUp,
  Star,
  Zap,
  Search,
  ChevronDown,
  Download,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Settings,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FadeIn,
  CardTitle,
  apiFetch,
  getColor,
  getInitials,
  statusMap,
  rankColors,
  Candidate,
  JobSummary,
} from "../_components/shared";
import { useDashboard } from "../layout";

export default function OverviewPage() {
  const { token, company } = useDashboard();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobSummaries, setJobSummaries] = useState<JobSummary[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilter] = useState("all");

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const apps = await apiFetch("/api/applications/hr", token);
        const mapped: Candidate[] = apps.map((a: any, i: number) => ({
          id: a.id,
          name: a.candidate_name || "Kandidat",
          avatar: getInitials(a.candidate_name || "KD"),
          job: a.job_title || "-",
          jobId: a.job_id,
          resumeScore: a.resume_score ?? 0,
          matchScore: a.matching_score ?? 0,
          skills: (a.extracted_skills || [])
            .slice(0, 3)
            .map((s: any) => s.name || s),
          status: a.status,
          appliedDate: new Date(a.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          }),
          color: getColor(i),
        }));
        setCandidates(mapped);

        const jobMap: Record<string, JobSummary> = {};
        apps.forEach((a: any) => {
          const title = a.job_title;
          if (!title) return;
          if (!jobMap[title])
            jobMap[title] = {
              title,
              applicants: 0,
              shortlisted: 0,
              color: getColor(Object.keys(jobMap).length),
            };
          jobMap[title].applicants++;
          if (a.status === "shortlisted") jobMap[title].shortlisted++;
        });
        setJobSummaries(Object.values(jobMap));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
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
    } catch {
      // rollback handled by re-fetch if needed
    }
  };

  const totalApplicants = candidates.length;
  const shortlisted = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;
  const avgScore = candidates.length
    ? Math.round(
        candidates.reduce((a, c) => a + c.resumeScore, 0) / candidates.length,
      )
    : 0;
  const activeJobs = jobSummaries.length;

  const stats = [
    {
      Icon: Users,
      bg: "rgba(16,185,129,0.12)",
      col: "#10b981",
      num: totalApplicants,
      label: "Total Pelamar",
      delta: "dari semua posisi",
    },
    {
      Icon: Star,
      bg: "rgba(245,158,11,0.12)",
      col: "#f59e0b",
      num: shortlisted,
      label: "Shortlisted",
      delta: "kandidat terpilih",
    },
    {
      Icon: TrendingUp,
      bg: "rgba(6,182,212,0.12)",
      col: "#06b6d4",
      num: avgScore,
      label: "Avg Resume Score",
      delta: "rata-rata skor AI",
    },
    {
      Icon: Zap,
      bg: "rgba(139,92,246,0.12)",
      col: "#8b5cf6",
      num: activeJobs,
      label: "Posisi Aktif",
      delta: "lowongan berjalan",
    },
  ];

  const filtered = candidates
    .filter((c) => {
      const ms = filterStatus === "all" || c.status === filterStatus;
      const mq =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.job.toLowerCase().includes(search.toLowerCase());
      return ms && mq;
    })
    .sort((a, b) => b.resumeScore - a.resumeScore);

  return (
    <div>
      {/* Stats */}
      <FadeIn>
        <div className="grid grid-cols-4 gap-[14px] mb-6">
          {stats.map(({ Icon, bg, col, num, label, delta }, i) => (
            <div
              key={i}
              className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 transition-all duration-200 hover:border-emerald-500/35 hover:-translate-y-[2px]">
              <div
                className="w-9 h-9 rounded-[9px] flex items-center justify-center mb-[14px]"
                style={{ background: bg, color: col }}>
                <Icon size={16} />
              </div>
              <div
                className="font-extrabold text-[2rem] leading-none mb-1"
                style={{ color: col }}>
                {num}
              </div>
              <div className="text-[0.75rem] text-[#7a9585] mb-1">{label}</div>
              <div className="text-[0.7rem] text-emerald-400">{delta}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* 2-col */}
      <div
        className="grid gap-5 mb-6"
        style={{ gridTemplateColumns: "1fr 280px" }}>
        <FadeIn delay={0.05}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
            <CardTitle>Ringkasan Posisi Aktif</CardTitle>
            {jobSummaries.length === 0 ? (
              <div className="text-center py-8 text-[#7a9585] text-[0.82rem]">
                Belum ada lowongan aktif
              </div>
            ) : (
              jobSummaries.map((j, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 py-[11px] ${i < jobSummaries.length - 1 ? "border-b border-emerald-500/15" : ""}`}>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: j.color }}
                  />
                  <div className="flex-1">
                    <div className="text-[0.85rem] font-semibold">
                      {j.title}
                    </div>
                    <div className="text-[0.72rem] text-[#7a9585]">
                      {j.applicants} pelamar · {j.shortlisted} shortlisted
                    </div>
                  </div>
                  <div className="w-[90px] mr-3">
                    <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${j.applicants ? (j.shortlisted / j.applicants) * 100 : 0}%`,
                          background: j.color,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="px-[9px] py-[3px] rounded-[5px] text-[0.68rem] font-bold"
                    style={{
                      background: `${j.color}15`,
                      color: j.color,
                      border: `1px solid ${j.color}30`,
                    }}>
                    {j.applicants
                      ? Math.round((j.shortlisted / j.applicants) * 100)
                      : 0}
                    %
                  </span>
                </div>
              ))
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
            <CardTitle>Info Perusahaan</CardTitle>
            {company ? (
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-[12px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="font-syne font-bold text-[1rem] mb-1">
                    {company.name}
                  </div>
                  {company.company_size && (
                    <div className="text-[0.75rem] text-[#7a9585] mb-2">
                      👥 {company.company_size}
                    </div>
                  )}
                  {company.description && (
                    <p className="text-[0.78rem] text-[#7a9585] leading-[1.6]">
                      {company.description}
                    </p>
                  )}
                </div>
                <button className="flex items-center gap-[6px] text-[0.75rem] text-emerald-400 hover:text-emerald-300 transition-colors mt-1">
                  <Settings size={12} /> Edit profil perusahaan
                </button>
              </div>
            ) : (
              <div className="text-[#7a9585] text-[0.82rem]">
                Belum ada data perusahaan
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Candidate table */}
      <FadeIn delay={0.12}>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <div className="font-bold text-[1rem]">
              Candidate Ranking — AI Analyzer
            </div>
            <div className="text-[0.75rem] text-[#7a9585] mt-[3px]">
              Diurutkan berdasarkan resume score · {filtered.length} kandidat
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau posisi..."
                className="pl-[34px] w-[220px] bg-[#0f1612] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-[#0f1612] border border-emerald-500/15 rounded-[9px] py-[9px] pl-3 pr-8 text-[#e8f0ec] text-[0.82rem] outline-none cursor-pointer appearance-none transition-all focus:border-emerald-500">
                <option value="all">Semua Status</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="applied">Applied</option>
                <option value="review">In Review</option>
                <option value="rejected">Ditolak</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
            </div>
            <Button
              variant="outline"
              className="inline-flex items-center gap-[6px] border-emerald-500/15 text-[#7a9585] text-[0.8rem] font-medium px-[14px] py-[9px] rounded-[9px] hover:border-emerald-500/35 hover:text-[#e8f0ec] bg-transparent">
              <Download size={13} /> Export
            </Button>
          </div>
        </div>

        <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] overflow-hidden">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead className="bg-[#141f19]">
              <tr>
                {[
                  "#",
                  "Kandidat",
                  "Skills",
                  "Resume Score",
                  "Match Score",
                  "Status",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[0.72rem] font-bold text-[#7a9585] tracking-[0.07em] uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-[#7a9585]">
                      <div className="text-[2rem] mb-[10px] opacity-40">🔍</div>
                      {candidates.length === 0
                        ? "Belum ada pelamar masuk"
                        : "Tidak ada kandidat ditemukan"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => {
                    const st = statusMap[c.status] ?? {
                      label: c.status,
                      color: "#7a9585",
                    };
                    return (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        className="hover:bg-emerald-500/[0.02] transition-colors border-t border-emerald-500/15">
                        <td className="px-4 py-[14px]">
                          <div
                            className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center font-extrabold text-[0.72rem]"
                            style={{
                              background:
                                i < 3 ? `${rankColors[i]}20` : "#141f19",
                              color: i < 3 ? rankColors[i] : "#7a9585",
                              border: `1px solid ${i < 3 ? rankColors[i] + "40" : "rgba(16,185,129,0.15)"}`,
                            }}>
                            {i + 1}
                          </div>
                        </td>
                        <td className="px-4 py-[14px]">
                          <div className="flex items-center gap-[10px]">
                            <div
                              className="w-9 h-9 rounded-[9px] flex items-center justify-center font-extrabold text-[0.75rem] flex-shrink-0"
                              style={{
                                background: `${c.color}18`,
                                color: c.color,
                              }}>
                              {c.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-[0.88rem]">
                                {c.name}
                              </div>
                              <div className="text-[0.72rem] text-[#7a9585] mt-[2px]">
                                {c.job} · {c.appliedDate}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-[14px]">
                          <div className="flex flex-wrap">
                            {c.skills.length > 0 ? (
                              c.skills.map((s) => (
                                <span
                                  key={s}
                                  className="inline-block bg-white/[0.04] border border-white/[0.08] px-[7px] py-[2px] rounded-[4px] text-[0.68rem] font-mono mr-[3px] mb-[2px]">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-[0.72rem] text-[#7a9585]">
                                —
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-[14px]">
                          <div className="flex items-center gap-[10px]">
                            <div className="w-[100px] h-[5px] rounded-full bg-white/[0.05] overflow-hidden flex-shrink-0">
                              <div
                                className="h-full rounded-full transition-all duration-[1s]"
                                style={{
                                  width: `${c.resumeScore}%`,
                                  background:
                                    "linear-gradient(90deg,#10b981,#06b6d4)",
                                }}
                              />
                            </div>
                            <span className="text-[0.8rem] font-bold min-w-[28px] text-emerald-400">
                              {c.resumeScore || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-[14px]">
                          <div className="flex items-center gap-[10px]">
                            <div className="w-[100px] h-[5px] rounded-full bg-white/[0.05] overflow-hidden flex-shrink-0">
                              <div
                                className="h-full rounded-full transition-all duration-[1s]"
                                style={{
                                  width: `${c.matchScore}%`,
                                  background:
                                    "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                                }}
                              />
                            </div>
                            <span className="text-[0.8rem] font-bold min-w-[28px] text-violet-400">
                              {c.matchScore ? `${c.matchScore}%` : "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-[14px]">
                          <span
                            className="inline-flex items-center px-[10px] py-1 rounded-full text-[0.67rem] font-bold tracking-[0.05em] uppercase"
                            style={{
                              background: `${st.color}15`,
                              color: st.color,
                              border: `1px solid ${st.color}30`,
                            }}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-[14px]">
                          <div className="flex gap-[6px] items-center">
                            <button
                              onClick={() => updateStatus(c.id, "shortlisted")}
                              disabled={c.status === "shortlisted"}
                              className="flex items-center gap-1 px-3 py-[7px] rounded-[7px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[0.75rem] font-bold cursor-pointer hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                              <ThumbsUp size={11} /> Shortlist
                            </button>
                            <button
                              onClick={() => updateStatus(c.id, "rejected")}
                              disabled={c.status === "rejected"}
                              className="flex items-center gap-1 px-3 py-[7px] rounded-[7px] bg-red-500/[0.07] border border-red-500/20 text-red-400 text-[0.75rem] font-bold cursor-pointer hover:bg-red-500/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                              <ThumbsDown size={11} /> Tolak
                            </button>
                            <button className="w-[30px] h-[30px] rounded-[7px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] flex items-center justify-center cursor-pointer transition-all hover:border-emerald-500/35 hover:text-[#e8f0ec]">
                              <Eye size={12} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </FadeIn>
    </div>
  );
}
