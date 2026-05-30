// @/components/hr/calendar/InterviewModal.tsx
// Modal detail interview — CSR, interaktif
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Calendar, Clock, Video, Building2,
  Briefcase, User, MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  type Interview,
  STATUS_CFG,
  getInitials,
  fmtTimeRange,
} from "./types";

// Warna default accent
const ACCENT = "#10b981";

export function InterviewModal({
  interview,
  onClose,
}: {
  interview: Interview;
  onClose: () => void;
}) {
  const st = STATUS_CFG[interview.status] ?? STATUS_CFG.scheduled;

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative flex flex-col rounded-[20px] overflow-hidden"
        style={{
          width: 340,
          maxHeight: "85vh",
          background: "#080e0a",
          border: "1px solid rgba(16,185,129,0.18)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="px-5 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center font-extrabold text-[13px]"
              style={{ background: `${ACCENT}18`, color: ACCENT }}
            >
              {getInitials(interview.candidate_name)}
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-[7px] flex items-center justify-center transition-colors hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#4d7060",
              }}
            >
              <X size={12} />
            </button>
          </div>

          <div className="font-bold text-[14px] text-[#e8f0ec] mb-[2px]">
            {interview.candidate_name}
          </div>
          <div className="flex items-center gap-[5px] text-[11px] text-[#5a8070] mb-3">
            <Briefcase size={10} />
            <span className="truncate">{interview.job_title}</span>
          </div>

          <span
            className="inline-flex items-center gap-[4px] px-[7px] py-[3px] rounded-full text-[10px] font-bold"
            style={{
              background: st.bg,
              color: st.color,
              border: `1px solid ${st.border}`,
            }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full"
              style={{ background: st.dot }}
            />
            {st.label}
          </span>
        </div>

        {/* ── Body ── */}
        <div className="cal-scroll flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {/* Detail block */}
          <div
            className="rounded-[11px] p-3 space-y-2"
            style={{
              background: "#0f1612",
              border: "1px solid rgba(16,185,129,0.1)",
            }}
          >
            <div className="flex items-center gap-2 text-[11px] text-[#7a9585]">
              <Calendar size={11} className="text-emerald-400/60" />
              {new Date(interview.scheduled_at).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#7a9585]">
              <Clock size={11} className="text-emerald-400/60" />
              {fmtTimeRange(interview.scheduled_at, interview.duration_minutes)}{" "}
              · {interview.duration_minutes ?? 60} menit
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#7a9585]">
              {interview.type === "online" ? (
                <Video size={11} className="text-cyan-400/60" />
              ) : (
                <Building2 size={11} className="text-amber-400/60" />
              )}
              <span className="truncate">
                {interview.location ||
                  (interview.type === "online"
                    ? "Belum ada link"
                    : "Belum ada lokasi")}
              </span>
            </div>
            {interview.interviewer_name && (
              <div className="flex items-center gap-2 text-[11px] text-[#7a9585]">
                <User size={11} className="text-violet-400/60" />
                {interview.interviewer_name}
              </div>
            )}
          </div>

          {/* Notes */}
          {interview.notes && (
            <div
              className="rounded-[11px] p-3"
              style={{
                background: "#0f1612",
                border: "1px solid rgba(16,185,129,0.1)",
              }}
            >
              <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#4d7060] mb-2">
                Catatan
              </div>
              <p className="text-[11px] text-[#6a9080] leading-relaxed">
                {interview.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            {interview.status === "scheduled" &&
              interview.type === "online" &&
              interview.location && (
                <a
                  href={interview.location}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-[9px] rounded-[10px] font-bold text-[12px]"
                  style={{ background: ACCENT, color: "#000" }}
                >
                  <Video size={13} /> Join Meeting
                </a>
              )}
            <Link href="/dashboard/hr/interviews">
              <button
                className="flex items-center justify-center gap-2 w-full py-[9px] rounded-[10px] font-semibold text-[12px]"
                style={{
                  background: "rgba(16,185,129,0.07)",
                  border: "1px solid rgba(16,185,129,0.18)",
                  color: ACCENT,
                }}
              >
                <MoreHorizontal size={13} /> Kelola Interview
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
