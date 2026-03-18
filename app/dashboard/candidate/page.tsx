"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Star,
  ChevronRight,
  Upload,
  Bell,
  Settings,
  FileText,
  BarChart3,
  Target,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────
type Application = {
  job: string;
  company: string;
  companyInitial: string;
  color: string;
  resumeScore: number;
  matchScore: number;
  status: string;
  appliedDate: string;
  location: string;
  salary: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const user = {
  name: "Arif Pratama",
  role: "Frontend Developer",
  avatar: "AP",
  resumeScore: 84,
  lastUpdated: "3 hari lalu",
};

const applications: Application[] = [
  {
    job: "Frontend Developer",
    company: "PT Teknologi Indonesia",
    companyInitial: "TI",
    color: "#10b981",
    resumeScore: 88,
    matchScore: 84,
    status: "shortlisted",
    appliedDate: "10 Jan 2025",
    location: "Jakarta / Remote",
    salary: "Rp 8–15 jt",
  },
  {
    job: "React Developer",
    company: "Startup Digital Nusantara",
    companyInitial: "SD",
    color: "#06b6d4",
    resumeScore: 75,
    matchScore: 70,
    status: "pending",
    appliedDate: "8 Jan 2025",
    location: "Remote",
    salary: "Rp 10–18 jt",
  },
  {
    job: "UI Engineer",
    company: "Fintech Maju Bersama",
    companyInitial: "FM",
    color: "#8b5cf6",
    resumeScore: 80,
    matchScore: 76,
    status: "review",
    appliedDate: "5 Jan 2025",
    location: "Bandung / Hybrid",
    salary: "Rp 9–14 jt",
  },
  {
    job: "Frontend Engineer",
    company: "Creative Agency Jakarta",
    companyInitial: "CA",
    color: "#f59e0b",
    resumeScore: 65,
    matchScore: 58,
    status: "rejected",
    appliedDate: "1 Jan 2025",
    location: "Jakarta",
    salary: "Rp 6–10 jt",
  },
];

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

const activities = [
  {
    text: "CV Anda dilihat oleh PT Teknologi Indonesia",
    time: "2 jam lalu",
    icon: "👀",
    color: "#10b981",
  },
  {
    text: "Anda di-shortlist untuk posisi Frontend Developer",
    time: "1 hari lalu",
    icon: "🎉",
    color: "#f59e0b",
  },
  {
    text: "Analisis CV diperbarui oleh AI",
    time: "3 hari lalu",
    icon: "🤖",
    color: "#06b6d4",
  },
  {
    text: "Lamaran UI Engineer sedang dalam review",
    time: "6 hari lalu",
    icon: "📋",
    color: "#8b5cf6",
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  pending: { label: "Pending", color: "#f59e0b" },
  review: { label: "In Review", color: "#06b6d4" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};

const TABS = [
  { id: "all", label: "Semua" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "pending", label: "Pending" },
  { id: "review", label: "In Review" },
  { id: "rejected", label: "Ditolak" },
];

// ── FadeIn ────────────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── SideTitle ─────────────────────────────────────────────────────────────────
function SideTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[7px] font-bold text-[0.88rem] mb-[14px]">
      <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 flex-shrink-0" />
      {children}
    </div>
  );
}

// ── IconButton ────────────────────────────────────────────────────────────────
function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-[34px] h-[34px] rounded-[8px] bg-[#0f1612] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] cursor-pointer transition-all hover:border-emerald-500/35 hover:text-[#e8f0ec]">
      {children}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeNav, setActiveNav] = useState("dashboard");

  const filtered =
    activeTab === "all"
      ? applications
      : applications.filter((a) => a.status === activeTab);

  const shortlistedCount = applications.filter(
    (a) => a.status === "shortlisted",
  ).length;
  const avgResume = Math.round(
    applications.reduce((s, a) => s + a.resumeScore, 0) / applications.length,
  );
  const avgMatch = Math.round(
    applications.reduce((s, a) => s + a.matchScore, 0) / applications.length,
  );

  const navItems = [
    { id: "dashboard", Icon: BarChart3, label: "Dashboard" },
    { id: "applications", Icon: Briefcase, label: "My Applications" },
    { id: "cv", Icon: FileText, label: "CV Analyzer" },
    { id: "matches", Icon: Target, label: "Job Matches" },
    { id: "interviews", Icon: Calendar, label: "Interviews" },
  ];

  const statItems = [
    {
      Icon: Briefcase,
      bg: "rgba(16,185,129,0.12)",
      col: "#10b981",
      num: `${applications.length}`,
      label: "Total Lamaran",
    },
    {
      Icon: Star,
      bg: "rgba(245,158,11,0.12)",
      col: "#f59e0b",
      num: `${shortlistedCount}`,
      label: "Shortlisted",
    },
    {
      Icon: TrendingUp,
      bg: "rgba(6,182,212,0.12)",
      col: "#06b6d4",
      num: `${avgResume}`,
      label: "Avg. Resume Score",
    },
    {
      Icon: Target,
      bg: "rgba(139,92,246,0.12)",
      col: "#8b5cf6",
      num: `${avgMatch}%`,
      label: "Avg. Match Score",
    },
  ];

  const circ = 2 * Math.PI * 28;

  return (
    <div className="flex min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* ── SIDEBAR ── */}
      <aside className="w-[240px] flex-shrink-0 bg-[#0f1612] border-r border-emerald-500/15 flex flex-col fixed top-0 left-0 bottom-0 z-50">
        <Link
          href="/"
          className="px-5 py-[22px] pb-[18px] border-b border-emerald-500/15 font-extrabold text-[1.1rem] flex items-center gap-2 text-[#e8f0ec] no-underline">
          <span className="text-emerald-400">✦</span> Recruit
          <em className="not-italic text-emerald-400">AI</em>
        </Link>

        <div className="flex-1 overflow-y-auto pt-2">
          <div className="px-3 pt-4 pb-2 text-[0.67rem] font-bold text-[#7a9585] tracking-[0.12em] uppercase">
            Menu
          </div>
          {navItems.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`flex items-center gap-[10px] px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium cursor-pointer border w-[calc(100%-16px)] text-left transition-all duration-200
                ${
                  activeNav === id
                    ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20"
                    : "text-[#7a9585] bg-transparent border-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04]"
                }`}>
              <Icon size={15} /> {label}
            </button>
          ))}

          <div className="px-3 pt-4 pb-2 text-[0.67rem] font-bold text-[#7a9585] tracking-[0.12em] uppercase">
            Akun
          </div>
          {[
            { Icon: Bell, label: "Notifikasi" },
            { Icon: Settings, label: "Pengaturan" },
          ].map(({ Icon, label }, i) => (
            <button
              key={i}
              className="flex items-center gap-[10px] px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium text-[#7a9585] cursor-pointer border border-transparent bg-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04] w-[calc(100%-16px)] transition-all">
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="border-t border-emerald-500/15 px-3 py-4">
          <div className="flex items-center gap-[10px] px-2 py-[10px] rounded-[10px]">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-extrabold text-[0.78rem] text-emerald-400 flex-shrink-0">
              {user.avatar}
            </div>
            <div>
              <div className="text-[0.82rem] font-semibold">{user.name}</div>
              <div className="text-[0.7rem] text-[#7a9585]">{user.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="ml-[240px] flex-1">
        {/* Topbar */}
        <div
          className="sticky top-0 z-40 border-b border-emerald-500/15 px-8 h-[60px] flex items-center justify-between"
          style={{
            background: "rgba(10,15,13,0.88)",
            backdropFilter: "blur(16px)",
          }}>
          <span className="font-bold text-[1rem]">Candidate Dashboard</span>
          <div className="flex items-center gap-2">
            <IconButton>
              <Bell size={15} />
            </IconButton>
            <IconButton>
              <Settings size={15} />
            </IconButton>
            <div className="w-8 h-8 rounded-[8px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-extrabold text-[0.78rem] text-emerald-400">
              {user.avatar}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-7 pb-[60px]">
          {/* ── Welcome ── */}
          <FadeIn>
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/[0.07] border border-emerald-500/15 rounded-[16px] px-7 py-[22px] mb-6 flex items-center justify-between gap-5">
              <div>
                <h2 className="font-extrabold text-[1.2rem] mb-1">
                  Selamat datang kembali, {user.name.split(" ")[0]}! 👋
                </h2>
                <p className="text-[#7a9585] text-[0.85rem]">
                  Anda memiliki{" "}
                  <strong className="text-emerald-400">1 shortlist baru</strong>{" "}
                  dan <strong className="text-amber-400">2 lamaran</strong> yang
                  sedang diproses.
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

          {/* ── Stats ── */}
          <FadeIn delay={0.05}>
            <div className="grid grid-cols-4 gap-[14px] mb-6">
              {statItems.map(({ Icon, bg, col, num, label }, i) => (
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
                  <div className="text-[0.75rem] text-[#7a9585]">{label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ── CV Banner ── */}
          <FadeIn delay={0.08}>
            <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] px-[22px] py-[18px] mb-6 flex items-center gap-5">
              {/* Score ring */}
              <div className="relative w-[72px] h-[72px] flex-shrink-0">
                <svg width="72" height="72">
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="7"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${(circ * user.resumeScore) / 100} ${circ}`}
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "36px 36px",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[1.3rem] text-emerald-400">
                  {user.resumeScore}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-[0.95rem] mb-1">
                  Resume Score Anda:{" "}
                  <span className="text-emerald-400">
                    {user.resumeScore}/100
                  </span>
                </h3>
                <p className="text-[0.8rem] text-[#7a9585] leading-[1.5]">
                  CV terakhir diperbarui {user.lastUpdated}. Ada 3 rekomendasi
                  AI yang bisa meningkatkan skor Anda hingga{" "}
                  <strong className="text-emerald-400">+8 poin</strong>.
                </p>
              </div>

              <Button
                variant="outline"
                className="inline-flex items-center gap-[6px] border-emerald-500/15 text-[#e8f0ec] text-[0.8rem] font-medium px-4 py-2 rounded-[8px] hover:border-emerald-500/35 hover:text-emerald-400 bg-transparent flex-shrink-0"
                asChild>
                <Link href="/analyze">
                  Lihat Analisis <ChevronRight size={13} />
                </Link>
              </Button>
            </div>
          </FadeIn>

          {/* ── 2-col ── */}
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "1fr 300px" }}>
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
                        ${
                          activeTab === t.id
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                        }`}>
                      {t.label}
                      {t.id !== "all" && (
                        <span className="ml-[5px] bg-white/[0.07] rounded-[4px] px-[5px] py-[1px] text-[0.65rem]">
                          {applications.filter((a) => a.status === t.id).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Cards */}
                {filtered.length === 0 ? (
                  <div className="text-center py-12 text-[#7a9585]">
                    <div className="text-[2.5rem] mb-3 opacity-40">📭</div>
                    <div className="font-bold text-[#e8f0ec] mb-[6px]">
                      Tidak ada lamaran
                    </div>
                    <p className="text-[0.85rem]">
                      Belum ada lamaran dengan status ini.
                    </p>
                  </div>
                ) : (
                  filtered.map((app, i) => {
                    const st = statusMap[app.status];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}>
                        <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 mb-3 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                          {/* Top */}
                          <div className="flex items-start gap-3 mb-[14px]">
                            <div
                              className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center font-extrabold text-[0.8rem] flex-shrink-0"
                              style={{
                                background: `${app.color}18`,
                                color: app.color,
                              }}>
                              {app.companyInitial}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-[0.95rem] mb-[3px]">
                                {app.job}
                              </div>
                              <div className="text-[0.78rem] text-[#7a9585]">
                                {app.company}
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

                          {/* Meta */}
                          <div className="flex gap-[14px] flex-wrap mb-[14px]">
                            {[
                              `📍 ${app.location}`,
                              `💰 ${app.salary}`,
                              `📅 ${app.appliedDate}`,
                            ].map((m) => (
                              <span
                                key={m}
                                className="text-[0.75rem] text-[#7a9585]">
                                {m}
                              </span>
                            ))}
                          </div>

                          {/* Score bars */}
                          <div className="flex flex-col gap-2">
                            {[
                              {
                                label: "Resume Score",
                                val: app.resumeScore,
                                grad: "linear-gradient(90deg,#10b981,#06b6d4)",
                                col: "#10b981",
                                suffix: "",
                              },
                              {
                                label: "Job Match",
                                val: app.matchScore,
                                grad: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                                col: "#8b5cf6",
                                suffix: "%",
                              },
                            ].map(({ label, val, grad, col, suffix }) => (
                              <div
                                key={label}
                                className="flex items-center gap-[10px]">
                                <span className="text-[0.75rem] text-[#7a9585] w-[120px] flex-shrink-0">
                                  {label}
                                </span>
                                <div className="flex-1 h-[5px] rounded-full bg-white/[0.05] overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-[1s]"
                                    style={{
                                      width: `${val}%`,
                                      background: grad,
                                    }}
                                  />
                                </div>
                                <span
                                  className="text-[0.75rem] font-bold w-9 text-right"
                                  style={{ color: col }}>
                                  {val}
                                  {suffix}
                                </span>
                              </div>
                            ))}
                          </div>
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
                {/* Rekomendasi */}
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

                {/* Aktivitas */}
                <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-[18px] mb-4">
                  <SideTitle>Aktivitas Terbaru</SideTitle>
                  {activities.map((a, i) => (
                    <div
                      key={i}
                      className={`flex gap-[10px] py-[10px] items-start ${i < activities.length - 1 ? "border-b border-emerald-500/15" : ""}`}>
                      <div
                        className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[0.85rem] flex-shrink-0"
                        style={{ background: `${a.color}15`, color: a.color }}>
                        {a.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-[0.8rem] text-[#7a9585] leading-[1.5]">
                          {a.text}
                        </div>
                        <div className="text-[0.68rem] text-[rgba(122,149,133,0.5)]">
                          {a.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload CTA */}
                <div className="bg-gradient-to-br from-emerald-500/[0.07] to-cyan-500/[0.05] border border-emerald-500/15 rounded-[14px] p-[18px] text-center">
                  <div className="text-[1.8rem] mb-[10px]">📄</div>
                  <div className="font-bold text-[0.9rem] mb-[6px]">
                    Update CV Anda
                  </div>
                  <p className="text-[#7a9585] text-[0.78rem] leading-[1.55] mb-[14px]">
                    CV Anda terakhir diperbarui {user.lastUpdated}. Update untuk
                    hasil matching yang lebih baik.
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
      </div>
    </div>
  );
}
