"use client";

import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ThumbsUp, ThumbsDown, Eye, Brain, ClipboardList } from "lucide-react";
import type { ActionButton, CandidateUI, GroupMetric, JobGroup } from "@/types/hr/dashboard";
import type { CandidateStatus } from "@/types/candidates";
import { getScoreColor, getScoreGradient, statusMap } from "@/lib/helpers/hr/dashboard";
import { RANK_COLORS, TABLE_HEADERS } from "@/constants/hr/dashboard";
import {
  isLocked,
  hasScore,
  showStatusToast,
  getRecommendationDisplay,
  type ConfirmableStatus,
} from "@/lib/helpers/hr/dashboardStatus";
import { DashboardStatusConfirmModal } from "./DashboardStatusConfirmModal";
import { DashboardCandidateInsightRow } from "./DashboardCandidateInsightRow";

export function DashboardJobGroupTable({
  group,
  onView,
  onStatusChange,
  onSendOnboarding,
}: {
  group: JobGroup;
  onView: (c: CandidateUI) => void;
  onStatusChange: (id: string, status: CandidateStatus) => void;
  onSendOnboarding: (c: CandidateUI) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  // Quick-action icon Shortlist/Reject di baris tabel butuh konfirmasi juga —
  // satu state di level tabel (bukan per baris) sudah cukup karena cuma satu
  // dialog konfirmasi yang mungkin terbuka dalam satu waktu.
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    name: string;
    status: ConfirmableStatus;
  } | null>(null);

  const handleConfirmAction = () => {
    if (!pendingAction) return;
    onStatusChange(pendingAction.id, pendingAction.status);
    showStatusToast(pendingAction.status, pendingAction.name);
    setPendingAction(null);
  };

  const handleCancelAction = () => setPendingAction(null);

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
                    const rec = getRecommendationDisplay(c);
                    const RecIcon = rec.Icon;
                    const rankCol = RANK_COLORS[i] ?? "#475569";
                    const isTop3 = i < 3;
                    const isExpanded = expandedInsight === c.id;
                    const locked = isLocked(c.status);

                    // Tombol onboarding hanya tampil kalau offer sudah
                    // accepted — dikombinasikan dengan status === "hired"
                    // karena backend langsung set status ke "hired" saat
                    // accept, offer_status jadi field terpisah yang mungkin
                    // belum ke-mapping dari API.
                    const canSendOnboarding =
                      c.offer_status === "accepted" || c.status === "hired";

                    const actionButtons: (ActionButton & { id: string })[] = [
                      ...(canSendOnboarding
                        ? [
                            {
                              id: "onboarding",
                              onClick: () => onSendOnboarding(c),
                              title: c.onboarding_sent
                                ? "Onboarding email sudah dikirim"
                                : "Kirim Onboarding Email",
                              Icon: ClipboardList,
                              color: "#10b981",
                              bg: c.onboarding_sent
                                ? "rgba(16,185,129,0.04)"
                                : "rgba(16,185,129,0.1)",
                              border: c.onboarding_sent
                                ? "rgba(16,185,129,0.12)"
                                : "rgba(16,185,129,0.25)",
                              disabled: !!c.onboarding_sent,
                            },
                          ]
                        : []),
                      {
                        id: "shortlist",
                        onClick: () =>
                          setPendingAction({
                            id: c.id,
                            name: c.name,
                            status: "shortlisted",
                          }),
                        title: locked
                          ? `${st.label} — keputusan sudah final`
                          : "Shortlist candidate",
                        Icon: ThumbsUp,
                        color: "#10b981",
                        bg: "rgba(16,185,129,0.08)",
                        border: "rgba(16,185,129,0.2)",
                        disabled: locked || c.status === "shortlisted",
                      },
                      {
                        id: "reject",
                        onClick: () =>
                          setPendingAction({
                            id: c.id,
                            name: c.name,
                            status: "rejected",
                          }),
                        title: locked
                          ? `${st.label} — keputusan sudah final`
                          : "Reject candidate",
                        Icon: ThumbsDown,
                        color: "#ef4444",
                        bg: "rgba(239,68,68,0.07)",
                        border: "rgba(239,68,68,0.18)",
                        disabled: locked || c.status === "rejected",
                      },
                      {
                        id: "view",
                        onClick: () => onView(c),
                        title: "View candidate detail",
                        Icon: Eye,
                        color: "#94a3b8",
                        bg: "rgba(255,255,255,0.04)",
                        border: "rgba(255,255,255,0.1)",
                        disabled: false,
                      },
                      {
                        id: "insight",
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
                                    width: `${hasScore(c.resumeScore) ? c.resumeScore : 0}%`,
                                    background: getScoreGradient(c.resumeScore),
                                  }}
                                />
                              </div>
                              <span
                                className="text-[0.88rem] font-black"
                                style={{ color: getScoreColor(c.resumeScore) }}>
                                {hasScore(c.resumeScore) ? c.resumeScore : "—"}
                              </span>
                            </div>
                          </td>

                          {/* Match */}
                          <td className="px-4 py-3">
                            <span
                              className="text-[0.82rem] font-black"
                              style={{ color: getScoreColor(c.matchScore) }}>
                              {hasScore(c.matchScore) ? `${c.matchScore}%` : "—"}
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
                                  id,
                                  onClick,
                                  title,
                                  Icon,
                                  color,
                                  bg,
                                  border,
                                  disabled,
                                }) => (
                                  <button
                                    key={id}
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
                                <DashboardCandidateInsightRow candidate={c} />
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
      {pendingAction && (
        <DashboardStatusConfirmModal
          status={pendingAction.status}
          candidateName={pendingAction.name}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}
    </div>
  );
}
