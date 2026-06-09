import Link from "next/link";
import { Briefcase, Bookmark } from "lucide-react";
import SavedJobsFadeIn from "./SavedJobsFadeIn";

export default function SavedJobsEmptyState() {
  return (
    <SavedJobsFadeIn delay={0.05}>
      <div className="text-center py-20 text-[#7a9585]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/[0.05] border border-dashed border-emerald-500/20 mb-5">
          <Bookmark size={22} className="text-emerald-500/30" />
        </div>
        <div className="font-bold text-[1rem] text-[#e8f0ec] mb-2">
          No saved jobs yet
        </div>
        <p className="text-[0.82rem] mb-6 max-w-[280px] mx-auto leading-relaxed">
          Tap the bookmark icon on any job listing to save it and find it again
          later.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-[10px] rounded-[9px] no-underline text-[0.84rem] transition-all hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
          <Briefcase size={14} /> Browse Jobs
        </Link>
      </div>
    </SavedJobsFadeIn>
  );
}
