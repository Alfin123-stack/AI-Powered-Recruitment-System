"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Users,
  TrendingUp,
  Bell,
  Settings,
  Plus,
  Search,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Download,
  Calendar,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── Types ─────────────────────────────────────────────────────────────────────
type Candidate = {
  name: string;
  avatar: string;
  job: string;
  resumeScore: number;
  matchScore: number;
  skills: string[];
  status: string;
  appliedDate: string;
  color: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const hrUser = {
  name: "Sarah Wijaya",
  role: "Senior HR Manager",
  avatar: "SW",
};

const stats = [
  {
    Icon: Users,
    bg: "rgba(16,185,129,0.12)",
    col: "#10b981",
    num: "128",
    label: "Total Pelamar",
    delta: "+12 minggu ini",
  },
  {
    Icon: Star,
    bg: "rgba(245,158,11,0.12)",
    col: "#f59e0b",
    num: "24",
    label: "Shortlisted",
    delta: "+3 hari ini",
  },
  {
    Icon: TrendingUp,
    bg: "rgba(6,182,212,0.12)",
    col: "#06b6d4",
    num: "82",
    label: "Avg Resume Score",
    delta: "↑ 4 dari bulan lalu",
  },
  {
    Icon: Zap,
    bg: "rgba(139,92,246,0.12)",
    col: "#8b5cf6",
    num: "6",
    label: "Posisi Aktif",
    delta: "2 baru minggu ini",
  },
];

const jobs = [
  {
    title: "Frontend Developer",
    applicants: 42,
    shortlisted: 8,
    color: "#10b981",
  },
  {
    title: "Fullstack Developer",
    applicants: 31,
    shortlisted: 5,
    color: "#06b6d4",
  },
  {
    title: "Backend Engineer",
    applicants: 29,
    shortlisted: 6,
    color: "#8b5cf6",
  },
  { title: "UI/UX Designer", applicants: 26, shortlisted: 5, color: "#f59e0b" },
];

const initCandidates: Candidate[] = [
  {
    name: "Ahmad Fauzi",
    avatar: "AF",
    job: "Frontend Developer",
    resumeScore: 90,
    matchScore: 86,
    skills: ["React", "Next.js", "TS"],
    status: "shortlisted",
    appliedDate: "10 Jan",
    color: "#10b981",
  },
  {
    name: "Budi Santoso",
    avatar: "BS",
    job: "Frontend Developer",
    resumeScore: 82,
    matchScore: 79,
    skills: ["React", "Node.js", "SQL"],
    status: "pending",
    appliedDate: "9 Jan",
    color: "#06b6d4",
  },
  {
    name: "Siti Rahma",
    avatar: "SR",
    job: "Fullstack Developer",
    resumeScore: 76,
    matchScore: 71,
    skills: ["Vue", "JavaScript", "CSS"],
    status: "review",
    appliedDate: "8 Jan",
    color: "#8b5cf6",
  },
  {
    name: "Dewi Lestari",
    avatar: "DL",
    job: "Backend Engineer",
    resumeScore: 70,
    matchScore: 65,
    skills: ["Go", "PostgreSQL", "Docker"],
    status: "rejected",
    appliedDate: "7 Jan",
    color: "#f59e0b",
  },
  {
    name: "Rian Hidayat",
    avatar: "RH",
    job: "UI/UX Designer",
    resumeScore: 88,
    matchScore: 83,
    skills: ["Figma", "Prototyping", "XD"],
    status: "shortlisted",
    appliedDate: "6 Jan",
    color: "#10b981",
  },
  {
    name: "Maya Putri",
    avatar: "MP",
    job: "Frontend Developer",
    resumeScore: 74,
    matchScore: 68,
    skills: ["React", "Tailwind", "HTML"],
    status: "pending",
    appliedDate: "5 Jan",
    color: "#ef4444",
  },
];

const activities = [
  {
    text: "Ahmad Fauzi di-shortlist untuk Frontend Developer",
    time: "30 mnt lalu",
    icon: "🎯",
    color: "#10b981",
  },
  {
    text: "5 CV baru masuk untuk posisi Backend Engineer",
    time: "2 jam lalu",
    icon: "📥",
    color: "#06b6d4",
  },
  {
    text: "Rian Hidayat menerima invitation interview",
    time: "4 jam lalu",
    icon: "📅",
    color: "#8b5cf6",
  },
  {
    text: "Analisis batch 12 CV selesai diproses AI",
    time: "1 hari lalu",
    icon: "🤖",
    color: "#f59e0b",
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  pending: { label: "Pending", color: "#f59e0b" },
  review: { label: "In Review", color: "#06b6d4" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};

const rankColors = ["#f59e0b", "#94a3b8", "#cd7f32"];

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

// ── CardTitle ─────────────────────────────────────────────────────────────────
function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[7px] font-bold text-[0.9rem] mb-4">
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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HRDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>(initCandidates);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [activeNav, setActiveNav] = useState("dashboard");

  const setStatus = (name: string, status: string) =>
    setCandidates((prev) =>
      prev.map((c) => (c.name === name ? { ...c, status } : c)),
    );

  const filtered = candidates
    .filter((c) => {
      const ms = filterStatus === "all" || c.status === filterStatus;
      const mq =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.job.toLowerCase().includes(search.toLowerCase());
      return ms && mq;
    })
    .sort((a, b) => b.resumeScore - a.resumeScore);

  const navItems = [
    { id: "dashboard", Icon: BarChart3, label: "Dashboard" },
    { id: "jobs", Icon: Briefcase, label: "Jobs" },
    { id: "candidates", Icon: Users, label: "Candidates" },
    { id: "analytics", Icon: TrendingUp, label: "Analytics" },
    { id: "interviews", Icon: Calendar, label: "Interviews" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* ── SIDEBAR ── */}
      <aside className="w-[240px] flex-shrink-0 bg-[#0f1612] border-r border-emerald-500/15 flex flex-col fixed top-0 left-0 bottom-0 z-50">
        {/* Logo */}
        <a
          href="/"
          className="px-5 py-[22px] pb-[18px] border-b border-emerald-500/15 font-extrabold text-[1.1rem] flex items-center gap-2 text-[#e8f0ec] no-underline">
          <span className="text-emerald-400">✦</span> Recruit
          <em className="not-italic text-emerald-400">AI</em>
        </a>

        {/* Nav */}
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
            Sistem
          </div>
          {[
            { Icon: Bell, label: "Notifikasi", badge: "3" },
            { Icon: Settings, label: "Pengaturan" },
          ].map(({ Icon, label, badge }, i) => (
            <button
              key={i}
              className="flex items-center justify-between px-3 py-[10px] rounded-[9px] mx-2 mb-[2px] text-[0.86rem] font-medium text-[#7a9585] cursor-pointer border border-transparent bg-transparent hover:text-[#e8f0ec] hover:bg-white/[0.04] w-[calc(100%-16px)] transition-all duration-200">
              <span className="flex items-center gap-[10px]">
                <Icon size={15} /> {label}
              </span>
              {badge && (
                <span className="bg-emerald-500 text-black rounded-[4px] px-[6px] py-[1px] text-[0.65rem] font-extrabold">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User */}
        <div className="border-t border-emerald-500/15 px-3 py-4">
          <div className="flex items-center gap-[10px] px-2 py-[10px] rounded-[10px]">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-extrabold text-[0.75rem] text-emerald-400 flex-shrink-0">
              {hrUser.avatar}
            </div>
            <div>
              <div className="text-[0.82rem] font-semibold">{hrUser.name}</div>
              <div className="text-[0.7rem] text-[#7a9585]">{hrUser.role}</div>
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
            background: "rgba(10,15,13,0.9)",
            backdropFilter: "blur(16px)",
          }}>
          <span className="font-bold text-[1rem]">HR Dashboard</span>
          <div className="flex items-center gap-[10px]">
            <IconButton>
              <Bell size={15} />
            </IconButton>
            <IconButton>
              <Download size={15} />
            </IconButton>
            <Button className="inline-flex items-center gap-[7px] bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] text-black font-bold text-[0.85rem] px-[18px] py-[9px] rounded-[9px]">
              <Plus size={14} /> Buat Lowongan
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-7 pb-[60px]">
          {/* ── STATS ── */}
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
                  <div className="text-[0.75rem] text-[#7a9585] mb-1">
                    {label}
                  </div>
                  <div className="text-[0.7rem] text-emerald-400">{delta}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ── 2-COL ── */}
          <div
            className="grid gap-5 mb-6"
            style={{ gridTemplateColumns: "1fr 280px" }}>
            {/* Job summary */}
            <FadeIn delay={0.05}>
              <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
                <CardTitle>Ringkasan Posisi Aktif</CardTitle>
                {jobs.map((j, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 py-[11px] ${i < jobs.length - 1 ? "border-b border-emerald-500/15" : ""}`}>
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
                            width: `${(j.shortlisted / j.applicants) * 100}%`,
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
                      {Math.round((j.shortlisted / j.applicants) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Activity */}
            <FadeIn delay={0.08}>
              <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
                <CardTitle>Aktivitas Terbaru</CardTitle>
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
                      <div className="text-[0.79rem] text-[#7a9585] leading-[1.5]">
                        {a.text}
                      </div>
                      <div className="text-[0.67rem] text-[rgba(122,149,133,0.5)]">
                        {a.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* ── TABLE ── */}
          <FadeIn delay={0.12}>
            {/* Table controls */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <div className="font-bold text-[1rem]">
                  Candidate Ranking — AI Analyzer
                </div>
                <div className="text-[0.75rem] text-[#7a9585] mt-[3px]">
                  Diurutkan berdasarkan resume score · {filtered.length}{" "}
                  kandidat
                </div>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {/* Search */}
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

                {/* Filter select */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-[#0f1612] border border-emerald-500/15 rounded-[9px] py-[9px] pl-3 pr-8 text-[#e8f0ec] text-[0.82rem] outline-none cursor-pointer appearance-none transition-all focus:border-emerald-500">
                    <option value="all">Semua Status</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="pending">Pending</option>
                    <option value="review">In Review</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
                  />
                </div>

                {/* Export */}
                <Button
                  variant="outline"
                  className="inline-flex items-center gap-[6px] border-emerald-500/15 text-[#7a9585] text-[0.8rem] font-medium px-[14px] py-[9px] rounded-[9px] hover:border-emerald-500/35 hover:text-[#e8f0ec] bg-transparent">
                  <Download size={13} /> Export
                </Button>
              </div>
            </div>

            {/* Table */}
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
                          <div className="text-[2rem] mb-[10px] opacity-40">
                            🔍
                          </div>
                          Tidak ada kandidat ditemukan
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c, i) => {
                        const st = statusMap[c.status];
                        return (
                          <motion.tr
                            key={c.name}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.04 }}
                            className="hover:bg-emerald-500/[0.02] transition-colors border-t border-emerald-500/15">
                            {/* Rank */}
                            <td className="px-4 py-[14px]">
                              <div
                                className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center font-extrabold text-[0.72rem] flex-shrink-0"
                                style={{
                                  background:
                                    i < 3 ? `${rankColors[i]}20` : "#141f19",
                                  color: i < 3 ? rankColors[i] : "#7a9585",
                                  border: `1px solid ${i < 3 ? rankColors[i] + "40" : "rgba(16,185,129,0.15)"}`,
                                }}>
                                {i + 1}
                              </div>
                            </td>

                            {/* Candidate */}
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

                            {/* Skills */}
                            <td className="px-4 py-[14px]">
                              <div className="flex flex-wrap">
                                {c.skills.map((s) => (
                                  <span
                                    key={s}
                                    className="inline-block bg-white/[0.04] border border-white/[0.08] px-[7px] py-[2px] rounded-[4px] text-[0.68rem] font-mono mr-[3px] mb-[2px]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Resume Score */}
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
                                  {c.resumeScore}
                                </span>
                              </div>
                            </td>

                            {/* Match Score */}
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
                                  {c.matchScore}%
                                </span>
                              </div>
                            </td>

                            {/* Status */}
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

                            {/* Actions */}
                            <td className="px-4 py-[14px]">
                              <div className="flex gap-[6px] items-center">
                                <button
                                  onClick={() =>
                                    setStatus(c.name, "shortlisted")
                                  }
                                  className="flex items-center gap-1 px-3 py-[7px] rounded-[7px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[0.75rem] font-bold cursor-pointer hover:bg-emerald-500/20 transition-all">
                                  <ThumbsUp size={11} /> Shortlist
                                </button>
                                <button
                                  onClick={() => setStatus(c.name, "rejected")}
                                  className="flex items-center gap-1 px-3 py-[7px] rounded-[7px] bg-red-500/[0.07] border border-red-500/20 text-red-400 text-[0.75rem] font-bold cursor-pointer hover:bg-red-500/15 transition-all">
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
      </div>
    </div>
  );
}
