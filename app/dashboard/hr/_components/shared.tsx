"use client";

import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client (hanya auth) ──────────────────────────────────────────────
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

// ── API base URL ──────────────────────────────────────────────────────────────
export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── apiFetch helper ───────────────────────────────────────────────────────────
export const apiFetch = async (
  path: string,
  token: string,
  options: RequestInit = {},
) => {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Request gagal");
  }
  return res.json();
};

// ── Types ─────────────────────────────────────────────────────────────────────
export type Company = {
  id: string;
  name: string;
  description: string;
  company_size: string;
};

export type Candidate = {
  id: string;
  name: string;
  avatar: string;
  job: string;
  jobId: string;
  resumeScore: number;
  matchScore: number;
  skills: string[];
  status: string;
  appliedDate: string;
  color: string;
  cv_url: string | null;
};

export type JobSummary = {
  title: string;
  applicants: number;
  shortlisted: number;
  color: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  type: string;
  skills: string[];
  benefits: string[];
  deadline: string | null;
  is_active: boolean;
  created_at: string;
};

export type JobForm = {
  title: string;
  description: string;
  requirements: string;
  salary: string;
  location: string;
  type: string;
  skills: string;
  benefits: string;
  deadline: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────
export const COLORS = [
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export const EMPTY_FORM: JobForm = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  type: "Full-time",
  skills: "",
  benefits: "",
  deadline: "",
};

export const statusMap: Record<string, { label: string; color: string }> = {
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  applied: { label: "Applied", color: "#f59e0b" },
  review: { label: "In Review", color: "#06b6d4" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};

export const rankColors = ["#f59e0b", "#94a3b8", "#cd7f32"];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getColor = (i: number) => COLORS[i % COLORS.length];

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Primitive components ──────────────────────────────────────────────────────
export function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[7px] font-bold text-[0.9rem] mb-4">
      <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 flex-shrink-0" />
      {children}
    </div>
  );
}

export function IconButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[34px] h-[34px] rounded-[8px] bg-[#0f1612] border border-emerald-500/15 flex items-center justify-center text-[#7a9585] cursor-pointer transition-all hover:border-emerald-500/35 hover:text-[#e8f0ec]">
      {children}
    </button>
  );
}

export const inputCls =
  "w-full bg-[#141f19] border border-emerald-500/15 rounded-[10px] px-4 py-[10px] text-[0.88rem] text-[#e8f0ec] placeholder:text-[#7a9585] outline-none focus:border-emerald-500/40 transition-colors";
