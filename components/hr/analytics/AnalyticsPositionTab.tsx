"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Briefcase, Target, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { Application, Job } from "@/types/hr/analytics";
import { PALETTE, T } from "@/constants/hr/analytics";
import { AnalyticsChartCard } from "./AnalyticsChartCard";
import { AnalyticsCustomTooltip } from "./AnalyticsCustomTooltip";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";

interface AnalyticsPositionTabProps {
  apps: Application[];
  jobs: Job[];
}

export function AnalyticsPositionTab({ apps, jobs }: AnalyticsPositionTabProps) {
  const jobBarData = useMemo(
    () =>
      jobs
        .map((j, i) => ({
          name: j.title?.split(" ").slice(0, 2).join(" ") ?? "Job",
          fullTitle: j.title ?? "",
          Pelamar: apps.filter((a) => a.job_id === j.id).length,
          Shortlisted: apps.filter(
            (a) => a.job_id === j.id && a.status === "shortlisted",
          ).length,
          Rejected: apps.filter(
            (a) => a.job_id === j.id && a.status === "rejected",
          ).length,
          color: PALETTE[i % PALETTE.length],
        }))
        .filter((j) => j.Pelamar > 0)
        .sort((a, b) => b.Pelamar - a.Pelamar)
        .slice(0, 7),
    [apps, jobs],
  );

  const radarData = useMemo(
    () =>
      jobBarData.map((j) => {
        const jobApps = apps.filter((a) => a.job_title === j.fullTitle);
        const len = Math.max(jobApps.length, 1);
        return {
          posisi: j.name,
          "Avg Score": Math.round(
            jobApps.reduce((s, a) => s + (a.resume_score ?? 0), 0) / len,
          ),
          "Avg Match": Math.round(
            jobApps.reduce((s, a) => s + (a.matching_score ?? 0), 0) / len,
          ),
        };
      }),
    [jobBarData, apps],
  );

  return (
    <>
      {/* Row 1: Grouped bar + Radar */}
      <div
        className="grid gap-5 mb-5"
        style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <AnalyticsChartCard
          title="Pelamar per Posisi"
          subtitle="total & shortlisted per lowongan"
          icon={Briefcase}
          iconColor={T.emerald}
          iconBg="rgba(16,185,129,0.12)"
          delay={0.05}>
          {jobBarData.length === 0 ? (
            <AnalyticsEmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={jobBarData}
                barGap={4}
                margin={{ left: -16, right: 8 }}>
                <CartesianGrid vertical={false} stroke={T.gridLine} />
                <XAxis
                  dataKey="name"
                  tick={T.tick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={T.tick}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<AnalyticsCustomTooltip />}
                  cursor={{ fill: "rgba(16,185,129,0.04)" }}
                />
                <Bar
                  dataKey="Pelamar"
                  fill={T.emerald}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                  fillOpacity={0.85}
                />
                <Bar
                  dataKey="Shortlisted"
                  fill={T.violet}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                  fillOpacity={0.85}
                />
                <Bar
                  dataKey="Rejected"
                  fill={T.rose}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                  fillOpacity={0.85}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ color: T.textSecondary, fontSize: 11 }}>
                      {v}
                    </span>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </AnalyticsChartCard>

        <AnalyticsChartCard
          title="Radar Score per Posisi"
          subtitle="AI score vs match score"
          icon={Target}
          iconColor={T.amber}
          iconBg="rgba(245,158,11,0.12)"
          delay={0.08}>
          {radarData.length === 0 ? (
            <AnalyticsEmptyState />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart
                  data={radarData}
                  margin={{ top: 8, right: 20, left: 20, bottom: 8 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.07)" />
                  <PolarAngleAxis
                    dataKey="posisi"
                    tick={{
                      fill: T.textSecondary,
                      fontSize: 9,
                      fontWeight: 600,
                    }}
                  />
                  <Tooltip content={<AnalyticsCustomTooltip />} />
                  <Radar
                    name="Avg Score"
                    dataKey="Avg Score"
                    stroke={T.emerald}
                    fill={T.emerald}
                    fillOpacity={0.12}
                    strokeWidth={2}
                    dot={{ fill: T.emerald, r: 3 }}
                  />
                  <Radar
                    name="Avg Match"
                    dataKey="Avg Match"
                    stroke={T.violet}
                    fill={T.violet}
                    fillOpacity={0.1}
                    strokeWidth={2}
                    dot={{ fill: T.violet, r: 3 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5">
                {[
                  { color: T.emerald, label: "Avg AI Score" },
                  { color: T.violet, label: "Avg Match %" },
                ].map((l) => (
                  <div
                    key={l.label}
                    className="flex items-center gap-1 text-[0.62rem]"
                    style={{ color: T.textSecondary }}>
                    <div
                      className="w-4 h-[2px] rounded-full"
                      style={{ background: l.color }}
                    />
                    {l.label}
                  </div>
                ))}
              </div>
            </>
          )}
        </AnalyticsChartCard>
      </div>

      {/* Row 2: Conversion rate per job */}
      <AnalyticsChartCard
        title="Conversion Rate per Lowongan"
        subtitle="persentase shortlisted dari total pelamar"
        icon={TrendingUp}
        iconColor={T.cyan}
        iconBg="rgba(6,182,212,0.12)"
        delay={0.11}>
        {jobBarData.length === 0 ? (
          <AnalyticsEmptyState />
        ) : (
          <div
            className="flex flex-col divide-y"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {jobBarData.map((j, i) => {
              const conv = j.Pelamar
                ? Math.round((j.Shortlisted / j.Pelamar) * 100)
                : 0;
              return (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: j.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[0.8rem] font-semibold truncate"
                      style={{ color: T.textPrimary }}>
                      {j.fullTitle}
                    </div>
                    <div
                      className="text-[0.65rem]"
                      style={{ color: T.textSecondary }}>
                      {j.Pelamar} pelamar · {j.Shortlisted} shortlisted ·{" "}
                      {j.Rejected} rejected
                    </div>
                  </div>
                  <div className="w-36 flex-shrink-0">
                    <div
                      className="h-[5px] rounded-full overflow-hidden mb-1"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${conv}%` }}
                        transition={{
                          duration: 1.1,
                          delay: i * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full"
                        style={{ background: j.color }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-[0.82rem] font-black w-10 text-right flex-shrink-0"
                    style={{ color: j.color }}>
                    {conv}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </AnalyticsChartCard>
    </>
  );
}
