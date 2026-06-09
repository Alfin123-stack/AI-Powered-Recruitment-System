import { ReactNode } from "react";

export function LandingTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-[14px] py-[5px] rounded-full text-[0.72rem] font-semibold tracking-[0.1em] uppercase">
      {children}
    </span>
  );
}
