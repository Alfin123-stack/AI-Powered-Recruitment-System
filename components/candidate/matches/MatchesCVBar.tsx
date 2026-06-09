// SERVER Component — tidak ada directive "use client".
// Menampilkan info analisis CV yang sedang dipakai untuk matching.

import Link from "next/link";
import { FileText, ChevronRight, Zap, Star } from "lucide-react";
import type { CvAnalysis } from "../../../types/candidate/matches";
import { timeAgo } from "../../../lib/helpers/candidate/matches";

type MatchesCVBarProps = {
  cvAnalysis: CvAnalysis;
};

export default function MatchesCVBar({ cvAnalysis }: MatchesCVBarProps) {
  const topSkills = (cvAnalysis.extracted_skills || [])
    .sort((a, b) => b.level - a.level)
    .slice(0, 5);

  const overallScore = cvAnalysis.overall_score;
  const scoreColor =
    overallScore >= 75 ? "#10b981" : overallScore >= 55 ? "#f59e0b" : "#6b7280";

  return (
    <div className="bg-[#0d1a14] border border-emerald-500/15 rounded-[12px] px-4 py-3 mb-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: CV info + skills */}
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          {/* CV score mini */}
          <div
            className="flex items-center gap-[6px] px-[10px] py-[5px] rounded-[7px] flex-shrink-0"
            style={{
              background: `${scoreColor}15`,
              border: `1px solid ${scoreColor}25`,
            }}>
            <Star size={11} style={{ color: scoreColor }} />
            <span
              className="text-[0.72rem] font-bold tabular-nums"
              style={{ color: scoreColor }}>
              {overallScore}
            </span>
            <span className="text-[0.65rem] text-white/30">skor CV</span>
          </div>

          {/* Filename + time */}
          <div className="flex items-center gap-[6px] text-[0.72rem] text-white/35 min-w-0">
            <FileText size={12} className="text-emerald-400 flex-shrink-0" />
            {cvAnalysis.file_name && (
              <span className="text-emerald-400 font-medium truncate max-w-[120px]">
                {cvAnalysis.file_name}
              </span>
            )}
            <span className="text-white/20 flex-shrink-0">·</span>
            <span className="flex-shrink-0">
              {timeAgo(cvAnalysis.created_at)}
            </span>
          </div>

          {/* Skills chips */}
          {topSkills.length > 0 && (
            <div className="flex items-center gap-[5px] flex-wrap">
              <span className="text-[0.65rem] text-white/25">skills:</span>
              {topSkills.map((s) => (
                <span
                  key={s.name}
                  className="px-[7px] py-[2px] rounded-[4px] text-[0.65rem] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                  {s.name}
                </span>
              ))}
              {(cvAnalysis.extracted_skills?.length || 0) > 5 && (
                <span className="text-[0.65rem] text-white/25">
                  +{(cvAnalysis.extracted_skills?.length || 0) - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: update link */}
        <Link
          href="/analyze"
          className="flex items-center gap-1 text-[0.7rem] text-white/30 hover:text-emerald-400 transition-colors no-underline whitespace-nowrap flex-shrink-0">
          Update CV <ChevronRight size={11} />
        </Link>
      </div>
    </div>
  );
}
