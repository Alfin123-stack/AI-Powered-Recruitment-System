"use client";

import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Video,
  Building2,
  Check,
  X,
  Link2,
  User,
  ExternalLink,
} from "lucide-react";
import { Interview } from "@/types/hr/interviews";
import { formatTimeRange } from "@/lib/helpers/hr/interviews";

export function InterviewStartMeetingModal({
  interview,
  onClose,
}: {
  interview: Interview;
  onClose: () => void;
}) {
  const isOnline = interview.type === "online";

  const handleJoin = () => {
    if (isOnline && interview.location) {
      window.open(interview.location, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-[#0a100c] border border-emerald-500/20 rounded-[18px] w-full max-w-[380px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[9px] bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                {isOnline ? <Video size={14} /> : <Building2 size={14} />}
              </div>
              <div>
                <div className="text-[0.85rem] font-bold text-[#e8f0ec]">
                  {isOnline ? "Join Meeting" : "Mulai Interview"}
                </div>
                <div className="text-[0.7rem] text-[#5a8070]">
                  {interview.candidate_name}
                </div>
              </div>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="w-7 h-7 rounded-[7px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#4d7060] hover:text-[#e8f0ec] transition-all cursor-pointer">
              <X size={12} />
            </button>
          </div>

          <div className="bg-emerald-500/[0.04] border border-emerald-500/12 rounded-[11px] p-3 mb-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[0.78rem] text-[#6a9080]">
              <Clock size={12} className="text-emerald-500/50 flex-shrink-0" />
              {formatTimeRange(
                interview.scheduled_at,
                interview.duration_minutes,
              )}{" "}
              · {interview.duration_minutes ?? 60} min
            </div>
            <div className="flex items-center gap-2 text-[0.78rem] text-[#6a9080]">
              {isOnline ? (
                <Link2
                  size={12}
                  className="text-emerald-500/50 flex-shrink-0"
                />
              ) : (
                <MapPin
                  size={12}
                  className="text-emerald-500/50 flex-shrink-0"
                />
              )}
              <span className="truncate">
                {interview.location ||
                  (isOnline ? "Tidak ada link meeting" : "Tidak ada lokasi")}
              </span>
            </div>
            {interview.interviewer_name && (
              <div className="flex items-center gap-2 text-[0.78rem] text-[#6a9080]">
                <User size={12} className="text-emerald-500/50 flex-shrink-0" />
                {interview.interviewer_name}
              </div>
            )}
          </div>

          {interview.notes && (
            <div className="bg-[#080f0b] border border-emerald-500/10 rounded-[9px] px-3 py-2 mb-4">
              <div className="text-[0.65rem] font-bold text-[#3d5c49] uppercase tracking-[0.08em] mb-1">
                Catatan
              </div>
              <p className="text-[0.75rem] text-[#5a8070] leading-relaxed">
                {interview.notes}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-[9px] rounded-[10px] border border-emerald-500/15 text-[#5a8070] text-[0.82rem] font-medium hover:text-[#e8f0ec] hover:border-emerald-500/30 transition-all cursor-pointer">
              Tutup
            </button>
            <button
              onClick={handleJoin}
              disabled={isOnline && !interview.location}
              className="flex-1 py-[9px] rounded-[10px] bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-[0.82rem] font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
              {isOnline ? (
                <>
                  <ExternalLink size={13} /> Join Meeting
                </>
              ) : (
                <>
                  <Check size={13} /> Mulai
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
