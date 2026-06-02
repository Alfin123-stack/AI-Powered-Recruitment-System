"use client";

// @/components/hr/analytics/KandidatTab.tsx
// Tab "Kandidat": Distribusi Score, Scatter, Top Kandidat, Radial Perf
// CSR — data via props

import { useMemo } from "react";
import { motion } from "framer-motion";
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
import { T, Application, PALETTE } from "./shared";
import { ChartCard, CustomTooltip, EmptyState } from "./ChartCard";

// ─── Top Candidate Row ───────────────────────────────────────────────────────
function TopCandidateRow({
  rank,
  name,
  job,
  cvScore,
  matchScore,
  color,
}: {
  rank: number;
  name: string;
  job: string;
  cvScore: number;
  matchScore: number;
  color: string;
}) {
  const rankColors = ["#f59e0b", "#94a3b8", "#cd7c38"];
  const rc = rankColors[rank - 1] ?? T.textSecondary;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.06 }}
      className="flex items-center gap-3 py-2 px-3 rounded-[11px] group cursor-default"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      whileHover={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)", transition: { duration: 0.15 } }}>
      <div
        className="w-6 h-6 rounded-[6px] flex items-center justify-center text-[0.65rem] font-black flex-shrink-0"
        style={{ background: `${rc}18`, color: rc, border: `1px solid ${rc}30` }}>
        {rank}
      </div>
      <div
        className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[0.7rem] font-black flex-shrink-0"
        style={{ background: `${color}18`, color, border: `1px solid ${color}25` }}>
        {name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.78rem] font-semibold truncate" style={{ color: T.textPrimary }}>{name}</div>
        <div className="text-[0.63rem] truncate" style={{ color: T.textSecondary }}>{job}</div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-center">
          <div
            className="text-[0.82rem] font-black"
            style={{ color: cvScore >= 80 ? T.emerald : cvScore >= 60 ? T.cyan : T.amber }}>
            {cvScore}
          </div>
          <div className="text-[0.55rem]" style={{ color: T.textMuted }}>CV</div>
        </div>
        <div className="text-center">
          <div
            className="text-[0.82rem] font-black"
            style={{ color: matchScore >= 80 ? T.violet : matchScore >= 60 ? T.cyan : T.amber }}>
            {matchScore}%
          </div>
          <div className="text-[0.55rem]" style={{ color: T.textMuted }}>Match</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────
interface KandidatTabProps {
  apps: Application[];
  total: number;
  avgScore: number;
  avgMatch: number;
  conversionRate: number;
}

export function KandidatTab({ apps, total, avgScore, avgMatch, conversionRate }: KandidatTabProps) {
  // Score distribution
  const scoreDistData = [
    { range: "90-100", count: apps.filter((a) => (a.resume_score ?? 0) >= 90).length, fill: T.emerald },
    { range: "70-89", count: apps.filter((a) => (a.resume_score ?? 0) >= 70 && (a.resume_score ?? 0) < 90).length, fill: T.cyan },
    { range: "50-69", count: apps.filter((a) => (a.resume_score ?? 0) >= 50 && (a.resume_score ?? 0) < 70).length, fill: T.amber },
    { range: "30-49", count: apps.filter((a) => (a.resume_score ?? 0) >= 30 && (a.resume_score ?? 0) < 50).length, fill: T.orange },
    { range: "< 30", count: apps.filter((a) => (a.resume_score ?? 0) > 0 && (a.resume_score ?? 0) < 30).length, fill: T.rose },
  ];

  // Scatter: cv score vs match score
  const scatterData = useMemo(
    () =>
      apps
        .filter((a) => (a.resume_score ?? 0) > 0 && (a.matching_score ?? 0) > 0)
        .slice(0, 40)
        .map((a, i) => ({ x: a.resume_score, y: a.matching_score, z: 60, name: a.candidate_name, color: PALETTE[i % PALETTE.length] })),
    [apps],
  );

  // Top candidates
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

  // Radial data
  const radialData = [
    { name: "Avg CV Score", value: avgScore, fill: T.emerald },
    { name: "Avg Match", value: avgMatch, fill: T.violet },
    { name: "Conversion", value: conversionRate, fill: T.cyan },
  ];

  return (
    <>
      {/* Row 1: Score dist + Scatter */}
      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 1.2fr" }}>
        <ChartCard
          title="Distribusi CV Score"
          subtitle="jumlah kandidat per rentang skor"
          icon={BarChart2}
          iconColor={T.amber}
          iconBg="rgba(245,158,11,0.12)"
          delay={0.05}>
          {total === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={scoreDistData} layout="vertical" barSize={18} margin={{ left: 4, right: 8 }}>
                <CartesianGrid horizontal={false} stroke={T.gridLine} />
                <XAxis type="number" tick={T.tick} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="range" tick={T.tick} axisLine={false} tickLine={false} width={46} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" name="Kandidat" radius={[0, 6, 6, 0]}>
                  {scoreDistData.map((e, i) => (
                    <Cell key={i} fill={e.fill} fillOpacity={0.88} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="CV Score vs Match Score"
          subtitle="korelasi antar metrik kandidat"
          icon={Activity}
          iconColor={T.cyan}
          iconBg="rgba(6,182,212,0.12)"
          delay={0.08}>
          {scatterData.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={230}>
                <ScatterChart margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                  <CartesianGrid stroke={T.gridLine} />
                  <XAxis
                    type="number" dataKey="x" name="CV Score" domain={[0, 100]}
                    tick={T.tick} axisLine={false} tickLine={false}
                    label={{ value: "CV Score", position: "insideBottom", offset: -2, fill: T.textSecondary, fontSize: 10 }}
                  />
                  <YAxis
                    type="number" dataKey="y" name="Match %" domain={[0, 100]}
                    tick={T.tick} axisLine={false} tickLine={false}
                    label={{ value: "Match %", angle: -90, position: "insideLeft", fill: T.textSecondary, fontSize: 10 }}
                  />
                  <ZAxis dataKey="z" range={[40, 80]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: T.gridLine }} />
                  <Scatter data={scatterData} fill={T.emerald} fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="text-[0.65rem] text-center mt-1" style={{ color: T.textMuted }}>
                Setiap titik = 1 kandidat
              </div>
            </>
          )}
        </ChartCard>
      </div>

      {/* Row 2: Top Candidates + Radial */}
      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <ChartCard
          title="Top Kandidat"
          subtitle="berdasarkan AI score tertinggi"
          icon={Award}
          iconColor={T.violet}
          iconBg="rgba(139,92,246,0.12)"
          delay={0.11}>
          {topCandidates.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-2">
              {topCandidates.map((c, i) => (
                <TopCandidateRow key={i} rank={i + 1} {...c} />
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Performa Radial"
          subtitle="avg score seluruh metrik"
          icon={Zap}
          iconColor={T.rose}
          iconBg="rgba(244,63,94,0.12)"
          delay={0.14}>
          {total === 0 ? (
            <EmptyState />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius={28} outerRadius={88} data={radialData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={5} background={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
                {radialData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1 text-[0.62rem]" style={{ color: T.textSecondary }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                    {d.name}: <b style={{ color: d.fill }}>{d.value}</b>
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>
      </div>
    </>
  );
}
