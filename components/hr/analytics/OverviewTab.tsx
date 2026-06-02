"use client";

// @/components/hr/analytics/OverviewTab.tsx
// Tab "Overview": Pipeline Funnel, Status Donut, Score Gauges, Weekly Trend
// CSR — semua data diterima via props dari parent (AnalyticsDashboard)

import { useMemo } from "react";
import { motion } from "framer-motion";
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
import { T, Application, PALETTE } from "./shared";
import { ChartCard, CustomTooltip, EmptyState } from "./ChartCard";

// ─── Pipeline Funnel ─────────────────────────────────────────────────────────
function PipelineFunnel({
  data,
}: {
  data: { label: string; count: number; color: string; icon: React.ElementType }[];
}) {
  const max = data[0]?.count || 1;
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => {
        const pct = (d.count / max) * 100;
        const DIcon = d.icon;
        return (
          <div key={d.label} className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ background: `${d.color}18`, color: d.color }}>
              <DIcon size={12} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-[0.72rem] font-semibold" style={{ color: T.textPrimary }}>
                  {d.label}
                </span>
                <span className="text-[0.72rem] font-black" style={{ color: d.color }}>
                  {d.count}
                </span>
              </div>
              <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${d.color}, ${d.color}99)` }}
                />
              </div>
            </div>
            <span className="text-[0.65rem] w-8 text-right flex-shrink-0" style={{ color: T.textSecondary }}>
              {max > 0 ? Math.round(pct) : 0}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Score Gauge (SVG half-circle) ───────────────────────────────────────────
function ScoreGauge({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 36, cx = 48, cy = 48;
  const halfCirc = Math.PI * r;
  const dash = (value / 100) * halfCirc;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={96} height={56} viewBox="0 0 96 64">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${halfCirc}`}
          initial={{ strokeDashoffset: halfCirc }}
          animate={{ strokeDashoffset: halfCirc - dash }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <text x={cx} y={cy - 2} textAnchor="middle" fill={color} fontSize="15" fontWeight="800">
          {value}
        </text>
      </svg>
      <div className="text-[0.65rem] font-semibold" style={{ color: T.textSecondary }}>
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────
interface OverviewTabProps {
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

export function OverviewTab({
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
}: OverviewTabProps) {
  // Status donut data
  const statusData = [
    { name: "Applied", value: applied, color: T.amber },
    { name: "In Review", value: review, color: T.cyan },
    { name: "Shortlisted", value: shortlisted, color: T.emerald },
    { name: "Rejected", value: rejected, color: T.rose },
    { name: "Hired", value: hired, color: T.violet },
  ].filter((d) => d.value > 0);

  // Pipeline data
  const pipelineData = [
    { label: "Total Lamaran", count: total, color: T.emerald, icon: Inbox },
    { label: "In Review", count: review, color: T.cyan, icon: Clock },
    { label: "Shortlisted", count: shortlisted, color: T.violet, icon: Star },
    { label: "Rejected", count: rejected, color: T.rose, icon: XCircle },
    { label: "Hired", count: hired, color: T.amber, icon: CheckCircle2 },
  ];

  // Weekly trend dari created_at — data real
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
      const dayApps = apps.filter((a) => a.created_at?.slice(0, 10) === dateStr);
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
      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1.3fr 1fr 1fr" }}>
        {/* Pipeline Funnel */}
        <ChartCard
          title="Hiring Pipeline"
          subtitle="alur seleksi kandidat"
          icon={Target}
          iconColor={T.emerald}
          iconBg="rgba(16,185,129,0.12)"
          delay={0.05}>
          <PipelineFunnel data={pipelineData} />
          <div
            className="grid grid-cols-2 gap-2 mt-5 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { label: "Conversion", val: `${conversionRate}%`, color: T.emerald },
              { label: "Rejection", val: total ? `${Math.round((rejected / total) * 100)}%` : "0%", color: T.rose },
            ].map((m) => (
              <div
                key={m.label}
                className="text-center py-2 rounded-[10px]"
                style={{ background: "rgba(255,255,255,0.025)" }}>
                <div className="text-[1rem] font-black" style={{ color: m.color }}>
                  {m.val}
                </div>
                <div className="text-[0.6rem]" style={{ color: T.textSecondary }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Status Donut */}
        <ChartCard
          title="Status Kandidat"
          subtitle="distribusi semua pelamar"
          icon={BarChart2}
          iconColor={T.cyan}
          iconBg="rgba(6,182,212,0.12)"
          delay={0.08}>
          {total === 0 ? (
            <EmptyState />
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
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
                {statusData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1 text-[0.62rem]" style={{ color: T.textSecondary }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>

        {/* Score Gauges */}
        <ChartCard
          title="Performa Metrik"
          subtitle="rata-rata seluruh kandidat"
          icon={Zap}
          iconColor={T.violet}
          iconBg="rgba(139,92,246,0.12)"
          delay={0.11}>
          <div className="flex justify-around mb-4">
            <ScoreGauge value={avgScore} color={T.emerald} label="Avg CV Score" />
            <ScoreGauge value={avgMatch} color={T.violet} label="Avg Match" />
            <ScoreGauge value={conversionRate} color={T.cyan} label="Conversion" />
          </div>
          <div className="space-y-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { label: "Kandidat unggul (Score ≥80)", val: apps.filter((a) => (a.resume_score ?? 0) >= 80).length, color: T.emerald },
              { label: "Match tinggi (≥75%)", val: apps.filter((a) => (a.matching_score ?? 0) >= 75).length, color: T.violet },
              { label: "Belum diproses", val: applied, color: T.amber },
            ].map((m) => (
              <div key={m.label} className="flex justify-between items-center">
                <span className="text-[0.68rem]" style={{ color: T.textSecondary }}>{m.label}</span>
                <span className="text-[0.78rem] font-black" style={{ color: m.color }}>{m.val}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Weekly Trend (full width) */}
      <ChartCard
        title="Tren Aplikasi 7 Hari Terakhir"
        subtitle="lamaran masuk & shortlisted per hari (data real)"
        icon={TrendingUp}
        iconColor={T.emerald}
        iconBg="rgba(16,185,129,0.12)"
        delay={0.14}
        className="mb-5">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={weeklyTrend} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
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
            <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false} />
            <XAxis dataKey="day" tick={T.tick} axisLine={false} tickLine={false} />
            <YAxis tick={T.tick} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(16,185,129,0.2)", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="Lamaran" stroke={T.emerald} strokeWidth={2.5} fill="url(#gradL)" dot={{ fill: T.emerald, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: T.emerald }} />
            <Area type="monotone" dataKey="Shortlisted" stroke={T.violet} strokeWidth={2.5} fill="url(#gradS)" dot={{ fill: T.violet, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: T.violet }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-2">
          {[
            { color: T.emerald, label: "Lamaran Masuk" },
            { color: T.violet, label: "Shortlisted" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2 text-[0.65rem]" style={{ color: T.textSecondary }}>
              <div className="w-5 h-[2px] rounded-full" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </ChartCard>
    </>
  );
}
