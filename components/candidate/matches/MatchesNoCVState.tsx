// SERVER Component — tidak ada directive "use client".
// Pure render, tidak ada hooks atau interaktivitas.

import Link from "next/link";
import { FileText, AlertCircle, ArrowRight, Upload } from "lucide-react";

export default function MatchesNoCVState() {
  const steps = [
    { num: "01", label: "Upload CV kamu" },
    { num: "02", label: "AI menganalisis skills" },
    { num: "03", label: "Job Matches aktif" },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-[24px] bg-emerald-500/[0.07] border border-emerald-500/20 flex items-center justify-center mx-auto">
          <FileText size={36} className="text-emerald-500/40" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <AlertCircle size={14} className="text-amber-400" />
        </div>
      </div>

      <h2 className="font-bold text-[1.1rem] mb-3">CV Belum Dianalisis</h2>
      <p className="text-[0.83rem] text-white/40 max-w-[360px] leading-relaxed mb-8">
        Fitur Job Matches menggunakan data skills dari analisis CV kamu. Upload
        dan analisis CV-mu agar kami bisa mencocokkan lowongan yang paling
        sesuai.
      </p>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 flex-wrap justify-center">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-[8px] bg-[#0f1612] border border-white/[0.07] rounded-[10px] px-4 py-[10px]">
              <span className="font-extrabold text-[0.68rem] text-emerald-500/40 font-mono">
                {step.num}
              </span>
              <span className="text-[0.78rem] text-white/45">{step.label}</span>
            </div>
            {i < 2 && (
              <ArrowRight size={13} className="text-white/15 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Link
        href="/analyze"
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-[10px] rounded-[10px] no-underline text-[0.88rem] transition-all hover:shadow-[0_6px_20px_rgba(16,185,129,0.25)] hover:-translate-y-[1px]">
        <Upload size={15} /> Analisis CV Sekarang
      </Link>
    </div>
  );
}
