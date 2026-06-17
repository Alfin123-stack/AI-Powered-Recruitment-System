"use client";

// ApplicationDetailModal.tsx — Client Component
// CSR: modal interaktif dengan animasi, butuh browser event

import { motion } from "framer-motion";
import {
  Award,
  Building2,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileText,
  MapPin,
  Sparkles,
  Target,
  Video,
  X,
} from "lucide-react";

import ApplicationsAIInsightBadge from "./ApplicationsAIInsightBadge";
import ApplicationsLiveCountdown from "./ApplicationsLiveCountdown";
import { Application, Interview } from "@/types/candidate/dashboard";
import { IV_STATUS_MAP, STATUS_MAP } from "@/constants/shared";
import { formatTime, getAIInsights, getDayLabel } from "@/lib/helpers/candidate/applications";


interface ApplicationDetailModalProps {
  app: Application;
  interviews: Interview[];
  onClose: () => void;
}

export default function ApplicationDetailModal({
  app,
  interviews,
  onClose,
}: ApplicationDetailModalProps) {
  const st = STATUS_MAP[app.status] ?? { label: app.status, color: "#7a9585" };
  const appInterviews = interviews.filter((iv) => iv.application_id === app.id);
  const insights = getAIInsights(app, interviews);
  const steps = ["applied", "review", "shortlisted"] as const;
  const currentStepIdx = steps.indexOf(app.status as (typeof steps)[number]);

  const resumeScore = app.resume_score ?? 0;
  const matchingScore = app.matching_score ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative bg-[#07100d] border border-emerald-500/15 rounded-[20px] w-full max-w-[600px] max-h-[85vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-[#07100d] border-b border-emerald-500/10 px-6 py-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[11px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building2 size={18} />
            </div>
            <div>
              <div className="font-bold text-[1rem]">{app.job_title}</div>
              <div className="text-[0.76rem] text-[#7a9585]">
                {app.company_name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="px-[10px] py-[4px] rounded-full text-[0.65rem] font-bold"
              style={{
                background: `${st.color}12`,
                color: st.color,
                border: `1px solid ${st.color}28`,
              }}>
              {st.label}
            </span>
            <button
              title="Tutup Detail Lamaran"
              onClick={onClose}
              className="w-8 h-8 rounded-[8px] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer bg-transparent">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* ── Progress Steps ── */}
          {app.status !== "rejected" && (
            <div>
              <div className="text-[0.73rem] font-bold text-[#7a9585] uppercase tracking-[0.06em] mb-3">
                Progress Lamaran
              </div>
              <div className="flex items-center gap-0">
                {(["applied", "review", "shortlisted"] as const).map(
                  (key, idx) => {
                    const isDone = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;
                    const label = ["Dikirim", "Direview", "Shortlisted"][idx];
                    return (
                      <div
                        key={key}
                        className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                              ${
                                isDone
                                  ? isCurrent
                                    ? "bg-emerald-500 border-emerald-500 text-black"
                                    : "bg-emerald-500/20 border-emerald-500/60 text-emerald-400"
                                  : "bg-transparent border-white/10 text-[#7a9585]"
                              }`}>
                            {isDone && !isCurrent ? (
                              <CheckCircle size={14} />
                            ) : (
                              <span className="text-[0.7rem] font-bold">
                                {idx + 1}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[0.63rem] font-medium whitespace-nowrap ${isDone ? "text-emerald-400" : "text-[#7a9585]"}`}>
                            {label}
                          </span>
                        </div>
                        {idx < 2 && (
                          <div
                            className={`flex-1 h-[2px] mb-4 mx-1 rounded-full ${
                              currentStepIdx > idx
                                ? "bg-emerald-500/40"
                                : "bg-white/[0.06]"
                            }`}
                          />
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {/* ── Scores ── */}
          {(resumeScore > 0 || matchingScore > 0) && (
            <div className="grid grid-cols-2 gap-3">
              {resumeScore > 0 && (
                <div className="bg-white/[0.025] border border-emerald-500/12 rounded-[12px] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={13} className="text-emerald-400" />
                    <span className="text-[0.73rem] font-bold text-[#7a9585]">
                      CV Score
                    </span>
                  </div>
                  <div className="text-[1.6rem] font-black text-emerald-400 leading-none mb-2">
                    {resumeScore}
                  </div>
                  <div className="w-full h-[5px] bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${resumeScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{
                        background: "linear-gradient(90deg,#10b981,#06b6d4)",
                      }}
                    />
                  </div>
                </div>
              )}
              {matchingScore > 0 && (
                <div className="bg-white/[0.025] border border-violet-500/12 rounded-[12px] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={13} className="text-violet-400" />
                    <span className="text-[0.73rem] font-bold text-[#7a9585]">
                      Job Match
                    </span>
                  </div>
                  <div className="text-[1.6rem] font-black text-violet-400 leading-none mb-2">
                    {matchingScore}%
                  </div>
                  <div className="w-full h-[5px] bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${matchingScore}%` }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.1,
                      }}
                      style={{
                        background: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AI Insights ── */}
          {insights.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={12} className="text-violet-400" />
                <span className="text-[0.73rem] font-bold text-[#7a9585] uppercase tracking-[0.06em]">
                  AI Insight
                </span>
              </div>
              <div className="space-y-2">
                {insights.map((insight, i) => (
                  <ApplicationsAIInsightBadge key={i} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {/* ── Interview Sessions ── */}
          {appInterviews.length > 0 && (
            <div>
              <div className="text-[0.73rem] font-bold text-[#7a9585] uppercase tracking-[0.06em] mb-2">
                Sesi Interview ({appInterviews.length})
              </div>
              <div className="space-y-2">
                {appInterviews.map((iv) => {
                  const ivSt = IV_STATUS_MAP[iv.status];
                  const upcoming =
                    iv.status === "scheduled" &&
                    new Date(iv.scheduled_at) > new Date();
                  return (
                    <div
                      key={iv.id}
                      className="bg-white/[0.025] border border-white/[0.06] rounded-[12px] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-[7px] flex items-center justify-center
                              ${upcoming ? "bg-cyan-500/10 text-cyan-400" : "bg-white/[0.04] text-[#7a9585]"}`}>
                            <Calendar size={13} />
                          </div>
                          <div>
                            <div className="text-[0.79rem] font-semibold">
                              {getDayLabel(iv.scheduled_at)}
                            </div>
                            <div className="text-[0.69rem] text-[#7a9585]">
                              {formatTime(iv.scheduled_at)} WIB
                            </div>
                          </div>
                        </div>
                        <span
                          className="text-[0.62rem] font-bold px-2 py-[2px] rounded-full"
                          style={{
                            background: ivSt.bg,
                            color: ivSt.color,
                            border: `1px solid ${ivSt.color}30`,
                          }}>
                          {ivSt.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3 text-[0.73rem] text-[#7a9585]">
                        {iv.type === "online" ? (
                          <span className="flex items-center gap-1">
                            <Video size={11} className="text-cyan-400" /> Online
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Building2 size={11} className="text-emerald-400" />{" "}
                            Onsite
                          </span>
                        )}
                        {iv.location && iv.type !== "online" && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {iv.location}
                          </span>
                        )}
                      </div>

                      {/* Online meeting link */}
                      {iv.location && iv.type === "online" && (
                        <a
                          href={iv.location}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-between w-full px-4 py-[10px] rounded-[9px] no-underline transition-all font-semibold text-[0.81rem]
                            ${
                              upcoming
                                ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                                : "bg-white/[0.03] border border-emerald-500/15 text-emerald-400 hover:border-emerald-500/30"
                            }`}>
                          <span className="flex items-center gap-2">
                            <Video size={13} />
                            {upcoming ? "Buka Link Meeting" : "Link Meeting"}
                          </span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      {/* HR Notes */}
                      {iv.notes && (
                        <div className="mt-3 bg-amber-500/[0.05] border border-amber-500/15 rounded-[8px] px-3 py-2">
                          <div className="text-[0.63rem] font-bold text-amber-400 uppercase tracking-[0.06em] mb-1">
                            Catatan HR
                          </div>
                          <div className="text-[0.73rem] text-[#7a9585]">
                            {iv.notes}
                          </div>
                        </div>
                      )}

                      {upcoming && (
                        <div className="mt-3 flex items-center justify-between">
                          <ApplicationsLiveCountdown
                            scheduledAt={iv.scheduled_at}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-500/8">
            <span className="text-[0.71rem] text-[#7a9585]">
              Dikirim{" "}
              {new Date(app.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {app.cv_url && (
              <a
                href={app.cv_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[0.73rem] text-emerald-400 hover:text-emerald-300 no-underline transition-colors font-medium">
                <FileText size={12} /> Lihat CV
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
