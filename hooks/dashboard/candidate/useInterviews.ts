"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { Interview } from "@/types/candidate-dashboard";


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useInterviews() {
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

  return { interviews, loading };
}
