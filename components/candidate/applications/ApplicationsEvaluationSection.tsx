"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, Star, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface EvaluationRecord {
  id: string;
  score: number;
  recommendation: "hire" | "reject" | "consider";
  notes: string | null;
  created_at: string;
}

interface ApplicationsEvaluationSectionProps {
  applicationId: string;
  token: string;
}

const RECOMMENDATION_META: Record<
  EvaluationRecord["recommendation"],
  {
    label: string;
    icon: typeof CheckCircle2;
    color: string;
    bg: string;
    border: string;
    // Fallback singkat kalau HR tidak menulis notes (notes null/kosong)
    fallbackDesc: string;
  }
> = {
  hire: {
    label: "Direkomendasikan",
    icon: CheckCircle2,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    fallbackDesc: "HR merekomendasikan kamu untuk lanjut ke tahap berikutnya.",
  },
  consider: {
    label: "Dipertimbangkan",
    icon: Clock,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    fallbackDesc: "Evaluasi kamu masih dipertimbangkan oleh tim HR.",
  },
  reject: {
    label: "Belum Sesuai",
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.18)",
    fallbackDesc:
      "Kualifikasi kamu belum sesuai dengan kebutuhan posisi ini saat ini.",
  },
};

export default function ApplicationsEvaluationSection({
  applicationId,
  token,
}: ApplicationsEvaluationSectionProps) {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    apiFetch(`/api/evaluations/application/${applicationId}`, token)
      .then((data) => {
        if (!cancelled) setEvaluations(data ?? []);
      })
      .catch(() => {
        if (!cancelled) setEvaluations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [applicationId, token]);

  // Cuma hilang total kalau sudah selesai fetch DAN memang tidak ada data.
  // Selama masih loading, tetap render (supaya skeleton kelihatan).
  if (!loading && evaluations.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={12} className="text-emerald-400" />
        <span className="text-[0.73rem] font-bold text-[#7a9585] uppercase tracking-[0.06em]">
          Hasil Evaluasi
        </span>
      </div>

      {loading ? (
        <div
          className="flex items-center gap-2 rounded-[12px] p-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <svg
            className="animate-spin"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#10b981"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="#10b981"
              d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
            />
          </svg>
          <span className="text-[0.72rem] text-[#7a9585]">
            Memuat hasil evaluasi...
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          {evaluations.map((evaluation) => {
            const meta = RECOMMENDATION_META[evaluation.recommendation];
            const Icon = meta.icon;
            const hasNotes = Boolean(evaluation.notes?.trim());

            return (
              <div
                key={evaluation.id}
                className="rounded-[12px] p-4"
                style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-[0.78rem] font-bold"
                    style={{ color: meta.color }}
                  >
                    <Icon size={13} />
                    {meta.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={11} fill={meta.color} color={meta.color} />
                    <span className="text-[0.8rem] font-black" style={{ color: meta.color }}>
                      {evaluation.score}
                    </span>
                    <span className="text-[0.62rem] text-[#3a5245]">/10</span>
                  </div>
                </div>

                {/* Feedback dari HR — pakai notes asli kalau ada, fallback ke
                    deskripsi generik kalau HR nggak nulis apa-apa */}
                <p className="text-[0.72rem] text-[#7a9585] leading-relaxed whitespace-pre-wrap">
                  {hasNotes ? evaluation.notes : meta.fallbackDesc}
                </p>

                <div className="text-[0.63rem] text-[#3a5245] mt-2">
                  {new Date(evaluation.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}