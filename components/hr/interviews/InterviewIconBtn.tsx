"use client";

import { LucideIcon } from "lucide-react";

interface InterviewIconBtnProps {
  onClick: () => void;
  title: string;
  icon: LucideIcon;
  hoverClass?: string;
  danger?: boolean;
  disabled?: boolean;
}

export function InterviewIconBtn({
  onClick,
  title,
  icon: Icon,
  hoverClass = "hover:text-emerald-400 hover:border-emerald-500/35",
  danger = false,
  disabled = false,
}: InterviewIconBtnProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={[
        "w-7 h-7 rounded-[6px] flex items-center justify-center",
        "cursor-pointer transition-all duration-150",
        "bg-white/[0.03] border border-emerald-500/[0.12] text-[#7a9585]",
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
