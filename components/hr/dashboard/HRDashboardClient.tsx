"use client";

// ─────────────────────────────────────────────────────────────────────────────
// HR DASHBOARD CLIENT — CSR Orchestrator
// Menerima initial data dari Server Component (SSR/ISR), mengelola state lokal
// Route: @/components/hr/dashboard/HRDashboardClient.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, LayoutDashboard } from "lucide-react";
import { StatCards } from "./StatCards";
import { AIInsightPanel } from "./AIInsightPanel";
import { AnalyticsSection } from "./AnalyticsSection";
import { DashboardSidebar } from "./Sidebar";
import { CandidateRanking } from "./CandidateRanking";
import { CandidateExtended, Interview, JobGroup, CompanyInfo } from "./types";
import { JOB_COLORS } from "./helpers";

interface HRDashboardClientProps {
  initialCandidates: CandidateExtended[];
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
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
}

export function HRDashboardClient({
  initialCandidates,
  initialInterviews,
  company,
}: HRDashboardClientProps) {
  const [candidates, setCandidates] = useState<CandidateExtended[]>(initialCandidates);
  const [interviews] = useState<Interview[]>(initialInterviews);

  // Optimistic status update (fire-and-forget to API)
  const updateStatus = async (id: string, status: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    try {
      await fetch(`/api/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Revert on error — optional: bisa tambahkan rollback jika perlu
    }
  };

  // Derived stats
  const total = candidates.length;
  const shortlisted = candidates.filter((c) => c.status === "shortlisted").length;
  const inReview = candidates.filter((c) => c.status === "review").length;
  const totalInterviews = interviews.length;
  const totalHired = candidates.filter((c) => c.status === "hired").length;
  const totalRejected = candidates.filter((c) => c.status === "rejected").length;
  const uniqueJobs = [...new Set(candidates.map((c) => c.job))].sort();

  // Build job groups (all candidates per position, sorted by score)
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
          color: JOB_COLORS[i % JOB_COLORS.length],
          candidates: all, // CandidateRanking will apply its own filter
          allCandidates: all,
          shortlisted: all.filter((c) => c.status === "shortlisted").length,
          avgScore: avgSc,
        };
      }),
    [candidates, uniqueJobs]
  );

  return (
    <div className="min-h-screen p-5" style={{ background: "#080d0a" }}>
      {/* Background ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            top: -200, left: -200, width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: 400, right: -100, width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(6,182,212,0.04) 0%,transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-[1]">
        {/* ── PAGE HEADER ── */}
        <FadeIn>
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div
                  className="w-11 h-11 rounded-[13px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(6,182,212,0.15) 100%)",
                    border: "1px solid rgba(16,185,129,0.35)",
                    boxShadow: "0 0 20px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <LayoutDashboard size={20} style={{ color: "#10b981" }} />
                </div>
                <div
                  className="absolute inset-0 rounded-[13px] pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at center, rgba(16,185,129,0.3) 0%, transparent 70%)",
                    filter: "blur(8px)",
                    zIndex: -1,
                  }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className="text-[1.4rem] font-black m-0 tracking-tight"
                    style={{
                      background: "linear-gradient(90deg, #e8f0ec 0%, #10b981 60%, #06b6d4 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    HR Dashboard
                  </h1>
                  <span
                    className="flex items-center gap-1 px-2 py-[3px] rounded-full text-[0.58rem] font-bold"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}
                  >
                    <span className="w-[5px] h-[5px] rounded-full animate-pulse" style={{ background: "#10b981" }} />
                    LIVE
                  </span>
                </div>
                <p className="text-[0.75rem] text-[#7a9585] mt-[2px] m-0 flex items-center gap-2">
                  <Building2 size={11} style={{ color: "#475569" }} />
                  {company?.name ?? "Recruitment Management"}
                  <span style={{ color: "#334155" }}>·</span>
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── STAT CARDS — CSR ── */}
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

        {/* ── AI INSIGHT — CSR (derived dari state) ── */}
        <FadeIn delay={0.06}>
          <AIInsightPanel candidates={candidates} />
        </FadeIn>

        {/* ── ANALYTICS + SIDEBAR — CSR ── */}
        <FadeIn delay={0.08}>
          <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "minmax(0,1fr) 280px" }}>
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

        {/* ── CANDIDATE RANKING — CSR ── */}
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
            <div className="rounded-[14px] p-4 flex items-center gap-4 mt-4 bg-[#0a0f0c] border border-emerald-500/12">
              <div className="w-10 h-10 rounded-[11px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.82rem] font-black text-[#e8f0ec]">{company.name}</div>
                {company.company_size && (
                  <div className="text-[0.68rem] text-[#7a9585] mt-[2px]">👥 {company.company_size}</div>
                )}
              </div>
              <div className="text-[0.62rem] text-[#7a9585]/40 flex-shrink-0">Powered by AI Recruitment</div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
