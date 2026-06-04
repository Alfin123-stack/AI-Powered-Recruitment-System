"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Eye, Loader2 } from "lucide-react";
import type { AnalysisData } from "@/types/analyze";

// ─── ANALYZE HERO ─────────────────────────────────────────────────────────────
// CSR: reacts to live upload/analysis state passed down from parent
type Props = {
  isLoading: boolean;
  analysisData: AnalysisData | null;
};

export default function AnalyzeHero({ isLoading, analysisData }: Props) {
  return (
    <section
      className="pt-[90px] pb-10 text-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 55% 40% at 50% 0%,rgba(34,197,94,0.04) 0%,transparent 70%),#090d0b",
      }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015)1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015)1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <motion.div
        className="relative max-w-[600px] mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <div
          className="inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[0.67rem] font-medium tracking-[0.08em] uppercase mb-[16px]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.35)",
          }}>
          <span
            className="animate-pulse text-[7px]"
            style={{ color: "rgba(74,222,128,0.7)" }}>
            ●
          </span>{" "}
          AI Resume Analyzer
        </div>
        <h1
          className="font-bold leading-[1.1] tracking-tight mb-[12px]"
          style={{
            fontSize: "clamp(1.85rem,4vw,2.6rem)",
            color: "rgba(255,255,255,0.88)",
          }}>
          Analisis CV dengan{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
            kecerdasan buatan
          </span>
        </h1>
        <p
          className="text-[0.87rem] leading-[1.7] max-w-[420px] mx-auto mb-5"
          style={{ color: "rgba(255,255,255,0.28)" }}>
          Score, ATS check, feedback per bagian, dan saran penulisan AI — semua
          dalam hitungan detik.
        </p>

        {/* Status pill */}
        <div
          className="inline-flex items-center gap-[6px] px-4 py-[6px] rounded-full text-[0.72rem]"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.22)",
          }}>
          {isLoading ? (
            <>
              <Loader2
                size={11}
                className="animate-spin"
                style={{ color: "rgba(74,222,128,0.6)" }}
              />
              <span>Menganalisis...</span>
            </>
          ) : analysisData ? (
            <>
              <CheckCircle2
                size={11}
                style={{ color: "rgba(74,222,128,0.6)" }}
              />
              <span style={{ color: "rgba(74,222,128,0.6)" }}>
                {analysisData.isFromDB
                  ? "Menampilkan analisis terakhir"
                  : "Analisis selesai"}
              </span>
              {analysisData.fileName && (
                <>
                  <span>·</span>
                  <span>{analysisData.fileName}</span>
                </>
              )}
            </>
          ) : (
            <>
              <Eye size={11} />
              <span>Upload CV untuk memulai</span>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
