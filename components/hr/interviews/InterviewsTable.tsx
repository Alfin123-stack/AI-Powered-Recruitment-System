"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Briefcase,
  Check,
  ChevronRight,
  MoreHorizontal,
  Play,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  apiFetch,
  FadeIn,
  getColor,
  getInitials,
} from "@/app/(role)/dashboard/hr/_components/shared";
import {
  Interview,
  statusConfig,
  roundConfig,
  formatTimeRange,
  isToday,
  isTomorrow,
  getDayLabel,
  getDayHeaderLabel,
  groupByDay,
} from "./types";
import {
  ConfirmModal,
  ReminderModal,
  StartMeetingModal,
  RescheduleModal,
} from "./InterviewModals";

// ─────────────────────────────────────────────────────────────────────────────
// MORE DROPDOWN — fixed portal positioning to avoid overflow clip
// ─────────────────────────────────────────────────────────────────────────────
function MoreDropdown({
  interview,
  onMarkDone,
  onCancel,
  onReschedule,
}: {
  interview: Interview;
  onMarkDone: () => void;
  onCancel: () => void;
  onReschedule: () => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !dropRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      <button
        title="open"
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-[8px] bg-emerald-500/[0.06] border border-emerald-500/12 text-[#5a8070] flex items-center justify-center hover:text-[#e8f0ec] hover:border-emerald-500/25 transition-all cursor-pointer">
        <MoreHorizontal size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              top: pos.top,
              right: pos.right,
              zIndex: 300,
            }}
            className="w-[160px] bg-[#0d1810] border border-emerald-500/20 rounded-[10px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-1">
            {interview.status === "scheduled" && (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    onMarkDone();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-[8px] text-[0.78rem] text-[#6a9080] hover:bg-emerald-500/[0.06] hover:text-emerald-400 transition-colors cursor-pointer">
                  <Check size={12} /> Tandai Selesai
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    onReschedule();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-[8px] text-[0.78rem] text-[#6a9080] hover:bg-emerald-500/[0.06] hover:text-cyan-400 transition-colors cursor-pointer">
                  <RefreshCw size={12} /> Reschedule
                </button>
                <div className="h-px bg-emerald-500/10 my-1" />
                <button
                  onClick={() => {
                    setOpen(false);
                    onCancel();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-[8px] text-[0.78rem] text-[#6a9080] hover:bg-red-500/[0.06] hover:text-red-400 transition-colors cursor-pointer">
                  <X size={12} /> Batalkan
                </button>
              </>
            )}
            {(interview.status === "done" ||
              interview.status === "overdue" ||
              interview.status === "cancelled") && (
              <button
                onClick={() => {
                  setOpen(false);
                  onReschedule();
                }}
                className="w-full flex items-center gap-2 px-3 py-[8px] text-[0.78rem] text-[#6a9080] hover:bg-emerald-500/[0.06] hover:text-emerald-400 transition-colors cursor-pointer">
                <RefreshCw size={12} /> Jadwalkan Ulang
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE GROUP HEADER
// ─────────────────────────────────────────────────────────────────────────────
function DateGroupHeader({ dateStr }: { dateStr: string }) {
  const { weekday, day } = getDayHeaderLabel(dateStr);
  const isT = isToday(dateStr);
  const isTo = isTomorrow(dateStr);

  return (
    <div className="flex items-stretch min-h-[1px]">
      <div className="w-[230px] flex-shrink-0 px-4 py-3 flex items-start gap-3 border-b border-emerald-500/[0.08]">
        <div
          className={`flex flex-col items-center justify-center w-11 h-11 rounded-[11px] flex-shrink-0 ${
            isT
              ? "bg-emerald-500 text-black"
              : isTo
                ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                : "bg-emerald-500/[0.07] border border-emerald-500/15 text-[#6a9080]"
          }`}>
          <span className="text-[0.55rem] font-bold tracking-[0.08em] leading-none mb-[1px]">
            {weekday}
          </span>
          <span className="text-[1.1rem] font-extrabold leading-none">
            {day}
          </span>
        </div>
      </div>
      <div className="flex-1 border-b border-emerald-500/[0.08]" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW ROW
// ─────────────────────────────────────────────────────────────────────────────
function InterviewRow({
  interview,
  token,
  onUpdate,
  index,
}: {
  interview: Interview;
  token: string;
  onUpdate: () => void;
  index: number;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<"done" | "cancelled" | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);

  const st = statusConfig[interview.status] ?? statusConfig.scheduled;
  const rc = interview.round ? roundConfig[interview.round] : null;
  const color = getColor(index);

  const updateStatus = async (status: "done" | "cancelled") => {
    setConfirmLoading(true);
    try {
      await apiFetch(`/api/interviews/${interview.id}`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            type={confirm}
            candidateName={interview.candidate_name}
            onConfirm={() => updateStatus(confirm)}
            onCancel={() => setConfirm(null)}
            loading={confirmLoading}
          />
        )}
        {showReschedule && (
          <RescheduleModal
            interview={interview}
            token={token}
            onDone={() => {
              setShowReschedule(false);
              onUpdate();
            }}
            onClose={() => setShowReschedule(false)}
          />
        )}
        {showReminder && (
          <ReminderModal
            interview={interview}
            onClose={() => setShowReminder(false)}
          />
        )}
        {showMeeting && (
          <StartMeetingModal
            interview={interview}
            onClose={() => setShowMeeting(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.04 }}
        className={`flex items-center gap-0 border-b last:border-b-0 transition-all ${
          interview.status === "cancelled"
            ? "border-emerald-500/[0.06] opacity-70"
            : "border-emerald-500/[0.08] hover:bg-emerald-500/[0.025]"
        }`}>
        {/* ── Time Column ── */}
        <div className="w-[230px] flex-shrink-0 px-4 py-4">
          <div
            className={`text-[0.85rem] font-bold mb-[3px] ${
              interview.status === "overdue"
                ? "text-amber-400"
                : "text-[#e8f0ec]"
            }`}>
            {formatTimeRange(
              interview.scheduled_at,
              interview.duration_minutes,
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-[4px] px-[7px] py-[2px] rounded-[5px] text-[0.65rem] font-bold"
              style={{
                background: st.bg,
                color: st.color,
                border: `1px solid ${st.border}`,
              }}>
              <span
                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{ background: st.dot }}
              />
              {st.label}
              {interview.status === "overdue" && (
                <AlertCircle size={9} className="ml-[1px]" />
              )}
            </span>
            {interview.round && rc && (
              <span
                className="inline-flex items-center gap-[4px] px-[7px] py-[2px] rounded-[5px] text-[0.65rem] font-bold"
                style={{
                  background: rc.bg,
                  color: rc.color,
                  border: `1px solid ${rc.border}`,
                }}>
                {interview.round}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-[5px]">
            <span className="text-[0.68rem] text-[#3d5c49]">
              ID: #{interview.id?.slice(-4).padStart(4, "0") ?? "0000"}
            </span>
            <span className="text-[0.68rem] text-[#3d5c49]">GMT+8</span>
            <span className="text-[0.68rem] text-[#3d5c49]">
              · {interview.duration_minutes ?? 60} min
            </span>
          </div>
          {interview.interviewer_name && (
            <div className="flex items-center gap-[5px] mt-[5px]">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold flex-shrink-0"
                style={{
                  background: `${getColor(index + 3)}20`,
                  color: getColor(index + 3),
                }}>
                {getInitials(interview.interviewer_name)}
              </div>
              <span className="text-[0.7rem] text-[#4d7060]">
                {interview.interviewer_name}
              </span>
            </div>
          )}
        </div>

        {/* ── Candidate Column ── */}
        <div className="flex-1 min-w-0 px-4 py-4">
          <div className="flex items-center gap-[7px] mb-[4px]">
            <div
              className="w-7 h-7 rounded-[7px] flex items-center justify-center font-extrabold text-[0.7rem] flex-shrink-0"
              style={{
                background: `${color}18`,
                color,
                border: `1px solid ${color}22`,
              }}>
              {getInitials(interview.candidate_name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-[5px]">
                <span className="font-semibold text-[0.88rem] text-[#e8f0ec] truncate">
                  {interview.candidate_name}
                </span>
                <span className="text-cyan-400 text-[0.75rem]">♂</span>
                {isToday(interview.scheduled_at) &&
                  interview.status === "scheduled" && (
                    <span className="inline-flex items-center gap-[3px] px-[6px] py-[1px] rounded-full text-[0.6rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                      ⚡ Today
                    </span>
                  )}
              </div>
            </div>
          </div>
          <div className="text-[0.72rem] text-[#4d7060] mb-[2px]">
            Candidate ID:{" "}
            <span className="text-emerald-500/70 font-semibold">
              #{interview.candidate_id?.slice(-4).padStart(4, "0") ?? "0000"}
            </span>
          </div>
          <button
            onClick={() =>
              router.push(
                `/dashboard/hr/candidates?job=${encodeURIComponent(interview.job_title)}`,
              )
            }
            className="flex items-center gap-[4px] text-[0.71rem] text-[#4d7060] hover:text-emerald-400 transition-colors group/job mt-[1px]">
            <Briefcase size={10} className="flex-shrink-0" />
            <span className="truncate">Applied Job: {interview.job_title}</span>
            <ChevronRight
              size={9}
              className="opacity-0 group-hover/job:opacity-100 transition-opacity flex-shrink-0"
            />
          </button>
        </div>

        {/* ── Actions Column ── */}
        <div className="flex items-center gap-2 px-4 py-4 flex-shrink-0">
          {interview.status === "done" && interview.recording_duration && (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-[6px] px-3 py-[7px] rounded-[8px] bg-teal-500/10 border border-teal-500/25 text-teal-400 text-[0.75rem] font-semibold hover:bg-teal-500/18 transition-all cursor-pointer">
                <Play size={11} fill="currentColor" /> View Recording
              </button>
              <span className="text-[0.7rem] text-[#4d7060]">
                {interview.recording_duration}
              </span>
              <button
                title="close"
                className="w-7 h-7 rounded-[7px] bg-red-500/[0.07] border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/12 transition-all cursor-pointer">
                <X size={12} />
              </button>
              <button className="flex items-center gap-[6px] px-3 py-[7px] rounded-[8px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.75rem] font-bold transition-all cursor-pointer">
                <Send size={10} /> Send Offer
              </button>
            </div>
          )}

          {interview.status === "scheduled" && (
            <button
              onClick={() => setShowMeeting(true)}
              className="flex items-center gap-[6px] px-3 py-[7px] rounded-[8px] bg-emerald-500 hover:bg-emerald-400 text-black text-[0.75rem] font-bold transition-all cursor-pointer">
              Start Meeting
            </button>
          )}

          {interview.status === "overdue" && (
            <button
              onClick={() => setShowReschedule(true)}
              className="flex items-center gap-[6px] px-3 py-[7px] rounded-[8px] bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[0.75rem] font-semibold hover:bg-amber-500/15 transition-all cursor-pointer">
              <RefreshCw size={11} /> Reschedule
            </button>
          )}

          {interview.status === "cancelled" && (
            <button
              onClick={() => setShowReschedule(true)}
              className="flex items-center gap-[6px] px-3 py-[7px] rounded-[8px] bg-cyan-500/[0.07] border border-cyan-500/20 text-cyan-400 text-[0.75rem] font-semibold hover:bg-cyan-500/12 transition-all cursor-pointer">
              <RefreshCw size={11} /> Reschedule
            </button>
          )}

          <button
          title="reminder"
            onClick={() => setShowReminder(true)}
            className="w-8 h-8 rounded-[8px] bg-emerald-500/[0.06] border border-emerald-500/12 text-[#5a8070] flex items-center justify-center hover:text-amber-400 hover:border-amber-500/30 transition-all cursor-pointer">
            <Bell size={13} />
          </button>

          <MoreDropdown
            interview={interview}
            onMarkDone={() => setConfirm("done")}
            onCancel={() => setConfirm("cancelled")}
            onReschedule={() => setShowReschedule(true)}
          />
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEWS TABLE — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function InterviewsTable({
  interviews,
  token,
  onUpdate,
  filter,
}: {
  interviews: Interview[];
  token: string;
  onUpdate: () => void;
  filter: string;
}) {
  const grouped = groupByDay(interviews);

  if (interviews.length === 0) {
    return (
      <div className="bg-[#0d1810] border border-emerald-500/12 rounded-[16px]">
        {/* Column headers */}
        <div className="flex items-center gap-0 bg-emerald-500/[0.03] border-b border-emerald-500/10 rounded-t-[16px]">
          <div className="w-[230px] flex-shrink-0 px-4 py-[10px]">
            <span className="text-[0.67rem] font-bold tracking-[0.1em] uppercase text-[#4d7060]">
              Schedule
            </span>
          </div>
          <div className="flex-1 px-4 py-[10px]">
            <span className="text-[0.67rem] font-bold tracking-[0.1em] uppercase text-[#4d7060]">
              Candidate
            </span>
          </div>
          <div className="w-[300px] flex-shrink-0 px-4 py-[10px] text-right">
            <span className="text-[0.67rem] font-bold tracking-[0.1em] uppercase text-[#4d7060]">
              Actions
            </span>
          </div>
        </div>
        <div className="text-center py-20 text-[#5a8070]">
          <div className="text-[3rem] mb-3 opacity-20">📅</div>
          <div className="font-bold text-[1rem] text-[#e8f0ec] mb-2">
            {filter === "all"
              ? "Belum ada jadwal interview"
              : `Tidak ada interview ${
                  filter === "scheduled"
                    ? "terjadwal"
                    : filter === "done"
                      ? "selesai"
                      : filter === "overdue"
                        ? "overdue"
                        : "dibatalkan"
                }`}
          </div>
          {filter === "all" && (
            <p className="text-[0.82rem]">
              Klik tombol di atas untuk menjadwalkan.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1810] border border-emerald-500/12 rounded-[16px]">
      {/* Column headers */}
      <div className="flex items-center gap-0 bg-emerald-500/[0.03] border-b border-emerald-500/10 rounded-t-[16px]">
        <div className="w-[230px] flex-shrink-0 px-4 py-[10px]">
          <span className="text-[0.67rem] font-bold tracking-[0.1em] uppercase text-[#4d7060]">
            Schedule
          </span>
        </div>
        <div className="flex-1 px-4 py-[10px]">
          <span className="text-[0.67rem] font-bold tracking-[0.1em] uppercase text-[#4d7060]">
            Candidate
          </span>
        </div>
        <div className="w-[300px] flex-shrink-0 px-4 py-[10px] text-right">
          <span className="text-[0.67rem] font-bold tracking-[0.1em] uppercase text-[#4d7060]">
            Actions
          </span>
        </div>
      </div>

      {/* Grouped rows */}
      {Object.entries(grouped).map(([dateLabel, { dateStr, items }], gi) => (
        <FadeIn key={dateLabel} delay={gi * 0.04}>
          <DateGroupHeader dateStr={dateStr} />
          <AnimatePresence>
            {items.map((iv, i) => (
              <InterviewRow
                key={iv.id}
                interview={iv}
                token={token}
                onUpdate={onUpdate}
                index={i}
              />
            ))}
          </AnimatePresence>
        </FadeIn>
      ))}
    </div>
  );
}
