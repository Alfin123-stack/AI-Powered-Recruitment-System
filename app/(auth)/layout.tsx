// app/(auth)/layout.tsx
import type { Metadata } from "next";
import { BrainCircuit, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Autentikasi · RecruitAI",
};

const features = [
  { icon: BrainCircuit, label: "Analisis CV dalam hitungan detik" },
  { icon: Target, label: "Cocokkan kandidat dengan posisi terbaik" },
  { icon: Zap, label: "Kurangi waktu screening dari minggu ke jam" },
];

const stats = [
  { value: "50K+", label: "CV Dianalisis" },
  { value: "2.4K+", label: "Perusahaan" },
  { value: "98%", label: "Akurasi AI" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0f0d]">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#0a0f0d]">
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/[0.06] blur-[120px] pointer-events-none" />

        {/* Rings */}
        <div className="absolute w-[600px] h-[600px] rounded-full border border-emerald-500/[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[380px] h-[380px] rounded-full border border-emerald-500/[0.09] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_35s_linear_infinite_reverse]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 py-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-base font-extrabold text-black bg-gradient-to-br from-emerald-500 to-cyan-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
              ✦
            </div>
            <span className="text-[1.4rem] font-extrabold tracking-tight text-[#e8f0ec]">
              Recruit<em className="not-italic text-emerald-400">AI</em>
            </span>
          </div>

          {/* Center */}
          <div className="flex-1 flex flex-col justify-center max-w-[360px]">
            {/* Headline */}
            <h1 className="text-[2.4rem] font-extrabold leading-[1.15] tracking-tight text-[#e8f0ec] mb-4">
              Rekrutmen lebih{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                cerdas
              </span>{" "}
              dimulai di sini.
            </h1>
            <p className="text-[#7a9585] text-[0.9rem] leading-relaxed mb-10">
              Analisis CV otomatis, job matching cerdas, dan rekrutmen 10× lebih
              cepat dengan AI.
            </p>

            {/* Features */}
            <div className="space-y-5">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-emerald-400" />
                  </div>
                  <span className="text-[0.85rem] text-[#c5d9ce]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-emerald-500/[0.04] border border-emerald-500/15 rounded-[10px] px-3 py-3 text-center">
                <p className="text-[1.3rem] font-extrabold text-emerald-400 leading-none mb-[3px]">
                  {s.value}
                </p>
                <p className="text-[0.68rem] text-[#7a9585]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
        {/* Mobile bg */}
        <div className="absolute inset-0 lg:hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_20%,rgba(16,185,129,0.07)_0%,transparent_60%),radial-gradient(ellipse_50%_60%_at_80%_80%,rgba(6,182,212,0.05)_0%,transparent_60%)]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Separator */}
        <div className="hidden lg:block absolute left-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />

        <div className="relative z-10 w-full max-w-[460px] px-6 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
