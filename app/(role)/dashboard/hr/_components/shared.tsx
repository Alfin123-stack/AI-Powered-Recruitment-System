"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Info } from "lucide-react";
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

export type Application = {
  id: string;
  candidate_name?: string;
  job_title?: string;
  job_id: string;

  resume_score?: number;
  matching_score?: number;

  extracted_skills?: Array<
    | string
    | {
        name?: string;
      }
  >;

  status: string;
  created_at: string;

  cv_url?: string | null;
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

// ── inputCls ──────────────────────────────────────────────────────────────────
export const inputCls =
  "w-full bg-[#0a120d] border border-emerald-500/20 rounded-[10px] px-3 py-[10px] text-[0.85rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all";

export const inputErrorCls =
  "w-full bg-[#0a120d] border border-red-500/50 rounded-[10px] px-3 py-[10px] text-[0.85rem] text-[#e8f0ec] placeholder:text-[#3d5c49] focus:outline-none focus:border-red-500/70 focus:ring-2 focus:ring-red-500/10 transition-all";
// ── Field ─────────────────────────────────────────────────────────────────────
export function Field({
  label,
  children,
  error,
  hint,
  icon,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="flex items-center gap-[6px] text-[0.72rem] font-semibold text-[#7a9585] tracking-[0.07em] uppercase">
        {icon && <span className="opacity-70 flex items-center">{icon}</span>}
        {label}
        {required && (
          <span className="text-red-400 text-[0.75rem] leading-none">*</span>
        )}
      </label>

      <div className="relative">{children}</div>

      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-[5px] text-[0.73rem] text-red-400 font-medium">
            <AlertCircle size={11} className="flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {!error && hint && (
        <div className="flex items-center gap-[5px] text-[0.72rem] text-[#4d7060]">
          <Info size={10} className="flex-shrink-0" />
          {hint}
        </div>
      )}
    </div>
  );
}

// ── ModalShell ────────────────────────────────────────────────────────────────
export function ModalShell({
  title,
  subtitle,
  onClose,
  maxWidth = "max-w-[640px]",
  zIndex = "z-[100]",
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  maxWidth?: string;
  zIndex?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-black/75 backdrop-blur-[6px] p-4`}>
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className={`relative bg-[#0d1810] border border-emerald-500/20 rounded-[22px] w-full ${maxWidth} max-h-[92vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]`}
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(16,185,129,0.04) 0%, transparent 60%)",
        }}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-[11px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h2 className="font-syne font-extrabold text-[1.05rem] text-[#e8f0ec]">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[#5a8070] text-[0.76rem] mt-[2px]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="w-9 h-9 rounded-[9px] bg-[#111a14] border border-emerald-500/15 flex items-center justify-center text-[#5a8070] hover:text-[#e8f0ec] hover:border-emerald-500/35 hover:bg-[#1a2d1f] transition-all cursor-pointer">
            <X size={14} />
          </button>
        </div>

        <div className="px-7 py-6 flex flex-col gap-5">{children}</div>
      </motion.div>
    </div>
  );
}
