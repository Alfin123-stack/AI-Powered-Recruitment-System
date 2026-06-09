"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  ChevronRight,
  LayoutGrid,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type {
  Application,
  Interview,
} from "../../../constants/candidate/applications";
import { FILTER_OPTIONS } from "../../../constants/candidate/applications";
import {
  isToday,
  getDayLabel,
  formatTime,
} from "../../../lib/helpers/candidate/applications";
import { useApplicationsFilter } from "@/hooks/dashboard/candidate/Useapplicationsfilter";
import ApplicationCard from "./ApplicationCard";
import ApplicationDetailModal from "./ApplicationDetailModal";
import InterviewsSection from "./ApplicationsInterviewsSection";

interface ApplicationsClientProps {
  applications: Application[];
  interviews: Interview[];
}

export default function ApplicationsClient({
  applications,
  interviews,
}: ApplicationsClientProps) {
  const {
    activeTab,
    setActiveTab,
    appSearch,
    setAppSearch,
    filter,
    setFilter,
    selectedApp,
    setSelectedApp,
    upcomingInterviews,
    filteredApps,
  } = useApplicationsFilter(applications, interviews);

  const TABS = [
    {
      key: "applications" as const,
      label: "Lamaranku",
      Icon: Building2,
      count: applications.length,
    },
    {
      key: "interviews" as const,
      label: "Jadwal Interview",
      Icon: Calendar,
      count: interviews.length,
    },
  ];

  return (
    <>
      {/* ── Upcoming Interview Banner ── */}
      <AnimatePresence>
        {upcomingInterviews.length > 0 && activeTab === "applications" && (
          <motion.div
            key="iv-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-cyan-500/[0.05] border border-cyan-500/20 rounded-[14px] p-4 mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[9px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Calendar size={15} />
              </div>
              <div>
                <div className="font-semibold text-[0.84rem] text-cyan-400">
                  {upcomingInterviews.length === 1
                    ? "Ada 1 jadwal interview menunggumu"
                    : `${upcomingInterviews.length} jadwal interview menunggu`}
                </div>
                <div className="text-[0.71rem] text-[#7a9585] mt-[2px]">
                  {isToday(upcomingInterviews[0].scheduled_at)
                    ? `Hari ini pukul ${formatTime(upcomingInterviews[0].scheduled_at)} WIB — ${upcomingInterviews[0].job_title}`
                    : `Berikutnya: ${getDayLabel(upcomingInterviews[0].scheduled_at)} — ${upcomingInterviews[0].job_title}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                title="Lihat semua jadwal interview"
                onClick={() => setActiveTab("interviews")}
                className="flex items-center gap-1 text-[0.77rem] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer whitespace-nowrap bg-transparent border-0">
                Lihat Jadwal <ChevronRight size={13} />
              </button>
              <Link
                href="./applications/calendar"
                title="Buka tampilan kalender"
                className="flex items-center gap-1 text-[0.75rem] text-[#7a9585] hover:text-[#e8f0ec] transition-colors no-underline whitespace-nowrap">
                <LayoutGrid size={11} /> Kalender
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tabs + Action Buttons ── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 bg-[#0a0f0c] border border-emerald-500/12 rounded-[12px] p-[5px]">
          {TABS.map(({ key, label, Icon, count }) => (
            <button
              key={key}
              title={`Tampilkan tab ${label}`}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-[7px] rounded-[9px] text-[0.81rem] font-medium cursor-pointer transition-all whitespace-nowrap border-0
                ${
                  activeTab === key
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                    : "bg-transparent text-[#7a9585] hover:text-[#e8f0ec]"
                }`}>
              <Icon size={13} />
              {label}
              {count > 0 && (
                <span
                  className={`rounded-[4px] px-[6px] py-[1px] text-[0.61rem] font-extrabold
                  ${activeTab === key ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.05] text-[#7a9585]"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="./applications/calendar"
            title="Buka tampilan kalender"
            className="flex items-center gap-2 px-3 py-[8px] rounded-[9px] text-[0.79rem] font-medium text-[#7a9585] hover:text-[#e8f0ec] border border-emerald-500/12 hover:border-emerald-500/25 no-underline transition-all">
            <LayoutGrid size={13} /> Kalender
          </Link>
          {activeTab === "applications" && (
            <Link
              href="/jobs"
              title="Cari lowongan baru untuk dilamar"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-[8px] rounded-[9px] text-[0.81rem] no-underline transition-all hover:shadow-[0_4px_12px_rgba(16,185,129,0.28)]">
              + Lamar Lagi
            </Link>
          )}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === "applications" && (
          <motion.div
            key="apps"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}>
            {/* Search + Filter */}
            <div className="flex gap-3 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  size={13}
                  className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7a9585] pointer-events-none"
                />
                <Input
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Cari posisi atau perusahaan..."
                  className="pl-[34px] pr-8 bg-[#0a0f0c] border-emerald-500/15 text-[#e8f0ec] placeholder:text-[rgba(122,149,133,0.45)] rounded-[9px] focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                />
                {appSearch && (
                  <button
                    title="Hapus pencarian"
                    onClick={() => setAppSearch("")}
                    className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#7a9585] hover:text-[#e8f0ec] transition-colors cursor-pointer bg-transparent border-0">
                    <X size={13} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {FILTER_OPTIONS.map(({ val, label }) => (
                  <button
                    key={val}
                    title={`Filter status: ${label}`}
                    onClick={() => setFilter(val)}
                    className={`px-3 py-[6px] rounded-[8px] border text-[0.77rem] font-medium cursor-pointer transition-all whitespace-nowrap
                      ${
                        filter === val
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-transparent border-emerald-500/12 text-[#7a9585] hover:border-emerald-500/28 hover:text-[#e8f0ec]"
                      }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications list or empty state */}
            {filteredApps.length === 0 ? (
              <div className="text-center py-20 text-[#7a9585]">
                <div className="text-[2.5rem] mb-3 opacity-25">🔍</div>
                <div className="font-bold text-[1rem] mb-2">
                  {applications.length === 0
                    ? "Belum ada lamaran"
                    : "Tidak ditemukan"}
                </div>
                {applications.length === 0 && (
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-[10px] rounded-[9px] text-[0.83rem] no-underline mt-4 transition-all">
                    Cari Lowongan →
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {filteredApps.map((app, i) => (
                    <ApplicationCard
                      key={app.id}
                      app={app}
                      index={i}
                      interviews={interviews}
                      onOpenDetail={setSelectedApp}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "interviews" && (
          <motion.div
            key="ivs"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}>
            <InterviewsSection interviews={interviews} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedApp && (
          <ApplicationDetailModal
            app={selectedApp}
            interviews={interviews}
            onClose={() => setSelectedApp(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
