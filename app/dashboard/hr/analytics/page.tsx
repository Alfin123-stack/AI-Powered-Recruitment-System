"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Star, Briefcase } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { FadeIn, apiFetch, getColor } from "../_components/shared";
import { useDashboard } from "../layout";

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f1612] border border-emerald-500/20 rounded-[10px] px-3 py-2 text-[0.78rem] shadow-xl">
      {label && <div className="text-[#7a9585] mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          <span className="text-[#e8f0ec] font-semibold">
            {p.name}:{" "}
            <span style={{ color: p.color || p.fill }}>{p.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[7px] font-bold text-[0.9rem] mb-5">
      <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 flex-shrink-0" />
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { token } = useDashboard();
  const [apps, setApps] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-[#7a9585] text-[0.85rem]">
            Memuat analytics...
          </span>
        </div>
      </div>
    );

  // ── Computed ──────────────────────────────────────────────────────────────
  const total = apps.length;
  const shortlisted = apps.filter((a) => a.status === "shortlisted").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;
  const review = apps.filter((a) => a.status === "review").length;
  const applied = apps.filter((a) => a.status === "applied").length;
  const avgScore = total
    ? Math.round(apps.reduce((s, a) => s + (a.resume_score || 0), 0) / total)
    : 0;
  const avgMatch = total
    ? Math.round(apps.reduce((s, a) => s + (a.matching_score || 0), 0) / total)
    : 0;
  const conversionRate = total ? Math.round((shortlisted / total) * 100) : 0;
  const activeJobs = jobs.filter((j) => j.is_active).length;

  // Pie chart — status distribution
  const statusData = [
    { name: "Applied", value: applied, color: "#f59e0b" },
    { name: "In Review", value: review, color: "#06b6d4" },
    { name: "Shortlisted", value: shortlisted, color: "#10b981" },
    { name: "Ditolak", value: rejected, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  // Bar chart — applicants per job
  const jobBarData = jobs
    .map((j, i) => ({
      name: j.title?.split(" ").slice(0, 2).join(" ") || "Job",
      fullTitle: j.title,
      Pelamar: apps.filter((a) => a.job_id === j.id).length,
      Shortlisted: apps.filter(
        (a) => a.job_id === j.id && a.status === "shortlisted",
      ).length,
      color: getColor(i),
    }))
    .filter((j) => j.Pelamar > 0)
    .sort((a, b) => b.Pelamar - a.Pelamar)
    .slice(0, 6);

  // Bar chart — score distribution
  const scoreDistData = [
    {
      range: "90–100",
      count: apps.filter((a) => a.resume_score >= 90).length,
      fill: "#10b981",
    },
    {
      range: "70–89",
      count: apps.filter((a) => a.resume_score >= 70 && a.resume_score < 90)
        .length,
      fill: "#06b6d4",
    },
    {
      range: "50–69",
      count: apps.filter((a) => a.resume_score >= 50 && a.resume_score < 70)
        .length,
      fill: "#f59e0b",
    },
    {
      range: "30–49",
      count: apps.filter((a) => a.resume_score >= 30 && a.resume_score < 50)
        .length,
      fill: "#f97316",
    },
    {
      range: "< 30",
      count: apps.filter((a) => a.resume_score > 0 && a.resume_score < 30)
        .length,
      fill: "#ef4444",
    },
  ];

  // Top candidates
  const topCandidates = [...apps]
    .filter((a) => a.resume_score > 0)
    .sort((a, b) => b.resume_score - a.resume_score)
    .slice(0, 5)
    .map((a, i) => ({
      name: (a.candidate_name || "Kandidat").split(" ")[0],
      fullName: a.candidate_name || "Kandidat",
      "CV Score": a.resume_score,
      "Match %": a.matching_score || 0,
      job: a.job_title,
      color: getColor(i),
    }));

  // Radial chart — avg scores
  const radialData = [
    { name: "Avg CV Score", value: avgScore, fill: "#10b981" },
    { name: "Avg Match Score", value: avgMatch, fill: "#8b5cf6" },
    { name: "Conversion Rate", value: conversionRate, fill: "#06b6d4" },
  ];

  const statCards = [
    {
      Icon: Users,
      bg: "rgba(16,185,129,0.12)",
      col: "#10b981",
      num: total,
      label: "Total Pelamar",
      sub: "semua posisi",
    },
    {
      Icon: Star,
      bg: "rgba(245,158,11,0.12)",
      col: "#f59e0b",
      num: shortlisted,
      label: "Shortlisted",
      sub: `${conversionRate}% conversion`,
    },
    {
      Icon: TrendingUp,
      bg: "rgba(6,182,212,0.12)",
      col: "#06b6d4",
      num: avgScore,
      label: "Avg CV Score",
      sub: "dari AI analyzer",
    },
    {
      Icon: Briefcase,
      bg: "rgba(139,92,246,0.12)",
      col: "#8b5cf6",
      num: activeJobs,
      label: "Lowongan Aktif",
      sub: `${jobs.length} total`,
    },
  ];

  const TICK_STYLE = { fill: "#7a9585", fontSize: 11 };
  const GRID_STYLE = { stroke: "rgba(16,185,129,0.08)" };

  const EmptyState = () => (
    <div className="flex items-center justify-center h-[200px] text-[#7a9585] text-[0.82rem]">
      Belum ada data
    </div>
  );

  return (
    <div>
      {/* Stat cards */}
      <FadeIn>
        <div className="grid grid-cols-4 gap-[14px] mb-6">
          {statCards.map(({ Icon, bg, col, num, label, sub }, i) => (
            <div
              key={i}
              className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 transition-all hover:border-emerald-500/35 hover:-translate-y-[2px]">
              <div
                className="w-9 h-9 rounded-[9px] flex items-center justify-center mb-[14px]"
                style={{ background: bg, color: col }}>
                <Icon size={16} />
              </div>
              <div
                className="font-extrabold text-[2rem] leading-none mb-1"
                style={{ color: col }}>
                {num}
              </div>
              <div className="text-[0.75rem] text-[#7a9585] mb-[2px]">
                {label}
              </div>
              <div className="text-[0.68rem] text-emerald-400">{sub}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Row 1: Status pie + Pelamar per posisi */}
      <div
        className="grid gap-5 mb-5"
        style={{ gridTemplateColumns: "1fr 1.4fr" }}>
        <FadeIn delay={0.05}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
            <CardTitle>Distribusi Status</CardTitle>
            {total === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none">
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ color: "#7a9585", fontSize: 11 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.07}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
            <CardTitle>Pelamar per Posisi</CardTitle>
            {jobBarData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={jobBarData} barGap={4}>
                  <CartesianGrid vertical={false} {...GRID_STYLE} />
                  <XAxis
                    dataKey="name"
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(16,185,129,0.04)" }}
                  />
                  <Bar
                    dataKey="Pelamar"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="Shortlisted"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Row 2: Score distribution + Top kandidat */}
      <div
        className="grid gap-5 mb-5"
        style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <FadeIn delay={0.09}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
            <CardTitle>Distribusi CV Score</CardTitle>
            {total === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreDistData} layout="vertical" barSize={16}>
                  <CartesianGrid horizontal={false} {...GRID_STYLE} />
                  <XAxis
                    type="number"
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="range"
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(16,185,129,0.04)" }}
                  />
                  <Bar dataKey="count" name="Kandidat" radius={[0, 4, 4, 0]}>
                    {scoreDistData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.11}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
            <CardTitle>Performa Metrik</CardTitle>
            {total === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={90}
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={6}
                    background={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ color: "#7a9585", fontSize: 11 }}>
                        {value}
                      </span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Row 3: Top kandidat bar chart */}
      {topCandidates.length > 0 && (
        <FadeIn delay={0.13}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5 mb-5">
            <CardTitle>Top Kandidat — CV Score vs Match Score</CardTitle>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCandidates} barGap={6}>
                <CartesianGrid vertical={false} {...GRID_STYLE} />
                <XAxis
                  dataKey="name"
                  tick={TICK_STYLE}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={TICK_STYLE}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(16,185,129,0.04)" }}
                />
                <Bar
                  dataKey="CV Score"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="Match %"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: "#7a9585", fontSize: 11 }}>
                      {value}
                    </span>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </FadeIn>
      )}

      {/* Row 4: Per-job conversion */}
      {jobBarData.length > 0 && (
        <FadeIn delay={0.15}>
          <div className="bg-[#0f1612] border border-emerald-500/15 rounded-[14px] p-5">
            <CardTitle>Conversion Rate per Lowongan</CardTitle>
            <div className="flex flex-col">
              {jobBarData.map((j, i) => {
                const conversion = j.Pelamar
                  ? Math.round((j.Shortlisted / j.Pelamar) * 100)
                  : 0;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 py-[11px] ${i < jobBarData.length - 1 ? "border-b border-emerald-500/15" : ""}`}>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: j.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.85rem] font-semibold truncate">
                        {j.fullTitle}
                      </div>
                      <div className="text-[0.72rem] text-[#7a9585]">
                        {j.Pelamar} pelamar · {j.Shortlisted} shortlisted
                      </div>
                    </div>
                    <div className="w-[140px]">
                      <div className="h-[5px] rounded-full bg-white/[0.05] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${conversion}%` }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full"
                          style={{ background: j.color }}
                        />
                      </div>
                    </div>
                    <span
                      className="text-[0.78rem] font-bold w-[36px] text-right flex-shrink-0"
                      style={{ color: j.color }}>
                      {conversion}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
