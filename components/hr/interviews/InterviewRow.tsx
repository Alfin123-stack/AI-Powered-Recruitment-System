"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  Play,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  apiFetch,
  getInitials,
} from "@/app/(role)/dashboard/hr/_components/shared";
import {
  Interview,
  InterviewConfirmType,
  InterviewStatusKey,
  roundConfig,
} from "@/types/hr/interviews";
import {
  formatTimeRange,
  interviewIsTimePast,
  isToday,
} from "@/lib/helpers/hr/interviews";

import { InterviewActionBtn } from "./InterviewActionBtn";
import { InterviewIconBtn } from "./InterviewIconBtn";
import { InterviewMoreDropdown } from "./InterviewMoreDropdown";
import {
  INTERVIEW_STATUS_STYLE,
  INTERVIEW_ACCENT_CLASSES,
} from "../../../constants/hr/Interviews";
import { InterviewConfirmModal } from "./InterviewConfirmModal";
import { InterviewRescheduleModal } from "./InterviewRescheduleModal";
import { InterviewStartMeetingModal } from "./InterviewStartMeetingModal";

interface InterviewRowProps {
  interview: Interview;
  token: string;
  onUpdate: () => void;
  index: number;
}

export function InterviewRow({
  interview,
  token,
  onUpdate,
  index,
}: InterviewRowProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<InterviewConfirmType | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);

  const timePast = interviewIsTimePast(interview);
  const displayStatusKey: InterviewStatusKey =
    interview.status === "scheduled" && timePast
      ? "scheduled_late"
      : (interview.status as InterviewStatusKey);
  const st =
    INTERVIEW_STATUS_STYLE[displayStatusKey] ??
    INTERVIEW_STATUS_STYLE.scheduled;
  const rc = interview.round ? roundConfig[interview.round] : null;
  const accent =
    INTERVIEW_ACCENT_CLASSES[index % INTERVIEW_ACCENT_CLASSES.length];
  const isCancelled = interview.status === "cancelled";

  const updateStatus = async (status: InterviewConfirmType) => {
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
          <InterviewConfirmModal
            type={confirm}
            candidateName={interview.candidate_name}
            onConfirm={() => updateStatus(confirm)}
            onCancel={() => setConfirm(null)}
            loading={confirmLoading}
          />
        )}
        {showReschedule && (
          <InterviewRescheduleModal
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
          <InterviewStartMeetingModal
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

          <div className="text-[0.67rem] text-[rgba(122,149,133,0.55)] mb-[3px]">
            Candidate ID:{" "}
            <span className={`font-bold ${accent.id}`}>
              #{interview.candidate_id?.slice(-4).padStart(4, "0") ?? "0000"}
            </span>
          </div>

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
              <InterviewActionBtn
                icon={Play}
                label="View Recording"
                colorClass="text-violet-400"
                onClick={() => {}}
              />
              <span className="text-[0.65rem] text-[rgba(122,149,133,0.55)]">
                {interview.recording_duration}
              </span>
              <InterviewIconBtn
                icon={X}
                title="dismiss"
                danger
                onClick={() => {}}
              />
              <InterviewActionBtn
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
            <InterviewActionBtn
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
              <InterviewActionBtn
                icon={Check}
                label="Tandai Selesai"
                colorClass="text-emerald-400"
                onClick={() => setConfirm("done")}
              />
              <InterviewActionBtn
                icon={RefreshCw}
                label="Jadwal Ulang"
                colorClass="text-orange-400"
                onClick={() => setShowReschedule(true)}
              />
            </>
          )}

          {interview.status === "overdue" && (
            <InterviewActionBtn
              icon={RefreshCw}
              label="Reschedule"
              colorClass="text-amber-400"
              onClick={() => setShowReschedule(true)}
            />
          )}

          {interview.status === "cancelled" && (
            <InterviewActionBtn
              icon={RefreshCw}
              label="Reschedule"
              colorClass="text-cyan-400"
              onClick={() => setShowReschedule(true)}
            />
          )}

          <InterviewMoreDropdown
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
