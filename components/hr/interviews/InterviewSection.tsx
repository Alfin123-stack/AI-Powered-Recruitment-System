"use client";

export function InterviewSection({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-emerald-500/50">{icon}</span>
      <span className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-[#3d5c49]">
        {label}
      </span>
      <div className="flex-1 h-px bg-emerald-500/8" />
    </div>
  );
}
