"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Zap,
  FileText,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────
type Candidate = {
  name: string;
  role: string;
  score: number;
  match: number;
  status: string;
  skills: string[];
  avatar: string;
  color: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const analysis = {
  resumeScore: 84,
  matchingScore: 78,
  skills: [
    { name: "React", level: 92 },
    { name: "Next.js", level: 88 },
    { name: "JavaScript", level: 95 },
    { name: "TailwindCSS", level: 85 },
    { name: "TypeScript", level: 70 },
    { name: "Git", level: 80 },
  ],
  categories: [
    { label: "Struktur CV", score: 90 },
    { label: "Relevansi Skill", score: 85 },
    { label: "Pengalaman Kerja", score: 78 },
    { label: "Pendidikan", score: 82 },
    { label: "ATS Compatibility", score: 74 },
  ],
  strengths: [
    "CV memiliki struktur yang jelas dan mudah dibaca ATS",
    "Pengalaman kerja relevan dengan posisi frontend developer",
    "Skill modern (React, Next.js) sesuai permintaan industri",
    "Section summary yang menggambarkan value proposition dengan baik",
  ],
  improvements: [
    "Tambahkan portfolio project dengan link yang dapat diklik",
    "Perjelas dampak kuantitatif dari pengalaman kerja (misal: meningkatkan performa 40%)",
    "Tambahkan section achievements/penghargaan",
    "Sertifikasi cloud atau AWS akan meningkatkan daya saing",
  ],
};

const candidates: Candidate[] = [
  {
    name: "Andi Pratama",
    role: "Frontend Developer",
    score: 86,
    match: 82,
    status: "shortlist",
    skills: ["React", "Next.js", "Tailwind"],
    avatar: "AP",
    color: "#10b981",
  },
  {
    name: "Siti Rahma",
    role: "Frontend Developer",
    score: 78,
    match: 74,
    status: "review",
    skills: ["Vue", "JavaScript", "CSS"],
    avatar: "SR",
    color: "#06b6d4",
  },
  {
    name: "Budi Santoso",
    role: "Frontend Developer",
    score: 91,
    match: 88,
    status: "shortlist",
    skills: ["React", "TypeScript", "Node.js"],
    avatar: "BS",
    color: "#8b5cf6",
  },
  {
    name: "Dewi Lestari",
    role: "Frontend Developer",
    score: 65,
    match: 58,
    status: "reject",
    skills: ["HTML", "CSS", "jQuery"],
    avatar: "DL",
    color: "#f59e0b",
  },
];

const statusColor: Record<string, string> = {
  shortlist: "#10b981",
  review: "#f59e0b",
  reject: "#ef4444",
};
const statusLabel: Record<string, string> = {
  shortlist: "Shortlist",
  review: "Perlu Review",
  reject: "Ditolak",
};
const catColors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];

// ── Counter (animated number) ─────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const step = to / (duration / 16);
        const t = setInterval(() => {
          cur += step;
          if (cur >= to) {
            setVal(to);
            clearInterval(t);
          } else setVal(Math.floor(cur));
        }, 16);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ── ScoreRing ─────────────────────────────────────────────────────────────────
function ScoreRing({
  score,
  color = "#10b981",
  size = 120,
}: {
  score: number;
  color?: string;
  size?: number;
}) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{
            transition: "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-syne font-extrabold leading-none"
          style={{ fontSize: "1.9rem", color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-[26px] ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({
  children,
  color = "#e8f0ec",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const dotColor = color === "#e8f0ec" ? "#10b981" : color;
  return (
    <div
      className="flex items-center gap-2 mb-5 font-syne font-bold text-[1rem]"
      style={{ color }}>
      <span
        className="w-[7px] h-[7px] rounded-full flex-shrink-0"
        style={{ background: dotColor }}
      />
      {children}
    </div>
  );
}

// ── Candidate Mode ────────────────────────────────────────────────────────────
function CandidateMode() {
  const scoreCards = [
    {
      label: "Resume Quality Score",
      score: analysis.resumeScore,
      color: "#10b981",
      Icon: FileText,
    },
    {
      label: "Job Matching Score",
      score: analysis.matchingScore,
      color: "#06b6d4",
      Icon: TrendingUp,
    },
    { label: "ATS Compatibility", score: 74, color: "#8b5cf6", Icon: Zap },
    { label: "Overall Rating", score: 81, color: "#f59e0b", Icon: Star },
  ];

  return (
    <motion.div
      key="candidate"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}>
      <section className="py-12 pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Score rings */}
          <FadeIn>
            <div
              className="grid gap-4 mb-5"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}>
              {scoreCards.map((s, i) => (
                <div
                  key={i}
                  className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] px-5 py-7 flex flex-col items-center gap-[14px] transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[2px]">
                  <div
                    className="flex items-center gap-[5px] text-[0.7rem] font-bold tracking-[0.07em] uppercase"
                    style={{ color: s.color }}>
                    <s.Icon size={14} /> {s.label}
                  </div>
                  <ScoreRing score={s.score} color={s.color} size={120} />
                  <div className="text-[0.78rem] text-[#7a9585] text-center">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Skills + Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FadeIn delay={0.05}>
              <Card>
                <CardTitle>Skill Proficiency</CardTitle>
                {analysis.skills.map((s, i) => (
                  <div key={i} className="mb-[14px]">
                    <div className="flex justify-between items-center mb-[6px]">
                      <span className="text-[0.85rem] font-medium">
                        {s.name}
                      </span>
                      <span className="text-[0.75rem] font-bold text-emerald-400 font-mono">
                        {s.level}%
                      </span>
                    </div>
                    <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-[1.2s] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          width: `${s.level}%`,
                          background: "linear-gradient(90deg,#10b981,#06b6d4)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardTitle>Score Breakdown</CardTitle>
                {analysis.categories.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <span className="text-[0.8rem] text-[#7a9585] w-[160px] flex-shrink-0">
                      {c.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-[1.3s]"
                        style={{
                          width: `${c.score}%`,
                          background: catColors[i],
                        }}
                      />
                    </div>
                    <span
                      className="text-[0.78rem] font-bold w-8 text-right"
                      style={{ color: catColors[i] }}>
                      {c.score}
                    </span>
                  </div>
                ))}
              </Card>
            </FadeIn>
          </div>

          {/* Strengths + Improvements */}
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <CardTitle color="#10b981">
                  <CheckCircle2 size={16} className="text-emerald-400" />{" "}
                  Kekuatan CV
                </CardTitle>
                <div className="flex flex-col gap-2">
                  {analysis.strengths.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-[10px] bg-emerald-500/[0.06] border border-emerald-500/15 rounded-[10px] p-3">
                      <CheckCircle2
                        size={14}
                        className="text-emerald-400 flex-shrink-0 mt-[1px]"
                      />
                      <span className="text-[0.83rem] text-[#7a9585] leading-[1.55]">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardTitle color="#f59e0b">
                  <AlertCircle size={16} className="text-amber-400" /> Area
                  Perbaikan
                </CardTitle>
                <div className="flex flex-col gap-2">
                  {analysis.improvements.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-[10px] bg-amber-500/[0.06] border border-amber-500/15 rounded-[10px] p-3">
                      <ChevronRight
                        size={14}
                        className="text-amber-400 flex-shrink-0 mt-[1px]"
                      />
                      <span className="text-[0.83rem] text-[#7a9585] leading-[1.55]">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </FadeIn>

          {/* Upload zone */}
          <FadeIn delay={0.2}>
            <div className="border-2 border-dashed border-emerald-500/15 rounded-[14px] p-10 text-center cursor-pointer transition-all hover:border-emerald-500/35 hover:bg-emerald-500/[0.03]">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto mb-[14px]">
                <Upload size={22} />
              </div>
              <div className="font-syne font-bold text-[1.05rem] mb-[6px]">
                Upload CV Baru
              </div>
              <p className="text-[#7a9585] text-[0.85rem]">
                Drag & drop file PDF atau DOCX, atau klik untuk memilih file
              </p>
              <p className="text-[#7a9585] text-[0.75rem] mt-[6px]">
                Maks. 5MB · PDF, DOCX
              </p>
              <Button className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.9rem] px-7 py-3 rounded-[10px] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:-translate-y-[1px] inline-flex items-center gap-2">
                <Upload size={15} /> Pilih File CV
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </motion.div>
  );
}

// ── HR Mode ───────────────────────────────────────────────────────────────────
function HRMode() {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(candidates.map((c) => [c.name, c.status])),
  );
  const setStatus = (name: string, status: string) =>
    setStatuses((p) => ({ ...p, [name]: status }));

  const shortlistCount = candidates.filter(
    (c) => statuses[c.name] === "shortlist",
  ).length;
  const avgScore = Math.round(
    candidates.reduce((a, c) => a + c.score, 0) / candidates.length,
  );
  const avgMatch = Math.round(
    candidates.reduce((a, c) => a + c.match, 0) / candidates.length,
  );

  return (
    <motion.div
      key="hr"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}>
      <section className="py-12 pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Summary bar */}
          <FadeIn>
            <div className="grid grid-cols-4 gap-3 mb-7">
              {[
                { num: candidates.length, label: "Total Pelamar", suf: "" },
                { num: shortlistCount, label: "Shortlisted", suf: "" },
                { num: avgScore, label: "Avg. Score", suf: "" },
                { num: avgMatch, label: "Avg. Match", suf: "%" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-[#0f1612] border border-emerald-500/15 rounded-[12px] p-4 text-center">
                  <div className="font-syne text-[1.8rem] font-extrabold text-emerald-400 leading-none mb-1">
                    <Counter to={s.num} suffix={s.suf} />
                  </div>
                  <div className="text-[0.72rem] text-[#7a9585]">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Candidate grid */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            }}>
            {candidates.map((c, i) => {
              const st = statuses[c.name];
              return (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-[22px] flex flex-col gap-[14px] transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[2px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                    {/* Top */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-[12px] flex items-center justify-center font-syne font-extrabold text-[0.85rem] flex-shrink-0"
                        style={{ background: `${c.color}18`, color: c.color }}>
                        {c.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-syne font-bold text-[0.95rem]">
                          {c.name}
                        </div>
                        <div className="text-[0.75rem] text-[#7a9585]">
                          {c.role}
                        </div>
                      </div>
                      <span
                        className="inline-flex items-center gap-[5px] px-[10px] py-1 rounded-full text-[0.68rem] font-bold tracking-[0.05em] uppercase flex-shrink-0"
                        style={{
                          background: `${statusColor[st]}15`,
                          color: statusColor[st],
                          border: `1px solid ${statusColor[st]}30`,
                        }}>
                        {statusLabel[st]}
                      </span>
                    </div>

                    {/* Score chips */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#141f19] border border-emerald-500/15 rounded-[8px] p-[9px] text-center">
                        <div className="font-syne text-[1.3rem] font-extrabold leading-none text-emerald-400">
                          {c.score}
                        </div>
                        <div className="text-[0.68rem] text-[#7a9585] mt-[2px]">
                          Resume Score
                        </div>
                      </div>
                      <div className="bg-[#141f19] border border-emerald-500/15 rounded-[8px] p-[9px] text-center">
                        <div className="font-syne text-[1.3rem] font-extrabold leading-none text-cyan-400">
                          {c.match}%
                        </div>
                        <div className="text-[0.68rem] text-[#7a9585] mt-[2px]">
                          Job Match
                        </div>
                      </div>
                    </div>

                    {/* Match bar */}
                    <div>
                      <div className="flex justify-between text-[0.7rem] text-[#7a9585] mb-[5px]">
                        <span>Kecocokan dengan posisi</span>
                        <span className="font-bold" style={{ color: c.color }}>
                          {c.match}%
                        </span>
                      </div>
                      <div className="h-[5px] rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-[1s]"
                          style={{
                            width: `${c.match}%`,
                            background: `linear-gradient(90deg, ${c.color}, #06b6d4)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-[5px]">
                      {c.skills.map((s) => (
                        <span
                          key={s}
                          className="bg-white/[0.04] border border-white/[0.08] px-[9px] py-[3px] rounded-[5px] text-[0.72rem] font-mono text-[#e8f0ec]">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-[7px]">
                      <button
                        onClick={() => setStatus(c.name, "shortlist")}
                        className="flex-1 flex items-center justify-center gap-[5px] py-[9px] rounded-[8px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.78rem] font-bold border-0 cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                        <ThumbsUp size={13} /> Shortlist
                      </button>
                      <button
                        onClick={() => setStatus(c.name, "reject")}
                        className="flex-1 flex items-center justify-center gap-[5px] py-[9px] rounded-[8px] bg-transparent border border-emerald-500/15 text-[#7a9585] text-[0.78rem] font-medium cursor-pointer transition-all hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/[0.05]">
                        <ThumbsDown size={13} /> Tolak
                      </button>
                      <button className="w-9 h-9 rounded-[8px] bg-[#141f19] border border-emerald-500/15 text-[#7a9585] flex items-center justify-center cursor-pointer transition-all hover:border-emerald-500/35 hover:text-[#e8f0ec] flex-shrink-0">
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AnalyzePage() {
  const [mode, setMode] = useState("candidate");

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8f0ec]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,13,0.85)] backdrop-blur-[16px] border-b border-emerald-500/15">
        <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-syne font-extrabold text-[1.1rem] text-[#e8f0ec] no-underline">
            <span className="text-emerald-400">✦</span> RecruitAI
          </Link>
          <div className="flex items-center gap-7">
            {[
              { label: "Jobs", href: "/jobs", active: false },
              { label: "Analyze", href: "#", active: true },
              { label: "Dashboard", href: "#", active: false },
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

      <main className="pt-16 bg-[#0a0f0d] min-h-screen">
        {/* HERO */}
        <section
          className="pt-[112px] pb-16 relative overflow-hidden text-center"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(16,185,129,0.07) 0%, transparent 65%), #0a0f0d",
          }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <motion.div
            className="relative max-w-[760px] mx-auto px-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.7rem] font-semibold tracking-[0.1em] uppercase mb-[18px]">
              <span className="animate-pulse">●</span> AI Resume Analyzer
            </div>

            <h1
              className="font-syne font-extrabold leading-[1.1] tracking-tight mb-[14px]"
              style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>
              Analisis CV dengan{" "}
              <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Kecerdasan Buatan
              </span>
            </h1>

            <p className="text-[#7a9585] text-[0.95rem] leading-[1.7] mb-8 max-w-[540px] mx-auto">
              Dapatkan resume score, job matching analysis, dan rekomendasi
              personal berbasis AI — dalam hitungan detik.
            </p>

            {/* Role toggle */}
            <div className="inline-flex bg-[#0f1612] border border-emerald-500/15 rounded-[12px] p-1 gap-1">
              {[
                { k: "candidate", l: "👤 Candidate" },
                { k: "hr", l: "🏢 HR Mode" },
              ].map(({ k, l }) => (
                <button
                  key={k}
                  onClick={() => setMode(k)}
                  className={`px-[22px] py-[9px] rounded-[9px] border-0 text-[0.85rem] font-semibold cursor-pointer transition-all duration-200
                    ${
                      mode === k
                        ? "bg-emerald-500 text-black shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
                        : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                    }`}>
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {mode === "candidate" ? (
            <CandidateMode key="candidate" />
          ) : (
            <HRMode key="hr" />
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <footer className="bg-[#0f1612] border-t border-emerald-500/15 py-9 px-6 text-center">
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
