"use client";

// app/dashboard/candidate/_components/RecommendationsPanel.tsx
// Data rekomendasi sudah dihitung di DashboardShell (memoized dari server data)
// Komponen ini murni presentational + UploadCtaCard di bawah

import Link from "next/link";
import {
  Zap,
  Building2,
  MapPin,
  Brain,
  ChevronRight,
  ExternalLink,
  Layers,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobRecommendation } from "@/hooks/dashboard/candidate/useDashboardDerived";

// ── Recommendations Panel ─────────────────────────────────────────────────────
interface DashboardRecommendationsProps {
  recommendations: JobRecommendation[];
  hasCv: boolean;
}

export function DashboardRecommendations({
  recommendations,
  hasCv,
}: DashboardRecommendationsProps) {
  return (
    <div className="bg-[#0a0f0c] border border-emerald-500/15 rounded-[18px] p-5 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-[8px] bg-emerald-500/15 flex items-center justify-center">
          <Zap size={13} className="text-emerald-400" />
        </div>
        <span className="font-bold text-[0.88rem]">Rekomendasi AI</span>
      </div>

      {!hasCv ? (
        <div className="text-center py-5">
          <div className="w-10 h-10 rounded-full bg-emerald-500/[0.06] border border-dashed border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <Brain size={16} className="text-emerald-500/30" />
          </div>
          <p className="text-[0.75rem] text-[#7a9585]">
            Upload CV agar AI bisa merekomendasikan lowongan yang cocok.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1 mt-3 text-emerald-400 text-[0.75rem] font-semibold no-underline hover:opacity-75">
            Upload CV <ChevronRight size={12} />
          </Link>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-[0.75rem] text-[#7a9585]">
            Tidak ada rekomendasi saat ini. Coba lamar lebih banyak lowongan.
          </p>
        </div>
      ) : (
        <>
          {recommendations.map((r, i) => {
            const matchColor =
              r.match >= 75 ? "#10b981" : r.match >= 50 ? "#f59e0b" : "#ef4444";
            return (
              <Link
                key={r.id}
                href={`/jobs/${r.id}`}
                className={`block py-3 no-underline group ${i < recommendations.length - 1 ? "border-b border-white/[0.05]" : ""}`}>
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-[2px]"
                    style={{ background: `${r.color}15`, color: r.color }}>
                    <Building2 size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-[2px]">
                      <span className="text-[0.82rem] font-semibold text-[#e8f0ec] group-hover:text-emerald-400 transition-colors truncate">
                        {r.title}
                      </span>
                      <span
                        className="text-[0.73rem] font-bold flex-shrink-0"
                        style={{ color: matchColor }}>
                        {r.match}%
                      </span>
                    </div>
                    <div className="text-[0.7rem] text-[#7a9585] mb-[6px]">
                      {r.company}
                    </div>
                    <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${r.match}%`,
                          background: matchColor,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.location && (
                        <span className="flex items-center gap-[3px] text-[0.63rem] text-[#7a9585]">
                          <MapPin size={9} /> {r.location}
                        </span>
                      )}
                      {r.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-[5px] py-[1px] rounded-[3px] text-[0.62rem] bg-emerald-500/[0.07] text-emerald-400 border border-emerald-500/15">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight
                    size={13}
                    className="text-[#7a9585] flex-shrink-0 mt-1 group-hover:text-emerald-400 transition-colors"
                  />
                </div>
              </Link>
            );
          })}
          <Link
            href="/dashboard/candidate/matches"
            className="flex items-center justify-center gap-1 mt-3 text-emerald-400 text-[0.78rem] font-semibold no-underline hover:opacity-75">
            Lihat semua matches <ExternalLink size={11} />
          </Link>
        </>
      )}
    </div>
  );
}

// ── Upload CTA Card ───────────────────────────────────────────────────────────
export function DashboardUploadCTA({ hasCv }: { hasCv: boolean }) {
  return (
    <div className="bg-gradient-to-br from-emerald-500/[0.06] to-cyan-500/[0.04] border border-emerald-500/15 rounded-[18px] p-5 text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
        <Layers size={16} className="text-emerald-400" />
      </div>
      <div className="font-bold text-[0.88rem] mb-[6px]">
        {hasCv ? "Update CV Anda" : "Analisis CV Anda"}
      </div>
      <p className="text-[#7a9585] text-[0.75rem] leading-[1.6] mb-4">
        {hasCv
          ? "Upload CV terbaru untuk reanalisis AI dan kecocokan yang lebih akurat."
          : "Upload CV untuk Resume Score, ATS Score, dan rekomendasi job personal dari AI."}
      </p>
      <Button
        asChild
        className="w-full bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] text-black font-bold text-[0.82rem] py-[9px] rounded-[9px] transition-all">
        <Link
          href="/analyze"
          className="inline-flex items-center justify-center gap-2">
          <Upload size={13} /> {hasCv ? "Upload CV Baru" : "Upload CV"}
        </Link>
      </Button>
    </div>
  );
}
