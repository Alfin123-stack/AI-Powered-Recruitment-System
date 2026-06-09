"use client";

import { Users, Star, CheckCircle2, Brain, Briefcase } from "lucide-react";
import { T } from "@/constants/hr/analytics";
import { AnalyticsStatCard } from "./AnalyticsStatCard";

interface AnalyticsStatCardsProps {
  total: number;
  shortlisted: number;
  hired: number;
  avgScore: number;
  activeJobs: number;
  totalJobs: number;
  conversionRate: number;
}

export function AnalyticsStatCards({
  total,
  shortlisted,
  hired,
  avgScore,
  activeJobs,
  totalJobs,
  conversionRate,
}: AnalyticsStatCardsProps) {
  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      <AnalyticsStatCard
        icon={Users}
        color={T.emerald}
        bg="rgba(16,185,129,0.12)"
        value={total}
        label="Total Kandidat"
        sub="semua posisi"
        delay={0}
      />
      <AnalyticsStatCard
        icon={Star}
        color={T.amber}
        bg="rgba(245,158,11,0.12)"
        value={shortlisted}
        label="Shortlisted"
        sub={`${conversionRate}% conversion rate`}
        delay={0.05}
      />
      <AnalyticsStatCard
        icon={CheckCircle2}
        color={T.violet}
        bg="rgba(139,92,246,0.12)"
        value={hired}
        label="Hired"
        sub="berhasil diterima"
        delay={0.1}
      />
      <AnalyticsStatCard
        icon={Brain}
        color={T.cyan}
        bg="rgba(6,182,212,0.12)"
        value={avgScore}
        label="Avg CV Score"
        sub="dari AI analyzer"
        delay={0.15}
      />
      <AnalyticsStatCard
        icon={Briefcase}
        color={T.orange}
        bg="rgba(249,115,22,0.12)"
        value={activeJobs}
        label="Posisi Aktif"
        sub={`${totalJobs} total lowongan`}
        delay={0.2}
      />
    </div>
  );
}
