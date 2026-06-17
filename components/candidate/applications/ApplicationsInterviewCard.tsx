"use client";

// ApplicationsInterviewCard.tsx — Client Component
// CSR: contains LiveCountdown which requires browser timer

import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Video,
} from "lucide-react";

import ApplicationsLiveCountdown from "./ApplicationsLiveCountdown";
import { formatTime, getDayLabel, isToday } from "@/lib/utils";
import { getPlatformInfo } from "@/lib/helpers/candidate/applications";
import { IV_STATUS_MAP } from "@/constants/calendar";
import { Interview } from "@/types/candidate/dashboard";

interface InterviewCardProps {
  iv: Interview;
  index: number;
}

export default function ApplicationsInterviewCard({
  iv,
  index,
}: InterviewCardProps) {
  const st = IV_STATUS_MAP[iv.status] ?? IV_STATUS_MAP.scheduled;
  const upcoming =
    iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date();
  const todayFlag = isToday(iv.scheduled_at) && iv.status === "scheduled";
  const platform = iv.type === "online" ? getPlatformInfo(iv.location) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`bg-[#0a0f0c] border rounded-[18px] overflow-hidden transition-all
        ${
          iv.status === "cancelled"
            ? "border-white/[0.05] opacity-55"
            : todayFlag
              ? "border-amber-500/25 shadow-[0_0_24px_rgba(245,158,11,0.06)]"
              : "border-emerald-500/15 hover:border-emerald-500/28 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        }`}>
      {/* Top accent line */}
      {upcoming && (
        <div
          className={`h-[2px] w-full ${
            todayFlag
              ? "bg-gradient-to-r from-amber-500/60 via-amber-400/40 to-transparent"
              : "bg-gradient-to-r from-emerald-500/40 via-cyan-500/30 to-transparent"
          }`}
        />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 border
              ${
                todayFlag
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                  : upcoming
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                    : "bg-white/[0.04] border-white/[0.07] text-[#7a9585]"
              }`}>
              <Calendar size={16} />
            </div>
            <div>
              <div className="font-bold text-[0.92rem]">{iv.job_title}</div>
              <div className="text-[0.74rem] text-[#7a9585]">
                {iv.company_name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {todayFlag && (
              <span className="px-[8px] py-[2px] rounded-full text-[0.63rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
                Hari ini!
              </span>
            )}
            <span
              className="px-[9px] py-[3px] rounded-full text-[0.67rem] font-bold"
              style={{
                background: st.bg,
                color: st.color,
                border: `1px solid ${st.color}30`,
              }}>
              {st.label}
            </span>
          </div>
        </div>

        {/* Countdown */}
        {upcoming && (
          <div className="flex items-center justify-between mb-3 bg-white/[0.02] rounded-[9px] px-3 py-2 border border-white/[0.04]">
            <ApplicationsLiveCountdown scheduledAt={iv.scheduled_at} />
          </div>
        )}

        {/* Date & time info */}
        <div className="bg-white/[0.025] border border-white/[0.05] rounded-[11px] p-3 mb-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-[6px] text-[0.82rem] font-semibold">
              <Calendar size={13} className="text-emerald-400" />
              {getDayLabel(iv.scheduled_at)}
            </span>
            <span className="flex items-center gap-[6px] text-[0.82rem] font-semibold">
              <Clock size={13} className="text-emerald-400" />
              {formatTime(iv.scheduled_at)} WIB
            </span>
            <span className="flex items-center gap-[6px] text-[0.75rem] text-[#7a9585]">
              {iv.type === "online" ? (
                <Video size={12} />
              ) : (
                <Building2 size={12} />
              )}
              {iv.type === "online" ? "Online" : "Onsite"}
            </span>
          </div>
        </div>

        {/* Location / meeting link */}
        {iv.location && (
          <div className="mb-3">
            {iv.type === "online" ? (
              <div className="space-y-2">
                {platform && (
                  <div className="flex items-center gap-2 px-3 py-[7px] bg-white/[0.02] border border-white/[0.05] rounded-[9px]">
                    <Video size={11} style={{ color: platform.color }} />
                    <span
                      className="text-[0.72rem] font-semibold"
                      style={{ color: platform.color }}>
                      {platform.name}
                    </span>
                  </div>
                )}
                <a
                  href={iv.location}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-between w-full px-4 py-[11px] rounded-[10px] no-underline transition-all font-semibold text-[0.84rem]
                    ${
                      upcoming
                        ? "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                        : "bg-white/[0.025] border border-emerald-500/15 text-emerald-400 hover:border-emerald-500/30"
                    }`}>
                  <span className="flex items-center gap-2">
                    <Video size={14} />
                    {upcoming ? "Buka Link Meeting" : "Link Meeting"}
                  </span>
                  <ExternalLink size={13} />
                </a>
              </div>
            ) : (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(iv.location)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between w-full px-4 py-[10px] bg-white/[0.025] border border-white/[0.05] rounded-[10px] no-underline hover:border-emerald-500/20 transition-all group">
                <div className="flex items-center gap-2 text-[0.78rem] text-[#7a9585] group-hover:text-[#e8f0ec] transition-colors">
                  <MapPin
                    size={13}
                    className="text-emerald-400 flex-shrink-0"
                  />
                  {iv.location}
                </div>
                <ExternalLink
                  size={11}
                  className="text-[#7a9585] group-hover:text-emerald-400 transition-colors"
                />
              </a>
            )}
          </div>
        )}

        {/* HR Notes */}
        {iv.notes && (
          <div className="bg-amber-500/[0.05] border border-amber-500/15 rounded-[9px] px-3 py-[10px] mb-3">
            <div className="text-[0.67rem] font-bold text-amber-400 uppercase tracking-[0.06em] mb-1">
              Catatan dari HR
            </div>
            <div className="text-[0.78rem] text-[#7a9585]">{iv.notes}</div>
          </div>
        )}

        {/* Reminder tip */}
        {upcoming && (
          <div className="flex items-center gap-2 text-[0.7rem] text-emerald-400/50 mt-1">
            <CheckCircle2 size={10} />
            Review job description & persiapkan portfolio sebelum interview
          </div>
        )}
      </div>
    </motion.div>
  );
}
