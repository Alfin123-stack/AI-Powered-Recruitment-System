// @/components/hr/candidates/CandidatesTable.tsx
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Building2,
  X,
  FileText,
  Clock,
  ExternalLink,
  Users,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  MapPin,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  apiFetch,
  getColor,
  getInitials,
} from "@/app/(role)/dashboard/hr/_components/shared";
import type { Candidate } from "@/app/(role)/dashboard/hr/_components/shared";
import OpeningsSection from "./OpeningsSection";
import { useDashboard } from "@/app/(role)/layout";
import { useSearchParams, useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type SortKey = "score" | "match" | "name" | "date" | "applied_role";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "applied" | "review" | "shortlisted" | "rejected";
type CandidateStatus =
  | "applied"
  | "review"
  | "shortlisted"
  | "rejected"
  | "hired";
type DateFilter = "Last 7 days" | "Last 30 days" | "Last 90 days" | "All time";

interface JobMeta {
  key: string;
  label: string;
  color: string;
  count: number;
  todayCount: number;
}

interface ApplicationRaw {
  id: string;
  candidate_name?: string;
  job_title?: string;
  job_id?: string;
  resume_score?: number;
  matching_score?: number;
  extracted_skills?: Array<{ name?: string } | string>;
  status: CandidateStatus;
  created_at: string;
  cv_url?: string;
  candidate_email?: string;
  candidate_phone?: string;
  location?: string;
}

interface CandidateExtended extends Candidate {
  created_at: string;
  email: string;
  phone: string;
  location: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  CandidateStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  applied: {
    label: "Applied",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.2)",
  },
  review: {
    label: "Screening",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.2)",
  },
  shortlisted: {
    label: "Interview",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  rejected: {
    label: "Offer",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  hired: {
    label: "Hired",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.25)",
  },
} as const;

const JOB_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];
const ROWS_PER_PAGE = 8;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getRec(score: number, match: number) {
  const avg = (score + match) / 2;
  if (avg >= 80)
    return {
      label: "Direkomendasikan",
      short: "Rekomen",
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      icon: ThumbsUp,
    };
  if (avg >= 60)
    return {
      label: "Perlu Review Lanjut",
      short: "Review",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      icon: AlertTriangle,
    };
  return {
    label: "Kurang Sesuai",
    short: "Tidak Sesuai",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.2)",
    icon: XCircle,
  };
}

function getScoreColor(s: number): string {
  if (s >= 80) return "#10b981";
  if (s >= 65) return "#06b6d4";
  if (s >= 50) return "#f59e0b";
  return "#f43f5e";
}

function getScoreGradient(s: number): string {
  if (s >= 80) return "linear-gradient(90deg,#10b981,#06b6d4)";
  if (s >= 65) return "linear-gradient(90deg,#06b6d4,#6366f1)";
  if (s >= 50) return "linear-gradient(90deg,#f59e0b,#f97316)";
  return "linear-gradient(90deg,#f43f5e,#f97316)";
}

function isToday(dateStr: string): boolean {
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StageBadge({ status }: { status: string }) {
  const st = STATUS_CONFIG[status as CandidateStatus] ?? STATUS_CONFIG.applied;
  return (
    <span
      className="inline-flex items-center gap-[5px] text-[11px] font-bold px-[9px] py-1 rounded-[6px]"
      style={{
        background: st.bg,
        color: st.color,
        border: `1px solid ${st.border}`,
      }}>
      {st.label}
    </span>
  );
}

function JobFilterDropdown({
  jobMetas,
  activeJob,
  totalCount,
  onSelect,
}: {
  jobMetas: JobMeta[];
  activeJob: string;
  totalCount: number;
  onSelect: (job: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = jobMetas.filter((j) =>
    j.label.toLowerCase().includes(search.toLowerCase()),
  );
  const activeJobMeta = jobMetas.find((j) => j.key === activeJob);
  const activeColor = activeJobMeta?.color ?? "#10b981";
  const activeLabel =
    activeJob === "all"
      ? "Semua Posisi"
      : (activeJobMeta?.label ?? "Semua Posisi");
  const activeCount =
    activeJob === "all" ? totalCount : (activeJobMeta?.count ?? 0);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        title={`Filter posisi: ${activeLabel}`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-[5px] rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer"
        style={
          open
            ? {
                background:
                  activeJob === "all"
                    ? "rgba(16,185,129,0.15)"
                    : `${activeColor}18`,
                color: activeJob === "all" ? "#10b981" : activeColor,
                border: `1px solid ${activeJob === "all" ? "rgba(16,185,129,0.4)" : `${activeColor}50`}`,
              }
            : activeJob === "all"
              ? {
                  background: "#10b981",
                  color: "#0a100d",
                  border: "1px solid #10b981",
                }
              : {
                  background: `${activeColor}15`,
                  color: activeColor,
                  border: `1px solid ${activeColor}40`,
                }
        }>
        {activeJob !== "all" && (
          <span
            className="w-[5px] h-[5px] rounded-full flex-shrink-0"
            style={{ background: activeColor }}
          />
        )}
        {activeJob === "all" && <Users size={10} />}
        {activeLabel}
        <span className="text-[10px] opacity-70">{activeCount}</span>
        <ChevronDown
          size={10}
          className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-full mt-2 z-[500] w-[260px] rounded-xl overflow-hidden"
            style={{
              background: "#0d1510",
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            }}>
            {/* Search input */}
            <div
              className="p-2"
              style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-[9px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
                />
                <input
                  ref={inputRef}
                  type="search"
                  title="Cari posisi pekerjaan"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari posisi..."
                  className="w-full pl-7 pr-3 py-[6px] rounded-[8px] text-[12px] outline-none text-[#e8f0ec]"
                  style={{
                    background: "#141f19",
                    border: "1px solid rgba(16,185,129,0.15)",
                  }}
                />
              </div>
            </div>

            <div className="overflow-y-auto py-1 max-h-60">
              {search === "" && (
                <button
                  type="button"
                  title="Tampilkan semua posisi"
                  onClick={() => {
                    onSelect("all");
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-left transition-colors cursor-pointer hover:bg-[rgba(16,185,129,0.04)]"
                  style={{
                    background:
                      activeJob === "all"
                        ? "rgba(16,185,129,0.08)"
                        : "transparent",
                    color: activeJob === "all" ? "#10b981" : "#7a9585",
                  }}>
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-[#10b981]" />
                    Semua Posisi
                  </div>
                  <span
                    className="text-[10px] font-bold px-[6px] py-[2px] rounded-[4px]"
                    style={{
                      background:
                        activeJob === "all"
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(16,185,129,0.06)",
                      color: activeJob === "all" ? "#10b981" : "#7a9585",
                    }}>
                    {totalCount}
                  </span>
                </button>
              )}
              {search === "" && jobMetas.length > 0 && (
                <div
                  className="mx-3 my-1 h-px"
                  style={{ background: "rgba(16,185,129,0.08)" }}
                />
              )}
              {filtered.length === 0 ? (
                <div className="px-3 py-5 text-center text-[12px] text-[#7a9585]">
                  Posisi tidak ditemukan
                </div>
              ) : (
                filtered.map((job) => (
                  <button
                    key={job.key}
                    type="button"
                    title={`Filter posisi: ${job.label}`}
                    onClick={() => {
                      onSelect(job.key);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-left transition-colors cursor-pointer"
                    style={{
                      background:
                        activeJob === job.key
                          ? `${job.color}10`
                          : "transparent",
                      color: activeJob === job.key ? job.color : "#7a9585",
                    }}
                    onMouseEnter={(e) => {
                      if (activeJob !== job.key)
                        e.currentTarget.style.background = `${job.color}08`;
                    }}
                    onMouseLeave={(e) => {
                      if (activeJob !== job.key)
                        e.currentTarget.style.background = "transparent";
                    }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                        style={{ background: job.color }}
                      />
                      <span className="truncate">{job.label}</span>
                    </div>
                    <span
                      className="text-[10px] font-bold px-[6px] py-[2px] rounded-[4px] flex-shrink-0 ml-2"
                      style={{
                        background:
                          activeJob === job.key
                            ? `${job.color}20`
                            : "rgba(16,185,129,0.06)",
                        color: activeJob === job.key ? job.color : "#7a9585",
                      }}>
                      {job.count}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionDropdown({
  candidate,
  onStatusChange,
  onView,
}: {
  candidate: CandidateExtended;
  onStatusChange: (id: string, status: CandidateStatus) => void;
  onView: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const dropdownH = 160;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < dropdownH ? rect.top - dropdownH - 4 : rect.bottom + 4;
    setPos({ top, left: rect.right - 160 });
  }, []);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePos();
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const menuItems: Array<{
    label: string;
    icon: React.ElementType;
    action: () => void;
    color: string;
  }> = [
    {
      label: "Lihat Detail",
      icon: Eye,
      action: () => {
        onView();
        setOpen(false);
      },
      color: "#e8f0ec",
    },
    {
      label: "Shortlist",
      icon: ThumbsUp,
      action: () => {
        onStatusChange(candidate.id, "shortlisted");
        setOpen(false);
      },
      color: "#10b981",
    },
    {
      label: "In Review",
      icon: RotateCcw,
      action: () => {
        onStatusChange(candidate.id, "review");
        setOpen(false);
      },
      color: "#06b6d4",
    },
    {
      label: "Tolak",
      icon: ThumbsDown,
      action: () => {
        onStatusChange(candidate.id, "rejected");
        setOpen(false);
      },
      color: "#f43f5e",
    },
  ];

  const menu = (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="fixed z-[9999] rounded-[10px] overflow-hidden w-40"
            style={{
              top: pos.top,
              left: pos.left,
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}>
            {menuItems.map(({ label, icon: Icon, action, color }) => (
              <button
                key={label}
                type="button"
                title={label}
                onClick={(e) => {
                  e.stopPropagation();
                  action();
                }}
                className="flex items-center gap-2 w-full px-3 py-[9px] text-[12px] font-semibold text-left transition-colors hover:bg-[rgba(16,185,129,0.06)]"
                style={{ color }}>
                <Icon size={12} />
                {label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        title="Opsi aksi kandidat"
        onClick={handleOpen}
        className="w-7 h-7 flex items-center justify-center rounded-[7px] transition-colors text-[#7a9585] hover:bg-[rgba(16,185,129,0.08)]"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(16,185,129,0.12)",
        }}>
        <MoreHorizontal size={14} />
      </button>
      {typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
}

function CandidateModal({
  candidate,
  onClose,
  onStatusChange,
}: {
  candidate: CandidateExtended;
  onClose: () => void;
  onStatusChange: (id: string, status: CandidateStatus) => void;
}) {
  const rec = getRec(candidate.resumeScore, candidate.matchScore);
  const RecIcon = rec.icon;
  const st = STATUS_CONFIG[candidate.status as CandidateStatus];

  const actionButtons: Array<{
    label: string;
    status: CandidateStatus;
    Icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }> = [
    {
      label: "Shortlist",
      status: "shortlisted",
      Icon: ThumbsUp,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.22)",
    },
    {
      label: "Review",
      status: "review",
      Icon: RotateCcw,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.07)",
      border: "rgba(6,182,212,0.2)",
    },
    {
      label: "Tolak",
      status: "rejected",
      Icon: ThumbsDown,
      color: "#f43f5e",
      bg: "rgba(244,63,94,0.07)",
      border: "rgba(244,63,94,0.2)",
    },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[20px]"
        style={{
          background: "#0f1612",
          border: "1px solid rgba(16,185,129,0.2)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}>
        {/* Gradient top bar */}
        <div
          className="h-[3px] w-full rounded-t-[20px]"
          style={{
            background: st
              ? `linear-gradient(90deg,${st.color},transparent)`
              : "transparent",
          }}
        />

        {/* Header */}
        <div
          className="flex items-start justify-between px-6 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center font-extrabold text-[0.9rem] flex-shrink-0"
              style={{
                background: `${candidate.color}18`,
                color: candidate.color,
              }}>
              {candidate.avatar}
            </div>
            <div>
              <div className="font-bold text-[#e8f0ec] text-[15px]">
                {candidate.name}
              </div>
              <div className="text-[12px] text-[#7a9585] mt-[2px]">
                {candidate.job}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {st && (
                  <span
                    className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-full text-[11px] font-bold"
                    style={{
                      background: st.bg,
                      color: st.color,
                      border: `1px solid ${st.border}`,
                    }}>
                    <span
                      className="w-[5px] h-[5px] rounded-full"
                      style={{ background: st.color }}
                    />
                    {st.label}
                  </span>
                )}
                <span
                  className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-full text-[11px] font-bold"
                  style={{
                    background: rec.bg,
                    color: rec.color,
                    border: `1px solid ${rec.border}`,
                  }}>
                  <RecIcon size={10} />
                  {rec.short}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            title="Tutup modal"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors text-[#7a9585] hover:bg-[rgba(16,185,129,0.08)]"
            style={{
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.15)",
            }}>
            <X size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Score cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "AI Score",
                val: candidate.resumeScore,
                suffix: "/100",
                gradient: "linear-gradient(90deg,#10b981,#06b6d4)",
              },
              {
                label: "Match Score",
                val: candidate.matchScore,
                suffix: "%",
                gradient: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-[12px] p-4"
                style={{
                  background: "#141f19",
                  border: "1px solid rgba(16,185,129,0.12)",
                }}>
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#7a9585] mb-2">
                  {s.label}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className="font-extrabold text-[2rem] leading-none"
                    style={{ color: getScoreColor(s.val) }}>
                    {s.val || "—"}
                  </span>
                  <span className="text-[11px] text-[#7a9585] mb-1">
                    {s.suffix}
                  </span>
                </div>
                <div
                  className="h-[4px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.val}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: s.gradient }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation badge */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-[10px] text-[13px] font-semibold"
            style={{
              background: rec.bg,
              color: rec.color,
              border: `1px solid ${rec.border}`,
            }}>
            <RecIcon size={14} />
            {rec.label}
          </div>

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <div>
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#7a9585] mb-2">
                Skills Terdeteksi
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {candidate.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-[9px] py-[4px] rounded-[6px] text-[12px] font-mono text-[#e8f0ec]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div
            className="rounded-[12px] p-3 space-y-2"
            style={{
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            <div className="flex items-center gap-2 text-[12px] text-[#7a9585]">
              <Building2 size={12} className="flex-shrink-0" />
              {candidate.job}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#7a9585]">
              <Clock size={12} className="flex-shrink-0" />
              Dilamar {candidate.appliedDate}
            </div>
          </div>

          {/* CV link */}
          {candidate.cv_url ? (
            <a
              href={candidate.cv_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between w-full px-4 py-[10px] rounded-[10px] text-[13px] font-semibold no-underline text-[#10b981] hover:bg-[rgba(16,185,129,0.06)] transition-colors"
              style={{
                background: "#141f19",
                border: "1px solid rgba(16,185,129,0.15)",
              }}>
              <div className="flex items-center gap-2">
                <FileText size={14} />
                Lihat CV Kandidat
              </div>
              <ExternalLink size={12} />
            </a>
          ) : (
            <div
              className="flex items-center justify-center gap-2 w-full py-[10px] rounded-[10px] text-[13px] text-[#7a9585]"
              style={{
                background: "#141f19",
                border: "1px solid rgba(16,185,129,0.1)",
              }}>
              <FileText size={14} />
              CV tidak tersedia
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            {actionButtons.map(({ label, status, Icon, color, bg, border }) => (
              <button
                key={status}
                type="button"
                title={`Ubah status kandidat ke ${label}`}
                onClick={() => {
                  onStatusChange(candidate.id, status);
                  onClose();
                }}
                disabled={candidate.status === status}
                className="flex items-center justify-center gap-[6px] py-[9px] rounded-[10px] font-bold text-[13px] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: bg,
                  color,
                  border: `1px solid ${border}`,
                }}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SortTh({
  label,
  sortKey: key,
  currentKey,
  dir,
  onSort,
}: {
  label: string;
  sortKey: string;
  currentKey: string;
  dir: SortDir;
  onSort: (k: string) => void;
}) {
  const active = currentKey === key;
  return (
    <th
      className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
      style={{ color: active ? "#10b981" : "#7a9585" }}
      onClick={() => onSort(key)}>
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          dir === "asc" ? (
            <ArrowUp size={10} />
          ) : (
            <ArrowDown size={10} />
          )
        ) : (
          <ArrowUpDown size={9} className="opacity-30" />
        )}
      </div>
    </th>
  );
}

function Pagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btnBase =
    "w-7 h-7 flex items-center justify-center rounded-[7px] text-[12px] font-semibold transition-all";
  const navStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(16,185,129,0.12)",
    color: "#7a9585",
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title="Halaman pertama"
        onClick={() => onChange(1)}
        disabled={page === 1}
        className={`${btnBase} disabled:opacity-30`}
        style={navStyle}>
        <ChevronsLeft size={12} />
      </button>
      <button
        type="button"
        title="Halaman sebelumnya"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} disabled:opacity-30`}
        style={navStyle}>
        <ChevronLeft size={12} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-7 text-center text-[11px] text-[#7a9585]">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            title={`Halaman ${p}`}
            onClick={() => onChange(p as number)}
            className={btnBase}
            style={
              page === p
                ? {
                    background: "#10b981",
                    color: "#0a100d",
                    border: "1px solid #10b981",
                  }
                : navStyle
            }>
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        title="Halaman berikutnya"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} disabled:opacity-30`}
        style={navStyle}>
        <ChevronRight size={12} />
      </button>
      <button
        type="button"
        title="Halaman terakhir"
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        className={`${btnBase} disabled:opacity-30`}
        style={navStyle}>
        <ChevronsRight size={12} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function CandidatesTable({
  initialJob,
}: {
  initialJob?: string;
}) {
  const { token } = useDashboard();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [candidates, setCandidates] = useState<CandidateExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeJob, setActiveJob] = useState<string>(
    initialJob ?? searchParams.get("job") ?? "all",
  );
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateExtended | null>(null);
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<DateFilter>("Last 30 days");

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/applications/hr", token)
      .then((apps: ApplicationRaw[]) => {
        const mapped: CandidateExtended[] = apps.map((a, i) => ({
          id: a.id,
          name: a.candidate_name ?? "Kandidat",
          avatar: getInitials(a.candidate_name ?? "KD"),
          job: a.job_title ?? "-",
          jobId: a.job_id ?? "",
          resumeScore: a.resume_score ?? 0,
          matchScore: a.matching_score ?? 0,
          skills: (a.extracted_skills ?? [])
            .slice(0, 6)
            .map((s) => (typeof s === "string" ? s : (s.name ?? ""))),
          status: a.status,
          appliedDate: new Date(a.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          created_at: a.created_at,
          color: getColor(i),
          cv_url: a.cv_url ?? null,
          email: a.candidate_email ?? "",
          phone: a.candidate_phone ?? "",
          location: a.location ?? "Jakarta",
        }));
        setCandidates(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (
    applicationId: string,
    status: CandidateStatus,
  ) => {
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

  const uniqueJobs = [...new Set(candidates.map((c) => c.job))].sort();
  const jobMetas: JobMeta[] = uniqueJobs.map((job, i) => {
    const jobCandidates = candidates.filter((c) => c.job === job);
    const todayCount = jobCandidates.filter((c) =>
      isToday(c.created_at),
    ).length;
    return {
      key: job,
      label: job,
      color: JOB_COLORS[i % JOB_COLORS.length],
      count: jobCandidates.length,
      todayCount,
    };
  });

  const getJobColor = (job: string): string =>
    jobMetas.find((j) => j.key === job)?.color ?? "#7a9585";

  const scoped =
    activeJob === "all"
      ? candidates
      : candidates.filter((c) => c.job === activeJob);

  const filtered = useMemo(() => {
    return scoped
      .filter((c) => {
        const statusMatch = activeStatus === "all" || c.status === activeStatus;
        const q = search.toLowerCase();
        const queryMatch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)) ||
          c.job.toLowerCase().includes(q);
        return statusMatch && queryMatch;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "score") cmp = b.resumeScore - a.resumeScore;
        else if (sortKey === "match") cmp = b.matchScore - a.matchScore;
        else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
        else if (sortKey === "applied_role") cmp = a.job.localeCompare(b.job);
        return sortDir === "asc" ? -cmp : cmp;
      });
  }, [scoped, activeStatus, search, sortKey, sortDir]);

  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key as SortKey);
      setSortDir("desc");
    }
    setPage(1); // ← reset di sini
  };

  const handleSelectJob = (job: string) => {
    setActiveJob(job);
    setPage(1); // ← reset di sini
    if (job === "all") router.replace("/dashboard/hr/candidates");
    else
      router.replace(`/dashboard/hr/candidates?job=${encodeURIComponent(job)}`);
  };
  // Ganti setState langsung dengan handler yang juga reset page

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setActiveStatus(status);
    setPage(1);
  };

  const statusTabs: Array<{ key: StatusFilter; label: string }> = [
    { key: "all", label: "Semua" },
    { key: "applied", label: "Applied" },
    { key: "review", label: "Screening" },
    { key: "shortlisted", label: "Interview" },
    { key: "rejected", label: "Offer" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 bg-[#0a100d]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={22} className="animate-spin text-[#10b981]" />
          <span className="text-[13px] text-[#7a9585]">Memuat kandidat...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onStatusChange={updateStatus}
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
              Kandidat terdaftar —{" "}
              <span className="font-bold text-[#e8f0ec]">
                {candidates.length}
              </span>{" "}
              kandidat aktif
            </div>
          </div>
        </div>

        {/* CURRENT OPENINGS */}
        <OpeningsSection jobMetas={jobMetas} />

        {/* HEADER BAR */}
        <div
          className="flex items-center justify-between gap-3 px-6 py-3 bg-[#0f1612]"
          style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
          <h2 className="font-bold text-[#e8f0ec] text-[15px]">Candidates</h2>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
              />
              <input
                type="search"
                title="Cari kandidat berdasarkan nama atau posisi"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, role"
                className="pl-8 pr-3 py-[7px] w-[200px] rounded-[9px] text-[13px] outline-none text-[#e8f0ec] bg-[#141f19] border border-[rgba(16,185,129,0.15)] focus:border-[rgba(16,185,129,0.4)] transition-colors"
              />
              {search && (
                <button
                  type="button"
                  title="Hapus pencarian"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-[8px] top-1/2 -translate-y-1/2 text-[#7a9585]">
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              type="button"
              title="Buka panel filter"
              className="flex items-center gap-2 px-3 py-[7px] rounded-[9px] text-[12px] font-semibold text-[#7a9585] bg-[#141f19] border border-[rgba(16,185,129,0.15)] hover:bg-[rgba(16,185,129,0.06)] transition-colors">
              <SlidersHorizontal size={13} />
              Filter
            </button>

            {/* Sort by */}
            <div className="relative">
              <select
                title="Urutkan kandidat"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="pl-3 pr-8 py-[7px] rounded-[9px] text-[12px] outline-none cursor-pointer appearance-none font-semibold text-[#7a9585] bg-[#141f19] border border-[rgba(16,185,129,0.15)]">
                <option value="name">Sort by A–Z</option>
                <option value="score">Sort by AI Score</option>
                <option value="match">Sort by Match</option>
                <option value="applied_role">Sort by Role</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
              />
            </div>

            {/* Date filter */}
            <div className="relative">
              <select
                title="Filter berdasarkan tanggal"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="pl-3 pr-8 py-[7px] rounded-[9px] text-[12px] outline-none cursor-pointer appearance-none font-semibold text-[#7a9585] bg-[#141f19] border border-[rgba(16,185,129,0.15)]">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>All time</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a9585]"
              />
            </div>
          </div>
        </div>

        {/* JOB + STATUS FILTER BAR */}
        <div
          className="flex items-center gap-3 px-6 py-[10px] bg-[#0d1510]"
          style={{ borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
          <JobFilterDropdown
            jobMetas={jobMetas}
            activeJob={activeJob}
            totalCount={candidates.length}
            onSelect={handleSelectJob}
          />
          <div
            className="w-px self-stretch"
            style={{ background: "rgba(16,185,129,0.1)" }}
          />
          <div className="flex items-center gap-1">
            {statusTabs.map(({ key, label }) => {
              const scope =
                activeJob === "all"
                  ? candidates
                  : candidates.filter((c) => c.job === activeJob);
              const count =
                key === "all"
                  ? scope.length
                  : scope.filter((c) => c.status === key).length;
              const isActive = activeStatus === key;
              return (
                <button
                  key={key}
                  type="button"
                  title={`Filter status: ${label}`}
                  onClick={() => handleStatusChange(key)}
                  className="flex items-center gap-[5px] px-[10px] py-[4px] rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer"
                  style={
                    isActive
                      ? {
                          background: "rgba(16,185,129,0.12)",
                          color: "#10b981",
                          border: "1px solid rgba(16,185,129,0.3)",
                        }
                      : {
                          background: "transparent",
                          color: "#7a9585",
                          border: "1px solid transparent",
                        }
                  }>
                  {label}
                  <span
                    className="text-[10px] font-bold px-[5px] py-[1px] rounded-[3px]"
                    style={{
                      background: isActive
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(16,185,129,0.06)",
                      color: isActive ? "#10b981" : "#7a9585",
                    }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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
                <SortTh
                  label="Applied Role"
                  sortKey="applied_role"
                  currentKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Location
                </th>
                <SortTh
                  label="Candidates"
                  sortKey="name"
                  currentKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Contact
                </th>
                <SortTh
                  label="Applied Date"
                  sortKey="date"
                  currentKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />
                <th className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider text-[#7a9585] whitespace-nowrap">
                  Stage
                </th>
                <SortTh
                  label="AI Score"
                  sortKey="score"
                  currentKey={sortKey}
                  dir={sortDir}
                  onSort={handleSort}
                />
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
                          Tidak ada kandidat ditemukan
                        </p>
                        <p className="text-[12px] mt-1 text-[#7a9585] opacity-70">
                          Coba ubah filter atau kata kunci pencarian
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((c, i) => {
                    const rowNum = (page - 1) * ROWS_PER_PAGE + i + 1;
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
                        {/* Row number */}
                        <td className="px-4 py-3 w-10">
                          <span className="text-[11px] font-bold tabular-nums text-[#7a9585]">
                            {rowNum}
                          </span>
                        </td>

                        {/* Applied role */}
                        <td className="px-4 py-3">
                          <span
                            className="text-[12px] font-semibold"
                            style={{ color: jobColor }}>
                            {c.job}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <MapPin size={10} className="text-[#7a9585]" />
                            <span className="text-[12px] text-[#7a9585]">
                              {c.location}
                            </span>
                          </div>
                        </td>

                        {/* Candidate name + email */}
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

                        {/* Phone */}
                        <td className="px-4 py-3">
                          <span className="text-[12px] text-[#7a9585] font-mono">
                            {c.phone}
                          </span>
                        </td>

                        {/* Applied date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={10} className="text-[#7a9585]" />
                            <span className="text-[12px] text-[#7a9585]">
                              {c.appliedDate}
                            </span>
                          </div>
                        </td>

                        {/* Stage badge */}
                        <td className="px-4 py-3">
                          <StageBadge status={c.status} />
                        </td>

                        {/* AI Score */}
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

                        {/* Actions */}
                        <td
                          className="px-4 py-3"
                          onClick={(e) => e.stopPropagation()}>
                          <ActionDropdown
                            candidate={c}
                            onStatusChange={updateStatus}
                            onView={() => setSelectedCandidate(c)}
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
                : Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}
            </span>{" "}
            –{" "}
            <span className="font-semibold text-[#e8f0ec]">
              {Math.min(page * ROWS_PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#e8f0ec]">
              {filtered.length}
            </span>{" "}
            candidates
          </span>
          <Pagination
            page={page}
            total={filtered.length}
            perPage={ROWS_PER_PAGE}
            onChange={setPage}
          />
        </div>
      </div>
    </>
  );
}
