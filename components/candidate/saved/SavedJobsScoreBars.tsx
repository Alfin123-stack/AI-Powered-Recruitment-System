import { Award, Target } from "lucide-react";

interface SavedJobsScoreBarsProps {
  resumeScore?: number;
  matchingScore?: number;
}

export default function SavedJobsScoreBars({
  resumeScore,
  matchingScore,
}: SavedJobsScoreBarsProps) {
  if (!(resumeScore ?? 0) && !(matchingScore ?? 0)) return null;

  return (
    <div className="flex gap-5 mb-3 flex-wrap">
      {(resumeScore ?? 0) > 0 && (
        <div className="flex items-center gap-2">
          <Award size={10} className="text-emerald-400 shrink-0" />
          <div className="w-[56px] h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${resumeScore}%`,
                background: "linear-gradient(90deg,#10b981,#06b6d4)",
              }}
            />
          </div>
          <span className="text-[0.69rem] font-bold text-emerald-400">
            {resumeScore}{" "}
            <span className="text-[#7a9585] font-normal">CV</span>
          </span>
        </div>
      )}
      {(matchingScore ?? 0) > 0 && (
        <div className="flex items-center gap-2">
          <Target size={10} className="text-violet-400 shrink-0" />
          <div className="w-[56px] h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${matchingScore}%`,
                background: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
              }}
            />
          </div>
          <span className="text-[0.69rem] font-bold text-violet-400">
            {matchingScore}%{" "}
            <span className="text-[#7a9585] font-normal">Match</span>
          </span>
        </div>
      )}
    </div>
  );
}
