"use client";

import { useMemo } from "react";
import { BarChart2, Activity, Award, Zap } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { Application } from "@/types/hr/analytics";
import { PALETTE, T } from "@/constants/hr/analytics";
import { AnalyticsChartCard } from "./AnalyticsChartCard";
import { AnalyticsCustomTooltip } from "./AnalyticsCustomTooltip";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";
import { AnalyticsTopCandidateRow } from "./AnalyticsTopCandidateRow";

interface AnalyticsCandidateTabProps {
  apps: Application[];
  total: number;
  avgScore: number;
  avgMatch: number;
  conversionRate: number;
}

export function AnalyticsCandidateTab({
  apps,
  total,
  avgScore,
  avgMatch,
  conversionRate,
}: AnalyticsCandidateTabProps) {
  const scoreDistData = [
    {
      range: "90-100",
      count: apps.filter((a) => (a.resume_score ?? 0) >= 90).length,
      fill: T.emerald,
    },
    {
      range: "70-89",
      count: apps.filter(
        (a) => (a.resume_score ?? 0) >= 70 && (a.resume_score ?? 0) < 90,
      ).length,
      fill: T.cyan,
    },
    {
      range: "50-69",
      count: apps.filter(
        (a) => (a.resume_score ?? 0) >= 50 && (a.resume_score ?? 0) < 70,
      ).length,
      fill: T.amber,
    },
    {
      range: "30-49",
      count: apps.filter(
        (a) => (a.resume_score ?? 0) >= 30 && (a.resume_score ?? 0) < 50,
      ).length,
      fill: T.orange,
    },
    {
      range: "< 30",
      count: apps.filter(
        (a) => (a.resume_score ?? 0) > 0 && (a.resume_score ?? 0) < 30,
      ).length,
      fill: T.rose,
    },
  ];

  const scatterData = useMemo(
    () =>
      apps
        .filter((a) => (a.resume_score ?? 0) > 0 && (a.matching_score ?? 0) > 0)
        .slice(0, 40)
        .map((a, i) => ({
          x: a.resume_score,
          y: a.matching_score,
          z: 60,
          name: a.candidate_name,
          color: PALETTE[i % PALETTE.length],
        })),
    [apps],
  );

  const topCandidates = useMemo(
    () =>
      [...apps]
        .filter((a) => (a.resume_score ?? 0) > 0)
        .sort((a, b) => (b.resume_score ?? 0) - (a.resume_score ?? 0))
        .slice(0, 6)
        .map((a, i) => ({
          name: a.candidate_name ?? "Kandidat",
          job: a.job_title ?? "-",
          cvScore: a.resume_score ?? 0,
          matchScore: a.matching_score ?? 0,
          color: PALETTE[i % PALETTE.length],
        })),
    [apps],
  );

  const radialData = [
    { name: "Avg CV Score", value: avgScore, fill: T.emerald },
    { name: "Avg Match", value: avgMatch, fill: T.violet },
    { name: "Conversion", value: conversionRate, fill: T.cyan },
  ];

  return (
    <>
      {/* Row 1: Score dist + Scatter */}
      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 1.2fr" }}>
        <AnalyticsChartCard
          title="Distribusi CV Score"
          subtitle="jumlah kandidat per rentang skor"
          icon={BarChart2}
          iconColor={T.amber}
          iconBg="rgba(245,158,11,0.12)"
          delay={0.05}>
          {total === 0 ? (
            <AnalyticsEmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={scoreDistData}
                layout="vertical"
                barSize={18}
                margin={{ left: 4, right: 8 }}>
                <CartesianGrid horizontal={false} stroke={T.gridLine} />
                <XAxis
                  type="number"
                  tick={T.tick}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="range"
                  tick={T.tick}
                  axisLine={false}
                  tickLine={false}
                  width={46}
                />
                <Tooltip
                  content={<AnalyticsCustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="count" name="Kandidat" radius={[0, 6, 6, 0]}>
                  {scoreDistData.map((e, i) => (
                    <Cell key={i} fill={e.fill} fillOpacity={0.88} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </AnalyticsChartCard>

        <AnalyticsChartCard
          title="CV Score vs Match Score"
          subtitle="korelasi antar metrik kandidat"
          icon={Activity}
          iconColor={T.cyan}
          iconBg="rgba(6,182,212,0.12)"
          delay={0.08}>
          {scatterData.length === 0 ? (
            <AnalyticsEmptyState />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={230}>
                <ScatterChart margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                  <CartesianGrid stroke={T.gridLine} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="CV Score"
                    domain={[0, 100]}
                    tick={T.tick}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "CV Score",
                      position: "insideBottom",
                      offset: -2,
                      fill: T.textSecondary,
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Match %"
                    domain={[0, 100]}
                    tick={T.tick}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "Match %",
                      angle: -90,
                      position: "insideLeft",
                      fill: T.textSecondary,
                      fontSize: 10,
                    }}
                  />
                  <ZAxis dataKey="z" range={[40, 80]} />
                  <Tooltip
                    content={<AnalyticsCustomTooltip />}
                    cursor={{ strokeDasharray: "3 3", stroke: T.gridLine }}
                  />
                  <Scatter data={scatterData} fill={T.emerald} fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
              <div
                className="text-[0.65rem] text-center mt-1"
                style={{ color: T.textMuted }}>
                Setiap titik = 1 kandidat
              </div>
            </>
          )}
        </AnalyticsChartCard>
      </div>

      {/* Row 2: Top Candidates + Radial */}
      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <AnalyticsChartCard
          title="Top Kandidat"
          subtitle="berdasarkan AI score tertinggi"
          icon={Award}
          iconColor={T.violet}
          iconBg="rgba(139,92,246,0.12)"
          delay={0.11}>
          {topCandidates.length === 0 ? (
            <AnalyticsEmptyState />
          ) : (
            <div className="flex flex-col gap-2">
              {topCandidates.map((c, i) => (
                <AnalyticsTopCandidateRow key={i} rank={i + 1} {...c} />
              ))}
            </div>
          )}
        </AnalyticsChartCard>

        <AnalyticsChartCard
          title="Performa Radial"
          subtitle="avg score seluruh metrik"
          icon={Zap}
          iconColor={T.rose}
          iconBg="rgba(244,63,94,0.12)"
          delay={0.14}>
          {total === 0 ? (
            <AnalyticsEmptyState />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={88}
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={5}
                    background={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Tooltip content={<AnalyticsCustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
                {radialData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-1 text-[0.62rem]"
                    style={{ color: T.textSecondary }}>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: d.fill }}
                    />
                    {d.name}: <b style={{ color: d.fill }}>{d.value}</b>
                  </div>
                ))}
              </div>
            </>
          )}
        </AnalyticsChartCard>
      </div>
    </>
  );
}
