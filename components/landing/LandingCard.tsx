import { ReactNode } from "react";

export function LandingCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0f1612] border border-emerald-500/15 rounded-[16px] p-7 transition-all duration-300 hover:border-emerald-500/35 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  );
}
