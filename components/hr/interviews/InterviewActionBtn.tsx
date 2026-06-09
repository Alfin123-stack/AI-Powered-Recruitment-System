"use client";

import { LucideIcon } from "lucide-react";

interface InterviewActionBtnProps {
  onClick: () => void;
  colorClass: string;
  solidBgClass?: string;
  icon: LucideIcon;
  label: string;
  solid?: boolean;
}

export function InterviewActionBtn({
  onClick,
  colorClass,
  solidBgClass,
  icon: Icon,
  label,
  solid = false,
}: InterviewActionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-[5px] px-[10px] py-[5px] rounded-lg",
        "text-[0.7rem] font-bold cursor-pointer transition-all duration-150 border-0",
        solid
          ? `${solidBgClass ?? "bg-emerald-500"} text-[#07100a] hover:opacity-90`
          : `${colorClass} bg-white/[0.055] hover:bg-white/[0.09] border border-white/[0.10]`,
      ].join(" ")}>
      <Icon size={9} />
      {label}
    </button>
  );
}
