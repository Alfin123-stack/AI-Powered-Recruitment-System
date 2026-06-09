"use client";

import { Video, Building2 } from "lucide-react";

export function InterviewTypeToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: "online" | "onsite") => void;
}) {
  return (
    <div className="flex gap-3">
      {[
        {
          val: "online",
          label: "Online",
          Icon: Video,
          hint: "Zoom, Meet, dll.",
        },
        { val: "onsite", label: "Onsite", Icon: Building2, hint: "Tatap muka" },
      ].map(({ val, label, Icon, hint }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val as "online" | "onsite")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-[11px] border text-[0.82rem] font-medium cursor-pointer transition-all ${
            value === val
              ? "bg-emerald-500/12 border-emerald-500/40 text-emerald-400"
              : "bg-[#080f0b] border-emerald-500/12 text-[#5a8070] hover:border-emerald-500/25 hover:text-[#c5d9cc]"
          }`}>
          <Icon size={16} />
          <span>{label}</span>
          <span className="text-[0.65rem] opacity-60">{hint}</span>
        </button>
      ))}
    </div>
  );
}
