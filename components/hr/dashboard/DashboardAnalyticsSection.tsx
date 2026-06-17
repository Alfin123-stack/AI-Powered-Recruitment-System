"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  BarChart2,
  Brain,
  Target,
  PieChart,
  Inbox,
  Eye,
  Star,
  XCircle,
  Briefcase,
} from "lucide-react";
import { getScoreColor, getScoreGradient } from "@/lib/helpers/hr/dashboard";

import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { CandidateUI, JobGroup } from "@/types/hr/dashboard";

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  active?: boolean;
  payload?: Array<{
    color?: string;
    name?: string;
    value?: ValueType;
  }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[10px] px-3 py-2 text-[0.72rem] font-semibold shadow-xl"
      style={{
        background: "#0f1a14",
        border: "1px solid rgba(16,185,129,0.25)",
        color: "#e8f0ec",
      }}>
      <div className="text-[#7a9585] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span style={{ color: p.color }}>
            {p.name}: <b>{p.value}</b>
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Donut Segment ─────────────────────────────────────────────────────────────
type DonutSegment = {
  value: number;
  color: string;
  label: string;
};

type DonutPath = {
  d: string;
  color: string;
};

function DonutChart({
  segments,
  size = 120,
  centerLabel,
  centerSub,
}: {
  segments: DonutSegment[];
  size?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const paths = useMemo((): DonutPath[] => {
    const total = segments.reduce((a, s) => a + s.value, 0) || 1;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 10;
    const ri = r - 16;

    // ✅ pakai reduce — tidak ada reassignment, angle terakumulasi di accumulator
    return segments.reduce<{ paths: DonutPath[]; angle: number }>(
      (acc, seg) => {
        const sweep = (seg.value / total) * 2 * Math.PI;
        if (sweep < 0.001) return acc;

        const ea = acc.angle + sweep;
        const x1 = cx + r * Math.cos(acc.angle);
        const y1 = cy + r * Math.sin(acc.angle);
        const x2 = cx + r * Math.cos(ea);
        const y2 = cy + r * Math.sin(ea);
        const xi1 = cx + ri * Math.cos(acc.angle);
        const yi1 = cy + ri * Math.sin(acc.angle);
        const xi2 = cx + ri * Math.cos(ea);
        const yi2 = cy + ri * Math.sin(ea);
        const lg = sweep > Math.PI ? 1 : 0;
        const d = `M${x1} ${y1} A${r} ${r} 0 ${lg} 1 ${x2} ${y2} L${xi2} ${yi2} A${ri} ${ri} 0 ${lg} 0 ${xi1} ${yi1}Z`;

        return {
          paths: [...acc.paths, { d, color: seg.color }],
          angle: ea, // ✅ bukan reassign — nilai baru di accumulator
        };
      },
      { paths: [], angle: -Math.PI / 2 },
    ).paths;
  }, [segments, size]);

  const cx = size / 2;
  const cy = size / 2;
  const ri = size / 2 - 10 - 16;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0 }}
      aria-hidden="true">
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity={0.85} />
      ))}
      <circle cx={cx} cy={cy} r={ri - 1} fill="#0a0f0c" />
      {centerLabel && (
        <>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#e8f0ec"
            fontSize="14"
            fontWeight="800">
            {centerLabel}
          </text>
          {centerSub && (
            <text
              x={cx}
              y={cy + 13}
              textAnchor="middle"
              fill="#7a9585"
              fontSize="9">
              {centerSub}
            </text>
          )}
        </>
      )}
    </svg>
  );
}

// ── Stat Item ─────────────────────────────────────────────────────────────────
type StatItem = {
  label: string;
  val: number;
  color: string;
};

// ── Total Overview Panel ──────────────────────────────────────────────────────
function TotalOverview({
  total,
  shortlisted,
  inReview,
  totalInterviews,
  totalRejected,
  totalHired,
}: {
  total: number;
  shortlisted: number;
  inReview: number;
  totalInterviews: number;
  totalRejected: number;
  totalHired: number;
}) {
  const donutSegments: DonutSegment[] = [
    { value: shortlisted, color: "#10b981", label: "Shortlisted" },
    { value: inReview, color: "#06b6d4", label: "Interview" },
    { value: totalRejected, color: "#ef4444", label: "Rejected" },
    {
      value: Math.max(0, total - shortlisted - inReview - totalRejected),
      color: "#8b5cf6",
      label: "Applied",
    },
  ];

  const statItems: StatItem[] = [
    { label: "Shortlisted", val: shortlisted, color: "#10b981" },
    { label: "Applicants", val: total, color: "#8b5cf6" },
    { label: "Interview", val: totalInterviews, color: "#f59e0b" },
    { label: "Rejected", val: totalRejected, color: "#ef4444" },
    { label: "Hired", val: totalHired, color: "#06b6d4" },
  ];

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-[6px] bg-cyan-500/15 flex items-center justify-center">
          <PieChart size={12} className="text-cyan-400" aria-hidden="true" />
        </div>
        <span className="font-bold text-[0.82rem] text-[#e8f0ec]">
          Total Overview
        </span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <DonutChart
          segments={donutSegments}
          size={110}
          centerLabel={String(total)}
          centerSub="Total"
        />
        <div className="w-full space-y-2">
          {statItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                  aria-hidden="true"
                />
                <span className="text-[0.68rem] text-[#7a9585]">
                  {item.label}
                </span>
              </div>
              <span
                className="text-[0.75rem] font-black"
                style={{ color: item.color }}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pipeline Stage ────────────────────────────────────────────────────────────
type PipelineStage = {
  label: string;
  count: number;
  color: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
};

type MetricItem = {
  label: string;
  val: string;
  color: string;
};

// ── Hiring Pipeline ───────────────────────────────────────────────────────────
function HiringPipeline({
  total,
  inReview,
  shortlisted,
  totalRejected,
}: {
  total: number;
  inReview: number;
  shortlisted: number;
  totalRejected: number;
}) {
  const stages: PipelineStage[] = [
    { label: "Applied", count: total, color: "#10b981", Icon: Inbox },
    { label: "In Review", count: inReview, color: "#06b6d4", Icon: Eye },
    { label: "Shortlisted", count: shortlisted, color: "#8b5cf6", Icon: Star },
    {
      label: "Rejected",
      count: totalRejected,
      color: "#ef4444",
      Icon: XCircle,
    },
  ];

  const metrics: MetricItem[] = [
    {
      label: "Conversion",
      val: `${total ? Math.round((shortlisted / total) * 100) : 0}%`,
      color: "#10b981",
    },
    {
      label: "Rejection",
      val: `${total ? Math.round((totalRejected / total) * 100) : 0}%`,
      color: "#ef4444",
    },
  ];

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5 h-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-[6px] bg-emerald-500/15 flex items-center justify-center">
          <BarChart2
            size={12}
            className="text-emerald-400"
            aria-hidden="true"
          />
        </div>
        <span className="font-bold text-[0.82rem] text-[#e8f0ec]">
          Hiring Pipeline
        </span>
      </div>
      <div className="space-y-3">
        {stages.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <s.Icon size={13} style={{ color: s.color, flexShrink: 0 }} />
            <div className="w-[72px] text-[0.7rem] font-semibold text-[#94a3b8] flex-shrink-0">
              {s.label}
            </div>
            <div className="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: total ? `${(s.count / total) * 100}%` : "0%",
                }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: s.color }}
              />
            </div>
            <span
              className="text-[0.82rem] font-black w-6 text-right flex-shrink-0"
              style={{ color: s.color }}>
              {s.count}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/[0.04]">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="text-center py-3 rounded-[10px] bg-white/[0.025] border border-white/[0.05]">
            <div className="text-base font-black" style={{ color: m.color }}>
              {m.val}
            </div>
            <div className="text-[0.6rem] text-[#7a9585] mt-[2px]">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chart Data Types ──────────────────────────────────────────────────────────
type WeeklyDataPoint = {
  day: string;
  label: string;
  Lamaran: number;
  Shortlist: number;
};

type ScoreBucket = {
  range: string;
  min: number;
  max: number;
  count: number;
  color: string;
};

type RadarDataPoint = {
  position: string;
  "Avg Score": number;
  Match: number;
};

type LegendItem = {
  color: string;
  label: string;
};

// ── Weekly Applications Area Chart ───────────────────────────────────────────
function WeeklyApplicationsChart({
  candidates,
}: {
  candidates: CandidateUI[];
}) {
  const data: WeeklyDataPoint[] = useMemo(() => {
    const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 6 + i);
      const dateStr = date.toDateString();
      const dayCandidates = candidates.filter(
        (c) => new Date(c.createdAt).toDateString() === dateStr,
      );
      return {
        day: DAY_LABELS[date.getDay()],
        label: `${DAY_LABELS[date.getDay()]} ${date.getDate()}`,
        Lamaran: dayCandidates.length,
        Shortlist: dayCandidates.filter((c) => c.status === "shortlisted")
          .length,
      };
    });
  }, [candidates]);

  const legends: LegendItem[] = [
    { color: "#10b981", label: "Lamaran Masuk" },
    { color: "#06b6d4", label: "Shortlisted" },
  ];

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-[6px] bg-emerald-500/15 flex items-center justify-center">
          <BarChart2
            size={12}
            className="text-emerald-400"
            aria-hidden="true"
          />
        </div>
        <span className="font-bold text-[0.82rem] text-[#e8f0ec]">
          Tren Aplikasi Mingguan
        </span>
        <span className="ml-auto text-[0.65rem] text-[#7a9585]">
          7 hari terakhir
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="gradLamaran" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradShortlist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#7a9585", fontSize: 10, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#7a9585", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(16,185,129,0.15)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="Lamaran"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradLamaran)"
            dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#10b981" }}
          />
          <Area
            type="monotone"
            dataKey="Shortlist"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#gradShortlist)"
            dot={{ fill: "#06b6d4", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#06b6d4" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2">
        {legends.map((l) => (
          <div
            key={l.label}
            className="flex items-center gap-1 text-[0.62rem] text-[#7a9585]">
            <div
              className="w-[18px] h-[2px] rounded-full"
              style={{ background: l.color }}
              aria-hidden="true"
            />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Score Distribution Bar Chart ──────────────────────────────────────────────
function ScoreDistributionChart({ candidates }: { candidates: CandidateUI[] }) {
  const data: ScoreBucket[] = useMemo(() => {
    const buckets: ScoreBucket[] = [
      { range: "0-20", min: 0, max: 20, count: 0, color: "#ef4444" },
      { range: "21-40", min: 21, max: 40, count: 0, color: "#f97316" },
      { range: "41-60", min: 41, max: 60, count: 0, color: "#f59e0b" },
      { range: "61-80", min: 61, max: 80, count: 0, color: "#06b6d4" },
      { range: "81-100", min: 81, max: 100, count: 0, color: "#10b981" },
    ];
    candidates.forEach((c) => {
      const bucket = buckets.find(
        (b) => c.resumeScore >= b.min && c.resumeScore <= b.max,
      );
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [candidates]);

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-[6px] bg-violet-500/15 flex items-center justify-center">
          <Brain size={12} className="text-violet-400" aria-hidden="true" />
        </div>
        <span className="font-bold text-[0.82rem] text-[#e8f0ec]">
          Distribusi AI Score
        </span>
        <span className="ml-auto text-[0.65rem] text-[#7a9585]">
          all candidates
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
          barCategoryGap="30%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="range"
            tick={{ fill: "#7a9585", fontSize: 10, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#7a9585", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="count" name="Kandidat" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Radar Chart ───────────────────────────────────────────────────────────────
function JobRadarChart({ jobGroups }: { jobGroups: JobGroup[] }) {
  const data: RadarDataPoint[] = useMemo(
    () =>
      jobGroups.slice(0, 6).map((g) => ({
        position: g.title.length > 12 ? g.title.slice(0, 12) + "…" : g.title,
        "Avg Score": g.avgScore,
        Match:
          g.allCandidates.length > 0
            ? Math.round(
                g.allCandidates.reduce((a, c) => a + c.matchScore, 0) /
                  g.allCandidates.length,
              )
            : 0,
      })),
    [jobGroups],
  );

  const legends: LegendItem[] = [
    { color: "#10b981", label: "Avg AI Score" },
    { color: "#8b5cf6", label: "Avg Match" },
  ];

  if (data.length === 0) return null;

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-[6px] bg-amber-500/15 flex items-center justify-center">
          <Target size={12} className="text-amber-400" aria-hidden="true" />
        </div>
        <span className="font-bold text-[0.82rem] text-[#e8f0ec]">
          AI Score vs Match per Posisi
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart
          data={data}
          margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
          <PolarGrid stroke="rgba(255,255,255,0.07)" />
          <PolarAngleAxis
            dataKey="position"
            tick={{ fill: "#7a9585", fontSize: 9, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Avg Score"
            dataKey="Avg Score"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.12}
            strokeWidth={2}
            dot={{ fill: "#10b981", r: 3 }}
          />
          <Radar
            name="Match"
            dataKey="Match"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.1}
            strokeWidth={2}
            dot={{ fill: "#8b5cf6", r: 3 }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-1">
        {legends.map((l) => (
          <div
            key={l.label}
            className="flex items-center gap-1 text-[0.62rem] text-[#7a9585]">
            <div
              className="w-[18px] h-[2px] rounded-full"
              style={{ background: l.color }}
              aria-hidden="true"
            />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Table Header ──────────────────────────────────────────────────────────────
const TABLE_HEADERS = ["Posisi", "Total", "Score"] as const;

// ── Job Ads Table ─────────────────────────────────────────────────────────────
function JobAdsTable({ jobGroups }: { jobGroups: JobGroup[] }) {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/12 rounded-[18px] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-2">
        <div className="w-6 h-6 rounded-[6px] bg-emerald-500/15 flex items-center justify-center">
          <Briefcase
            size={12}
            className="text-emerald-400"
            aria-hidden="true"
          />
        </div>
        <span className="font-bold text-[0.82rem] text-[#e8f0ec]">
          Lowongan Aktif
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black/20">
            {TABLE_HEADERS.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-2 text-left text-[0.62rem] font-bold tracking-widest uppercase text-[#7a9585] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobGroups.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-8 text-center text-[0.75rem] text-[#7a9585]">
                Belum ada lowongan aktif
              </td>
            </tr>
          ) : (
            jobGroups.map((g) => (
              <tr
                key={g.title}
                className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: g.color }}
                      aria-hidden="true"
                    />
                    <span className="text-[0.72rem] font-semibold text-[#e8f0ec] truncate max-w-[110px]">
                      {g.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[0.78rem] font-black text-[#e8f0ec]">
                    {g.allCandidates.length}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-7 h-1 rounded-full bg-white/[0.05] overflow-hidden flex-shrink-0">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${g.avgScore}%`,
                          background: getScoreGradient(g.avgScore),
                        }}
                      />
                    </div>
                    <span
                      className="text-[0.72rem] font-bold"
                      style={{ color: getScoreColor(g.avgScore) }}>
                      {g.avgScore}
                    </span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Analytics Section Props ───────────────────────────────────────────────────
type AnalyticsSectionProps = {
  candidates: CandidateUI[];
  jobGroups: JobGroup[];
  total: number;
  shortlisted: number;
  inReview: number;
  totalInterviews: number;
  totalRejected: number;
  totalHired: number;
};

// ── Analytics Section ─────────────────────────────────────────────────────────
export function AnalyticsSection({
  candidates,
  jobGroups,
  total,
  shortlisted,
  inReview,
  totalInterviews,
  totalRejected,
  totalHired,
}: AnalyticsSectionProps) {
  return (
    <div className="flex flex-col gap-5 min-w-0">
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1.5fr" }}>
        <TotalOverview
          total={total}
          shortlisted={shortlisted}
          inReview={inReview}
          totalInterviews={totalInterviews}
          totalRejected={totalRejected}
          totalHired={totalHired}
        />
        <HiringPipeline
          total={total}
          inReview={inReview}
          shortlisted={shortlisted}
          totalRejected={totalRejected}
        />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <WeeklyApplicationsChart candidates={candidates} />
        <ScoreDistributionChart candidates={candidates} />
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <JobRadarChart jobGroups={jobGroups} />
        <JobAdsTable jobGroups={jobGroups} />
      </div>
    </div>
  );
}
