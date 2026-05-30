"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const  apiFetch = async (
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
export type CandidateUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
};

export type Application = {
  id: string;
  status: string;
  created_at: string;
  cv_url: string | null;
  job_title: string;
  company_name: string;
  resume_score: number;
  matching_score: number;
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
export const getColor = (i: number) => COLORS[i % COLORS.length];

export const statusMap: Record<string, { label: string; color: string }> = {
  applied: { label: "Dikirim", color: "#f59e0b" },
  review: { label: "Direview", color: "#06b6d4" },
  shortlisted: { label: "Shortlisted", color: "#10b981" },
  rejected: { label: "Ditolak", color: "#ef4444" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
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

export function SideTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[7px] font-bold text-[0.88rem] mb-[14px]">
      <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 flex-shrink-0" />
      {children}
    </div>
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

// ── Score Ring ────────────────────────────────────────────────────────────────
export function ScoreRing({
  score,
  size = 72,
  color = "#10b981",
}: {
  score: number;
  size?: number;
  color?: string;
}) {
  const r = size / 2 - 7;
  const circ = 2 * Math.PI * r;
  const dash = (circ * score) / 100;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={7}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{
            transform: `rotate(-90deg)`,
            transformOrigin: `${size / 2}px ${size / 2}px`,
            transition: "stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-extrabold"
        style={{ fontSize: size > 80 ? "1.3rem" : "1rem", color }}>
        {score}
      </div>
    </div>
  );
}

export const inputCls =
  "w-full bg-[#141f19] border border-emerald-500/15 rounded-[10px] px-4 py-[10px] text-[0.88rem] text-[#e8f0ec] placeholder:text-[#7a9585] outline-none focus:border-emerald-500/40 transition-colors";
