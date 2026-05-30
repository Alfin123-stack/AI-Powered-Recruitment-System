"use client";

import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Building2,
  X,
  FileText,
  Clock,
  ExternalLink,
  Target,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Briefcase,
  BarChart2,
  Inbox,
  Brain,
  TrendingUp,
  Award,
  AlertTriangle,
  Video,
  MapPin,
  ArrowRight,
  Plus,
  ChevronRight,
  PieChart,
} from "lucide-react";
import {
  FadeIn,
  apiFetch,
  getColor,
  getInitials,
  statusMap,
  rankColors,
  Candidate,
  Application,
} from "./_components/shared";
import Link from "next/link";
import { useDashboard } from "../../layout";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Interview = {
  id: string;
  application_id: string;
  scheduled_at: string;
  duration_minutes?: number;
  type: "online" | "onsite";
  location: string | null;
  notes: string | null;
  status: "scheduled" | "done" | "cancelled" | "overdue";
  round?: string;
  created_at: string;
  candidate_name: string;
  candidate_id?: string;
  job_title: string;
  interviewer_name?: string;
  interviewer_avatar?: string;
};

interface JobGroup {
  title: string;
  color: string;
  candidates: Candidate[];
  allCandidates: Candidate[];
  shortlisted: number;
  avgScore: number;
}

interface CandidateInsight {
  strengths: string[];
  weaknesses: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const JOB_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

const interviewStatusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  scheduled: {
    label: "Scheduled",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.10)",
    border: "rgba(99,102,241,0.28)",
  },
  done: {
    label: "Selesai",
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.28)",
  },
  overdue: {
    label: "Overdue",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.28)",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.28)",
  },
};

const roundConfig: Record<string, { color: string; bg: string }> = {
  "First Interview": { color: "#06b6d4", bg: "rgba(6,182,212,0.08)" },
  "Second Interview": { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  "Final Interview": { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getScoreColor(s: number) {
  if (s >= 80) return "#10b981";
  if (s >= 65) return "#06b6d4";
  if (s >= 50) return "#f59e0b";
  return "#f43f5e";
}

function getScoreGradient(s: number) {
  if (s >= 80) return "linear-gradient(90deg,#10b981,#06b6d4)";
  if (s >= 65) return "linear-gradient(90deg,#06b6d4,#6366f1)";
  if (s >= 50) return "linear-gradient(90deg,#f59e0b,#f97316)";
  return "linear-gradient(90deg,#f43f5e,#f97316)";
}

function getRec(score: number, match: number) {
  const avg = (score + match) / 2;
  if (avg >= 80)
    return {
      label: "Direkomendasikan",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.22)",
      Icon: CheckCircle2,
    };
  if (avg >= 60)
    return {
      label: "Perlu Review",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.22)",
      Icon: AlertCircle,
    };
  return {
    label: "Kurang Sesuai",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.2)",
    Icon: XCircle,
  };
}

function computeInsight(c: Candidate): CandidateInsight {
  const strengths: string[] = [];
  if (c.resumeScore >= 80) strengths.push("Resume kuat & terstruktur");
  if (c.matchScore >= 80)
    strengths.push("Match tinggi dengan kebutuhan posisi");
  if (c.skills.length >= 4)
    strengths.push(`${c.skills.length} skill relevan terdeteksi`);
  if (c.resumeScore >= 70 && c.matchScore >= 70)
    strengths.push("Konsistensi skor AI & match");
  if (strengths.length === 0)
    strengths.push("Memiliki pengalaman di bidang terkait");

  const weaknesses: string[] = [];
  if (c.matchScore < 50) weaknesses.push("Match score rendah dengan JD");
  if (c.resumeScore < 60) weaknesses.push("Resume perlu diperkuat");
  if (c.skills.length < 2) weaknesses.push("Skill terdeteksi terbatas");
  if (Math.abs(c.resumeScore - c.matchScore) > 30)
    weaknesses.push("Ketidaksesuaian skor AI vs match");
  if (weaknesses.length === 0)
    weaknesses.push("Belum ada data kelemahan signifikan");

  return { strengths, weaknesses };
}

function generateInsights(
  candidates: Candidate[],
): { icon: string; color: string; bg: string; border: string; text: string }[] {
  if (candidates.length === 0) return [];
  const insights = [];
  const topReady = candidates.filter(
    (c) =>
      c.resumeScore >= 80 && c.matchScore >= 75 && c.status !== "shortlisted",
  );
  if (topReady.length > 0) {
    insights.push({
      icon: "🎯",
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      text: `${topReady.length} kandidat memiliki skor tinggi (AI ≥80, Match ≥75) namun belum di-shortlist — segera tinjau.`,
    });
  }
  const pending = candidates.filter((c) => c.status === "applied");
  if (pending.length > 0) {
    const avgPending = Math.round(
      pending.reduce((a, c) => a + c.resumeScore, 0) / pending.length,
    );
    insights.push({
      icon: "⏳",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      text: `${pending.length} lamaran masih Applied dengan rata-rata skor ${avgPending}. Proses lebih cepat untuk meningkatkan candidate experience.`,
    });
  }
  const highMatch = candidates.filter((c) => c.matchScore >= 85);
  if (highMatch.length > 0) {
    insights.push({
      icon: "✨",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.2)",
      text: `${highMatch.length} kandidat punya match score ≥85% — sangat sesuai deskripsi pekerjaan, direkomendasikan untuk interview.`,
    });
  }
  return insights.slice(0, 3);
}

const isToday = (d: string) =>
  new Date(d).toDateString() === new Date().toDateString();

const isTomorrow = (d: string) => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return new Date(d).toDateString() === t.toDateString();
};

const formatInterviewTime = (d: string, durationMinutes = 60) => {
  const start = new Date(d);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const fmt = (dt: Date) =>
    dt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  return `${fmt(start)} – ${fmt(end)}`;
};

const formatInterviewDate = (d: string) => {
  if (isToday(d)) return "Hari Ini";
  if (isTomorrow(d)) return "Besok";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// SPARKLINE
// ─────────────────────────────────────────────────────────────────────────────
function Sparkline({
  data,
  color,
  width = 80,
  height = 28,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || data.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    const min = Math.min(...data),
      max = Math.max(...data);
    const range = max - min || 1;
    const pad = 3;
    const xs = data.map(
      (_, i) => pad + (i / (data.length - 1)) * (width - pad * 2),
    );
    const ys = data.map(
      (v) => height - pad - ((v - min) / range) * (height - pad * 2),
    );
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, color + "40");
    grad.addColorStop(1, color + "00");
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
      const mx = (xs[i - 1] + xs[i]) / 2;
      ctx.bezierCurveTo(mx, ys[i - 1], mx, ys[i], xs[i], ys[i]);
    }
    ctx.lineTo(xs[xs.length - 1], height);
    ctx.lineTo(xs[0], height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
      const mx = (xs[i - 1] + xs[i]) / 2;
      ctx.bezierCurveTo(mx, ys[i - 1], mx, ys[i], xs[i], ys[i]);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(xs[xs.length - 1], ys[ys.length - 1], 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [data, color, width, height]);
  return <canvas ref={ref} style={{ display: "block" }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// DONUT CHART (Overview)
// ─────────────────────────────────────────────────────────────────────────────
function DonutChart({
  segments,
  size = 120,
  centerLabel,
  centerSub,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;

  const cx = size / 2;
  const cy = size / 2;

  const r = size / 2 - 10;
  const ri = r - 14;

  const result = segments.reduce(
    (acc, seg) => {
      const startAngle = acc.angle;

      const portion = seg.value / total;
      const sweep = portion * 2 * Math.PI;

      const endAngle = startAngle + sweep;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);

      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const xi1 = cx + ri * Math.cos(startAngle);
      const yi1 = cy + ri * Math.sin(startAngle);

      const xi2 = cx + ri * Math.cos(endAngle);
      const yi2 = cy + ri * Math.sin(endAngle);

      const large = sweep > Math.PI ? 1 : 0;

      const d = `
      M ${x1} ${y1}
      A ${r} ${r} 0 ${large} 1 ${x2} ${y2}
      L ${xi2} ${yi2}
      A ${ri} ${ri} 0 ${large} 0 ${xi1} ${yi1}
      Z
    `;

      acc.paths.push({
        d,
        color: seg.color,
        label: seg.label,
        value: seg.value,
      });

      acc.angle = endAngle;

      return acc;
    },
    {
      angle: -Math.PI / 2,
      paths: [] as {
        d: string;
        color: string;
        label: string;
        value: number;
      }[],
    },
  );

  const paths = result.paths;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity={0.85} />
      ))}
      <circle cx={cx} cy={cy} r={ri - 2} fill="#0f1612" />
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
              y={cy + 12}
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

// ─────────────────────────────────────────────────────────────────────────────
// TREND CHART
// ─────────────────────────────────────────────────────────────────────────────
function TrendChart({ candidates }: { candidates: Candidate[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const weeks = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (7 - i) * 7);
      return {
        label: d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        count: 0,
        avgScore: 0,
        scores: [] as number[],
      };
    });
  }, []);

  const buckets = useMemo(() => {
    const bkts = weeks.map((w) => ({ ...w, scores: [] as number[] }));
    candidates.forEach((c, i) => {
      const bi = Math.min(
        7,
        Math.floor(i / Math.max(1, Math.ceil(candidates.length / 8))),
      );
      bkts[bi].scores.push(c.resumeScore);
      bkts[bi].count++;
    });
    return bkts.map((b) => ({
      ...b,
      avgScore: b.scores.length
        ? Math.round(b.scores.reduce((a, s) => a + s, 0) / b.scores.length)
        : 0,
    }));
  }, [candidates, weeks]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 500;
    const H = 130;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    const padL = 36,
      padR = 16,
      padT = 12,
      padB = 28;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const n = buckets.length;
    for (let g = 0; g <= 4; g++) {
      const y = padT + (chartH / 4) * g;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    const xs = buckets.map((_, i) => padL + (i / (n - 1)) * chartW);
    const maxCount = Math.max(...buckets.map((b) => b.count), 1);
    buckets.forEach((b, i) => {
      const bw = Math.max(4, chartW / n - 8);
      const bh = (b.count / maxCount) * chartH;
      const bx = xs[i] - bw / 2;
      const by = padT + chartH - bh;
      ctx.fillStyle = "rgba(16,185,129,0.12)";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 3);
      else ctx.rect(bx, by, bw, bh);
      ctx.fill();
      if (b.count > 0) {
        ctx.fillStyle = "#10b981";
        ctx.font = `bold ${(10 * dpr) / dpr}px system-ui`;
        ctx.textAlign = "center";
        ctx.fillText(String(b.count), xs[i], by - 3);
      }
    });
    const maxScore = 100;
    const scoreYs = buckets.map((b) =>
      b.avgScore > 0 ? padT + chartH - (b.avgScore / maxScore) * chartH : null,
    );
    const activePoints = scoreYs
      .map((y, i) => (y !== null ? { x: xs[i], y } : null))
      .filter(Boolean) as { x: number; y: number }[];
    if (activePoints.length >= 2) {
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, "#8b5cf6");
      grad.addColorStop(1, "#06b6d4");
      ctx.beginPath();
      ctx.moveTo(activePoints[0].x, activePoints[0].y);
      for (let i = 1; i < activePoints.length; i++) {
        const mx = (activePoints[i - 1].x + activePoints[i].x) / 2;
        ctx.bezierCurveTo(
          mx,
          activePoints[i - 1].y,
          mx,
          activePoints[i].y,
          activePoints[i].x,
          activePoints[i].y,
        );
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();
      activePoints.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#8b5cf6";
        ctx.fill();
      });
    }
    ctx.fillStyle = "rgba(122,149,133,0.8)";
    ctx.font = `${(9 * dpr) / dpr}px system-ui`;
    ctx.textAlign = "center";
    buckets.forEach((b, i) => {
      if (i % 2 === 0) ctx.fillText(b.label, xs[i], H - 6);
    });
    ctx.font = `bold ${(9 * dpr) / dpr}px system-ui`;
    ctx.fillStyle = "#10b981";
    ctx.textAlign = "left";
    ctx.fillText("█ Pelamar", padL, 10);
    ctx.fillStyle = "#8b5cf6";
    ctx.fillText("● Avg Score", padL + 65, 10);
  }, [buckets]);

  return (
    <canvas
      ref={ref}
      style={{ width: "100%", display: "block" }}
      aria-label="Trend chart pelamar dan skor"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI INSIGHT BANNER
// ─────────────────────────────────────────────────────────────────────────────
function AIInsightBanner({ candidates }: { candidates: Candidate[] }) {
  const insights = useMemo(() => generateInsights(candidates), [candidates]);
  if (insights.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[14px] p-4 mb-5"
      style={{
        background:
          "linear-gradient(135deg,rgba(139,92,246,0.07),rgba(16,185,129,0.05))",
        border: "1px solid rgba(139,92,246,0.18)",
      }}>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.25)",
          }}>
          <Brain size={14} className="text-violet-400" />
        </div>
        <span className="font-bold text-[13px] text-violet-300">
          AI Recommendations
        </span>
        <span
          className="text-[10px] px-2 py-[2px] rounded-full font-semibold ml-1"
          style={{
            background: "rgba(139,92,246,0.12)",
            color: "#a78bfa",
            border: "1px solid rgba(139,92,246,0.2)",
          }}>
          {insights.length} insights
        </span>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${insights.length}, 1fr)` }}>
        {insights.map((ins, i) => (
          <div
            key={i}
            className="rounded-[10px] p-3 flex gap-2 items-start"
            style={{ background: ins.bg, border: `1px solid ${ins.border}` }}>
            <span className="text-[14px] flex-shrink-0 mt-[1px]">
              {ins.icon}
            </span>
            <p
              className="text-[11.5px] leading-[1.6]"
              style={{ color: ins.color }}>
              {ins.text}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE CANDIDATE INSIGHT ROW (tanpa prediksi)
// ─────────────────────────────────────────────────────────────────────────────
function CandidateInsightRow({ candidate }: { candidate: Candidate }) {
  const ins = useMemo(() => computeInsight(candidate), [candidate]);
  return (
    <div className="flex gap-3 flex-wrap" style={{ padding: "4px 0 8px" }}>
      <div
        className="flex items-start gap-2 rounded-[8px] px-3 py-2 flex-1"
        style={{
          background: "rgba(16,185,129,0.05)",
          border: "1px solid rgba(16,185,129,0.1)",
        }}>
        <CheckCircle2
          size={11}
          className="text-emerald-400 flex-shrink-0 mt-[2px]"
        />
        <div>
          <div className="text-[9.5px] font-bold text-emerald-400 uppercase tracking-wider mb-[3px]">
            Kekuatan
          </div>
          <div className="flex flex-wrap gap-[4px]">
            {ins.strengths.slice(0, 2).map((s, i) => (
              <span key={i} className="text-[10.5px] text-emerald-300">
                {s}
                {i < Math.min(ins.strengths.length, 2) - 1 ? " ·" : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className="flex items-start gap-2 rounded-[8px] px-3 py-2 flex-1"
        style={{
          background: "rgba(244,63,94,0.05)",
          border: "1px solid rgba(244,63,94,0.1)",
        }}>
        <AlertTriangle
          size={11}
          className="text-rose-400 flex-shrink-0 mt-[2px]"
        />
        <div>
          <div className="text-[9.5px] font-bold text-rose-400 uppercase tracking-wider mb-[3px]">
            Perhatian
          </div>
          <div className="flex flex-wrap gap-[4px]">
            {ins.weaknesses.slice(0, 2).map((w, i) => (
              <span key={i} className="text-[10.5px] text-rose-300">
                {w}
                {i < Math.min(ins.weaknesses.length, 2) - 1 ? " ·" : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE DETAIL MODAL (tanpa prediksi)
// ─────────────────────────────────────────────────────────────────────────────
function CandidateModal({
  candidate,
  onClose,
  onStatusChange,
}: {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const st = statusMap[candidate.status] ?? {
    label: candidate.status,
    color: "#7a9585",
  };
  const rec = getRec(candidate.resumeScore, candidate.matchScore);
  const RecIcon = rec.Icon;
  const ins = useMemo(() => computeInsight(candidate), [candidate]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-[520px] max-h-[92vh] overflow-y-auto rounded-[20px]"
        style={{
          background: "#0f1612",
          border: "1px solid rgba(16,185,129,0.2)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}>
        <div
          className="h-[3px] w-full rounded-t-[20px]"
          style={{
            background: `linear-gradient(90deg,${st.color},transparent)`,
          }}
        />
        <div
          className="flex items-start justify-between px-6 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center font-extrabold text-[0.9rem] flex-shrink-0"
              style={{
                background: `${candidate.color}18`,
                color: candidate.color,
              }}>
              {candidate.avatar}
            </div>
            <div>
              <div className="font-bold text-[#e8f0ec] text-[15px]">
                {candidate.name}
              </div>
              <div className="text-[12px] text-[#7a9585] mt-[2px]">
                {candidate.job}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-full text-[11px] font-bold"
                  style={{
                    background: `${st.color}15`,
                    color: st.color,
                    border: `1px solid ${st.color}30`,
                  }}>
                  <span
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: st.color }}
                  />
                  {st.label}
                </span>
                <span
                  className="inline-flex items-center gap-[5px] px-2 py-[3px] rounded-full text-[11px] font-bold"
                  style={{
                    background: rec.bg,
                    color: rec.color,
                    border: `1px solid ${rec.border}`,
                  }}>
                  <RecIcon size={10} /> {rec.label}
                </span>
              </div>
            </div>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="
    w-8
    h-8
    rounded-[8px]
    flex
    items-center
    justify-center
    bg-[#141f19]
    border
    border-emerald-500/15
    text-[#7a9585]
    hover:text-[#e8f0ec]
    hover:border-emerald-500/30
    transition-colors
  ">
            <X size={13} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "AI Score", val: candidate.resumeScore, suffix: "/100" },
              { label: "Match Score", val: candidate.matchScore, suffix: "%" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-[12px] p-4"
                style={{
                  background: "#141f19",
                  border: "1px solid rgba(16,185,129,0.12)",
                }}>
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#7a9585] mb-2">
                  {s.label}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className="font-extrabold text-[2rem] leading-none"
                    style={{ color: getScoreColor(s.val) }}>
                    {s.val || "—"}
                  </span>
                  <span className="text-[11px] text-[#7a9585] mb-1">
                    {s.suffix}
                  </span>
                </div>
                <div
                  className="h-[4px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.val}%` }}
                    transition={{ duration: 0.9 }}
                    className="h-full rounded-full"
                    style={{ background: getScoreGradient(s.val) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis — hanya kekuatan & perhatian, tanpa prediksi */}
          <div
            className="rounded-[12px] p-4 space-y-3"
            style={{
              background:
                "linear-gradient(135deg,rgba(139,92,246,0.07),rgba(16,185,129,0.04))",
              border: "1px solid rgba(139,92,246,0.18)",
            }}>
            <div className="flex items-center gap-2">
              <Brain size={13} className="text-violet-400" />
              <span className="text-[11px] font-bold text-violet-300">
                AI Analysis
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded-[8px] p-3"
                style={{
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.12)",
                }}>
                <div className="text-[9.5px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle2 size={9} /> Kekuatan
                </div>
                {ins.strengths.slice(0, 3).map((s, i) => (
                  <div
                    key={i}
                    className="text-[11px] text-emerald-300 mb-[3px] flex items-start gap-1">
                    <span className="mt-[4px] w-[4px] h-[4px] rounded-full bg-emerald-500 flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
              <div
                className="rounded-[8px] p-3"
                style={{
                  background: "rgba(244,63,94,0.05)",
                  border: "1px solid rgba(244,63,94,0.12)",
                }}>
                <div className="text-[9.5px] font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle size={9} /> Perhatian
                </div>
                {ins.weaknesses.slice(0, 3).map((w, i) => (
                  <div
                    key={i}
                    className="text-[11px] text-rose-300 mb-[3px] flex items-start gap-1">
                    <span className="mt-[4px] w-[4px] h-[4px] rounded-full bg-rose-500 flex-shrink-0" />
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {candidate.skills.length > 0 && (
            <div>
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#7a9585] mb-2">
                Skills Terdeteksi
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {candidate.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-[9px] py-[4px] rounded-[6px] text-[12px] font-mono text-[#e8f0ec]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="rounded-[12px] p-3 space-y-2"
            style={{
              background: "#141f19",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            <div className="flex items-center gap-2 text-[12px] text-[#7a9585]">
              <Building2 size={12} className="flex-shrink-0" /> {candidate.job}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#7a9585]">
              <Clock size={12} className="flex-shrink-0" /> Dilamar{" "}
              {candidate.appliedDate}
            </div>
          </div>

          {candidate.cv_url ? (
            <a
              href={candidate.cv_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between w-full px-4 py-[10px] rounded-[10px] text-[13px] font-semibold no-underline"
              style={{
                background: "#141f19",
                border: "1px solid rgba(16,185,129,0.15)",
                color: "#10b981",
              }}>
              <div className="flex items-center gap-2">
                <FileText size={14} /> Lihat CV Kandidat
              </div>
              <ExternalLink size={12} />
            </a>
          ) : (
            <div
              className="flex items-center justify-center gap-2 w-full py-[10px] rounded-[10px] text-[13px] text-[#7a9585]"
              style={{
                background: "#141f19",
                border: "1px solid rgba(16,185,129,0.1)",
              }}>
              <FileText size={14} /> CV tidak tersedia
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Shortlist",
                status: "shortlisted",
                Icon: ThumbsUp,
                color: "#10b981",
                bg: "rgba(16,185,129,0.08)",
                border: "rgba(16,185,129,0.22)",
              },
              {
                label: "Review",
                status: "review",
                Icon: Eye,
                color: "#06b6d4",
                bg: "rgba(6,182,212,0.07)",
                border: "rgba(6,182,212,0.2)",
              },
              {
                label: "Tolak",
                status: "rejected",
                Icon: ThumbsDown,
                color: "#f43f5e",
                bg: "rgba(244,63,94,0.07)",
                border: "rgba(244,63,94,0.2)",
              },
            ].map(({ label, status, Icon, color, bg, border }) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(candidate.id, status);
                  onClose();
                }}
                disabled={candidate.status === status}
                className="flex items-center justify-center gap-[6px] py-[9px] rounded-[10px] font-bold text-[13px] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: bg,
                  color,
                  border: `1px solid ${border}`,
                }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOB ADS TABLE (referensi: "Your Job Ads" section)
// ─────────────────────────────────────────────────────────────────────────────
function JobAdsTable({ jobGroups }: { jobGroups: JobGroup[] }) {
  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{
        background: "#0f1612",
        border: "1px solid rgba(16,185,129,0.12)",
      }}>
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
        <div className="font-bold text-[13px] text-[#e8f0ec] flex items-center gap-2">
          <Briefcase size={13} className="text-emerald-400" /> Job Ads Aktif
        </div>
        <Link href="/dashboard/hr/jobs">
          <button
            className="flex items-center gap-[5px] text-[11px] font-semibold text-emerald-400 px-3 py-[5px] rounded-[7px]"
            style={{
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.15)",
            }}>
            <Plus size={11} /> Buat Job Ad
          </button>
        </Link>
      </div>
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(0,0,0,0.15)" }}>
            {["Posisi", "Baru", "Menunggu", "Total"].map((h) => (
              <th
                key={h}
                className="px-5 py-[8px] text-left text-[10px] font-bold tracking-[0.07em] uppercase"
                style={{ color: "#7a9585" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobGroups.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-5 py-8 text-center text-[12px] text-[#7a9585]">
                Belum ada job aktif
              </td>
            </tr>
          ) : (
            jobGroups.map((g, i) => {
              const applied = g.allCandidates.filter(
                (c) => c.status === "applied",
              ).length;
              const review = g.allCandidates.filter(
                (c) => c.status === "review",
              ).length;
              return (
                <tr
                  key={g.title}
                  className="transition-colors hover:bg-emerald-500/[0.02]"
                  style={{ borderTop: "1px solid rgba(16,185,129,0.06)" }}>
                  <td className="px-5 py-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                        style={{ background: g.color }}
                      />
                      <span className="text-[12.5px] font-semibold text-[#e8f0ec]">
                        {g.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-[11px]">
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: "#10b981" }}>
                      {applied}
                    </span>
                  </td>
                  <td className="px-5 py-[11px]">
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: "#f59e0b" }}>
                      {review}
                    </span>
                  </td>
                  <td className="px-5 py-[11px]">
                    <span className="text-[13px] font-bold text-[#e8f0ec]">
                      {g.allCandidates.length}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP CANDIDATES STRIP (referensi: "Top 5 candidate")
// ─────────────────────────────────────────────────────────────────────────────
function TopCandidatesStrip({
  candidates,
  onView,
}: {
  candidates: Candidate[];
  onView: (c: Candidate) => void;
}) {
  const top5 = useMemo(
    () =>
      [...candidates].sort((a, b) => b.resumeScore - a.resumeScore).slice(0, 5),
    [candidates],
  );

  if (top5.length === 0) return null;

  return (
    <div
      className="rounded-[14px] p-5"
      style={{
        background: "#0f1612",
        border: "1px solid rgba(16,185,129,0.12)",
      }}>
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-[13px] text-[#e8f0ec] flex items-center gap-2">
          <Award size={13} className="text-amber-400" /> Top 5 Kandidat
          <span className="text-[10px] text-[#7a9585] font-normal">
            · by AI Score
          </span>
        </div>
        <Link href="/dashboard/hr/candidates">
          <button
            className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-400 px-2 py-[4px] rounded-[6px]"
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            Lihat Semua <ArrowRight size={10} />
          </button>
        </Link>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}>
        {top5.map((c, i) => {
          const rec = getRec(c.resumeScore, c.matchScore);
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onView(c)}
              className="flex flex-col items-center gap-2 rounded-[12px] p-4 transition-all flex-shrink-0 text-left"
              style={{
                background: "#141f19",
                border: "1px solid rgba(16,185,129,0.1)",
                width: 140,
                minWidth: 140,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(16,185,129,0.1)")
              }>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-[13px] ring-2"
                style={{
                  backgroundColor: `${c.color}20`,
                  color: c.color,
                  borderColor: c.color,
                }}>
                {c.avatar}
              </div>
              <div className="text-center w-full">
                <div className="text-[11.5px] font-bold text-[#e8f0ec] truncate">
                  {c.name}
                </div>
                <div className="text-[10px] text-[#7a9585] truncate mt-[1px]">
                  {c.job}
                </div>
              </div>
              <div className="flex flex-wrap gap-[3px] justify-center">
                {c.skills.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="text-[9px] px-[5px] py-[2px] rounded-[4px] text-[#e8f0ec]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}>
                    {s}
                  </span>
                ))}
              </div>
              <div
                className="w-full flex items-center justify-between px-2 py-[5px] rounded-[7px]"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="text-[10px] text-[#7a9585]">Score</span>
                <span
                  className="text-[12px] font-extrabold"
                  style={{ color: getScoreColor(c.resumeScore) }}>
                  {c.resumeScore}
                </span>
              </div>
              <span
                className="inline-flex items-center gap-[4px] text-[9.5px] font-bold px-[7px] py-[2px] rounded-full w-full justify-center"
                style={{
                  background: rec.bg,
                  color: rec.color,
                  border: `1px solid ${rec.border}`,
                }}>
                <rec.Icon size={9} /> {rec.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOB GROUP TABLE (candidate ranking, tanpa kolom prediksi)
// ─────────────────────────────────────────────────────────────────────────────
function JobGroupTable({
  group,
  onView,
  onStatusChange,
}: {
  group: JobGroup;
  onView: (c: Candidate) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  return (
    <div
      className="rounded-[14px] overflow-hidden mb-3"
      style={{
        background: "#0f1612",
        border: "1px solid rgba(16,185,129,0.12)",
      }}>
      <button
        className="w-full flex items-center gap-3 px-5 py-[13px] text-left transition-colors hover:bg-emerald-500/[0.02]"
        style={{
          borderBottom: collapsed ? "none" : "1px solid rgba(16,185,129,0.1)",
        }}
        onClick={() => setCollapsed(!collapsed)}>
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: group.color }}
        />
        <span className="font-bold text-[#e8f0ec] text-[13.5px] flex-1">
          {group.title}
        </span>
        <div className="flex items-center gap-4 mr-2">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#7a9585]">Pelamar:</span>
            <span className="text-[12px] font-bold text-[#e8f0ec]">
              {group.allCandidates.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#7a9585]">Shortlisted:</span>
            <span
              className="text-[12px] font-bold"
              style={{ color: "#10b981" }}>
              {group.shortlisted}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#7a9585]">Avg AI Score:</span>
            <span
              className="text-[12px] font-bold"
              style={{ color: getScoreColor(group.avgScore) }}>
              {group.avgScore}
            </span>
          </div>
        </div>
        <ChevronDown
          size={14}
          className="text-[#7a9585] transition-transform flex-shrink-0"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
        />
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}>
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                  {[
                    "#",
                    "Kandidat",
                    "AI Score",
                    "Match",
                    "Skills",
                    "Rekomendasi",
                    "Status",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-[9px] text-left text-[10px] font-bold tracking-[0.07em] uppercase whitespace-nowrap"
                      style={{ color: "#7a9585" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.candidates.map((c, i) => {
                  const st = statusMap[c.status] ?? {
                    label: c.status,
                    color: "#7a9585",
                  };
                  const rec = getRec(c.resumeScore, c.matchScore);
                  const RecIcon = rec.Icon;
                  const rankCol = rankColors?.[i] ?? "#7a9585";
                  const isTop3 = i < 3;
                  const isExpanded = expandedInsight === c.id;

                  return (
                    <Fragment key={c.id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="transition-colors cursor-pointer"
                        style={{
                          borderTop: "1px solid rgba(16,185,129,0.07)",
                          background: isExpanded
                            ? "rgba(139,92,246,0.04)"
                            : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.background =
                              "rgba(16,185,129,0.025)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.background = "transparent";
                        }}
                        onClick={() => onView(c)}>
                        <td className="px-4 py-[12px]">
                          <div
                            className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center font-extrabold text-[10px]"
                            style={{
                              background: isTop3
                                ? `${rankCol}20`
                                : "rgba(255,255,255,0.03)",
                              color: isTop3 ? rankCol : "#7a9585",
                              border: `1px solid ${isTop3 ? rankCol + "35" : "rgba(16,185,129,0.1)"}`,
                            }}>
                            {i + 1}
                          </div>
                        </td>
                        <td className="px-4 py-[12px]">
                          <div className="flex items-center gap-[10px]">
                            <div
                              className="w-9 h-9 rounded-[9px] flex items-center justify-center font-extrabold text-[11px] flex-shrink-0"
                              style={{
                                background: `${c.color}18`,
                                color: c.color,
                              }}>
                              {c.avatar}
                            </div>
                            <div>
                              <div className="text-[12.5px] font-semibold text-[#e8f0ec]">
                                {c.name}
                              </div>
                              <div className="text-[10.5px] text-[#7a9585]">
                                {c.appliedDate}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-[12px]">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-12 h-[4px] rounded-full overflow-hidden"
                              style={{ background: "rgba(255,255,255,0.05)" }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${c.resumeScore}%`,
                                  background: getScoreGradient(c.resumeScore),
                                }}
                              />
                            </div>
                            <span
                              className="text-[14px] font-extrabold"
                              style={{ color: getScoreColor(c.resumeScore) }}>
                              {c.resumeScore || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-[12px]">
                          <span
                            className="text-[13px] font-extrabold"
                            style={{ color: getScoreColor(c.matchScore) }}>
                            {c.matchScore ? `${c.matchScore}%` : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-[12px]">
                          <div className="flex flex-wrap gap-[3px]">
                            {c.skills.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="text-[10px] px-[6px] py-[2px] rounded-[4px] font-mono text-[#e8f0ec]"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                }}>
                                {s}
                              </span>
                            ))}
                            {c.skills.length > 2 && (
                              <span className="text-[10px] text-[#7a9585]">
                                +{c.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-[12px]">
                          <span
                            className="inline-flex items-center gap-[5px] text-[10.5px] font-bold px-[8px] py-[3px] rounded-full"
                            style={{
                              background: rec.bg,
                              color: rec.color,
                              border: `1px solid ${rec.border}`,
                            }}>
                            <RecIcon size={10} /> {rec.label}
                          </span>
                        </td>
                        <td className="px-4 py-[12px]">
                          <span
                            className="inline-flex items-center gap-[5px] text-[10.5px] font-bold px-[8px] py-[3px] rounded-full"
                            style={{
                              background: `${st.color}15`,
                              color: st.color,
                              border: `1px solid ${st.color}28`,
                            }}>
                            <span
                              className="w-[5px] h-[5px] rounded-full"
                              style={{ background: st.color }}
                            />
                            {st.label}
                          </span>
                        </td>
                        <td
                          className="px-4 py-[12px]"
                          onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-[4px]">
                            <button
                              onClick={() =>
                                onStatusChange(c.id, "shortlisted")
                              }
                              disabled={c.status === "shortlisted"}
                              title="Shortlist"
                              className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              style={{
                                background: "rgba(16,185,129,0.08)",
                                border: "1px solid rgba(16,185,129,0.2)",
                                color: "#10b981",
                              }}>
                              <ThumbsUp size={10} />
                            </button>
                            <button
                              onClick={() => onStatusChange(c.id, "rejected")}
                              disabled={c.status === "rejected"}
                              title="Tolak"
                              className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              style={{
                                background: "rgba(244,63,94,0.07)",
                                border: "1px solid rgba(244,63,94,0.18)",
                                color: "#f43f5e",
                              }}>
                              <ThumbsDown size={10} />
                            </button>
                            <button
                              onClick={() => onView(c)}
                              title="Detail"
                              className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-all"
                              style={{
                                background: "#141f19",
                                border: "1px solid rgba(16,185,129,0.13)",
                                color: "#7a9585",
                              }}>
                              <Eye size={10} />
                            </button>
                            <button
                              onClick={() =>
                                setExpandedInsight(isExpanded ? null : c.id)
                              }
                              title="AI Insight"
                              className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-all"
                              style={{
                                background: isExpanded
                                  ? "rgba(139,92,246,0.15)"
                                  : "rgba(139,92,246,0.07)",
                                border: `1px solid ${isExpanded ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.18)"}`,
                                color: "#a78bfa",
                              }}>
                              <Brain size={10} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            key={`insight-${c.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}>
                            <td
                              colSpan={8}
                              className="px-4 pb-3 pt-0"
                              style={{ background: "rgba(139,92,246,0.03)" }}>
                              <CandidateInsightRow candidate={c} />
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPCOMING INTERVIEWS SECTION
// ─────────────────────────────────────────────────────────────────────────────
function UpcomingInterviews({ interviews }: { interviews: Interview[] }) {
  const upcoming = useMemo(() => {
    return interviews
      .filter((iv) => iv.status === "scheduled" || iv.status === "overdue")
      .sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime(),
      )
      .slice(0, 5);
  }, [interviews]);

  const totalScheduled = interviews.filter(
    (iv) => iv.status === "scheduled",
  ).length;
  const totalOverdue = interviews.filter(
    (iv) => iv.status === "overdue",
  ).length;

  return (
    <div
      className="rounded-[14px] p-5 h-full flex flex-col"
      style={{
        background: "#0f1612",
        border: "1px solid rgba(16,185,129,0.12)",
      }}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-[12px] font-bold text-[#e8f0ec] flex items-center gap-2">
          <Calendar size={13} className="text-rose-400" /> Interview Mendatang
        </div>
        <Link href="/dashboard/hr/interviews">
          <button
            className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-400 px-2 py-[4px] rounded-[6px]"
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            Lihat Semua <ArrowRight size={10} />
          </button>
        </Link>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10.5px] text-[#7a9585]">
          <span className="font-bold text-indigo-400">{totalScheduled}</span>{" "}
          terjadwal
        </span>
        {totalOverdue > 0 && (
          <>
            <span className="w-[3px] h-[3px] rounded-full bg-[#3d5c49]" />
            <span className="text-[10.5px] text-[#7a9585]">
              <span className="font-bold text-amber-400">{totalOverdue}</span>{" "}
              overdue
            </span>
          </>
        )}
      </div>
      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-6 text-center">
          <Calendar size={24} className="text-[#7a9585] mb-2 opacity-40" />
          <div className="text-[12px] text-[#7a9585]">
            Belum ada interview terjadwal
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[6px] flex-1">
          {upcoming.map((iv, i) => {
            const st =
              interviewStatusConfig[iv.status] ??
              interviewStatusConfig.scheduled;
            const rc = iv.round ? roundConfig[iv.round] : null;
            const color = getColor(i);
            const todayFlag = isToday(iv.scheduled_at);
            const tomorrowFlag = isTomorrow(iv.scheduled_at);
            const dateLabel = formatInterviewDate(iv.scheduled_at);
            const timeRange = formatInterviewTime(
              iv.scheduled_at,
              iv.duration_minutes,
            );

            return (
              <motion.div
                key={iv.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-[11px] p-3 transition-colors hover:bg-emerald-500/[0.025]"
                style={{
                  background: todayFlag
                    ? "rgba(99,102,241,0.05)"
                    : "rgba(255,255,255,0.01)",
                  border: todayFlag
                    ? "1px solid rgba(99,102,241,0.18)"
                    : "1px solid rgba(16,185,129,0.07)",
                }}>
                <div
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 mt-[1px]"
                  style={{ background: `${color}18`, color }}>
                  {getInitials(iv.candidate_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[6px] flex-wrap">
                    <span className="text-[12px] font-semibold text-[#e8f0ec] truncate">
                      {iv.candidate_name}
                    </span>
                    {todayFlag && (
                      <span className="inline-flex items-center gap-[3px] px-[5px] py-[1px] rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse flex-shrink-0">
                        ⚡ Hari Ini
                      </span>
                    )}
                    {iv.status === "overdue" && (
                      <span
                        className="inline-flex items-center gap-[3px] px-[5px] py-[1px] rounded-full text-[9px] font-bold flex-shrink-0"
                        style={{
                          background: "rgba(245,158,11,0.1)",
                          color: "#f59e0b",
                          border: "1px solid rgba(245,158,11,0.2)",
                        }}>
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px] text-[#5a8070] mt-[1px] truncate">
                    <Briefcase size={9} className="flex-shrink-0" />
                    <span className="truncate">{iv.job_title}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-[5px] flex-wrap">
                    <span
                      className="text-[10px] font-semibold"
                      style={{
                        color: todayFlag
                          ? "#6366f1"
                          : tomorrowFlag
                            ? "#06b6d4"
                            : "#7a9585",
                      }}>
                      {dateLabel}
                    </span>
                    <span className="text-[#2d4a38]">·</span>
                    <span className="text-[10px] text-[#7a9585] flex items-center gap-[3px]">
                      <Clock size={9} className="flex-shrink-0" /> {timeRange}
                    </span>
                    <span className="text-[#2d4a38]">·</span>
                    <span
                      className="inline-flex items-center gap-[3px] text-[9.5px] font-semibold px-[6px] py-[1px] rounded-full flex-shrink-0"
                      style={
                        iv.type === "online"
                          ? {
                              background: "rgba(6,182,212,0.08)",
                              color: "#22d3ee",
                              border: "1px solid rgba(6,182,212,0.2)",
                            }
                          : {
                              background: "rgba(245,158,11,0.08)",
                              color: "#fbbf24",
                              border: "1px solid rgba(245,158,11,0.2)",
                            }
                      }>
                      {iv.type === "online" ? (
                        <Video size={8} />
                      ) : (
                        <MapPin size={8} />
                      )}
                      {iv.type === "online" ? "Online" : "Onsite"}
                    </span>
                    {iv.round && rc && (
                      <span
                        className="inline-flex items-center text-[9.5px] font-semibold px-[6px] py-[1px] rounded-full flex-shrink-0"
                        style={{ background: rc.bg, color: rc.color }}>
                        {iv.round}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-[4px] pt-[2px]">
                  <span
                    className="text-[10px] font-bold px-[6px] py-[2px] rounded-[5px]"
                    style={{
                      background: st.bg,
                      color: st.color,
                      border: `1px solid ${st.border}`,
                    }}>
                    {iv.duration_minutes ?? 60}m
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      {interviews.length > 0 && (
        <div
          className="mt-3 pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(16,185,129,0.08)" }}>
          <span className="text-[10px] text-[#4d7060]">
            Total:{" "}
            <span className="font-bold text-[#7a9585]">
              {interviews.length}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#4d7060]">
              Selesai:{" "}
              <span className="font-bold text-emerald-500">
                {interviews.filter((iv) => iv.status === "done").length}
              </span>
            </span>
            <span className="text-[10px] text-[#4d7060]">
              Batal:{" "}
              <span className="font-bold text-red-500/70">
                {interviews.filter((iv) => iv.status === "cancelled").length}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HRDashboard() {
  const { token, company } = useDashboard();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        const [apps, ivData] = await Promise.all([
          apiFetch("/api/applications/hr", token),
          apiFetch("/api/interviews", token),
        ]);
        const mapped: Candidate[] = (Array.isArray(apps) ? apps : []).map(
          (a: Application, i: number) => ({
            id: a.id,

            name: a.candidate_name || "Kandidat",

            avatar: getInitials(a.candidate_name || "KD"),

            job: a.job_title || "-",

            jobId: a.job_id,

            resumeScore: a.resume_score ?? 0,

            matchScore: a.matching_score ?? 0,

            skills: (a.extracted_skills || [])
              .slice(0, 5)
              .map((s) => (typeof s === "string" ? s : s.name || "")),

            status: a.status,

            appliedDate: new Date(a.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            }),

            color: getColor(i),

            cv_url: a.cv_url || null,
          }),
        );
        setCandidates(mapped);
        setInterviews(Array.isArray(ivData) ? ivData : []);
      } catch (err) {
        console.error("[HRDashboard] fetchAll error:", err);
      }
    };
    fetchAll();
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
    try {
      await apiFetch(`/api/applications/${id}/status`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    } catch {}
  };

  // ── Stats ──
  const total = candidates.length;
  const shortlisted = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;
  const inReview = candidates.filter((c) => c.status === "review").length;
  const totalInterviews = interviews.length;
  const totalHired = candidates.filter((c) => c.status === "hired").length;
  const totalRejected = candidates.filter(
    (c) => c.status === "rejected",
  ).length;
  const avgScore = total
    ? Math.round(candidates.reduce((a, c) => a + c.resumeScore, 0) / total)
    : 0;

  const uniqueJobs = [...new Set(candidates.map((c) => c.job))].sort();
  const jobGroups: JobGroup[] = uniqueJobs
    .map((title, i) => {
      const all = candidates.filter((c) => c.job === title);
      const filtered = all
        .filter((c) => {
          if (filterStatus !== "all" && c.status !== filterStatus) return false;
          if (search) {
            const q = search.toLowerCase();
            return (
              c.name.toLowerCase().includes(q) ||
              c.skills.some((s) => s.toLowerCase().includes(q))
            );
          }
          return true;
        })
        .sort((a, b) => b.resumeScore - a.resumeScore);
      const avgSc = all.length
        ? Math.round(all.reduce((a, c) => a + c.resumeScore, 0) / all.length)
        : 0;
      return {
        title,
        color: JOB_COLORS[i % JOB_COLORS.length],
        candidates: filtered,
        allCandidates: all.sort((a, b) => b.resumeScore - a.resumeScore),
        shortlisted: all.filter((c) => c.status === "shortlisted").length,
        avgScore: avgSc,
      };
    })
    .filter((g) => g.candidates.length > 0);

  // Donut data
  const donutSegments = [
    { value: shortlisted, color: "#8b5cf6", label: "Shortlisted" },
    { value: inReview, color: "#06b6d4", label: "Interview" },
    { value: totalRejected, color: "#f43f5e", label: "Rejected" },
    {
      value: Math.max(0, total - shortlisted - inReview - totalRejected),
      color: "#10b981",
      label: "Applicants",
    },
  ];

  return (
    <div>
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onStatusChange={(id, status) => {
              updateStatus(id, status);
              setSelectedCandidate(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── TOP STAT CARDS (referensi: 6 metric cards) ── */}
      <FadeIn>
        <div className="grid grid-cols-6 gap-3 mb-5">
          {[
            {
              Icon: Briefcase,
              col: "#10b981",
              bg: "rgba(16,185,129,0.1)",
              num: uniqueJobs.length,
              label: "All Jobs",
              sub: "View More",
            },
            {
              Icon: Users,
              col: "#8b5cf6",
              bg: "rgba(139,92,246,0.1)",
              num: total,
              label: "Total Candidates",
              sub: "More Info",
            },
            {
              Icon: Inbox,
              col: "#06b6d4",
              bg: "rgba(6,182,212,0.1)",
              num: total,
              label: "Total Applications",
              sub: "More Info",
            },
            {
              Icon: Calendar,
              col: "#f59e0b",
              bg: "rgba(245,158,11,0.1)",
              num: totalInterviews,
              label: "Total Interviews",
              sub: "More Info",
            },
            {
              Icon: CheckCircle2,
              col: "#10b981",
              bg: "rgba(16,185,129,0.1)",
              num: totalHired,
              label: "Total Hired",
              sub: "More Info",
            },
            {
              Icon: XCircle,
              col: "#f43f5e",
              bg: "rgba(244,63,94,0.08)",
              num: totalRejected,
              label: "Total Rejected",
              sub: "More Info",
            },
          ].map(({ Icon, col, bg, num, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-[14px] p-4 relative overflow-hidden"
              style={{
                background: "#0f1612",
                border: "1px solid rgba(16,185,129,0.12)",
              }}>
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: col }}
              />
              <div className="flex items-start justify-between mb-3">
                <div
                  className="font-extrabold text-[1.6rem] leading-none"
                  style={{ color: col }}>
                  {num}
                </div>
                <div
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                  style={{ background: bg, color: col }}>
                  <Icon size={14} />
                </div>
              </div>
              <div className="text-[11.5px] font-semibold text-[#e8f0ec]">
                {label}
              </div>
              <button className="text-[10px] text-emerald-400 mt-[3px] flex items-center gap-[3px] hover:text-emerald-300 transition-colors">
                {sub} <ChevronRight size={9} />
              </button>
            </motion.div>
          ))}
        </div>
      </FadeIn>

      {/* ── AI INSIGHT BANNER ── */}
      <FadeIn delay={0.04}>
        <AIInsightBanner candidates={candidates} />
      </FadeIn>

      {/* ── ROW 2: Job Ads + Total Overview + Upcoming Interviews ── */}
      <div
        className="grid gap-4 mb-5"
        style={{ gridTemplateColumns: "1.4fr 1fr 1fr" }}>
        {/* Job Ads Table */}
        <FadeIn delay={0.06}>
          <JobAdsTable jobGroups={jobGroups} />
        </FadeIn>

        {/* Total Overview (Donut) */}
        <FadeIn delay={0.08}>
          <div
            className="rounded-[14px] p-5 h-full flex flex-col"
            style={{
              background: "#0f1612",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            <div className="font-bold text-[13px] text-[#e8f0ec] flex items-center gap-2 mb-4">
              <PieChart size={13} className="text-cyan-400" /> Total Overview
            </div>
            <div className="flex items-center gap-4 flex-1">
              <DonutChart
                segments={donutSegments}
                size={110}
                centerLabel={String(total)}
                centerSub="Total"
              />
              <div className="flex flex-col gap-2 flex-1">
                {[
                  { label: "Recommended", val: shortlisted, color: "#8b5cf6" },
                  { label: "Shorted", val: shortlisted, color: "#10b981" },
                  { label: "Applicants", val: total, color: "#06b6d4" },
                  {
                    label: "Interview",
                    val: totalInterviews,
                    color: "#f59e0b",
                  },
                  { label: "Rejected", val: totalRejected, color: "#f43f5e" },
                  { label: "Hired", val: totalHired, color: "#10b981" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                        style={{ background: item.color }}
                      />
                      <span className="text-[#7a9585]">{item.label}</span>
                    </div>
                    <span className="font-bold" style={{ color: item.color }}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Trend Chart */}
        <FadeIn delay={0.1}>
          <div
            className="rounded-[14px] p-5 h-full flex flex-col"
            style={{
              background: "#0f1612",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-[13px] text-[#e8f0ec] flex items-center gap-2">
                <TrendingUp size={13} className="text-cyan-400" /> Trend Pelamar
              </div>
              <span className="text-[10px] text-[#7a9585]">8 minggu</span>
            </div>
            <TrendChart candidates={candidates} />
            <div
              className="mt-3 pt-3 grid grid-cols-2 gap-2"
              style={{ borderTop: "1px solid rgba(16,185,129,0.08)" }}>
              {[
                {
                  label: "Conversion",
                  val: `${total ? Math.round((shortlisted / total) * 100) : 0}%`,
                  color: "#10b981",
                },
                { label: "Avg Score", val: avgScore, color: "#8b5cf6" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-[10px] p-3 text-center"
                  style={{
                    background: "#141f19",
                    border: "1px solid rgba(16,185,129,0.1)",
                  }}>
                  <div
                    className="text-[15px] font-extrabold"
                    style={{ color: m.color }}>
                    {m.val}
                  </div>
                  <div className="text-[10px] text-[#7a9585] mt-[2px]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── ROW 3: Hiring Pipeline + Upcoming Interviews ── */}
      <div
        className="grid gap-4 mb-5"
        style={{ gridTemplateColumns: "1fr 1.5fr" }}>
        {/* Hiring Pipeline */}
        <FadeIn delay={0.12}>
          <div
            className="rounded-[14px] p-5 h-full"
            style={{
              background: "#0f1612",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            <div className="text-[12px] font-bold text-[#e8f0ec] flex items-center gap-2 mb-4">
              <BarChart2 size={13} className="text-emerald-400" /> Hiring
              Pipeline
            </div>
            <div className="space-y-3 mb-4">
              {[
                { label: "Applied", count: total, color: "#10b981" },
                { label: "In Review", count: inReview, color: "#06b6d4" },
                { label: "Shortlisted", count: shortlisted, color: "#8b5cf6" },
                { label: "Rejected", count: totalRejected, color: "#f43f5e" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div
                    className="w-[72px] text-[11px] font-semibold"
                    style={{ color: "#a8c5b2" }}>
                    {s.label}
                  </div>
                  <div
                    className="flex-1 h-[6px] rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: total ? `${(s.count / total) * 100}%` : "0%",
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                    />
                  </div>
                  <div
                    className="w-6 text-right text-[12px] font-extrabold"
                    style={{ color: s.color }}>
                    {s.count}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="pt-3 grid grid-cols-2 gap-2"
              style={{ borderTop: "1px solid rgba(16,185,129,0.1)" }}>
              {[
                {
                  label: "Conversion",
                  val: `${total ? Math.round((shortlisted / total) * 100) : 0}%`,
                  color: "#10b981",
                },
                {
                  label: "Rejection",
                  val: `${total ? Math.round((totalRejected / total) * 100) : 0}%`,
                  color: "#f43f5e",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-[10px] p-3 text-center"
                  style={{
                    background: "#141f19",
                    border: "1px solid rgba(16,185,129,0.1)",
                  }}>
                  <div
                    className="text-[15px] font-extrabold"
                    style={{ color: m.color }}>
                    {m.val}
                  </div>
                  <div className="text-[10px] text-[#7a9585] mt-[2px]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Upcoming Interviews */}
        <FadeIn delay={0.14}>
          <UpcomingInterviews interviews={interviews} />
        </FadeIn>
      </div>

      {/* ── TOP 5 CANDIDATES STRIP ── */}
      <FadeIn delay={0.16}>
        <div className="mb-5">
          <TopCandidatesStrip
            candidates={candidates}
            onView={setSelectedCandidate}
          />
        </div>
      </FadeIn>

      {/* ── CANDIDATE RANKING PER JOB ── */}
      <FadeIn delay={0.18}>
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div>
            <div className="font-bold text-[15px] text-[#e8f0ec] flex items-center gap-2">
              <Target size={15} className="text-emerald-400" /> Ranking Kandidat
              per Posisi
            </div>
            <div className="text-[11px] text-[#7a9585] mt-[2px]">
              Klik <Brain size={10} className="inline text-violet-400" /> untuk
              AI insight per kandidat
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#7a9585" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau skill..."
                className=" pl-8
pr-3
    py-[7px]
    w-[200px]
    rounded-[9px]
    text-[13px]
    outline-none
    bg-[#0f1612]
    border
    border-emerald-500/15
    text-[#e8f0ec]
    focus:border-emerald-500/40
    transition-colors
  "
              />
              {search && (
                <button
                  title="Clear search"
                  type="button"
                  onClick={() => setSearch("")}
                  className="
    absolute
    right-[8px]
    top-1/2
    -translate-y-1/2
    text-[#7a9585]
    hover:text-[#e8f0ec]
    transition-colors
  ">
                  <X size={11} />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                title="filter by status"
                value={filterStatus}
                onChange={(e) => setFilter(e.target.value)}
                className=" appearance-none  rounded-[9px]
    py-[7px]
    pl-3
    pr-8
    text-[13px]
    outline-none
    cursor-pointer
    bg-[#0f1612]
    border
    border-emerald-500/15
    text-[#e8f0ec]
  ">
                <option value="all">Semua Status</option>
                <option value="applied">Applied</option>
                <option value="review">In Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Ditolak</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-[9px] top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#7a9585" }}
              />
            </div>
          </div>
        </div>

        {jobGroups.length === 0 ? (
          <div
            className="rounded-[14px] flex flex-col items-center justify-center py-16 text-center"
            style={{
              background: "#0f1612",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            <Users size={28} className="text-[#7a9585] mb-3 opacity-40" />
            <div className="text-[13px] font-semibold text-[#e8f0ec] mb-1">
              {total === 0
                ? "Belum ada pelamar"
                : "Tidak ada kandidat ditemukan"}
            </div>
            <div className="text-[11.5px] text-[#7a9585]">
              {total === 0
                ? "Kandidat akan muncul setelah ada yang melamar"
                : "Coba ubah filter pencarian"}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {jobGroups.map((group, i) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <JobGroupTable
                  group={group}
                  onView={setSelectedCandidate}
                  onStatusChange={updateStatus}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </FadeIn>

      {/* ── COMPANY FOOTER ── */}
      {company && (
        <FadeIn delay={0.22}>
          <div
            className="rounded-[14px] p-4 flex items-center gap-4 mt-3"
            style={{
              background: "#0f1612",
              border: "1px solid rgba(16,185,129,0.12)",
            }}>
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
              <Building2 size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-[#e8f0ec]">
                {company.name}
              </div>
              {company.company_size && (
                <div className="text-[11px] text-[#7a9585]">
                  👥 {company.company_size}
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
