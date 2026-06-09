"use client";

import { LucideIcon } from "lucide-react";

interface InterviewDropItemProps {
  icon: LucideIcon;
  label: string;
  hoverClass: string;
  onClick: () => void;
}

export function InterviewDropItem({
  icon: Icon,
  label,
  hoverClass,
  onClick,
}: InterviewDropItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 px-3 py-[7px]",
        "text-[0.74rem] font-semibold cursor-pointer border-0",
        "transition-all duration-[120ms] rounded-[7px] text-[#7a9585]",
        hoverClass,
      ].join(" ")}>
      <Icon size={11} />
      {label}
    </button>
  );
}
