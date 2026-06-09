"use client";

const COLS = [
  { label: "Schedule", className: "w-[220px] shrink-0 text-left" },
  { label: "Candidate", className: "flex-1 text-left" },
  { label: "Actions",   className: "w-[320px] shrink-0 text-right" },
];

export function InterviewTableHeader() {
  return (
    <div className="flex items-center bg-white/[0.015] border-b border-white/[0.06] rounded-t-[18px]">
      {COLS.map((col) => (
        <div key={col.label} className={`${col.className} px-4 py-[9px]`}>
          <span className="text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[#5a8070]">
            {col.label}
          </span>
        </div>
      ))}
    </div>
  );
}
