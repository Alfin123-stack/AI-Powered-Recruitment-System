"use client";

// ApplicationCard.tsx — Client Component
// CSR: butuh interaktivitas (toggle AI insight, open detail modal)

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Building2,
  Calendar,
  ChevronDown,
  FileText,
  Search,
  Sparkles,
  Target,
  Video,
} from "lucide-react";
import {
  Application,
  Interview,
  STATUS_MAP,
} from "../../../constants/candidate/applications";
import {
  getAIInsights,
  getCardColor,
  getDayLabel,
  formatTime,
} from "../../../lib/helpers/candidate/applications";
import AIInsightBadge from "./ApplicationsAIInsightBadge";
import LiveCountdown from "./ApplicationsLiveCountdown";

interface ApplicationCardProps {
  app: Application;
  index: number;
  interviews: Interview[];
  onOpenDetail: (app: Application) => void;
}

export default function ApplicationCard({
  app,
  index,
  interviews,
  onOpenDetail,
}: ApplicationCardProps) {
  const [showInsights, setShowInsights] = useState(false);

  const st = STATUS_MAP[app.status] ?? { label: app.status, color: "#7a9585" };
  const color = getCardColor(index);
  const appInterview = interviews.find(
    (iv) => iv.application_id === app.id && iv.status === "scheduled",
  );
  const insights = getAIInsights(app, interviews);

  const resumeScore = app.resume_score ?? 0;
  const matchingScore = app.matching_score ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] overflow-hidden hover:border-emerald-500/25 transition-all hover:-translate-y-[1px] hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] group">
      <div className="flex">
        {/* Color accent bar */}
        <div
          className="w-[3px] flex-shrink-0 rounded-l-[18px]"
          style={{
            background: `linear-gradient(180deg, ${color}60, ${color}10)`,
          }}
        />
        <div className="flex-1 p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.06]"
              style={{ background: `${color}14`, color }}>
              <Building2 size={18} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-bold text-[0.93rem]">
                    {app.job_title}
                  </div>
                  <div className="text-[0.76rem] text-[#7a9585]">
                    {app.company_name}
                  </div>
                </div>
                <span
                  className="px-[10px] py-[4px] rounded-full text-[0.65rem] font-bold flex-shrink-0"
                  style={{
                    background: `${st.color}12`,
                    color: st.color,
                    border: `1px solid ${st.color}28`,
                  }}>
                  {st.label}
                </span>
              </div>

              {/* Score bars */}
              {(resumeScore > 0 || matchingScore > 0) && (
                <div className="flex gap-5 mb-3 flex-wrap">
                  {resumeScore > 0 && (
                    <div className="flex items-center gap-2">
                      <Award size={10} className="text-emerald-400 shrink-0" />
                      <div className="w-[64px] h-[4px] rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${resumeScore}%`,
                            background:
                              "linear-gradient(90deg,#10b981,#06b6d4)",
                          }}
                        />
                      </div>
                      <span className="text-[0.71rem] font-bold text-emerald-400">
                        {resumeScore}{" "}
                        <span className="text-[#7a9585] font-normal">CV</span>
                      </span>
                    </div>
                  )}
                  {matchingScore > 0 && (
                    <div className="flex items-center gap-2">
                      <Target size={10} className="text-violet-400 shrink-0" />
                      <div className="w-[64px] h-[4px] rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${matchingScore}%`,
                            background:
                              "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                          }}
                        />
                      </div>
                      <span className="text-[0.71rem] font-bold text-violet-400">
                        {matchingScore}%{" "}
                        <span className="text-[#7a9585] font-normal">
                          Match
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Interview badge */}
              {appInterview && (
                <div className="flex items-center justify-between bg-cyan-500/[0.05] border border-cyan-500/18 rounded-[9px] px-3 py-[7px] mb-3">
                  <div className="flex items-center gap-2 text-[0.75rem]">
                    <Calendar size={11} className="text-cyan-400" />
                    <span className="text-cyan-400 font-semibold">
                      Interview:
                    </span>
                    <span className="text-[#7a9585]">
                      {getDayLabel(appInterview.scheduled_at)},{" "}
                      {formatTime(appInterview.scheduled_at)} WIB
                    </span>
                    {appInterview.type === "online" && (
                      <Video size={10} className="text-cyan-400" />
                    )}
                  </div>
                  <LiveCountdown scheduledAt={appInterview.scheduled_at} />
                </div>
              )}

              {/* AI Insight (collapsible) */}
              {insights.length > 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => setShowInsights((v) => !v)}
                    className="flex items-center gap-1.5 text-[0.71rem] text-violet-400 hover:text-violet-300 transition-colors cursor-pointer bg-transparent border-0">
                    <Sparkles size={11} />
                    AI Insight{showInsights ? "" : " — klik untuk lihat"}
                    <ChevronDown
                      size={11}
                      className={`transition-transform ${showInsights ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {showInsights && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden">
                        <div className="pt-2 space-y-1.5">
                          {insights.map((ins, i) => (
                            <AIInsightBadge key={i} insight={ins} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] text-[#7a9585]">
                  {new Date(app.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-2">
                  {app.cv_url && (
                    <a
                      href={app.cv_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[0.71rem] text-emerald-400 hover:text-emerald-300 no-underline transition-colors">
                      <FileText size={11} /> Lihat CV
                    </a>
                  )}
                  <button
                    onClick={() => onOpenDetail(app)}
                    className="flex items-center gap-1 text-[0.71rem] text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer ml-2 bg-transparent border-0">
                    <Search size={11} /> Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
