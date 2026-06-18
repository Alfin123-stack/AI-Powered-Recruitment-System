"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Layers } from "lucide-react";
import type { Company } from "@/types/main/company";
import CompanyDetailJobGrid from "./CompanyDetailJobGrid";
import CompanyDetailAbout from "./CompanyDetailAbout";
import { Job } from "@/types/jobs";

type CompanyDetailTabsProps = {
  company: Company;
  jobs: Job[];
  accent: string;
};

export default function CompanyDetailTabs({
  company,
  jobs,
  accent,
}: CompanyDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"jobs" | "about">("jobs");

  return (
    <>
      {/* Tabs bar */}
      <div className="max-w-[900px] mx-auto px-6">
        <div className="flex gap-0 border-b border-white/[0.07]">
          {(["jobs", "about"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-[16px] py-[10px] text-[0.78rem] font-medium cursor-pointer border-b-[2px] transition-all -mb-px ${
                activeTab === tab
                  ? "text-[#e8f0ec] border-b-current"
                  : "text-[#5d7a6a] border-transparent hover:text-[#a0b8a8]"
              }`}
              style={activeTab === tab ? { borderBottomColor: accent } : {}}>
              {tab === "jobs" ? (
                <span className="flex items-center gap-[5px]">
                  <Briefcase size={12} />
                  Open Roles
                  <span
                    className="text-[0.62rem] px-[5px] py-[1px] rounded-full font-semibold"
                    style={{ background: `${accent}20`, color: accent }}>
                    {jobs.length}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-[5px]">
                  <Layers size={12} /> About
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <section className="py-[28px] pb-24">
        <div className="max-w-[900px] mx-auto px-6">
          <AnimatePresence mode="wait">
            {activeTab === "jobs" ? (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>
                <CompanyDetailJobGrid jobs={jobs} accent={accent} />
              </motion.div>
            ) : (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>
                <CompanyDetailAbout
                  company={company}
                  jobCount={jobs.length}
                  accent={accent}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
