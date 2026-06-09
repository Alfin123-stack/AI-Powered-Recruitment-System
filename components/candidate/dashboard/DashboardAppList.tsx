"use client";

// app/dashboard/candidate/_components/ApplicationList.tsx
// CSR — tab filter, animated card list, detail expand

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Clock,
  Eye,
  Award,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { statusMap, getCardColor } from "./DashboardHelpers";
import type { Application } from "@/types/candidate-dashboard";

const TABS = [
  { id: "all", label: "Semua" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "review", label: "In Review" },
  { id: "applied", label: "Dikirim" },
  { id: "rejected", label: "Ditolak" },
];

// ── Radial Score (mini) ───────────────────────────────────────────────────────
function RadialScoreMini({ score, color }: { score: number; color: string }) {
  const size = 56;
  const strokeWidth = 5;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={size * 0.22}
        fontWeight="700"
        style={{
          transform: "rotate(90deg)",
          transformOrigin: `${size / 2}px ${size / 2}px`,
        }}>
        {score}
      </text>
    </svg>
  );
}

// ── Application Card ──────────────────────────────────────────────────────────
function AppCard({ app, index }: { app: Application; index: number }) {
  const st = statusMap[app.status] ?? { label: app.status, color: "#7a9585" };
  const color = getCardColor(index);
  const [showDetail, setShowDetail] = useState(false);

  const matchScore = app.matching_score || 0;
  const resumeScore = app.resume_score || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}>
      <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[16px] p-5 mb-3 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-[2px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-white/[0.06]"
            style={{ background: `${color}15`, color }}>
            <Building2 size={17} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[0.93rem] mb-[2px] truncate">
              {app.job_title}
            </div>
            <div className="text-[0.76rem] text-[#7a9585]">
              {app.company_name}
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1 px-[9px] py-[4px] rounded-full text-[0.65rem] font-bold tracking-wide uppercase flex-shrink-0"
            style={{
              background: `${st.color}12`,
              color: st.color,
              border: `1px solid ${st.color}28`,
            }}>
            {st.label}
          </span>
        </div>

        {(resumeScore > 0 || matchScore > 0) && (
          <div className="space-y-[7px] mb-3">
            {resumeScore > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[0.7rem] text-[#7a9585] w-[105px] shrink-0 flex items-center gap-1">
                  <Award size={9} className="text-emerald-400" /> Resume Score
                </span>
                <div className="flex-1 h-[4px] rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${resumeScore}%`,
                      background: "linear-gradient(90deg,#10b981,#06b6d4)",
                      transition: "width 1.2s ease",
                    }}
                  />
                </div>
                <span className="text-[0.72rem] font-bold w-7 text-right text-emerald-400">
                  {resumeScore}
                </span>
              </div>
            )}
            {matchScore > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[0.7rem] text-[#7a9585] w-[105px] shrink-0 flex items-center gap-1">
                  <Target size={9} className="text-violet-400" /> Job Match
                </span>
                <div className="flex-1 h-[4px] rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${matchScore}%`,
                      background: "linear-gradient(90deg,#8b5cf6,#06b6d4)",
                      transition: "width 1.2s ease",
                    }}
                  />
                </div>
                <span className="text-[0.72rem] font-bold w-7 text-right text-violet-400">
                  {matchScore}%
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[0.69rem] text-[#7a9585] flex items-center gap-1">
            <Clock size={10} /> Dilamar{" "}
            {new Date(app.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {(resumeScore > 0 || matchScore > 0) && (
            <button
              onClick={() => setShowDetail(!showDetail)}
              className="flex items-center gap-1 text-[0.69rem] text-[#7a9585] hover:text-emerald-400 transition-colors bg-transparent border-0 cursor-pointer">
              <Eye size={10} /> Detail
            </button>
          )}
        </div>

        <AnimatePresence>
          {showDetail && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden">
              <div className="pt-3 mt-3 border-t border-white/[0.05] grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-[10px] bg-white/[0.025]">
                  <RadialScoreMini score={resumeScore} color="#10b981" />
                  <div className="text-[0.65rem] text-[#7a9585] mt-1">
                    Resume Score
                  </div>
                </div>
                <div className="text-center p-3 rounded-[10px] bg-white/[0.025]">
                  <RadialScoreMini score={matchScore} color="#8b5cf6" />
                  <div className="text-[0.65rem] text-[#7a9585] mt-1">
                    Job Match Score
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Application List ──────────────────────────────────────────────────────────
interface DashboardAppListProps {
  applications: Application[];
  filteredApplications: Application[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardAppList({
  applications,
  filteredApplications,
  activeTab,
  onTabChange,
}: DashboardAppListProps) {
  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-[#0a0f0c] border border-emerald-500/12 rounded-[10px] p-[5px] mb-4 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`px-4 py-[6px] rounded-[7px] text-[0.78rem] font-medium cursor-pointer transition-all whitespace-nowrap border-0
              ${
                activeTab === t.id
                  ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20"
                  : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"
              }`}>
            {t.label}
            {t.id !== "all" && (
              <span className="ml-[5px] bg-white/[0.06] rounded-[4px] px-[5px] py-[1px] text-[0.63rem]">
                {applications.filter((a) => a.status === t.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-14">
          <div className="text-[2.8rem] mb-3 opacity-25">📭</div>
          <div className="font-bold text-[0.93rem] mb-2">
            {applications.length === 0
              ? "Belum ada lamaran"
              : "Tidak ada di kategori ini"}
          </div>
          <p className="text-[#7a9585] text-[0.8rem] mb-5">
            {applications.length === 0
              ? "Mulai lamar lowongan yang sesuai skill kamu."
              : "Coba tab lain."}
          </p>
          {applications.length === 0 && (
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-[9px] rounded-[9px] text-[0.83rem] no-underline transition-all">
              Cari Lowongan <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      ) : (
        filteredApplications.map((app, i) => (
          <AppCard key={app.id} app={app} index={i} />
        ))
      )}
    </div>
  );
}
