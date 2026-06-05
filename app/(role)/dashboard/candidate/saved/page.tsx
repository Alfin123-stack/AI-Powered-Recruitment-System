"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Bookmark,
  Loader2,
  ChevronRight,
  Search,
  Trash2,
  Sparkles,
  AlertCircle,
  Brain,
  Award,
  Target,
  Eye,
  ChevronDown,
  Timer,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/context/DashboardContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────
type SavedJob = {
  saved_id: string;
  saved_at: string;
  id: string;
  title: string;
  salary: string | null;
  location: string | null;
  type: string | null;
  skills: string[];
  deadline: string | null;
  created_at: string;
  resume_score?: number;
  matching_score?: number;
  companies: { name: string; logo_url: string | null; company_size: string };
  color: string;
};

type SortOption = "saved_at" | "deadline" | "matching_score" | "title";

type InsightType = "tip" | "warning" | "success";

type Insight = {
  type: InsightType;
  text: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

const getColor = (i: number): string => COLORS[i % COLORS.length];

const timeAgo = (dateStr: string): string => {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari lalu";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
};

const daysUntilDeadline = (deadline: string | null): number | null => {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
};

const isDeadlineSoon = (deadline: string | null): boolean => {
  const d = daysUntilDeadline(deadline);
  return d !== null && d >= 0 && d <= 7;
};

const isExpired = (deadline: string | null): boolean => {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
};

// ── Raw API response type ─────────────────────────────────────────────────────
type SavedJobRaw = Omit<SavedJob, "color">;

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

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-emerald-500/[0.06] ${className}`}
    />
  );
}

function SavedJobCardSkeleton() {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[18px] overflow-hidden">
      <div className="flex">
        <div className="w-[3px] bg-emerald-500/10 rounded-l-[18px] flex-shrink-0" />
        <div className="flex-1 p-5">
          <div className="flex items-start gap-4">
            <SkeletonPulse className="w-11 h-11 rounded-[10px] flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <SkeletonPulse className="h-4 w-44 mb-2" />
                  <SkeletonPulse className="h-3 w-28" />
                </div>
                <SkeletonPulse className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex gap-3 mb-3">
                <SkeletonPulse className="h-3 w-24" />
                <SkeletonPulse className="h-3 w-20" />
                <SkeletonPulse className="h-3 w-28" />
              </div>
              <div className="flex gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <SkeletonPulse key={i} className="h-5 w-16 rounded-[4px]" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <SkeletonPulse className="h-8 w-28 rounded-[8px]" />
                  <SkeletonPulse className="h-8 w-20 rounded-[8px]" />
                </div>
                <SkeletonPulse className="h-8 w-20 rounded-[8px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar({ jobs }: { jobs: SavedJob[] }) {
  const total = jobs.length;
  const expiring = jobs.filter(
    (j) => isDeadlineSoon(j.deadline) && !isExpired(j.deadline),
  ).length;
  const expired = jobs.filter((j) => isExpired(j.deadline)).length;
  const highMatch = jobs.filter((j) => (j.matching_score ?? 0) >= 75).length;

  const stats = [
    {
      label: "Tersimpan",
      value: total,
      Icon: Bookmark,
      color: "text-emerald-400",
      bg: "bg-emerald-500/8",
      border: "border-emerald-500/12",
    },
    {
      label: "Segera Expired",
      value: expiring,
      Icon: Timer,
      color: "text-amber-400",
      bg: "bg-amber-500/8",
      border: "border-amber-500/12",
    },
    {
      label: "High Match",
      value: highMatch,
      Icon: Target,
      color: "text-violet-400",
      bg: "bg-violet-500/8",
      border: "border-violet-500/12",
    },
    {
      label: "Sudah Expired",
      value: expired,
      Icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-500/8",
      border: "border-red-500/12",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {stats.map(({ label, value, Icon, color, bg, border }) => (
        <div
          key={label}
          className={`bg-[#0a0f0c] border ${border} rounded-[14px] p-4`}>
          <div
            className={`w-8 h-8 rounded-[8px] ${bg} flex items-center justify-center mb-3`}>
            <Icon size={15} className={color} />
          </div>
          <div
            className={`text-[1.5rem] font-black ${color} leading-none mb-1`}>
            {value}
          </div>
          <div className="text-[0.68rem] text-[#7a9585]">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── AI Insights ───────────────────────────────────────────────────────────────
function getJobInsights(job: SavedJob): Insight[] {
  const insights: Insight[] = [];
  const days = daysUntilDeadline(job.deadline);

  if (days !== null && days >= 0 && days <= 3) {
    insights.push({
      type: "warning",
      text: `Deadline ${days === 0 ? "hari ini" : `${days} hari lagi`}! Segera apply sebelum terlambat.`,
    });
  }
  if ((job.matching_score ?? 0) >= 80) {
    insights.push({
      type: "success",
      text: "Profil kamu sangat cocok untuk posisi ini. Peluang lolos lebih tinggi!",
    });
  } else if ((job.matching_score ?? 0) >= 60) {
    insights.push({
      type: "tip",
      text: "Match lumayan bagus. Highlight pengalaman yang relevan di cover letter.",
    });
  }
  if ((job.resume_score ?? 0) >= 85) {
    insights.push({
      type: "success",
      text: "CV kamu sudah kuat untuk posisi ini berdasarkan analisis ATS.",
    });
  }
  if (!job.salary) {
    insights.push({
      type: "tip",
      text: "Riset kisaran gaji posisi ini di Glassdoor/LinkedIn sebelum negosiasi.",
    });
  }

  return insights.slice(0, 2);
}

// ── Deadline Bar ──────────────────────────────────────────────────────────────
function DeadlineBar({ deadline }: { deadline: string | null }) {
  if (!deadline) return null;
  const days = daysUntilDeadline(deadline);
  if (days === null || days < 0) return null;

  const maxDays = 30;
  const pct = Math.max(0, Math.min(100, (days / maxDays) * 100));
  const color = days <= 3 ? "#ef4444" : days <= 7 ? "#f59e0b" : "#10b981";

  return (
    <div className="flex items-center gap-2 text-[0.68rem]">
      <span
        style={{ color }}
        className="font-semibold tabular-nums whitespace-nowrap">
        {days === 0 ? "Hari terakhir!" : `${days} hari lagi`}
      </span>
      <div className="flex-1 h-[3px] bg-white/[0.05] rounded-full overflow-hidden min-w-[40px]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${100 - pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Saved Job Card ────────────────────────────────────────────────────────────
const INSIGHT_CONFIG: Record<
  InsightType,
  {
    color: string;
    bg: string;
    border: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  tip: {
    color: "text-violet-400",
    bg: "bg-violet-500/[0.06]",
    border: "border-violet-500/15",
    Icon: Brain,
  },
  warning: {
    color: "text-amber-400",
    bg: "bg-amber-500/[0.06]",
    border: "border-amber-500/15",
    Icon: AlertCircle,
  },
  success: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.06]",
    border: "border-emerald-500/15",
    Icon: Sparkles,
  },
};

function SavedJobCard({
  job,
  index,
  onUnsave,
  removingId,
}: {
  job: SavedJob;
  index: number;
  onUnsave: (id: string) => void;
  removingId: string | null;
}) {
  const expired = isExpired(job.deadline);
  const soon = isDeadlineSoon(job.deadline);
  const insights = getJobInsights(job);
  const [showInsights, setShowInsights] = useState(false);
  const isRemoving = removingId === job.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`bg-[#0a0f0c] border rounded-[18px] overflow-hidden transition-all
        ${
          expired
            ? "border-white/[0.05] opacity-55"
            : soon
              ? "border-amber-500/20 hover:border-amber-500/32 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]"
              : "border-emerald-500/12 hover:border-emerald-500/28 hover:-translate-y-[1px] hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
        }`}>
      {!expired && (
        <div
          className={`h-[2px] w-full ${
            soon
              ? "bg-gradient-to-r from-amber-500/60 via-amber-400/30 to-transparent"
              : "bg-gradient-to-r from-emerald-500/30 via-cyan-500/20 to-transparent"
          }`}
        />
      )}

      <div className="flex">
        <div
          className="w-[3px] flex-shrink-0"
          style={{
            background: expired
              ? "transparent"
              : `linear-gradient(180deg, ${job.color}60, ${job.color}10)`,
          }}
        />

        <div className="flex-1 p-5">
          <div className="flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.07]"
              style={{ background: `${job.color}14`, color: job.color }}>
              <Building2 size={18} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title + badges */}
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <div className="font-bold text-[0.93rem] truncate">
                    {job.title}
                  </div>
                  <div className="text-[0.76rem] text-[#7a9585]">
                    {job.companies?.name}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  {expired && (
                    <span className="px-[8px] py-[2px] rounded-full text-[0.63rem] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                      Expired
                    </span>
                  )}
                  {!expired && soon && (
                    <span className="px-[8px] py-[2px] rounded-full text-[0.63rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
                      ⚡ Segera!
                    </span>
                  )}
                  {job.type && (
                    <span
                      className="px-[8px] py-[2px] rounded-[5px] text-[0.63rem] font-semibold"
                      style={{
                        background: `${job.color}15`,
                        color: job.color,
                        border: `1px solid ${job.color}25`,
                      }}>
                      {job.type}
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline bar */}
              {!expired && job.deadline && (
                <div className="mb-2">
                  <DeadlineBar deadline={job.deadline} />
                </div>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.73rem] text-[#7a9585] mb-3">
                {job.location && (
                  <span className="flex items-center gap-[4px]">
                    <MapPin size={11} className="flex-shrink-0" />{" "}
                    {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-[4px]">
                    💰 {job.salary}
                  </span>
                )}
                {job.deadline && (
                  <span
                    className={`flex items-center gap-[4px] ${soon && !expired ? "text-amber-400 font-medium" : ""}`}>
                    <Clock size={11} className="flex-shrink-0" />
                    {new Date(job.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span className="flex items-center gap-[4px] text-[#7a9585]/50">
                  <Bookmark size={10} /> {timeAgo(job.saved_at)}
                </span>
              </div>

              {/* Score bars */}
              {((job.matching_score ?? 0) > 0 ||
                (job.resume_score ?? 0) > 0) && (
                <div className="flex gap-5 mb-3 flex-wrap">
                  {(job.resume_score ?? 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <Award size={10} className="text-emerald-400 shrink-0" />
                      <div className="w-[56px] h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${job.resume_score}%`,
                            background:
                              "linear-gradient(90deg,#10b981,#06b6d4)",
                          }}
                        />
                      </div>
                      <span className="text-[0.69rem] font-bold text-emerald-400">
                        {job.resume_score}{" "}
                        <span className="text-[#7a9585] font-normal">CV</span>
                      </span>
                    </div>
                  )}
                  {(job.matching_score ?? 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <Target size={10} className="text-violet-400 shrink-0" />
                      <div className="w-[56px] h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${job.matching_score}%`,
                            background:
                              "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                          }}
                        />
                      </div>
                      <span className="text-[0.69rem] font-bold text-violet-400">
                        {job.matching_score}%{" "}
                        <span className="text-[#7a9585] font-normal">
                          Match
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-[5px] mb-3">
                  {job.skills.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="px-[7px] py-[2px] rounded-[4px] text-[0.67rem] font-mono bg-white/[0.04] border border-white/[0.07] text-[#e8f0ec]">
                      {s}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="text-[0.67rem] text-[#7a9585] py-[2px]">
                      +{job.skills.length - 5}
                    </span>
                  )}
                </div>
              )}

              {/* AI Insights */}
              {insights.length > 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => setShowInsights((v) => !v)}
                    className="flex items-center gap-1.5 text-[0.7rem] text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
                    <Sparkles size={11} />
                    AI Insight
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-200 ${showInsights ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {showInsights && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden">
                        <div className="pt-2 space-y-1.5">
                          {insights.map((ins, i) => {
                            const cfg = INSIGHT_CONFIG[ins.type];
                            return (
                              <div
                                key={i}
                                className={`flex items-start gap-2 rounded-[9px] px-3 py-[8px] border ${cfg.bg} ${cfg.border}`}>
                                <cfg.Icon
                                  size={11}
                                  className={`${cfg.color} mt-[1px] flex-shrink-0`}
                                />
                                <span
                                  className={`text-[0.7rem] leading-relaxed ${cfg.color}`}>
                                  {ins.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                  {!expired && (
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex items-center gap-1.5 px-4 py-[7px] rounded-[8px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.78rem] font-bold no-underline transition-all hover:shadow-[0_4px_12px_rgba(16,185,129,0.28)]">
                      Apply Sekarang <ChevronRight size={12} />
                    </Link>
                  )}
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-1.5 px-3 py-[7px] rounded-[8px] bg-white/[0.03] border border-emerald-500/15 text-emerald-400 text-[0.78rem] font-semibold no-underline hover:border-emerald-500/30 transition-all">
                    <Eye size={12} /> Detail
                  </Link>
                </div>

                <button
                  onClick={() => onUnsave(job.id)}
                  disabled={isRemoving}
                  className="flex items-center gap-1.5 px-3 py-[7px] rounded-[8px] bg-red-500/[0.05] border border-red-500/12 text-red-400 text-[0.75rem] font-medium cursor-pointer hover:bg-red-500/10 hover:border-red-500/22 transition-all disabled:opacity-40">
                  {isRemoving ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Filter Sort Bar ───────────────────────────────────────────────────────────
type FilterValue = "all" | "active" | "expiring" | "expired";

const FILTER_OPTIONS: { val: FilterValue; label: string }[] = [
  { val: "all", label: "Semua" },
  { val: "active", label: "Aktif" },
  { val: "expiring", label: "⚡ Segera Expired" },
  { val: "expired", label: "Expired" },
];

function FilterSortBar({
  filter,
  setFilter,
  sortBy,
  setSortBy,
}: {
  filter: FilterValue;
  setFilter: (v: FilterValue) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
}) {
  return (
    <div className="flex items-center gap-3 mb-5 flex-wrap">
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map(({ val, label }) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-[5px] rounded-[7px] border text-[0.75rem] font-medium cursor-pointer transition-all whitespace-nowrap
              ${
                filter === val
                  ? val === "expiring"
                    ? "bg-amber-500/10 border-amber-500/28 text-amber-400"
                    : val === "expired"
                      ? "bg-red-500/10 border-red-500/28 text-red-400"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-transparent border-emerald-500/12 text-[#7a9585] hover:text-[#e8f0ec] hover:border-emerald-500/25"
              }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="ml-auto">
        <select
          title="Sortir berdasarkan"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-[#0a0f0c] border border-emerald-500/15 text-[#7a9585] text-[0.76rem] rounded-[8px] px-3 py-[6px] cursor-pointer focus:outline-none focus:border-emerald-500/30 transition-all">
          <option value="saved_at">Terbaru Disimpan</option>
          <option value="deadline">Deadline Terdekat</option>
          <option value="matching_score">Highest Match</option>
          <option value="title">Nama A–Z</option>
        </select>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <FadeIn delay={0.05}>
      <div className="text-center py-20 text-[#7a9585]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/[0.05] border border-dashed border-emerald-500/20 mb-5">
          <Bookmark size={22} className="text-emerald-500/30" />
        </div>
        <div className="font-bold text-[1rem] text-[#e8f0ec] mb-2">
          Belum ada lowongan tersimpan
        </div>
        <p className="text-[0.82rem] mb-6 max-w-[280px] mx-auto leading-relaxed">
          Tekan ikon bookmark di halaman lowongan untuk menyimpannya dan temukan
          lagi nanti.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-[10px] rounded-[9px] no-underline text-[0.84rem] transition-all hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
          <Briefcase size={14} /> Jelajahi Lowongan
        </Link>
      </div>
    </FadeIn>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SavedJobsPage() {
  const { token } = useDashboard();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sortBy, setSortBy] = useState<SortOption>("saved_at");

  useEffect(() => {
    if (!token) return;

    const fetchSaved = async () => {
      try {
        const res = await fetch(`${API}/api/saved-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: SavedJobRaw[] = await res.json();
        setSavedJobs(
          (Array.isArray(data) ? data : []).map((j, i) => ({
            ...j,
            color: getColor(i),
          })),
        );
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };

    void fetchSaved();
  }, [token]);

  const handleUnsave = async (jobId: string): Promise<void> => {
    setRemovingId(jobId);
    try {
      await fetch(`${API}/api/saved-jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch {
      // silent
    } finally {
      setRemovingId(null);
    }
  };

  const afterFilter = savedJobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      j.title.toLowerCase().includes(q) ||
      j.companies?.name.toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (filter === "active") return !isExpired(j.deadline);
    if (filter === "expiring")
      return isDeadlineSoon(j.deadline) && !isExpired(j.deadline);
    if (filter === "expired") return isExpired(j.deadline);
    return true;
  });

  const sorted = [...afterFilter].sort((a, b) => {
    if (sortBy === "saved_at")
      return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime();
    if (sortBy === "deadline") {
      const dA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dA - dB;
    }
    if (sortBy === "matching_score")
      return (b.matching_score ?? 0) - (a.matching_score ?? 0);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#0a0f0c] border border-emerald-500/10 rounded-[14px] p-4">
              <SkeletonPulse className="w-8 h-8 rounded-[8px] mb-3" />
              <SkeletonPulse className="h-7 w-10 mb-1" />
              <SkeletonPulse className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-5">
          <SkeletonPulse className="h-5 w-40" />
          <SkeletonPulse className="h-9 w-52 rounded-[9px]" />
        </div>
        <div className="flex gap-2 mb-5">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonPulse key={i} className="h-8 w-20 rounded-[7px]" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <SavedJobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {savedJobs.length > 0 && (
        <FadeIn>
          <StatsBar jobs={savedJobs} />
        </FadeIn>
      )}

      <FadeIn delay={0.02}>
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div>
            <div className="font-bold text-[1rem]">Lowongan Tersimpan</div>
            <div className="text-[0.73rem] text-[#7a9585] mt-[2px]">
              {savedJobs.length} lowongan disimpan
            </div>
          </div>
          {savedJobs.length > 0 && (
            <div className="relative min-w-[220px]">
              <Search
                size={13}
                className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari lowongan tersimpan..."
                className="pl-[34px] pr-8 bg-[#0a0f0c] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              />
              {search && (
                <button
                  title="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer">
                  <X size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </FadeIn>

      {savedJobs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <FadeIn delay={0.04}>
            <FilterSortBar
              filter={filter}
              setFilter={setFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </FadeIn>

          {sorted.length === 0 ? (
            <div className="text-center py-16 text-[#7a9585]">
              <div className="text-[2rem] mb-3 opacity-20">🔍</div>
              <div className="text-[0.88rem] font-semibold mb-2">
                Tidak ada hasil
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="text-emerald-400 text-[0.78rem] hover:opacity-75 transition-opacity cursor-pointer">
                Reset filter
              </button>
            </div>
          ) : (
            <>
              <div className="text-[0.72rem] text-[#7a9585] mb-3">
                Menampilkan {sorted.length} lowongan
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {sorted.map((job, i) => (
                    <SavedJobCard
                      key={job.saved_id}
                      job={job}
                      index={i}
                      onUnsave={handleUnsave}
                      removingId={removingId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          <div className="mt-7 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[10px] rounded-[9px] text-[0.84rem] font-semibold no-underline transition-all">
              <Briefcase size={14} /> Cari Lowongan Lainnya
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
