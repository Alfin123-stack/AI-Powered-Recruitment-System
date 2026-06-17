"use client";

import { useState, useMemo, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Building2,
  X,
  FileText,
  Clock,
  ExternalLink,
  Target,
  CheckCircle2,
  Brain,
  AlertTriangle,
} from "lucide-react";
import type {
  ActionButton,
  CandidateUI,
  GroupMetric,
  InsightPanel,
  JobGroup,
  ScoreItem,
  StatusAction,
} from "@/types/hr/dashboard";
import {
  getScoreColor,
  getScoreGradient,
  getRec,
  computeInsight,
  statusMap,
} from "@/lib/helpers/hr/dashboard";
import {
  RANK_COLORS,
  REC_ICON_MAP,
  STATUS_FILTER_OPTIONS,
  TABLE_HEADERS,
} from "@/constants/hr/dashboard";

// ── Candidate Insight Row ─────────────────────────────────────────────────────
function CandidateInsightRow({ candidate }: { candidate: CandidateUI }) {
  const ins = useMemo(() => computeInsight(candidate), [candidate]);

  const panels: InsightPanel[] = [
    {
      title: "Kekuatan",
      items: ins.strengths.slice(0, 2),
      color: "#10b981",
      bg: "rgba(16,185,129,0.05)",
      border: "rgba(16,185,129,0.12)",
      Icon: CheckCircle2,
    },
    {
      title: "Perhatian",
      items: ins.weaknesses.slice(0, 2),
      color: "#ef4444",
      bg: "rgba(239,68,68,0.05)",
      border: "rgba(239,68,68,0.12)",
      Icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex gap-3 py-2 px-1 flex-wrap">
      {panels.map(({ title, items, color, bg, border, Icon }) => (
        <div
          key={title}
          className="flex-1 min-w-[200px] flex items-start gap-2 rounded-[9px] p-3"
          style={{ background: bg, border: `1px solid ${border}` }}>
          <Icon size={11} style={{ color, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div
              className="text-[0.6rem] font-black uppercase tracking-widest mb-1"
              style={{ color }}>
              {title}
            </div>
            <div className="flex flex-wrap gap-1">
              {items.map((s, i) => (
                <span
                  key={i}
                  className="text-[0.68rem]"
                  style={{ color: `${color}cc` }}>
                  {s}
                  {i < items.length - 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Candidate Modal ───────────────────────────────────────────────────────────
function CandidateModal({
  candidate,
  onClose,
  onStatusChange,
}: {
  candidate: CandidateUI;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const st = statusMap[candidate.status] ?? {
    label: candidate.status,
    color: "#475569",
  };
  const rec = getRec(candidate.resumeScore, candidate.matchScore);
  const ins = useMemo(() => computeInsight(candidate), [candidate]);

  const RecIcon =
    REC_ICON_MAP[rec.iconName as keyof typeof REC_ICON_MAP] ?? CheckCircle2;

  const scoreItems: ScoreItem[] = [
    { label: "AI Score", val: candidate.resumeScore, suffix: "/100" },
    { label: "Match Score", val: candidate.matchScore, suffix: "%" },
  ];

  const insightPanels: InsightPanel[] = [
    {
      title: "Kekuatan",
      items: ins.strengths.slice(0, 3),
      color: "#10b981",
      bg: "rgba(16,185,129,0.06)",
      border: "rgba(16,185,129,0.15)",
      Icon: CheckCircle2,
    },
    {
      title: "Perhatian",
      items: ins.weaknesses.slice(0, 3),
      color: "#ef4444",
      bg: "rgba(239,68,68,0.05)",
      border: "rgba(239,68,68,0.15)",
      Icon: AlertTriangle,
    },
  ];

  const statusActions: StatusAction[] = [
    {
      label: "Shortlist",
      status: "shortlisted",
      Icon: ThumbsUp,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.25)",
    },
    {
      label: "Review",
      status: "review",
      Icon: Eye,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.07)",
      border: "rgba(6,182,212,0.2)",
    },
    {
      label: "Tolak",
      status: "rejected",
      Icon: ThumbsDown,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.07)",
      border: "rgba(239,68,68,0.2)",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-[8px] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Candidate detail ${candidate.name}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-[520px] max-h-[92vh] overflow-y-auto rounded-[20px] bg-[#0a0f0c] border border-emerald-500/25"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
        <div
          className="h-[3px] rounded-t-[20px]"
          style={{
            background: `linear-gradient(90deg,${st.color},transparent)`,
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-[13px] flex items-center justify-center text-[0.9rem] font-black flex-shrink-0"
              style={{
                background: `${candidate.color}18`,
                border: `1px solid ${candidate.color}30`,
                color: candidate.color,
              }}>
              {candidate.avatar}
            </div>
            <div className="min-w-0">
              <div className="font-black text-[0.95rem] text-[#e8f0ec]">
                {candidate.name}
              </div>
              <div className="text-[0.75rem] text-[#7a9585] mt-[2px] truncate">
                {candidate.job}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span
                  className="text-[0.68rem] font-bold px-2 py-[3px] rounded-full flex items-center gap-1"
                  style={{
                    background: `${st.color}18`,
                    color: st.color,
                    border: `1px solid ${st.color}30`,
                  }}>
                  <span
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: st.color }}
                    aria-hidden="true"
                  />
                  {st.label}
                </span>
                <span
                  className="text-[0.68rem] font-bold px-2 py-[3px] rounded-full flex items-center gap-1 border"
                  style={{
                    background: rec.bg,
                    color: rec.color,
                    borderColor: rec.border,
                  }}>
                  <RecIcon size={10} aria-hidden="true" /> {rec.label}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            title="Close candidate detail"
            aria-label="Close candidate detail"
            onClick={onClose}
            className="w-8 h-8 rounded-[9px] bg-white/[0.05] border border-white/10 flex items-center justify-center cursor-pointer text-[#64748b] hover:text-[#e8f0ec] hover:bg-white/[0.08] transition-colors flex-shrink-0">
            <X size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {/* Scores */}
          <div className="grid grid-cols-2 gap-3">
            {scoreItems.map((s) => (
              <div
                key={s.label}
                className="rounded-[13px] p-4 bg-white/[0.03] border border-white/[0.07]">
                <div className="text-[0.62rem] font-bold uppercase tracking-widest text-[#7a9585] mb-2">
                  {s.label}
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span
                    className="font-black text-[2rem] leading-none"
                    style={{ color: getScoreColor(s.val) }}>
                    {s.val || "—"}
                  </span>
                  <span className="text-[0.7rem] text-[#7a9585] mb-[2px]">
                    {s.suffix}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.val}%` }}
                    transition={{ duration: 0.9 }}
                    className="h-full rounded-full"
                    style={{ background: getScoreGradient(s.val) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis */}
          <div className="rounded-[13px] p-4 bg-emerald-500/[0.04] border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Brain
                size={13}
                className="text-emerald-400"
                aria-hidden="true"
              />
              <span className="text-[0.72rem] font-bold text-emerald-400">
                AI Analysis
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {insightPanels.map(
                ({ title, items, color, bg, border, Icon }) => (
                  <div
                    key={title}
                    className="rounded-[9px] p-3"
                    style={{ background: bg, border: `1px solid ${border}` }}>
                    <div
                      className="text-[0.6rem] font-black uppercase tracking-widest mb-2 flex items-center gap-1"
                      style={{ color }}>
                      <Icon size={9} aria-hidden="true" /> {title}
                    </div>
                    {items.map((s, i) => (
                      <div
                        key={i}
                        className="text-[0.68rem] mb-1 flex items-start gap-1"
                        style={{ color: `${color}cc` }}>
                        <span
                          className="mt-[5px] w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: color }}
                          aria-hidden="true"
                        />
                        {s}
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-widest text-[#7a9585] mb-2">
                Skills Terdeteksi
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-[7px] text-[0.75rem] font-mono text-[#e8f0ec] bg-white/[0.04] border border-white/[0.08]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="rounded-[12px] p-3 bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-[0.75rem] text-[#7a9585]">
              <Building2
                size={12}
                className="text-[#475569]"
                aria-hidden="true"
              />
              {candidate.job}
            </div>
            <div className="flex items-center gap-2 text-[0.75rem] text-[#7a9585]">
              <Clock size={12} className="text-[#475569]" aria-hidden="true" />
              Dilamar {candidate.appliedDate}
            </div>
          </div>

          {/* CV Link */}
          {candidate.cv_url ? (
            <a
              href={candidate.cv_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-[11px] no-underline bg-emerald-500/[0.07] border border-emerald-500/20 text-emerald-400 text-[0.82rem] font-semibold hover:bg-emerald-500/[0.12] transition-colors">
              <div className="flex items-center gap-2">
                <FileText size={14} aria-hidden="true" /> Lihat CV Kandidat
              </div>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 rounded-[11px] bg-white/[0.02] border border-white/[0.06] text-[0.82rem] text-[#7a9585]">
              <FileText size={14} aria-hidden="true" /> CV tidak tersedia
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            {statusActions.map(({ label, status, Icon, color, bg, border }) => (
              <button
                key={status}
                type="button"
                title={label}
                aria-label={`${label} candidate ${candidate.name}`}
                onClick={() => {
                  onStatusChange(candidate.id, status);
                  onClose();
                }}
                disabled={candidate.status === status}
                className="flex items-center justify-center gap-2 p-3 rounded-[11px] font-bold text-[0.82rem] cursor-pointer transition-all duration-150 hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: bg,
                  color,
                  border: `1px solid ${border}`,
                }}>
                <Icon size={13} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Job Group Table ───────────────────────────────────────────────────────────
function JobGroupTable({
  group,
  onView,
  onStatusChange,
}: {
  group: JobGroup;
  onView: (c: CandidateUI) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const groupMetrics: GroupMetric[] = [
    { label: "Pelamar", val: group.allCandidates.length, color: "#e8f0ec" },
    { label: "Shortlisted", val: group.shortlisted, color: "#10b981" },
    {
      label: "Avg AI Score",
      val: group.avgScore,
      color: getScoreColor(group.avgScore),
    },
  ];

  return (
    <div className="rounded-[14px] overflow-hidden mb-3 bg-[#0a0f0c] border border-emerald-500/12">
      {/* Group header */}
      <button
        type="button"
        title={`${collapsed ? "Buka" : "Tutup"} grup ${group.title}`}
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-transparent border-none cursor-pointer text-left hover:bg-white/[0.02] transition-colors"
        style={{
          borderBottom: collapsed ? "none" : "1px solid rgba(255,255,255,0.04)",
        }}>
        <span
          className="w-[10px] h-[10px] rounded-full flex-shrink-0"
          style={{
            background: group.color,
            boxShadow: `0 0 8px ${group.color}60`,
          }}
          aria-hidden="true"
        />
        <span className="font-bold text-[#e8f0ec] text-[0.85rem] flex-1 truncate">
          {group.title}
        </span>
        <div className="flex items-center gap-4 mr-2 flex-shrink-0">
          {groupMetrics.map((m) => (
            <div key={m.label} className="flex items-center gap-1">
              <span className="text-[0.68rem] text-[#7a9585]">{m.label}:</span>
              <span
                className="text-[0.75rem] font-black"
                style={{ color: m.color }}>
                {m.val}
              </span>
            </div>
          ))}
        </div>
        <ChevronDown
          size={14}
          className="text-[#475569] flex-shrink-0 transition-transform duration-200"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0)" }}
          aria-hidden="true"
        />
      </button>

      {/* Table */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}>
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse"
                style={{ minWidth: 700 }}>
                <thead>
                  <tr className="bg-black/25">
                    {TABLE_HEADERS.map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-2 text-left text-[0.62rem] font-bold tracking-widest uppercase text-[#7a9585] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.candidates.map((c, i) => {
                    const st = statusMap[c.status] ?? {
                      label: c.status,
                      color: "#475569",
                    };
                    const rec = getRec(c.resumeScore, c.matchScore);
                    const RecIcon =
                      REC_ICON_MAP[rec.iconName as keyof typeof REC_ICON_MAP] ??
                      CheckCircle2;
                    const rankCol = RANK_COLORS[i] ?? "#475569";
                    const isTop3 = i < 3;
                    const isExpanded = expandedInsight === c.id;

                    const actionButtons: ActionButton[] = [
                      {
                        onClick: () => onStatusChange(c.id, "shortlisted"),
                        title: "Shortlist candidate",
                        Icon: ThumbsUp,
                        color: "#10b981",
                        bg: "rgba(16,185,129,0.08)",
                        border: "rgba(16,185,129,0.2)",
                        disabled: c.status === "shortlisted",
                      },
                      {
                        onClick: () => onStatusChange(c.id, "rejected"),
                        title: "Reject candidate",
                        Icon: ThumbsDown,
                        color: "#ef4444",
                        bg: "rgba(239,68,68,0.07)",
                        border: "rgba(239,68,68,0.18)",
                        disabled: c.status === "rejected",
                      },
                      {
                        onClick: () => onView(c),
                        title: "View candidate detail",
                        Icon: Eye,
                        color: "#94a3b8",
                        bg: "rgba(255,255,255,0.04)",
                        border: "rgba(255,255,255,0.1)",
                        disabled: false,
                      },
                      {
                        onClick: () =>
                          setExpandedInsight(isExpanded ? null : c.id),
                        title: "Lihat AI Insight",
                        Icon: Brain,
                        color: "#8b5cf6",
                        bg: isExpanded
                          ? "rgba(139,92,246,0.15)"
                          : "rgba(139,92,246,0.07)",
                        border: isExpanded
                          ? "rgba(139,92,246,0.35)"
                          : "rgba(139,92,246,0.18)",
                        disabled: false,
                      },
                    ];

                    return (
                      <Fragment key={c.id}>
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => onView(c)}
                          className="border-t border-white/[0.04] cursor-pointer transition-colors duration-150"
                          style={{
                            background: isExpanded
                              ? "rgba(16,185,129,0.03)"
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isExpanded)
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = "rgba(255,255,255,0.02)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isExpanded)
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = "transparent";
                          }}>
                          {/* Rank */}
                          <td className="px-4 py-3">
                            <div
                              className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[0.62rem] font-black"
                              style={{
                                background: isTop3
                                  ? `${rankCol}18`
                                  : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isTop3 ? rankCol + "35" : "rgba(255,255,255,0.07)"}`,
                                color: isTop3 ? rankCol : "#475569",
                              }}>
                              {i + 1}
                            </div>
                          </td>

                          {/* Candidate */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[0.7rem] font-black flex-shrink-0"
                                style={{
                                  background: `${c.color}18`,
                                  border: `1px solid ${c.color}25`,
                                  color: c.color,
                                }}
                                aria-hidden="true">
                                {c.avatar}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[0.78rem] font-semibold text-[#e8f0ec] truncate max-w-[160px]">
                                  {c.name}
                                </div>
                                <div className="text-[0.65rem] text-[#7a9585]">
                                  {c.appliedDate}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* AI Score */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-1 rounded-full bg-white/[0.05] overflow-hidden flex-shrink-0">
                                <div
                                  className="h-full"
                                  style={{
                                    width: `${c.resumeScore}%`,
                                    background: getScoreGradient(c.resumeScore),
                                  }}
                                />
                              </div>
                              <span
                                className="text-[0.88rem] font-black"
                                style={{ color: getScoreColor(c.resumeScore) }}>
                                {c.resumeScore || "—"}
                              </span>
                            </div>
                          </td>

                          {/* Match */}
                          <td className="px-4 py-3">
                            <span
                              className="text-[0.82rem] font-black"
                              style={{ color: getScoreColor(c.matchScore) }}>
                              {c.matchScore ? `${c.matchScore}%` : "—"}
                            </span>
                          </td>

                          {/* Skills */}
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {c.skills.slice(0, 2).map((s) => (
                                <span
                                  key={s}
                                  className="text-[0.62rem] px-[6px] py-[2px] rounded font-mono text-[#94a3b8] bg-white/[0.04] border border-white/[0.07] whitespace-nowrap">
                                  {s}
                                </span>
                              ))}
                              {c.skills.length > 2 && (
                                <span className="text-[0.62rem] text-[#7a9585]">
                                  +{c.skills.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Recommendation */}
                          <td className="px-4 py-3">
                            <span
                              className="text-[0.65rem] font-bold px-2 py-[3px] rounded-full inline-flex items-center gap-1 whitespace-nowrap border"
                              style={{
                                background: rec.bg,
                                color: rec.color,
                                borderColor: rec.border,
                              }}>
                              <RecIcon size={10} aria-hidden="true" />{" "}
                              {rec.label}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className="text-[0.65rem] font-bold px-2 py-[3px] rounded-full inline-flex items-center gap-1 whitespace-nowrap"
                              style={{
                                background: `${st.color}15`,
                                color: st.color,
                                border: `1px solid ${st.color}28`,
                              }}>
                              <span
                                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                                style={{ background: st.color }}
                                aria-hidden="true"
                              />
                              {st.label}
                            </span>
                          </td>

                          {/* Actions */}
                          <td
                            className="px-4 py-3"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {actionButtons.map(
                                ({
                                  onClick,
                                  title,
                                  Icon,
                                  color,
                                  bg,
                                  border,
                                  disabled,
                                }) => (
                                  <button
                                    key={title}
                                    type="button"
                                    title={title}
                                    aria-label={title}
                                    onClick={onClick}
                                    disabled={disabled}
                                    className="w-7 h-7 rounded-[7px] flex items-center justify-center transition-all duration-150 hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    style={{
                                      background: bg,
                                      border: `1px solid ${border}`,
                                      color,
                                    }}>
                                    <Icon size={10} aria-hidden="true" />
                                  </button>
                                ),
                              )}
                            </div>
                          </td>
                        </motion.tr>

                        {/* Inline AI insight */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              key={`ins-${c.id}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}>
                              <td
                                colSpan={8}
                                className="px-4 pb-3"
                                style={{ background: "rgba(16,185,129,0.02)" }}>
                                <CandidateInsightRow candidate={c} />
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Candidate Ranking ─────────────────────────────────────────────────────────
type CandidateRankingProps = {
  jobGroups: JobGroup[];
  total: number;
  onStatusChange: (id: string, status: string) => void;
};

export function CandidateRanking({
  jobGroups,
  total,
  onStatusChange,
}: CandidateRankingProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] =
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
      {/* Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onStatusChange={(id, status) => {
              onStatusChange(id, status);
              setSelectedCandidate(null);
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
              <JobGroupTable
                group={group}
                onView={setSelectedCandidate}
                onStatusChange={onStatusChange}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </>
  );
}
