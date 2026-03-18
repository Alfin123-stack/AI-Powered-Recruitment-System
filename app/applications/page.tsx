"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  BarChart3,
  MapPin,
  Calendar,
  Eye,
  Search,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// ── Types ─────────────────────────────────────────────────────────────────────
type TimelineStep = { label: string; done: boolean; date: string };
type Application = {
  id: number;
  company: string;
  companyInitial: string;
  role: string;
  location: string;
  salary: string;
  appliedDate: string;
  resumeScore: number;
  matchingScore: number;
  status: string;
  color: string;
  timeline: TimelineStep[];
};
type HRCandidate = {
  id: number;
  name: string;
  avatar: string;
  role: string;
  resumeScore: number;
  matchingScore: number;
  status: string;
  appliedDate: string;
  color: string;
  skills: string[];
};

// ── Data ──────────────────────────────────────────────────────────────────────
const candidateApplications: Application[] = [
  {
    id: 1,
    company: "PT Teknologi Indonesia",
    companyInitial: "TI",
    role: "Frontend Developer",
    location: "Jakarta / Remote",
    salary: "Rp 8–15 jt",
    appliedDate: "10 Jan 2025",
    resumeScore: 82,
    matchingScore: 76,
    status: "pending",
    color: "#10b981",
    timeline: [
      { label: "Lamaran Dikirim", done: true, date: "10 Jan" },
      { label: "CV Dianalisis AI", done: true, date: "10 Jan" },
      { label: "Diproses HR", done: false, date: "—" },
      { label: "Keputusan Final", done: false, date: "—" },
    ],
  },
  {
    id: 2,
    company: "Startup Digital Nusantara",
    companyInitial: "SD",
    role: "Fullstack Developer",
    location: "Remote",
    salary: "Rp 12–20 jt",
    appliedDate: "8 Jan 2025",
    resumeScore: 88,
    matchingScore: 84,
    status: "shortlisted",
    color: "#06b6d4",
    timeline: [
      { label: "Lamaran Dikirim", done: true, date: "8 Jan" },
      { label: "CV Dianalisis AI", done: true, date: "8 Jan" },
      { label: "Diproses HR", done: true, date: "9 Jan" },
      { label: "Keputusan Final", done: false, date: "—" },
    ],
  },
  {
    id: 3,
    company: "Fintech Maju Bersama",
    companyInitial: "FM",
    role: "UI Engineer",
    location: "Bandung / Hybrid",
    salary: "Rp 9–14 jt",
    appliedDate: "5 Jan 2025",
    resumeScore: 74,
    matchingScore: 68,
    status: "review",
    color: "#8b5cf6",
    timeline: [
      { label: "Lamaran Dikirim", done: true, date: "5 Jan" },
      { label: "CV Dianalisis AI", done: true, date: "5 Jan" },
      { label: "Diproses HR", done: true, date: "7 Jan" },
      { label: "Keputusan Final", done: false, date: "—" },
    ],
  },
  {
    id: 4,
    company: "Creative Agency Jakarta",
    companyInitial: "CA",
    role: "Frontend Engineer",
    location: "Jakarta",
    salary: "Rp 6–10 jt",
    appliedDate: "1 Jan 2025",
    resumeScore: 65,
    matchingScore: 58,
    status: "rejected",
    color: "#ef4444",
    timeline: [
      { label: "Lamaran Dikirim", done: true, date: "1 Jan" },
      { label: "CV Dianalisis AI", done: true, date: "1 Jan" },
      { label: "Diproses HR", done: true, date: "3 Jan" },
      { label: "Keputusan Final", done: true, date: "5 Jan" },
    ],
  },
];

const initHrApplications: HRCandidate[] = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    avatar: "AF",
    role: "Frontend Developer",
    resumeScore: 90,
    matchingScore: 86,
    status: "shortlisted",
    appliedDate: "10 Jan",
    color: "#10b981",
    skills: ["React", "Next.js", "TS"],
  },
  {
    id: 2,
    name: "Budi Santoso",
    avatar: "BS",
    role: "Fullstack Developer",
    resumeScore: 82,
    matchingScore: 79,
    status: "pending",
    appliedDate: "9 Jan",
    color: "#06b6d4",
    skills: ["Node.js", "React", "SQL"],
  },
  {
    id: 3,
    name: "Siti Rahma",
    avatar: "SR",
    role: "UI Engineer",
    resumeScore: 76,
    matchingScore: 71,
    status: "review",
    appliedDate: "8 Jan",
    color: "#8b5cf6",
    skills: ["Vue", "JS", "CSS"],
  },
  {
    id: 4,
    name: "Dewi Lestari",
    avatar: "DL",
    role: "Frontend Developer",
    resumeScore: 65,
    matchingScore: 58,
    status: "rejected",
    appliedDate: "5 Jan",
    color: "#f59e0b",
    skills: ["HTML", "CSS", "jQuery"],
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
      transition={{ duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── StatusPill ────────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const st = statusMap[status] ?? { label: status, color: "#7a9585" };
  return (
    <span
      className="inline-flex items-center px-[11px] py-1 rounded-full text-[0.68rem] font-bold tracking-[0.05em] uppercase flex-shrink-0 ml-auto"
      style={{
        background: `${st.color}15`,
        color: st.color,
        border: `1px solid ${st.color}30`,
      }}>
      {st.label}
    </span>
  );
}

// ── ScoreBox ──────────────────────────────────────────────────────────────────
function ScoreBox({
  label,
  value,
  gradient,
  numColor,
}: {
  label: string;
  value: number;
  gradient: string;
  numColor: string;
}) {
  return (
    <div className="bg-[#141f19] rounded-[10px] px-[14px] py-3">
      <div className="text-[0.68rem] text-[#7a9585] mb-[6px]">{label}</div>
      <div className="h-[5px] rounded-full bg-white/[0.06] overflow-hidden mb-[5px]">
        <div
          className="h-full rounded-full transition-all duration-[1.2s]"
          style={{ width: `${value}%`, background: gradient }}
        />
      </div>
      <div
        className="font-syne text-[1.1rem] font-extrabold"
        style={{ color: numColor }}>
        {value}
        {numColor === "#8b5cf6" ? "%" : ""}
      </div>
    </div>
  );
}

// ── StatsRow ──────────────────────────────────────────────────────────────────
function StatsRow({
  items,
}: {
  items: { n: number | string; label: string; col: string }[];
}) {
  return (
    <FadeIn>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {items.map((s, i) => (
          <div
            key={i}
            className="bg-[#0f1612] border border-emerald-500/15 rounded-[12px] p-4 text-center">
            <div
              className="font-syne text-[1.7rem] font-extrabold leading-none mb-1"
              style={{ color: s.col }}>
              {s.n}
            </div>
            <div className="text-[0.72rem] text-[#7a9585]">{s.label}</div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────
function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <FadeIn delay={0.04}>
      <div className="flex items-center gap-[10px] mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
          />
          <Input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="pl-[36px] bg-[#0f1612] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.4)] rounded-[10px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
          />
        </div>
      </div>
    </FadeIn>
  );
}

// ── TabsBar ───────────────────────────────────────────────────────────────────
function TabsBar({
  filter,
  setFilter,
  getCounts,
}: {
  filter: string;
  setFilter: (v: string) => void;
  getCounts: (id: string) => number;
}) {
  return (
    <div className="flex gap-1 bg-[#0f1612] border border-emerald-500/15 rounded-[10px] p-1 mb-5 overflow-x-auto">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setFilter(t.id)}
          className={`px-[14px] py-[7px] rounded-[7px] border-0 text-[0.8rem] font-medium cursor-pointer transition-all whitespace-nowrap
            ${
              filter === t.id
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"
            }`}>
          {t.label}
          {t.id !== "all" && (
            <span className="ml-[5px] bg-white/[0.07] rounded-[4px] px-[5px] py-[1px] text-[0.65rem]">
              {getCounts(t.id)}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── CandidateCard ─────────────────────────────────────────────────────────────
function CandidateCard({
  app,
  expanded,
  setExpanded,
}: {
  app: Application;
  expanded: number | null;
  setExpanded: (v: number | null) => void;
}) {
  const isOpen = expanded === app.id;

  return (
    <div
      className={`bg-[#0f1612] border rounded-[16px] overflow-hidden mb-[14px] transition-all duration-300 hover:border-emerald-500/35
        ${isOpen ? "border-emerald-500/35" : "border-emerald-500/15"}`}>
      {/* Clickable top */}
      <div
        className="px-[22px] pt-5 pb-5 cursor-pointer"
        onClick={() => setExpanded(isOpen ? null : app.id)}>
        {/* Top row */}
        <div className="flex items-start gap-[14px] mb-[14px]">
          <div
            className="w-11 h-11 rounded-[11px] flex items-center justify-center font-syne font-extrabold text-[0.82rem] flex-shrink-0"
            style={{ background: `${app.color}18`, color: app.color }}>
            {app.companyInitial}
          </div>
          <div className="flex-1">
            <div className="font-syne font-bold text-[0.98rem] mb-[3px]">
              {app.role}
            </div>
            <div className="text-[0.78rem] text-[#7a9585]">{app.company}</div>
          </div>
          <StatusPill status={app.status} />
        </div>

        {/* Meta */}
        <div className="flex gap-[14px] flex-wrap mb-[14px]">
          {[
            { Icon: MapPin, text: app.location },
            { Icon: Briefcase, text: app.salary },
            { Icon: Calendar, text: app.appliedDate },
          ].map(({ Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-[5px] text-[0.75rem] text-[#7a9585]">
              <Icon size={12} /> {text}
            </span>
          ))}
          <span className="flex items-center gap-[5px] text-[0.75rem] text-emerald-400 font-semibold">
            {isOpen ? "▲ Tutup" : "▼ Detail"}
          </span>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-[10px]">
          <ScoreBox
            label="Resume Score"
            value={app.resumeScore}
            gradient="linear-gradient(90deg,#10b981,#06b6d4)"
            numColor="#10b981"
          />
          <ScoreBox
            label="Matching Score"
            value={app.matchingScore}
            gradient="linear-gradient(90deg,#8b5cf6,#06b6d4)"
            numColor="#8b5cf6"
          />
        </div>
      </div>

      {/* Expandable Timeline */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}>
            <div className="border-t border-emerald-500/15 bg-black/15 px-[22px] pb-5">
              <div className="text-[0.72rem] font-bold text-[#7a9585] tracking-[0.1em] uppercase py-[14px] pb-[10px]">
                Progress Lamaran
              </div>
              <div className="flex items-center">
                {app.timeline.map((step, si) => (
                  <React.Fragment key={si}>
                    <div className="flex flex-col items-center gap-[5px] flex-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-[0.7rem] font-extrabold transition-all duration-300
                          ${
                            step.done
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                              : "bg-[#141f19] border-emerald-500/15 text-[#7a9585]"
                          }`}>
                        {step.done ? "✓" : si + 1}
                      </div>
                      <div className="text-[0.67rem] text-[#7a9585] text-center leading-[1.3]">
                        {step.label}
                      </div>
                      <div className="text-[0.63rem] text-[rgba(122,149,133,0.5)]">
                        {step.date}
                      </div>
                    </div>
                    {si < app.timeline.length - 1 && (
                      <div
                        className={`flex-1 h-[2px] mb-[22px] transition-colors duration-300
                          ${step.done && app.timeline[si + 1]?.done ? "bg-emerald-500" : "bg-emerald-500/15"}`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2 px-[22px] py-[14px] border-t border-emerald-500/15">
        <Link
          href={`/jobs/${app.id}`}
          className="flex-1 flex items-center justify-center gap-[6px] py-[9px] rounded-[9px] border border-emerald-500/15 text-[#e8f0ec] text-[0.8rem] font-medium hover:border-emerald-500/35 hover:text-emerald-400 transition-all no-underline">
          <Eye size={13} /> Lihat Detail
        </Link>
        <Link
          href="/analyze"
          className="flex-1 flex items-center justify-center gap-[6px] py-[9px] rounded-[9px] bg-emerald-500 text-black text-[0.8rem] font-bold hover:bg-emerald-400 hover:shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all no-underline">
          <BarChart3 size={13} /> Analisis CV
        </Link>
      </div>
    </div>
  );
}

// ── HRCard ────────────────────────────────────────────────────────────────────
function HRCard({
  c,
  onShortlist,
  onReject,
}: {
  c: HRCandidate;
  onShortlist: (id: number) => void;
  onReject: (id: number) => void;
}) {
  return (
    <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] px-[22px] py-5 mb-3 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
      {/* Top row */}
      <div className="flex items-center gap-3 mb-[14px]">
        <div
          className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center font-syne font-extrabold text-[0.8rem] flex-shrink-0"
          style={{ background: `${c.color}18`, color: c.color }}>
          {c.avatar}
        </div>
        <div className="flex-1">
          <div className="font-syne font-bold text-[0.95rem] mb-[3px]">
            {c.name}
          </div>
          <div className="text-[0.75rem] text-[#7a9585]">
            {c.role} · {c.appliedDate}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-[3px]">
            {c.skills.map((s) => (
              <span
                key={s}
                className="bg-white/[0.04] border border-white/[0.08] px-2 py-[3px] rounded-[5px] text-[0.7rem] font-mono text-[#e8f0ec]">
                {s}
              </span>
            ))}
          </div>
          <StatusPill status={c.status} />
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
        <ScoreBox
          label="Resume Score"
          value={c.resumeScore}
          gradient="linear-gradient(90deg,#10b981,#06b6d4)"
          numColor="#10b981"
        />
        <ScoreBox
          label="Job Match"
          value={c.matchingScore}
          gradient="linear-gradient(90deg,#8b5cf6,#06b6d4)"
          numColor="#8b5cf6"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-[7px]">
        <button
          onClick={() => onShortlist(c.id)}
          className="flex-1 flex items-center justify-center gap-[5px] py-2 px-3 rounded-[8px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[0.78rem] font-bold hover:bg-emerald-500/20 transition-all cursor-pointer">
          <ThumbsUp size={12} /> Shortlist
        </button>
        <button
          onClick={() => onReject(c.id)}
          className="flex-1 flex items-center justify-center gap-[5px] py-2 px-3 rounded-[8px] bg-red-500/[0.07] border border-red-500/20 text-red-400 text-[0.78rem] font-bold hover:bg-red-500/15 transition-all cursor-pointer">
          <ThumbsDown size={12} /> Tolak
        </button>
        <button className="w-[34px] h-[34px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec] rounded-[8px] flex items-center justify-center cursor-pointer transition-all flex-shrink-0">
          <Eye size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ApplicationsPage() {
  const [role, setRole] = useState("candidate");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [hrData, setHrData] = useState<HRCandidate[]>(initHrApplications);
  const [expanded, setExpanded] = useState<number | null>(null);

  const switchRole = (r: string) => {
    setRole(r);
    setSearch("");
    setFilter("all");
    setExpanded(null);
  };

  const setHrStatus = (id: number, status: string) =>
    setHrData((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const filteredCandidate = candidateApplications.filter(
    (a) =>
      (filter === "all" || a.status === filter) &&
      (a.role.toLowerCase().includes(search.toLowerCase()) ||
        a.company.toLowerCase().includes(search.toLowerCase())),
  );

  const filteredHR = hrData
    .filter(
      (a) =>
        (filter === "all" || a.status === filter) &&
        (a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.role.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => b.resumeScore - a.resumeScore);

  const cCounts = (id: string) =>
    candidateApplications.filter((a) => a.status === id).length;
  const hCounts = (id: string) => hrData.filter((a) => a.status === id).length;

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,13,0.85)] backdrop-blur-[16px] border-b border-emerald-500/15">
        <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-syne font-extrabold text-[1.1rem] text-[#e8f0ec] no-underline">
            <span className="text-emerald-400">✦</span> Recruit
            <em className="not-italic text-emerald-400">AI</em>
          </Link>
          <div className="flex items-center gap-7">
            {[
              { label: "Jobs", href: "/jobs", active: false },
              { label: "Lamaran", href: "#", active: true },
              { label: "Analyze", href: "/analyze", active: false },
            ].map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`text-[0.88rem] font-medium no-underline transition-colors
                  ${active ? "text-emerald-400" : "text-[#7a9585] hover:text-emerald-400"}`}>
                {label}
              </Link>
            ))}
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-[0.82rem] px-[18px] py-2 rounded-[8px]">
              Masuk →
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-16 min-h-screen bg-[#0a0f0d]">
        {/* ── HERO ── */}
        <section
          className="pt-[108px] pb-[60px] relative overflow-hidden text-center"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
          }}>
          {/* Grid bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <motion.div
            className="relative max-w-[700px] mx-auto px-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            {/* Tag */}
            <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.7rem] font-semibold tracking-[0.1em] uppercase mb-[18px]">
              <span className="animate-pulse">●</span>
              {role === "candidate" ? "Candidate" : "HR Dashboard"}
            </div>

            <h1
              className="font-syne font-extrabold leading-[1.1] tracking-tight mb-[14px]"
              style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>
              {role === "candidate" ? "Lamaran " : "Pelamar "}
              <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {role === "candidate" ? "Saya" : "Masuk"}
              </span>
            </h1>

            <p className="text-[#7a9585] text-[0.95rem] leading-[1.7] mb-8 max-w-[520px] mx-auto">
              {role === "candidate"
                ? "Pantau status semua lamaran pekerjaan Anda dan lihat hasil analisis AI resume secara detail."
                : "Kelola kandidat yang melamar posisi di perusahaan Anda, analisis CV mereka, dan buat keputusan hiring lebih cepat."}
            </p>

            {/* Role toggle */}
            <div className="inline-flex bg-[#0f1612] border border-emerald-500/15 rounded-[12px] p-1 gap-1">
              {[
                { k: "candidate", l: "👤 Candidate" },
                { k: "hr", l: "🏢 HR Mode" },
              ].map(({ k, l }) => (
                <button
                  key={k}
                  onClick={() => switchRole(k)}
                  className={`px-[22px] py-[9px] rounded-[9px] border-0 text-[0.85rem] font-semibold cursor-pointer transition-all duration-200
                    ${
                      role === k
                        ? "bg-emerald-500 text-black shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
                        : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                    }`}>
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}>
            <section className="py-10 pb-20">
              <div className="max-w-[1000px] mx-auto px-6">
                {/* ── CANDIDATE VIEW ── */}
                {role === "candidate" && (
                  <>
                    <StatsRow
                      items={[
                        {
                          n: candidateApplications.length,
                          label: "Total Lamaran",
                          col: "#10b981",
                        },
                        {
                          n: candidateApplications.filter(
                            (a) => a.status === "shortlisted",
                          ).length,
                          label: "Shortlisted",
                          col: "#f59e0b",
                        },
                        {
                          n: Math.round(
                            candidateApplications.reduce(
                              (s, a) => s + a.resumeScore,
                              0,
                            ) / candidateApplications.length,
                          ),
                          label: "Avg Resume Score",
                          col: "#06b6d4",
                        },
                        {
                          n:
                            Math.round(
                              candidateApplications.reduce(
                                (s, a) => s + a.matchingScore,
                                0,
                              ) / candidateApplications.length,
                            ) + "%",
                          label: "Avg Match Score",
                          col: "#8b5cf6",
                        },
                      ]}
                    />

                    <SearchBar
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari posisi atau perusahaan..."
                    />
                    <TabsBar
                      filter={filter}
                      setFilter={setFilter}
                      getCounts={cCounts}
                    />

                    {filteredCandidate.length === 0 ? (
                      <div className="text-center py-[60px] text-[#7a9585]">
                        <div className="text-[2.5rem] mb-3 opacity-35">📭</div>
                        Tidak ada lamaran ditemukan.
                      </div>
                    ) : (
                      filteredCandidate.map((app, i) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}>
                          <CandidateCard
                            app={app}
                            expanded={expanded}
                            setExpanded={setExpanded}
                          />
                        </motion.div>
                      ))
                    )}

                    {/* CTA */}
                    <FadeIn delay={0.1}>
                      <div className="mt-10 bg-gradient-to-br from-emerald-500/[0.08] to-cyan-500/[0.05] border border-emerald-500/15 rounded-[16px] p-9 text-center">
                        <h2 className="font-syne text-[1.5rem] font-extrabold mb-[10px]">
                          Ingin Melamar Pekerjaan Lain?
                        </h2>
                        <p className="text-[#7a9585] text-[0.9rem] leading-relaxed mb-[22px] max-w-[460px] mx-auto">
                          Jelajahi ratusan lowongan pekerjaan dan tingkatkan
                          peluang karir Anda dengan AI match score.
                        </p>
                        <Link
                          href="/jobs"
                          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.9rem] px-7 py-3 rounded-[10px] no-underline hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition-all">
                          <Briefcase size={14} /> Lihat Lowongan{" "}
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </FadeIn>
                  </>
                )}

                {/* ── HR VIEW ── */}
                {role === "hr" && (
                  <>
                    <StatsRow
                      items={[
                        {
                          n: initHrApplications.length,
                          label: "Total Pelamar",
                          col: "#10b981",
                        },
                        {
                          n: initHrApplications.filter(
                            (a) => a.status === "shortlisted",
                          ).length,
                          label: "Shortlisted",
                          col: "#f59e0b",
                        },
                        {
                          n: Math.round(
                            initHrApplications.reduce(
                              (s, a) => s + a.resumeScore,
                              0,
                            ) / initHrApplications.length,
                          ),
                          label: "Avg Score",
                          col: "#06b6d4",
                        },
                        {
                          n: initHrApplications.filter(
                            (a) => a.status === "rejected",
                          ).length,
                          label: "Ditolak",
                          col: "#ef4444",
                        },
                      ]}
                    />

                    <SearchBar
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari nama kandidat atau posisi..."
                    />
                    <TabsBar
                      filter={filter}
                      setFilter={setFilter}
                      getCounts={hCounts}
                    />

                    {filteredHR.length === 0 ? (
                      <div className="text-center py-[60px] text-[#7a9585]">
                        <div className="text-[2.5rem] mb-3 opacity-35">🔍</div>
                        Tidak ada kandidat ditemukan.
                      </div>
                    ) : (
                      filteredHR.map((c, i) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}>
                          <HRCard
                            c={c}
                            onShortlist={(id) => setHrStatus(id, "shortlisted")}
                            onReject={(id) => setHrStatus(id, "rejected")}
                          />
                        </motion.div>
                      ))
                    )}
                  </>
                )}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* ── FOOTER ── */}
        <footer className="bg-[#0f1612] border-t border-emerald-500/15 py-9 px-6 text-center mt-10">
          <div className="flex items-center justify-center gap-[6px] font-syne font-extrabold text-base mb-[6px]">
            <span className="text-emerald-400">✦</span> RecruitAI
          </div>
          <p className="text-[#7a9585] text-[0.78rem]">
            Built with Next.js · Supabase · Gemini AI
          </p>
        </footer>
      </main>
    </div>
  );
}
