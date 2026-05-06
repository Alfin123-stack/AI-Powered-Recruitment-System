"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Star,
  Target,
  ChevronRight,
  Upload,
  ExternalLink,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  SideTitle,
  ScoreRing,
  apiFetch,
  getColor,
  statusMap,
  Application,
} from "./_components/shared";
import { useDashboard } from "../../layout";

// Rekomendasi job hardcoded — nanti bisa diganti fetch dari backend
const recommendations = [
  {
    title: "Senior React Developer",
    company: "GoTo Group",
    match: 91,
    color: "#10b981",
  },
  {
    title: "Frontend Specialist",
    company: "Tokopedia",
    match: 87,
    color: "#06b6d4",
  },
  {
    title: "Next.js Engineer",
    company: "Traveloka",
    match: 83,
    color: "#8b5cf6",
  },
];

const TABS = [
  { id: "all", label: "Semua" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "review", label: "In Review" },
  { id: "applied", label: "Dikirim" },
  { id: "rejected", label: "Ditolak" },
];

export default function CandidateDashboard() {
  const { token, user } = useDashboard();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/applications/my", token)
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filtered =
    activeTab === "all"
      ? applications
      : applications.filter((a) => a.status === activeTab);
  const shortlistedCount = applications.filter(
    (a) => a.status === "shortlisted",
  ).length;
  const avgResume = applications.length
    ? Math.round(
        applications.reduce((s, a) => s + (a.resume_score || 0), 0) /
          applications.length,
      )
    : 0;
  const avgMatch = applications.length
    ? Math.round(
        applications.reduce((s, a) => s + (a.matching_score || 0), 0) /
          applications.length,
      )
    : 0;

  const stats = [
    {
      Icon: Briefcase,
      bg: "rgba(16,185,129,0.12)",
      col: "#10b981",
      num: applications.length,
      label: "Total Lamaran",
      sub: "semua posisi",
    },
    {
      Icon: Star,
      bg: "rgba(245,158,11,0.12)",
      col: "#f59e0b",
      num: shortlistedCount,
      label: "Shortlisted",
      sub: "peluang interview",
    },
    {
      Icon: TrendingUp,
      bg: "rgba(6,182,212,0.12)",
      col: "#06b6d4",
      num: avgResume,
      label: "Avg Resume Score",
      sub: "skor rata-rata CV",
    },
    {
      Icon: Target,
      bg: "rgba(139,92,246,0.12)",
      col: "#8b5cf6",
      num: `${avgMatch}%`,
      label: "Avg Match Score",
      sub: "kecocokan rata-rata",
    },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <FadeIn>
        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/[0.07] border border-emerald-500/15 rounded-[16px] px-7 py-[22px] mb-6 flex items-center justify-between gap-5">
          <div>
            <h2 className="font-extrabold text-[1.2rem] mb-1">
              Selamat datang kembali,{" "}
              {user?.full_name?.split(" ")[0] || "Kandidat"}! 👋
            </h2>
            <p className="text-[#7a9585] text-[0.85rem]">
              {shortlistedCount > 0 ? (
                <>
                  Anda memiliki{" "}
                  <strong className="text-emerald-400">
                    {shortlistedCount} shortlist
                  </strong>{" "}
                  menunggu interview.
                </>
              ) : (
                "Mulai lamar lowongan yang sesuai dengan skill kamu."
              )}
            </p>
          </div>
          <Button
            asChild
            className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] text-black font-bold text-[0.85rem] px-5 py-[10px] rounded-[9px] flex-shrink-0">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-[7px]">
              <Upload size={14} /> Upload CV Baru
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-4 gap-[14px] mb-6">
          {stats.map(({ Icon, bg, col, num, label, sub }, i) => (
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
              <div className="text-[0.75rem] text-[#7a9585] mb-[2px]">
                {label}
              </div>
              <div className="text-[0.68rem] text-emerald-400">{sub}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* CV Score banner */}
      {avgResume > 0 && (
        <FadeIn delay={0.08}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] px-[22px] py-[18px] mb-6 flex items-center gap-5">
            <ScoreRing score={avgResume} size={72} color="#10b981" />
            <div className="flex-1">
              <h3 className="font-bold text-[0.95rem] mb-1">
                Rata-rata Resume Score:{" "}
                <span className="text-emerald-400">{avgResume}/100</span>
              </h3>
              <p className="text-[0.8rem] text-[#7a9585] leading-[1.5]">
                Berdasarkan {applications.length} lamaran. Upload CV terbaru
                untuk meningkatkan skor.
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="inline-flex items-center gap-[6px] border-emerald-500/15 text-[#e8f0ec] text-[0.8rem] font-medium px-4 py-2 rounded-[8px] hover:border-emerald-500/35 hover:text-emerald-400 bg-transparent flex-shrink-0">
              <Link href="/analyze">
                Analisis CV <ChevronRight size={13} />
              </Link>
            </Button>
          </div>
        </FadeIn>
      )}

      {/* 2-col */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 300px" }}>
        {/* Applications */}
        <FadeIn delay={0.1}>
          <div>
            {/* Tabs */}
            <div className="flex gap-1 bg-[#0f1612] border border-emerald-500/15 rounded-[10px] p-1 mb-4 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-[14px] py-[7px] rounded-[7px] border-0 text-[0.8rem] font-medium cursor-pointer transition-all whitespace-nowrap
                    ${activeTab === t.id ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"}`}>
                  {t.label}
                  {t.id !== "all" && (
                    <span className="ml-[5px] bg-white/[0.07] rounded-[4px] px-[5px] py-[1px] text-[0.65rem]">
                      {applications.filter((a) => a.status === t.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-[#7a9585] text-[0.85rem]">
                Memuat lamaran...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-14">
                <div className="text-[2.5rem] mb-3 opacity-30">📭</div>
                <div className="font-syne font-bold text-[0.95rem] mb-2">
                  {applications.length === 0
                    ? "Belum ada lamaran"
                    : "Tidak ada lamaran di kategori ini"}
                </div>
                <p className="text-[#7a9585] text-[0.82rem] mb-5">
                  {applications.length === 0
                    ? "Mulai lamar lowongan yang sesuai dengan skill kamu."
                    : "Coba tab lain."}
                </p>
                {applications.length === 0 && (
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-[9px] rounded-[9px] text-[0.85rem] no-underline">
                    Cari Lowongan →
                  </Link>
                )}
              </div>
            ) : (
              filtered.map((app, i) => {
                const st = statusMap[app.status] ?? {
                  label: app.status,
                  color: "#7a9585",
                };
                const color = getColor(i);
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}>
                    <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 mb-3 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                      {/* Top */}
                      <div className="flex items-start gap-3 mb-[14px]">
                        <div
                          className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.08]"
                          style={{ background: `${color}18`, color }}>
                          <Building2 size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[0.95rem] mb-[3px]">
                            {app.job_title}
                          </div>
                          <div className="text-[0.78rem] text-[#7a9585]">
                            {app.company_name}
                          </div>
                        </div>
                        <span
                          className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[0.68rem] font-bold tracking-[0.05em] uppercase flex-shrink-0"
                          style={{
                            background: `${st.color}15`,
                            color: st.color,
                            border: `1px solid ${st.color}30`,
                          }}>
                          {st.label}
                        </span>
                      </div>

                      <div className="text-[0.72rem] text-[#7a9585] mb-[14px]">
                        📅 Dilamar{" "}
                        {new Date(app.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      {/* Score bars */}
                      {(app.resume_score > 0 || app.matching_score > 0) && (
                        <div className="flex flex-col gap-2">
                          {app.resume_score > 0 && (
                            <div className="flex items-center gap-[10px]">
                              <span className="text-[0.75rem] text-[#7a9585] w-[120px] flex-shrink-0">
                                Resume Score
                              </span>
                              <div className="flex-1 h-[5px] rounded-full bg-white/[0.05] overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-[1s]"
                                  style={{
                                    width: `${app.resume_score}%`,
                                    background:
                                      "linear-gradient(90deg,#10b981,#06b6d4)",
                                  }}
                                />
                              </div>
                              <span className="text-[0.75rem] font-bold w-9 text-right text-emerald-400">
                                {app.resume_score}
                              </span>
                            </div>
                          )}
                          {app.matching_score > 0 && (
                            <div className="flex items-center gap-[10px]">
                              <span className="text-[0.75rem] text-[#7a9585] w-[120px] flex-shrink-0">
                                Job Match
                              </span>
                              <div className="flex-1 h-[5px] rounded-full bg-white/[0.05] overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-[1s]"
                                  style={{
                                    width: `${app.matching_score}%`,
                                    background:
                                      "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                                  }}
                                />
                              </div>
                              <span className="text-[0.75rem] font-bold w-9 text-right text-violet-400">
                                {app.matching_score}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </FadeIn>

        {/* Right panels */}
        <FadeIn delay={0.12}>
          <div>
            {/* Rekomendasi AI */}
            <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-[18px] mb-4">
              <SideTitle>Rekomendasi AI</SideTitle>
              {recommendations.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-[10px] py-[10px] ${i < recommendations.length - 1 ? "border-b border-emerald-500/15" : ""}`}>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: r.color }}
                  />
                  <div className="flex-1">
                    <div className="text-[0.82rem] font-semibold">
                      {r.title}
                    </div>
                    <div className="text-[0.72rem] text-[#7a9585]">
                      {r.company}
                    </div>
                  </div>
                  <span
                    className="text-[0.72rem] font-bold flex-shrink-0"
                    style={{ color: r.color }}>
                    {r.match}%
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-[#7a9585] flex-shrink-0"
                  />
                </div>
              ))}
              <Link
                href="/jobs"
                className="flex items-center justify-center gap-[5px] mt-[14px] text-emerald-400 text-[0.78rem] font-semibold no-underline hover:opacity-75 transition-opacity">
                Lihat semua lowongan <ExternalLink size={12} />
              </Link>
            </div>

            {/* Upload CTA */}
            <div className="bg-gradient-to-br from-emerald-500/[0.07] to-cyan-500/[0.05] border border-emerald-500/15 rounded-[14px] p-[18px] text-center">
              <div className="text-[1.8rem] mb-[10px]">📄</div>
              <div className="font-bold text-[0.9rem] mb-[6px]">
                Update CV Anda
              </div>
              <p className="text-[#7a9585] text-[0.78rem] leading-[1.55] mb-[14px]">
                Upload CV terbaru untuk mendapatkan analisis AI dan kecocokan
                yang lebih akurat.
              </p>
              <Button
                asChild
                className="w-full bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] text-black font-bold text-[0.85rem] py-[10px] rounded-[9px]">
                <Link
                  href="/analyze"
                  className="inline-flex items-center justify-center gap-[7px]">
                  <Upload size={13} /> Upload CV
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
