"use client";

import { Inbox } from "lucide-react";
import { T } from "@/constants/hr/analytics";

interface AnalyticsEmptyStateProps {
  h?: number;
}

export function AnalyticsEmptyState({ h = 200 }: AnalyticsEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2"
      style={{ height: h }}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "rgba(16,185,129,0.08)" }}>
        <Inbox size={16} style={{ color: T.textSecondary }} />
      </div>
      <div className="text-[0.78rem]" style={{ color: T.textSecondary }}>
        Belum ada data
      </div>
    </div>
  );
}
