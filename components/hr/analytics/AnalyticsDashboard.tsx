"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { T, Application, Job, computeStats } from "./shared";
import { StatCards } from "./StatCards";
import { OverviewTab } from "./OverviewTab";
import { KandidatTab } from "./KandidatTab";
import { PosisiTab } from "./PosisiTab";

import { apiFetch, FadeIn } from "@/app/(role)/dashboard/hr/_components/shared";
import { useDashboard } from "@/context/DashboardContext";

type TabId = "overview" | "kandidat" | "posisi";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "kandidat", label: "Kandidat" },
  { id: "posisi", label: "Per Posisi" },
];

export function AnalyticsDashboard() {
  const { token } = useDashboard();
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // CSR fetch — data real-time, tidak di-cache server
  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiFetch("/api/applications/hr", token),
      apiFetch("/api/jobs/my", token),
    ])
      .then(([appsData, jobsData]) => {
        setApps(Array.isArray(appsData) ? appsData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      })
      .catch(console.error);
  }, [token]);

  const stats = computeStats(apps, jobs);

  return (
    <div className="min-h-screen pb-10" style={{ background: T.bg }}>
      {/* ── Header ── */}
      <FadeIn>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.15)", color: T.emerald }}>
              <Activity size={15} />
            </div>
            <h1
              className="text-[1.35rem] font-black tracking-tight"
              style={{ color: T.textPrimary }}>
              Analytics
            </h1>
          </div>
          <p
            className="text-[0.75rem] ml-11"
            style={{ color: T.textSecondary }}>
            Data rekrutmen real-time — {stats.total} total kandidat ·{" "}
            {stats.activeJobs} posisi aktif
          </p>
        </div>

        {/* Tab bar */}
        <div
          className="flex items-center gap-1 mb-6 p-1 rounded-[12px] w-fit"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-[6px] rounded-[9px] text-[0.78rem] font-semibold transition-all duration-200 cursor-pointer border-0"
              style={{
                background:
                  activeTab === tab.id
                    ? "rgba(16,185,129,0.18)"
                    : "transparent",
                color: activeTab === tab.id ? T.emerald : T.textSecondary,
                border:
                  activeTab === tab.id
                    ? "1px solid rgba(16,185,129,0.3)"
                    : "1px solid transparent",
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Stat Cards — hanya di overview, tapi tetap visible saat pindah tab */}
      {activeTab === "overview" && (
        <StatCards
          total={stats.total}
          shortlisted={stats.shortlisted}
          hired={stats.hired}
          avgScore={stats.avgScore}
          activeJobs={stats.activeJobs}
          totalJobs={jobs.length}
          conversionRate={stats.conversionRate}
        />
      )}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <OverviewTab
              apps={apps}
              total={stats.total}
              shortlisted={stats.shortlisted}
              rejected={stats.rejected}
              review={stats.review}
              applied={stats.applied}
              hired={stats.hired}
              avgScore={stats.avgScore}
              avgMatch={stats.avgMatch}
              conversionRate={stats.conversionRate}
            />
          </motion.div>
        )}

        {activeTab === "kandidat" && (
          <motion.div
            key="kandidat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <KandidatTab
              apps={apps}
              total={stats.total}
              avgScore={stats.avgScore}
              avgMatch={stats.avgMatch}
              conversionRate={stats.conversionRate}
            />
          </motion.div>
        )}

        {activeTab === "posisi" && (
          <motion.div
            key="posisi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <PosisiTab apps={apps} jobs={jobs} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
