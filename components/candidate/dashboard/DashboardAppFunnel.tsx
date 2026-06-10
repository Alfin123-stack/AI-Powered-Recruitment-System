"use client";

import { Activity } from "lucide-react";
import type { Application } from "@/types/candidate-dashboard";
import { STATUS_MAP } from "@/constants/candidate/dashboard";
export function DashboardAppFunnel({
  applications,
}: {
  applications: Application[];
}) {
  const statusOrder = ["applied", "review", "shortlisted", "rejected"];

  const counts = statusOrder.map((s) => ({
    key: s,
    label: STATUS_MAP[s]?.label || s,
    count: applications.filter((a) => a.status === s).length,
    color: STATUS_MAP[s]?.color || "#7a9585",
  }));

  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/15 rounded-[14px] p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={13} className="text-emerald-400" />
        <span className="text-[0.78rem] font-bold text-[#e8f0ec]">
          Funnel Lamaran
        </span>
      </div>
      <div className="space-y-2">
        {counts.map((item) => (
          <div key={item.key} className="flex items-center gap-3">
            <span className="text-[0.68rem] text-[#7a9585] w-[72px] shrink-0">
              {item.label}
            </span>
            <div className="flex-1 h-[6px] rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-[1.2s]"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  background: item.color,
                }}
              />
            </div>
            <span
              className="text-[0.72rem] font-bold w-4 text-right"
              style={{ color: item.color }}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
