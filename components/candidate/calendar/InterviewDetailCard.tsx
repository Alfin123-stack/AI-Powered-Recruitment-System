"use client";

import {
  Calendar,
  Clock,
  Video,
  Building2,
  MapPin,
  ExternalLink,
  Timer,
  CheckCircle2,
} from "lucide-react";

import LiveCountdown from "./LiveCountdown";
import { Interview, IV_STATUS_MAP, formatTime, isToday } from "./types";

interface InterviewDetailCardProps {
  iv: Interview;
}

export default function InterviewDetailCard({ iv }: InterviewDetailCardProps) {
  const st = IV_STATUS_MAP[iv.status] ?? IV_STATUS_MAP.scheduled;
  const upcoming =
    iv.status === "scheduled" && new Date(iv.scheduled_at) > new Date();
  const todayFlag = isToday(iv.scheduled_at) && iv.status === "scheduled";

  const getPlatformInfo = (url: string | null) => {
    if (!url) return null;
    if (url.includes("zoom.us")) return { name: "Zoom", color: "#2D8CFF" };
    if (url.includes("meet.google.com"))
      return { name: "Google Meet", color: "#34A853" };
    if (url.includes("teams.microsoft.com"))
      return { name: "MS Teams", color: "#6264A7" };
    return { name: "Meeting Link", color: "#06b6d4" };
  };

  const platform = iv.type === "online" ? getPlatformInfo(iv.location) : null;

  return (
    <div
      className={`bg-[#0a0f0c] border rounded-[16px] overflow-hidden transition-all
        ${
          iv.status === "cancelled"
            ? "border-white/[0.05] opacity-55"
            : todayFlag
              ? "border-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
              : "border-emerald-500/15"
        }`}>
      {upcoming && (
        <div
          className={`h-[2px] w-full ${
            todayFlag
              ? "bg-gradient-to-r from-amber-500/60 via-amber-400/30 to-transparent"
              : "bg-gradient-to-r from-emerald-500/40 via-cyan-500/20 to-transparent"
          }`}
        />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 border
                ${
                  todayFlag
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                    : upcoming
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      : "bg-white/[0.04] border-white/[0.07] text-[#7a9585]"
                }`}>
              <Calendar size={15} />
            </div>
            <div>
              <div className="font-bold text-[0.88rem]">{iv.job_title}</div>
              <div className="text-[0.72rem] text-[#7a9585]">
                {iv.company_name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {todayFlag && (
              <span className="px-[7px] py-[2px] rounded-full text-[0.62rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
                Hari ini!
              </span>
            )}
            <span
              className="px-[8px] py-[3px] rounded-full text-[0.63rem] font-bold"
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
          <div className="flex items-center justify-between mb-3 bg-white/[0.02] rounded-[8px] px-3 py-[7px] border border-white/[0.04]">
            <LiveCountdown scheduledAt={iv.scheduled_at} />
          </div>
        )}

        {/* Time info */}
        <div className="flex items-center gap-4 text-[0.78rem] mb-3 flex-wrap">
          <span className="flex items-center gap-1 font-semibold">
            <Clock size={12} className="text-emerald-400" />
            {formatTime(iv.scheduled_at)} WIB
          </span>
          <span className="flex items-center gap-1 text-[#7a9585]">
            {iv.type === "online" ? (
              <Video size={11} />
            ) : (
              <Building2 size={11} />
            )}
            {iv.type === "online" ? "Online" : "Onsite"}
          </span>
          {platform && (
            <span
              className="text-[0.72rem] font-medium"
              style={{ color: platform.color }}>
              {platform.name}
            </span>
          )}
        </div>

        {/* Action */}
        {iv.location &&
          (iv.type === "online" ? (
            <a
              href={iv.location}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-between w-full px-3 py-[9px] rounded-[9px] no-underline transition-all font-semibold text-[0.8rem]
                ${
                  upcoming
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                    : "bg-white/[0.025] border border-emerald-500/15 text-emerald-400 hover:border-emerald-500/30"
                }`}>
              <span className="flex items-center gap-2">
                <Video size={13} />
                {upcoming ? "Buka Link Meeting" : "Link Meeting"}
              </span>
              <ExternalLink size={12} />
            </a>
          ) : (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(iv.location)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[0.75rem] text-[#7a9585] hover:text-emerald-400 no-underline transition-colors">
              <MapPin size={11} className="text-emerald-400" />
              {iv.location}
            </a>
          ))}

        {/* Notes */}
        {iv.notes && (
          <div className="mt-3 bg-amber-500/[0.04] border border-amber-500/12 rounded-[8px] px-3 py-2">
            <div className="text-[0.63rem] font-bold text-amber-400 uppercase tracking-[0.06em] mb-1">
              Catatan HR
            </div>
            <div className="text-[0.72rem] text-[#7a9585]">{iv.notes}</div>
          </div>
        )}

        {upcoming && (
          <div className="flex items-center gap-1.5 text-[0.68rem] text-emerald-400/50 mt-3">
            <CheckCircle2 size={10} />
            Persiapkan diri: riset perusahaan & review job description
          </div>
        )}
      </div>
    </div>
  );
}
