// @/components/hr/calendar/EventCard.tsx
// Avatar dan EventCard — pure presentational, tidak ada data fetching
"use client";

import { motion } from "framer-motion";
import {
  type Interview,
  getCardColor,
  getInitials,
  getAvatarColor,
  fmt12,
  fmtTimeRange,
} from "./types";

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export function Avatar({
  name,
  size = 28,
  src,
}: {
  name: string;
  size?: number;
  src?: string;
}) {
  const color = getAvatarColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `${color}28`,
        color,
        fontSize: size * 0.38,
        border: `1.5px solid ${color}55`,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── EVENT CARD ───────────────────────────────────────────────────────────────
export function EventCard({
  interview,
  heightPx,
  onClick,
}: {
  interview: Interview;
  heightPx: number;
  onClick: () => void;
}) {
  const c = getCardColor(interview.id);
  const compact = heightPx < 64;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="absolute inset-x-[3px] overflow-hidden rounded-[12px] text-left transition-all hover:brightness-110"
      style={{
        height: heightPx - 5,
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      <div className="px-[10px] pt-[8px] pb-[6px] h-full flex flex-col">
        {compact ? (
          <div className="flex items-center gap-2 h-full">
            <Avatar
              name={interview.candidate_name}
              src={interview.interviewer_avatar}
              size={20}
            />
            <span
              className="text-[10px] font-bold truncate"
              style={{ color: c.text }}
            >
              {interview.job_title}
            </span>
            <span
              className="text-[9px] ml-auto flex-shrink-0"
              style={{ color: c.sub }}
            >
              {fmt12(new Date(interview.scheduled_at))}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-[6px]">
              <Avatar
                name={interview.candidate_name}
                src={interview.interviewer_avatar}
                size={26}
              />
              {interview.interviewer_name && (
                <div style={{ marginLeft: -6 }}>
                  <Avatar name={interview.interviewer_name} size={26} />
                </div>
              )}
            </div>
            <div
              className="font-bold text-[12px] leading-[1.35] mb-[4px]"
              style={{ color: c.text }}
            >
              {interview.job_title}
            </div>
            <div className="text-[10px] mt-auto" style={{ color: c.sub }}>
              {fmtTimeRange(interview.scheduled_at, interview.duration_minutes)}
            </div>
          </>
        )}
      </div>
    </motion.button>
  );
}
