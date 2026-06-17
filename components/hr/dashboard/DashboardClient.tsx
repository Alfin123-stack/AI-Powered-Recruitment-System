"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, LayoutDashboard } from "lucide-react";
import { StatCards } from "./DashboardStatCards";
import { AIInsightPanel } from "./DashboardAIInsightPanel";
import { AnalyticsSection } from "./DashboardAnalyticsSection";
import { DashboardSidebar } from "./DashboardSidebar";
import { CandidateRanking } from "./DashboardCandidateRanking";
import {
  Interview,
  JobGroup,
  CompanyInfo,
  CandidateUI,
} from "@/types/hr/dashboard";
import { PALETTE_COLORS } from "@/constants/shared";

interface DashboardClientProps {
  initialCandidates: CandidateUI[];
  initialInterviews: Interview[];
  company: CompanyInfo | null;
}

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}>
      {children}
    </motion.div>
  );
}

export function DashboardClient({
  initialCandidates,
  initialInterviews,
  company,
}: DashboardClientProps) {
  const [candidates, setCandidates] =
    useState<CandidateUI[]>(initialCandidates);
  const [interviews] = useState<Interview[]>(initialInterviews);

  const updateStatus = async (id: string, status: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
    try {
      await fetch(`/api/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Revert on error — optional: add rollback if needed
    }
  };

  const total = candidates.length;
  const shortlisted = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;
  const inReview = candidates.filter((c) => c.status === "review").length;
  const totalInterviews = interviews.length;
  const totalHired = candidates.filter((c) => c.status === "hired").length;
  const totalRejected = candidates.filter(
    (c) => c.status === "rejected",
  ).length;
  const uniqueJobs = [...new Set(candidates.map((c) => c.job))].sort();

  const jobGroups: JobGroup[] = useMemo(
    () =>
      uniqueJobs.map((title, i) => {
        const all = candidates
          .filter((c) => c.job === title)
          .sort((a, b) => b.resumeScore - a.resumeScore);
        const avgSc = all.length
          ? Math.round(all.reduce((a, c) => a + c.resumeScore, 0) / all.length)
          : 0;
        return {
          title,
          color: PALETTE_COLORS[i % PALETTE_COLORS.length],
          candidates: all,
          allCandidates: all,
          shortlisted: all.filter((c) => c.status === "shortlisted").length,
          avgScore: avgSc,
        };
      }),
    [candidates, uniqueJobs],
  );

  return (
    <div className="min-h-screen p-5 bg-[#080d0a]">
      <div className="relative">
        {/* ── PAGE HEADER ── */}
        <FadeIn>
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <LayoutDashboard size={18} className="text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[1.25rem] font-black m-0 tracking-tight text-[#e8f0ec]">
                    HR Dashboard
                  </h1>
                  <span className="flex items-center gap-1 px-2 py-[3px] rounded-full text-[0.58rem] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="w-[5px] h-[5px] rounded-full animate-pulse bg-emerald-400" />
                    LIVE
                  </span>
                </div>
                <p className="text-[0.75rem] text-[#4a6a5a] mt-[2px] m-0 flex items-center gap-2">
                  <Building2 size={11} className="text-[#3a5245]" />
                  {company?.name ?? "Recruitment Management"}
                  <span className="text-[#253b2e]">·</span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── STAT CARDS ── */}
        <FadeIn delay={0.03}>
          <StatCards
            uniqueJobsCount={uniqueJobs.length}
            total={total}
            totalInterviews={totalInterviews}
            totalHired={totalHired}
            totalRejected={totalRejected}
            shortlisted={shortlisted}
          />
        </FadeIn>

        {/* ── AI INSIGHT ── */}
        <FadeIn delay={0.06}>
          <AIInsightPanel candidates={candidates} />
        </FadeIn>

        {/* ── ANALYTICS + SIDEBAR ── */}
        <FadeIn delay={0.08}>
          <div
            className="grid gap-5 mb-5"
            style={{ gridTemplateColumns: "minmax(0,1fr) 280px" }}>
            <AnalyticsSection
              candidates={candidates}
              jobGroups={jobGroups}
              total={total}
              shortlisted={shortlisted}
              inReview={inReview}
              totalInterviews={totalInterviews}
              totalRejected={totalRejected}
              totalHired={totalHired}
            />
            <DashboardSidebar interviews={interviews} />
          </div>
        </FadeIn>

        {/* ── CANDIDATE RANKING ── */}
        <FadeIn delay={0.18}>
          <CandidateRanking
            jobGroups={jobGroups}
            total={total}
            onStatusChange={updateStatus}
          />
        </FadeIn>

        {/* ── COMPANY FOOTER ── */}
        {company && (
          <FadeIn delay={0.22}>
            <div className="rounded-xl p-4 flex items-center gap-4 mt-4 bg-[#0a0f0c] border border-white/[0.07]">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 size={17} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.82rem] font-black text-[#e8f0ec]">
                  {company.name}
                </div>
                {company.company_size && (
                  <div className="text-[0.68rem] text-[#4a6a5a] mt-[2px]">
                    👥 {company.company_size}
                  </div>
                )}
              </div>
              <div className="text-[0.62rem] text-[#253b2e] flex-shrink-0">
                Powered by AI Recruitment
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
