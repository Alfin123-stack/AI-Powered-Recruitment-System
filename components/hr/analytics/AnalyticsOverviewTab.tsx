"use client";

import { useMemo } from "react";
import {
  Target,
  Clock,
  Star,
  XCircle,
  CheckCircle2,
  Inbox,
  BarChart2,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Application } from "@/types/hr/analytics";
import { T } from "@/constants/hr/analytics";
import { AnalyticsChartCard } from "./AnalyticsChartCard";
import { AnalyticsCustomTooltip } from "./AnalyticsCustomTooltip";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";
import { AnalyticsPipelineFunnel } from "./AnalyticsPipelineFunnel";
import { AnalyticsScoreGauge } from "./AnalyticsScoreGauge";

interface AnalyticsOverviewTabProps {
  apps: Application[];
  total: number;
  shortlisted: number;
  rejected: number;
  review: number;
  applied: number;
  hired: number;
  avgScore: number;
  avgMatch: number;
  conversionRate: number;
}

export function AnalyticsOverviewTab({
  apps,
  total,
  shortlisted,
  rejected,
  review,
  applied,
  hired,
  avgScore,
  avgMatch,
  conversionRate,
}: AnalyticsOverviewTabProps) {
  const statusData = [
    { name: "Applied", value: applied, color: T.amber },
    { name: "In Review", value: review, color: T.cyan },
    { name: "Shortlisted", value: shortlisted, color: T.emerald },
    { name: "Rejected", value: rejected, color: T.rose },
    { name: "Hired", value: hired, color: T.violet },
  ].filter((d) => d.value > 0);

  const pipelineData = [
    { label: "Total Lamaran", count: total, color: T.emerald, icon: Inbox },
    { label: "In Review", count: review, color: T.cyan, icon: Clock },
    { label: "Shortlisted", count: shortlisted, color: T.violet, icon: Star },
    { label: "Rejected", count: rejected, color: T.rose, icon: XCircle },
    { label: "Hired", count: hired, color: T.amber, icon: CheckCircle2 },
  ];

  const weeklyTrend = useMemo(() => {
    const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 6 + i);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayApps = apps.filter(
        (a) => a.created_at?.slice(0, 10) === dateStr,
      );
      return {
        day: DAY_LABELS[date.getDay()],
        Lamaran: dayApps.length,
        Shortlisted: dayApps.filter((a) => a.status === "shortlisted").length,
      };
    });
  }, [apps]);

  return (
    <>
      {/* Row 1: Pipeline + Donut + Gauges */}
      <div
        className="grid gap-5 mb-5"
        style={{ gridTemplateColumns: "1.3fr 1fr 1fr" }}>
        {/* Pipeline Funnel */}
        <AnalyticsChartCard
          title="Hiring Pipeline"
          subtitle="alur seleksi kandidat"
          icon={Target}
          iconColor={T.emerald}
          iconBg="rgba(16,185,129,0.12)"
          delay={0.05}>
          <AnalyticsPipelineFunnel data={pipelineData} />
          <div
            className="grid grid-cols-2 gap-2 mt-5 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              {
                label: "Conversion",
                val: `${conversionRate}%`,
                color: T.emerald,
              },
              {
                label: "Rejection",
                val: total ? `${Math.round((rejected / total) * 100)}%` : "0%",
                color: T.rose,
              },
            ].map((m) => (
              <div
                key={m.label}
                className="text-center py-2 rounded-[10px]"
                style={{ background: "rgba(255,255,255,0.025)" }}>
                <div
                  className="text-[1rem] font-black"
                  style={{ color: m.color }}>
                  {m.val}
                </div>
                <div
                  className="text-[0.6rem]"
                  style={{ color: T.textSecondary }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </AnalyticsChartCard>

        {/* Status Donut */}
        <AnalyticsChartCard
          title="Status Kandidat"
          subtitle="distribusi semua pelamar"
          icon={BarChart2}
          iconColor={T.cyan}
          iconBg="rgba(6,182,212,0.12)"
          delay={0.08}>
          {total === 0 ? (
            <AnalyticsEmptyState />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none">
                    {statusData.map((e, i) => (
                      <Cell key={i} fill={e.color} fillOpacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip content={<AnalyticsCustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
                {statusData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-1 text-[0.62rem]"
                    style={{ color: T.textSecondary }}>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: d.color }}
                    />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </AnalyticsChartCard>

        {/* Score Gauges */}
        <AnalyticsChartCard
          title="Performa Metrik"
          subtitle="rata-rata seluruh kandidat"
          icon={Zap}
          iconColor={T.violet}
          iconBg="rgba(139,92,246,0.12)"
          delay={0.11}>
          <div className="flex justify-around mb-4">
            <AnalyticsScoreGauge
              value={avgScore}
              color={T.emerald}
              label="Avg CV Score"
            />
            <AnalyticsScoreGauge
              value={avgMatch}
              color={T.violet}
              label="Avg Match"
            />
            <AnalyticsScoreGauge
              value={conversionRate}
              color={T.cyan}
              label="Conversion"
            />
          </div>
          <div
            className="space-y-2 mt-3 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              {
                label: "Kandidat unggul (Score ≥80)",
                val: apps.filter((a) => (a.resume_score ?? 0) >= 80).length,
                color: T.emerald,
              },
              {
                label: "Match tinggi (≥75%)",
                val: apps.filter((a) => (a.matching_score ?? 0) >= 75).length,
                color: T.violet,
              },
              { label: "Belum diproses", val: applied, color: T.amber },
            ].map((m) => (
              <div key={m.label} className="flex justify-between items-center">
                <span
                  className="text-[0.68rem]"
                  style={{ color: T.textSecondary }}>
                  {m.label}
                </span>
                <span
                  className="text-[0.78rem] font-black"
                  style={{ color: m.color }}>
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </AnalyticsChartCard>
      </div>

      {/* Row 2: Weekly Trend (full width) */}
      <AnalyticsChartCard
        title="Tren Aplikasi 7 Hari Terakhir"
        subtitle="lamaran masuk & shortlisted per hari (data real)"
        icon={TrendingUp}
        iconColor={T.emerald}
        iconBg="rgba(16,185,129,0.12)"
        delay={0.14}
        className="mb-5">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart
            data={weeklyTrend}
            margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="gradL" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.emerald} stopOpacity={0.3} />
                <stop offset="100%" stopColor={T.emerald} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.violet} stopOpacity={0.25} />
                <stop offset="100%" stopColor={T.violet} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={T.gridLine}
              vertical={false}
            />
            <XAxis
              dataKey="day"
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
              cursor={{ stroke: "rgba(16,185,129,0.2)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="Lamaran"
              stroke={T.emerald}
              strokeWidth={2.5}
              fill="url(#gradL)"
              dot={{ fill: T.emerald, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: T.emerald }}
            />
            <Area
              type="monotone"
              dataKey="Shortlisted"
              stroke={T.violet}
              strokeWidth={2.5}
              fill="url(#gradS)"
              dot={{ fill: T.violet, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: T.violet }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-2">
          {[
            { color: T.emerald, label: "Lamaran Masuk" },
            { color: T.violet, label: "Shortlisted" },
          ].map((l) => (
            <div
              key={l.label}
              className="flex items-center gap-2 text-[0.65rem]"
              style={{ color: T.textSecondary }}>
              <div
                className="w-5 h-[2px] rounded-full"
                style={{ background: l.color }}
              />
              {l.label}
            </div>
          ))}
        </div>
      </AnalyticsChartCard>
    </>
  );
}
