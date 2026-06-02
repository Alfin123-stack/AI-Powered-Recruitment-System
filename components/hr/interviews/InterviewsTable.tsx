"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  MoreHorizontal,
  Play,
  RefreshCw,
  Send,
  X,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  apiFetch,
  FadeIn,
  getInitials,
} from "@/app/(role)/dashboard/hr/_components/shared";
import {
  Interview,
  roundConfig,
  formatTimeRange,
  isToday,
  isTomorrow,
  getDayHeaderLabel,
  groupByDay,
} from "./types";
import {
  ConfirmModal,
  RescheduleModal,
  StartMeetingModal,
} from "./InterviewModals";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type ConfirmType = "done" | "cancelled";
type FilterType = "scheduled" | "done" | "overdue" | "cancelled" | string;

interface StatusStyle {
  bg: string;
  color: string;
  border: string;
  dot: string;
  label: string;
}

type StatusKey =
  | "scheduled"
  | "scheduled_late"
  | "done"
  | "overdue"
  | "cancelled";

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<StatusKey, StatusStyle> = {
  scheduled: {
    bg: "bg-emerald-500/[0.08]",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    label: "Terjadwal",
  },
  scheduled_late: {
    bg: "bg-orange-500/[0.08]",
    color: "text-orange-400",
    border: "border-orange-500/[0.22]",
    dot: "bg-orange-400",
    label: "Lewat Waktu",
  },
  done: {
    bg: "bg-violet-500/[0.08]",
    color: "text-violet-400",
    border: "border-violet-500/[0.22]",
    dot: "bg-violet-400",
    label: "Selesai",
  },
  overdue: {
    bg: "bg-amber-500/[0.07]",
    color: "text-amber-400",
    border: "border-amber-500/[0.22]",
    dot: "bg-amber-400",
    label: "Overdue",
  },
  cancelled: {
    bg: "bg-rose-500/[0.07]",
    color: "text-rose-400",
    border: "border-rose-500/[0.18]",
    dot: "bg-rose-400",
    label: "Dibatalkan",
  },
};

// Tailwind accent classes (bg + text + border) per palette index
const ACCENT_CLASSES = [
  {
    bg: "bg-emerald-500/[0.18]",
    text: "text-emerald-400",
    id: "text-emerald-400/60",
  },
  { bg: "bg-cyan-500/[0.18]", text: "text-cyan-400", id: "text-cyan-400/60" },
  {
    bg: "bg-violet-500/[0.18]",
    text: "text-violet-400",
    id: "text-violet-400/60",
  },
  {
    bg: "bg-amber-500/[0.18]",
    text: "text-amber-400",
    id: "text-amber-400/60",
  },
  { bg: "bg-rose-500/[0.18]", text: "text-rose-400", id: "text-rose-400/60" },
  {
    bg: "bg-orange-500/[0.18]",
    text: "text-orange-400",
    id: "text-orange-400/60",
  },
  { bg: "bg-teal-400/[0.18]", text: "text-teal-300", id: "text-teal-300/60" },
  {
    bg: "bg-purple-400/[0.18]",
    text: "text-purple-400",
    id: "text-purple-400/60",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────────────────────
function isTimePast(interview: Interview): boolean {
  if (interview.status !== "scheduled") return false;
  try {
    const end = new Date(interview.scheduled_at);
    end.setMinutes(end.getMinutes() + (interview.duration_minutes ?? 60));
    return end < new Date();
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION BUTTON
// ─────────────────────────────────────────────────────────────────────────────
interface ActionBtnProps {
  onClick: () => void;
  colorClass: string;
  solidBgClass?: string;
  icon: LucideIcon;
  label: string;
  solid?: boolean;
}

function ActionBtn({
  onClick,
  colorClass,
  solidBgClass,
  icon: Icon,
  label,
  solid = false,
}: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-[5px] px-[10px] py-[5px] rounded-lg",
        "text-[0.7rem] font-bold cursor-pointer transition-all duration-150",
        "border-0",
        solid
          ? `${solidBgClass ?? "bg-emerald-500"} text-[#07100a] hover:opacity-90`
          : `${colorClass} bg-white/[0.055] hover:bg-white/[0.09] border border-white/[0.10]`,
      ].join(" ")}>
      <Icon size={9} />
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ICON BUTTON
// ─────────────────────────────────────────────────────────────────────────────
interface IconBtnProps {
  onClick: () => void;
  title: string;
  icon: LucideIcon;
  hoverClass?: string;
  danger?: boolean;
  disabled?: boolean;
}

function IconBtn({
  onClick,
  title,
  icon: Icon,
  hoverClass = "hover:text-emerald-400 hover:border-emerald-500/35",
  danger = false,
  disabled = false,
}: IconBtnProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={[
        "w-7 h-7 rounded-[6px] flex items-center justify-center",
        "cursor-pointer transition-all duration-150",
        "bg-white/[0.03] border border-emerald-500/[0.12]",
        "text-[#7a9585]",
        disabled
          ? "opacity-30 cursor-not-allowed"
          : danger
            ? "hover:text-rose-400 hover:border-rose-500/30"
            : hoverClass,
      ].join(" ")}>
      <Icon size={11} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DROP ITEM
// ─────────────────────────────────────────────────────────────────────────────
interface DropItemProps {
  icon: LucideIcon;
  label: string;
  hoverClass: string;
  onClick: () => void;
}

function DropItem({ icon: Icon, label, hoverClass, onClick }: DropItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 px-3 py-[7px]",
        "text-[0.74rem] font-semibold cursor-pointer border-0",
        "transition-all duration-[120ms] rounded-[7px]",
        "text-[#7a9585]",
        hoverClass,
      ].join(" ")}>
      <Icon size={11} />
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MORE DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────
interface MoreDropdownProps {
  interview: Interview;
  onMarkDone: () => void;
  onCancel: () => void;
  onReschedule: () => void;
}

function MoreDropdown({
  interview,
  onMarkDone,
  onCancel,
  onReschedule,
}: MoreDropdownProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + window.scrollY + 6,
        right: window.innerWidth - r.right,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !dropRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        title="more options"
        onClick={() => setOpen((v) => !v)}
        className="w-7 h-7 rounded-[6px] flex items-center justify-center cursor-pointer transition-all duration-150 bg-white/[0.03] border border-emerald-500/[0.12] text-[#7a9585] hover:border-emerald-500/35 hover:text-[#e8f0ec]">
        <MoreHorizontal size={13} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{ position: "fixed", top: pos.top, right: pos.right }}
            className="z-[300] bg-[#0f1612] border border-white/[0.08] rounded-[11px] shadow-[0_16px_48px_rgba(0,0,0,0.55)] w-[168px] py-1">
            {interview.status === "scheduled" && (
              <>
                <DropItem
                  icon={Check}
                  label="Tandai Selesai"
                  hoverClass="hover:bg-emerald-500/10 hover:text-emerald-400"
                  onClick={() => {
                    setOpen(false);
                    onMarkDone();
                  }}
                />
                <DropItem
                  icon={RefreshCw}
                  label="Reschedule"
                  hoverClass="hover:bg-cyan-500/10 hover:text-cyan-400"
                  onClick={() => {
                    setOpen(false);
                    onReschedule();
                  }}
                />
                <div className="h-px bg-white/[0.06] my-[3px]" />
                <DropItem
                  icon={X}
                  label="Batalkan"
                  hoverClass="hover:bg-rose-500/10 hover:text-rose-400"
                  onClick={() => {
                    setOpen(false);
                    onCancel();
                  }}
                />
              </>
            )}
            {(interview.status === "done" ||
              interview.status === "overdue" ||
              interview.status === "cancelled") && (
              <DropItem
                icon={RefreshCw}
                label="Jadwalkan Ulang"
                hoverClass="hover:bg-emerald-500/10 hover:text-emerald-400"
                onClick={() => {
                  setOpen(false);
                  onReschedule();
                }}
              />
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
      <div className="w-[220px] shrink-0 p-4 flex items-start gap-[10px] border-b border-white/[0.05]">
        {/* Date box */}
        <div
          className={[
            "w-11 h-11 rounded-[12px] shrink-0 flex flex-col items-center justify-center",
            isT
              ? "bg-emerald-500 text-[#07100a]"
              : isTo
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                : "bg-white/[0.03] text-[#7a9585] border border-white/[0.07]",
          ].join(" ")}>
          <span className="text-[0.5rem] font-bold tracking-[0.08em] leading-none mb-0.5">
            {weekday}
          </span>
          <span className="text-[1.05rem] font-extrabold leading-none">
            {day}
          </span>
        </div>

        {isT && (
          <span className="self-center text-[0.58rem] font-bold px-2 py-[3px] rounded-full bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/20">
            Today
          </span>
        )}
        {isTo && (
          <span className="self-center text-[0.58rem] font-bold px-2 py-[3px] rounded-full bg-cyan-500/[0.08] text-cyan-400 border border-cyan-500/20">
            Tomorrow
          </span>
        )}
      </div>
      <div className="flex-1 border-b border-white/[0.05]" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW ROW
// ─────────────────────────────────────────────────────────────────────────────
interface InterviewRowProps {
  interview: Interview;
  token: string;
  onUpdate: () => void;
  index: number;
}

function InterviewRow({
  interview,
  token,
  onUpdate,
  index,
}: InterviewRowProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<ConfirmType | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);

  const timePast = isTimePast(interview);
  const displayStatusKey: StatusKey =
    interview.status === "scheduled" && timePast
      ? "scheduled_late"
      : (interview.status as StatusKey);
  const st = STATUS_STYLE[displayStatusKey] ?? STATUS_STYLE.scheduled;
  const rc = interview.round ? roundConfig[interview.round] : null;

  const accent = ACCENT_CLASSES[index % ACCENT_CLASSES.length];
  const isCancelled = interview.status === "cancelled";

  const updateStatus = async (status: ConfirmType) => {
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
        {showMeeting && (
          <StartMeetingModal
            interview={interview}
            onClose={() => setShowMeeting(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.25,
          delay: index * 0.04,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={[
          "flex items-center border-b border-white/[0.05] transition-colors duration-150",
          isCancelled ? "opacity-55" : "",
          !isCancelled ? "hover:bg-white/[0.02]" : "",
        ].join(" ")}>
        {/* ── Time / Status Column ── */}
        <div className="w-[220px] shrink-0 p-4">
          {/* Time */}
          <div
            className={[
              "text-[0.85rem] font-bold mb-[6px]",
              interview.status === "overdue" || timePast
                ? "text-amber-400"
                : "text-[#e8f0ec]",
            ].join(" ")}>
            {formatTimeRange(
              interview.scheduled_at,
              interview.duration_minutes,
            )}
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-[5px] flex-wrap mb-[6px]">
            <span
              className={[
                "inline-flex items-center gap-[5px] px-2 py-[3px] rounded-[5px]",
                "text-[0.63rem] font-bold border",
                st.bg,
                st.color,
                st.border,
              ].join(" ")}>
              <span
                className={`w-[5px] h-[5px] rounded-full shrink-0 ${st.dot}`}
              />
              {st.label}
              {interview.status === "overdue" && <AlertCircle size={9} />}
              {displayStatusKey === "scheduled_late" && <Clock size={9} />}
            </span>

            {interview.round && rc && (
              <span className="inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[5px] text-[0.63rem] font-bold bg-violet-500/[0.08] text-violet-400 border border-violet-500/20">
                {interview.round}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-[5px]">
            <span className="text-[0.64rem] text-[rgba(122,149,133,0.55)]">
              #{interview.id?.slice(-4).padStart(4, "0") ?? "0000"}
            </span>
            <span className="text-[rgba(122,149,133,0.55)] text-[0.45rem]">
              ·
            </span>
            <span className="text-[0.64rem] text-[rgba(122,149,133,0.55)]">
              {interview.duration_minutes ?? 60} min
            </span>
            <span className="text-[rgba(122,149,133,0.55)] text-[0.45rem]">
              ·
            </span>
            <span className="text-[0.64rem] text-[rgba(122,149,133,0.55)]">
              GMT+8
            </span>
          </div>

          {/* Interviewer */}
          {interview.interviewer_name && (
            <div className="flex items-center gap-[5px] mt-[6px]">
              <div className="w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center text-[0.42rem] font-extrabold bg-violet-500/[0.16] text-violet-400 border border-violet-500/[0.25]">
                {getInitials(interview.interviewer_name)}
              </div>
              <span className="text-[0.67rem] text-[#7a9585]">
                {interview.interviewer_name}
              </span>
            </div>
          )}
        </div>

        {/* ── Candidate Column ── */}
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-center gap-2 mb-[5px]">
            {/* Avatar */}
            <div
              className={[
                "w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center",
                "text-[0.68rem] font-extrabold border border-white/[0.07]",
                accent.bg,
                accent.text,
              ].join(" ")}>
              {getInitials(interview.candidate_name)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-[6px] flex-wrap">
                <span className="font-bold text-[0.86rem] text-[#e8f0ec]">
                  {interview.candidate_name}
                </span>

                {isToday(interview.scheduled_at) &&
                  interview.status === "scheduled" &&
                  !timePast && (
                    <span className="inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full text-[0.57rem] font-bold bg-amber-500/[0.08] text-amber-400 border border-amber-500/20 animate-pulse">
                      ⚡ Today
                    </span>
                  )}

                {timePast && (
                  <span className="inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full text-[0.57rem] font-bold bg-orange-500/[0.08] text-orange-400 border border-orange-500/[0.22]">
                    <Clock size={8} /> Lewat Waktu
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Candidate ID */}
          <div className="text-[0.67rem] text-[rgba(122,149,133,0.55)] mb-[3px]">
            Candidate ID:{" "}
            <span className={`font-bold ${accent.id}`}>
              #{interview.candidate_id?.slice(-4).padStart(4, "0") ?? "0000"}
            </span>
          </div>

          {/* Job link */}
          <button
            onClick={() =>
              router.push(
                `/dashboard/hr/candidates?job=${encodeURIComponent(interview.job_title)}`,
              )
            }
            className="flex items-center gap-1 text-[0.67rem] text-[rgba(122,149,133,0.55)] bg-transparent border-0 p-0 cursor-pointer transition-colors duration-150 hover:text-emerald-400">
            <Briefcase size={10} className="shrink-0" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {interview.job_title}
            </span>
            <ChevronRight size={9} className="shrink-0 opacity-60" />
          </button>
        </div>

        {/* ── Actions Column ── */}
        <div className="flex items-center gap-[6px] p-4 shrink-0">
          {interview.status === "done" && interview.recording_duration && (
            <>
              <ActionBtn
                icon={Play}
                label="View Recording"
                colorClass="text-violet-400"
                onClick={() => {}}
              />
              <span className="text-[0.65rem] text-[rgba(122,149,133,0.55)]">
                {interview.recording_duration}
              </span>
              <IconBtn icon={X} title="dismiss" danger onClick={() => {}} />
              <ActionBtn
                icon={Send}
                label="Send Offer"
                colorClass="text-[#07100a]"
                solidBgClass="bg-emerald-500"
                solid
                onClick={() => {}}
              />
            </>
          )}

          {interview.status === "scheduled" && !timePast && (
            <ActionBtn
              icon={Play}
              label="Start Meeting"
              colorClass="text-[#07100a]"
              solidBgClass="bg-emerald-500"
              solid
              onClick={() => setShowMeeting(true)}
            />
          )}

          {interview.status === "scheduled" && timePast && (
            <>
              <ActionBtn
                icon={Check}
                label="Tandai Selesai"
                colorClass="text-emerald-400"
                onClick={() => setConfirm("done")}
              />
              <ActionBtn
                icon={RefreshCw}
                label="Jadwal Ulang"
                colorClass="text-orange-400"
                onClick={() => setShowReschedule(true)}
              />
            </>
          )}

          {interview.status === "overdue" && (
            <ActionBtn
              icon={RefreshCw}
              label="Reschedule"
              colorClass="text-amber-400"
              onClick={() => setShowReschedule(true)}
            />
          )}

          {interview.status === "cancelled" && (
            <ActionBtn
              icon={RefreshCw}
              label="Reschedule"
              colorClass="text-cyan-400"
              onClick={() => setShowReschedule(true)}
            />
          )}

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
// TABLE HEADER
// ─────────────────────────────────────────────────────────────────────────────
function TableHeader() {
  const cols = [
    { label: "Schedule", className: "w-[220px] shrink-0 text-left" },
    { label: "Candidate", className: "flex-1 text-left" },
    { label: "Actions", className: "w-[320px] shrink-0 text-right" },
  ];

  return (
    <div className="flex items-center bg-white/[0.015] border-b border-white/[0.06] rounded-t-[18px]">
      {cols.map((col) => (
        <div key={col.label} className={`${col.className} px-4 py-[9px]`}>
          <span className="text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[#5a8070]">
            {col.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState({ filter }: { filter: FilterType }) {
  const labelMap: Record<string, string> = {
    scheduled: "terjadwal",
    done: "selesai",
    overdue: "overdue",
    cancelled: "dibatalkan",
  };
  const label = labelMap[filter] ?? null;

  return (
    <div className="flex flex-col items-center justify-center py-[80px] gap-3">
      <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[1.6rem] bg-white/[0.03] border border-white/[0.07]">
        📅
      </div>
      <div className="font-bold text-[0.93rem] text-[#e8f0ec]">
        {label ? `Tidak ada interview ${label}` : "Belum ada jadwal interview"}
      </div>
      {!label && (
        <p className="text-[0.76rem] text-[#7a9585] m-0">
          Klik tombol di atas untuk menjadwalkan.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEWS TABLE — main export
// ─────────────────────────────────────────────────────────────────────────────
interface InterviewsTableProps {
  interviews: Interview[];
  token: string;
  onUpdate: () => void;
  filter: FilterType;
}

export default function InterviewsTable({
  interviews,
  token,
  onUpdate,
  filter,
}: InterviewsTableProps) {
  const grouped = groupByDay(interviews);

  return (
    <div className="rounded-[18px] overflow-hidden bg-[#0f1612] border border-emerald-500/[0.15]">
      {/* Top accent strip */}
      <div className="h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400/50 to-transparent" />

      <TableHeader />

      {interviews.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        Object.entries(grouped).map(([dateLabel, { dateStr, items }], gi) => (
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
        ))
      )}
    </div>
  );
}
