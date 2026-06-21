// components/auth/register/RoleSelect.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { User, Building2, ChevronDown, CheckCircle2 } from "lucide-react";
import { FieldError } from "@/components/auth/FieldError";

export const ROLES = [
  {
    value: "candidate",
    label: "Candidate",
    sub: "Job seeker",
    icon: <User size={17} />,
    color: "#10b981",
    desc: "CV analysis, job matching, application status tracking",
    features: [
      "Automatic CV analysis + ATS Score",
      "Job matching based on skills",
      "Concrete CV improvement recommendations",
      "Real-time application status tracking",
    ],
  },
  {
    value: "hr",
    label: "HR / Company",
    sub: "Recruiter or company HR team",
    icon: <Building2 size={17} />,
    color: "#06b6d4",
    desc: "Recruitment dashboard, candidate ranking, job management",
    features: [
      "Complete recruitment dashboard",
      "Automatic AI-based candidate ranking",
      "View original CV + candidate skill details",
      "Job posting & candidate status management",
    ],
  },
];

interface RoleSelectProps {
  value: string;
  onChange: (v: string) => void;
  errorMessage?: string;
  onClearError?: () => void;
}

export function RoleSelect({
  value,
  onChange,
  errorMessage,
  onClearError,
}: RoleSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = ROLES.find((r) => r.value === value);
  const hasError = !!errorMessage;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-[6px]">
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full rounded-[11px] border px-[14px] py-3 h-[46px] text-[0.87rem]
            cursor-pointer flex items-center justify-between transition-all duration-200 outline-none
            ${
              hasError
                ? "border-red-500/50 bg-red-500/[0.04] shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
                : open
                  ? "border-emerald-500 bg-emerald-500/[0.05] shadow-[0_0_0_3px_rgba(16,185,129,0.10)]"
                  : "border-emerald-500/15 bg-[#0f1a14] hover:border-emerald-500/35 hover:bg-[#111d16]"
            }`}
        >
          {selected ? (
            <div className="flex items-center gap-[10px]">
              <span style={{ color: selected.color }} className="opacity-80">
                {selected.icon}
              </span>
              <span className="font-semibold text-[#e8f0ec]">
                {selected.label}
              </span>
              <span className="text-[#3a5444] text-[0.75rem] hidden sm:inline">
                — {selected.sub}
              </span>
            </div>
          ) : (
            <span className={hasError ? "text-red-400/60" : "text-[#2e4a3a]"}>
              Select your role...
            </span>
          )}
          <ChevronDown
            size={15}
            className={`flex-shrink-0 transition-transform duration-200 ${
              open
                ? "rotate-180 text-emerald-400"
                : hasError
                  ? "text-red-400/60"
                  : "text-[#4a6b58]"
            }`}
          />
        </button>

        {open && (
          <div
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50
            bg-[#0c1510] border border-emerald-500/20 rounded-[13px] overflow-hidden
            shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(16,185,129,0.06)]"
          >
            {ROLES.map((r, idx) => (
              <div
                key={r.value}
                onClick={() => {
                  onChange(r.value);
                  onClearError?.();
                  setOpen(false);
                }}
                className={`flex items-start gap-[12px] px-4 py-[14px] cursor-pointer transition-all duration-150
                  ${idx < ROLES.length - 1 ? "border-b border-emerald-500/10" : ""}
                  ${value === r.value ? "bg-emerald-500/[0.07]" : "hover:bg-emerald-500/[0.05]"}`}
              >
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 mt-[1px] border"
                  style={{
                    background: `${r.color}12`,
                    borderColor: `${r.color}30`,
                    color: r.color,
                  }}
                >
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[0.87rem] text-[#e8f0ec]">
                      {r.label}
                    </span>
                    {value === r.value && (
                      <span className="text-emerald-400 text-[0.75rem] flex items-center gap-[3px]">
                        <CheckCircle2 size={11} /> Selected
                      </span>
                    )}
                  </div>
                  <p className="text-[0.73rem] text-[#4a6b58] mt-[2px]">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FieldError message={errorMessage} />
    </div>
  );
}
