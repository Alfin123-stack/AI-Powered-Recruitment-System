// components/blog-detail/ArticleCTA.tsx
// Server Component — tidak ada "use client".
// Link dari next/link boleh di Server Component.
// CSS animation menggantikan framer-motion.

import Link from "next/link";
import { Brain, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ArticleCTA() {
  return (
    <section
      className="max-w-[760px] mx-auto px-6 pb-16"
      style={{ animation: "fadeInUp 0.6s 0.2s ease-out both" }}
    >
      <div className="bg-[#0f1612] border border-emerald-500/20 rounded-[18px] p-8 relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.07)_0%,transparent_65%)]" />

        <div className="relative">
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-emerald-400" />
            <span className="text-emerald-400 text-[0.75rem] font-bold uppercase tracking-[0.09em]">
              Coba Langsung
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-syne font-extrabold text-[1.25rem] text-[#e8f0ec] mb-3 leading-[1.3]">
            Sudah tahu tipsnya? Sekarang terapkan ke CV kamu.
          </h3>

          {/* Body */}
          <p className="text-[#7a9585] text-[0.875rem] leading-[1.7] mb-6 max-w-[480px]">
            Upload PDF CV kamu dan dalam 30 detik kamu akan tahu Resume Score,
            ATS Score, dan rekomendasi perbaikan spesifik yang bisa langsung
            diterapkan.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[0.9rem] px-6 py-[11px] rounded-[10px] no-underline transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(16,185,129,0.28)]"
            >
              <FileText size={15} /> Analisis CV Sekarang
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/[0.06] px-5 py-[10px] rounded-[10px] no-underline text-[0.875rem] transition-all"
            >
              Lihat Lowongan <ArrowRight size={13} />
            </Link>
          </div>

          {/* Fine print */}
          <p className="text-[#4a6b58] text-[0.72rem] mt-4 flex items-center gap-2">
            <CheckCircle2 size={11} className="text-emerald-700" /> Gratis
            untuk kandidat · Tidak perlu kartu kredit
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
