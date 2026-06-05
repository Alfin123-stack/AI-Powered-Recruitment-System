"use client";

import { useState, useEffect } from "react";

import FullCalendar from "./FullCalendar";
import { Interview } from "./types";
import { useDashboard } from "@/context/DashboardContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CalendarClient() {
  const { token } = useDashboard();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/api/interviews/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setInterviews(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
        <div className="bg-[#070d0a] border border-emerald-500/12 rounded-[20px] p-5">
          <div className="flex items-center justify-center h-64">
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <div className="space-y-4">
          {[80, 120, 80].map((h, i) => (
            <div
              key={i}
              className="animate-pulse rounded-[16px] bg-emerald-500/[0.04] border border-emerald-500/8"
              style={{ height: h }}
            />
          ))}
        </div>
      </div>
    );
  }

  return <FullCalendar interviews={interviews} />;
}
