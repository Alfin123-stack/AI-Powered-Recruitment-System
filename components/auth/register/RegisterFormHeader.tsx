import { Sparkles } from "lucide-react";

export function RegisterFormHeader() {
  return (
    <div className="mb-6">
      <div className="mb-3">
        <span
          className="inline-flex items-center gap-[6px] bg-emerald-500/10 border border-emerald-500/20
          text-emerald-400 px-[11px] py-[4px] rounded-full text-[0.66rem] font-semibold tracking-[0.1em] uppercase">
          <Sparkles size={8} className="animate-pulse" /> Free for candidates
        </span>
      </div>
      <h2 className="font-syne text-[1.9rem] font-extrabold text-[#e8f0ec] tracking-tight leading-[1.15] mb-2">
        Create a new account
      </h2>
      <p className="text-[#5a7a6a] text-[0.86rem]">
        Start analyzing your CV with AI — no credit card required
      </p>
    </div>
  );
}
